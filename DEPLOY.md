# Deploying SmartDomainFinds on EC2 (Amazon Linux 2023)

A single-instance, no-Docker deployment: Node + a `deploy` user + systemd +
Caddy (automatic HTTPS) + a `git pull` deploy script. AI is **off** (no OpenAI
key), so the app uses the built-in demo generator and free RDAP availability.

## Do I need Docker?

**No.** For one Next.js app on one box, plain systemd is simpler, lighter, and
cheaper (no daemon overhead, fewer moving parts). Reach for Docker only if you
later want reproducible multi-host builds or to move to ECS/Fargate/Kubernetes.

## Recommended instance

- **t4g.small** (ARM Graviton, 2 vCPU, 2 GB) — cheapest + best balance, builds fine.
- **t3.small** (x86, 2 vCPU, 2 GB) — equivalent if you prefer x86.
- **t2.small** (x86, 1 vCPU, 2 GB) — works, but it's older-gen and single-core, so
  `npm ci` + tests + `next build` are slower. Prefer t3.small (newer, similar price).
- On **any 2 GB box add a 2 GB swapfile** (below): the runtime is light (~150 MB),
  but `next build` + vitest can spike past 2 GB and OOM-kill the build.
- 20 GB gp3 EBS, plus an **Elastic IP** (free while attached).

### Security group
- Inbound: `22` (SSH, ideally your IP only), `80` and `443` (web).
- Do **not** expose `3000` — the app binds to `127.0.0.1` and Caddy proxies to it.

---

## 1. First-time server setup

SSH in as `ec2-user`, then:

```bash
# System packages + Node 22 + Caddy + git
sudo dnf update -y
sudo dnf install -y git
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs

# Caddy (official COPR for Amazon Linux / Fedora)
sudo dnf install -y 'dnf-command(copr)'
sudo dnf copr enable -y @caddy/caddy
sudo dnf install -y caddy

# Add 2 GB swap so `next build` doesn't OOM on a 2 GB instance
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Create the deploy user

```bash
sudo useradd -m -s /bin/bash deploy
# Allow deploy to restart ONLY this service without a password:
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart smartdomainfinds, /usr/bin/systemctl status smartdomainfinds, /usr/bin/journalctl -u smartdomainfinds *' \
  | sudo tee /etc/sudoers.d/deploy-smartdomainfinds
sudo chmod 440 /etc/sudoers.d/deploy-smartdomainfinds
```

### Clone the repo as `deploy`

```bash
sudo -iu deploy
git clone https://github.com/zrogers010/smartdomainfinds.git ~/smartdomainfinds
exit
```

---

## 2. Environment file (kept OUTSIDE the repo)

Secrets/config never live in the git tree. Store them in `/etc/smartdomainfinds/env`,
readable only by root and the `deploy` group:

```bash
sudo mkdir -p /etc/smartdomainfinds
sudo cp /home/deploy/smartdomainfinds/deploy/env.production.example /etc/smartdomainfinds/env
sudo chown root:deploy /etc/smartdomainfinds/env
sudo chmod 640 /etc/smartdomainfinds/env
sudo nano /etc/smartdomainfinds/env   # set NEXT_PUBLIC_APP_URL to your domain
```

### Env security notes
- **Never commit env files** — `.env*` is already in `.gitignore`. Keeping the
  file in `/etc` (not the repo / web root) means `git reset --hard` can't clobber
  or leak it.
- **`chmod 640`, owned `root:deploy`** so only root and the service user read it.
- **`NEXT_PUBLIC_*` is NOT secret** — those values are inlined into the public
  client bundle at build time. Never put a real secret behind a `NEXT_PUBLIC_`
  name.
- With AI off there are effectively **no secrets** today (RDAP needs none). If you
  later add `OPENAI_API_KEY`, prefer **AWS SSM Parameter Store / Secrets Manager**
  with an instance IAM role over a plaintext file, and set a billing limit.
- The app reads runtime config via systemd's `EnvironmentFile`; `deploy.sh` also
  sources it so build-time `NEXT_PUBLIC_*` values are present during `next build`.

---

## 3. Install the systemd service + Caddy config

```bash
sudo cp /home/deploy/smartdomainfinds/deploy/smartdomainfinds.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable smartdomainfinds   # start happens after first build

sudo cp /home/deploy/smartdomainfinds/deploy/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile           # set your real domain
sudo systemctl enable --now caddy
```

Point your domain's **A record** at the instance's Elastic IP before reloading
Caddy so it can issue a certificate.

---

## 4. Deploy (first time and every release)

```bash
sudo -iu deploy
cd ~/smartdomainfinds
./deploy/deploy.sh
```

The script: pulls `origin/main` → `npm ci` → `npm test` → `next build` → copies
static assets into the standalone bundle → `sudo systemctl restart
smartdomainfinds` → polls `/api/health` and prints logs if it fails.

Verify:

```bash
curl -s http://127.0.0.1:3000/api/health      # {"status":"ok",...}
curl -sI https://your-domain.com              # 200 via Caddy
```

---

## 5. Day-2 operations

```bash
# Logs
sudo journalctl -u smartdomainfinds -f
# Restart / status
sudo systemctl restart smartdomainfinds
sudo systemctl status smartdomainfinds
```

### What's already in place for production
- **Standalone build** (`output: "standalone"`) — lean, low-memory runtime.
- **Per-IP rate limiting** on all API routes (keeps us polite to RDAP registries
  and blocks runaway clients).
- **Security headers** (Next config) + **HSTS** (Caddy); `3000` bound to localhost.
- **`/api/health`** liveness endpoint.

### Notes / future scaling
- State is in-memory (availability + rate-limit buckets). Fine for one instance.
  To run multiple instances behind a load balancer, move both to Redis/Upstash
  (see the `TODO(scale)` markers in the code).
- The shortlist is stored client-side (localStorage), so there's no database to
  back up.
