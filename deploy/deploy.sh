#!/usr/bin/env bash
#
# Pull the latest code and (re)deploy SmartDomainFinds.
# Run as the `deploy` user:  ./deploy/deploy.sh
#
# Idempotent: safe to run on every release. See DEPLOY.md for first-time setup.

set -euo pipefail

APP_DIR="${APP_DIR:-/home/deploy/smartdomainfinds}"
ENV_FILE="${ENV_FILE:-/etc/smartdomainfinds/env}"
SERVICE="${SERVICE:-smartdomainfinds}"
BRANCH="${BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/api/health}"

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }

cd "$APP_DIR"

log "Fetching latest code (origin/$BRANCH)"
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

# Make NEXT_PUBLIC_* values available to the build (they're inlined at build time).
if [[ -f "$ENV_FILE" ]]; then
  log "Loading build-time env from $ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# --include=dev is required: the env file sets NODE_ENV=production, which would
# otherwise make npm omit devDependencies (typescript, tailwind, vitest) that the
# build + tests need. The runtime itself only uses production deps.
log "Installing dependencies (npm ci)"
npm ci --include=dev

log "Running tests"
npm test

log "Building (next build → standalone)"
npm run build

# The standalone server doesn't include static assets or /public; copy them in.
log "Copying static assets into standalone bundle"
cp -r .next/static .next/standalone/.next/static
if [[ -d public ]]; then
  cp -r public .next/standalone/public
fi

log "Restarting service: $SERVICE"
sudo systemctl restart "$SERVICE"

log "Health check: $HEALTH_URL"
for i in {1..15}; do
  if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
    log "Deploy OK — service is healthy."
    exit 0
  fi
  sleep 2
done

echo "Health check failed after restart. Recent logs:" >&2
sudo journalctl -u "$SERVICE" -n 40 --no-pager >&2
exit 1
