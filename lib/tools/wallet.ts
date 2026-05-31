import { getChain } from "@/lib/tools/chains";
import {
  encodeAddress,
  ethCall,
  formatUnits,
  hexToBigInt,
  isAddress,
  resolveEnsAddress,
  rpc,
  selector,
} from "@/lib/tools/evm";
import type { TokenBalance, WalletResult } from "@/lib/tools/types";

const BALANCE_OF = selector("balanceOf(address)");
const TEN = BigInt(10);
const ZERO = BigInt(0);

/** Scale a token balance to a common 6-decimal base so totals add up across coins. */
function toBase6(value: bigint, decimals: number): bigint {
  if (decimals === 6) return value;
  if (decimals > 6) return value / TEN ** BigInt(decimals - 6);
  return value * TEN ** BigInt(6 - decimals);
}

export async function checkWallet(
  rawInput: string,
  chainId: string
): Promise<WalletResult | { error: string }> {
  const chain = getChain(chainId)!;
  const input = rawInput.trim();

  let address: string;
  let ensName: string | null = null;

  if (isAddress(input)) {
    address = input;
  } else if (/\.[a-z]{2,}$/i.test(input)) {
    const resolved = await resolveEnsAddress(input);
    if (!resolved) {
      return {
        error: `Couldn't resolve "${input}". Check the ENS name or paste a 0x address.`,
      };
    }
    address = resolved;
    ensName = input.toLowerCase();
  } else {
    return { error: "Enter a valid 0x address or ENS name (e.g. vitalik.eth)." };
  }

  const addrParam = encodeAddress(address);
  const native = hexToBigInt(await rpc<string>(chain, "eth_getBalance", [address, "latest"]));

  const balances = await Promise.all(
    chain.stablecoins.map((coin) =>
      ethCall(chain, coin.address, "0x" + BALANCE_OF + addrParam).then((raw) => ({
        coin,
        balance: hexToBigInt(raw),
      }))
    )
  );

  const stablecoins: TokenBalance[] = [];
  let total = ZERO;
  for (const { coin, balance } of balances) {
    if (balance === null) continue;
    stablecoins.push({ symbol: coin.symbol, amount: formatUnits(balance, coin.decimals, 2) });
    total += toBase6(balance, coin.decimals);
  }

  return {
    chainId: chain.id,
    chainName: chain.name,
    address,
    ensName,
    nativeSymbol: chain.nativeSymbol,
    nativeBalance: native !== null ? formatUnits(native, 18, 5) : "0",
    stablecoins,
    stablecoinTotal: formatUnits(total, 6, 2),
    explorerUrl: `${chain.explorer}/address/${address}`,
  };
}
