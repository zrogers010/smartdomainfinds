import { getChain } from "@/lib/tools/chains";
import { formatUnits, hexToBigInt, isTxHash, rpc } from "@/lib/tools/evm";
import type { TxResult } from "@/lib/tools/types";

const ONE = BigInt(1);

type RpcTx = {
  from?: string;
  to?: string | null;
  value?: string;
  gasPrice?: string;
  blockNumber?: string | null;
};

type RpcReceipt = {
  status?: string;
  gasUsed?: string;
  effectiveGasPrice?: string;
  blockNumber?: string;
  contractAddress?: string | null;
};

/** Look up a transaction by hash on the given chain and summarize it. */
export async function checkTx(rawHash: string, chainId: string): Promise<TxResult> {
  const chain = getChain(chainId)!; // chain validated by the schema upstream
  const hash = rawHash.trim().toLowerCase();
  const base: TxResult = {
    chainId: chain.id,
    chainName: chain.name,
    hash,
    found: false,
    status: null,
    from: null,
    to: null,
    contractCreated: null,
    value: null,
    nativeSymbol: chain.nativeSymbol,
    gasUsed: null,
    fee: null,
    blockNumber: null,
    confirmations: null,
    explorerUrl: `${chain.explorer}/tx/${hash}`,
  };

  if (!isTxHash(hash)) return base;

  const tx = await rpc<RpcTx | null>(chain, "eth_getTransactionByHash", [hash]);
  if (!tx) return base;

  const value = hexToBigInt(tx.value);
  const result: TxResult = {
    ...base,
    found: true,
    from: tx.from ?? null,
    to: tx.to ?? null,
    value: value !== null ? formatUnits(value, 18, 6) : "0",
  };

  const receipt = await rpc<RpcReceipt | null>(chain, "eth_getTransactionReceipt", [hash]);
  if (!receipt) {
    // In the mempool but not yet mined.
    return { ...result, status: "pending" };
  }

  const ok = hexToBigInt(receipt.status);
  const gasUsed = hexToBigInt(receipt.gasUsed);
  const gasPrice = hexToBigInt(receipt.effectiveGasPrice ?? tx.gasPrice);
  const fee = gasUsed !== null && gasPrice !== null ? gasUsed * gasPrice : null;
  const blockNumber = hexToBigInt(receipt.blockNumber);
  const latest = hexToBigInt(await rpc<string>(chain, "eth_blockNumber", []));

  result.status = ok === ONE ? "success" : "failed";
  result.gasUsed = gasUsed !== null ? gasUsed.toString() : null;
  result.fee = fee !== null ? formatUnits(fee, 18, 8) : null;
  result.blockNumber = blockNumber !== null ? Number(blockNumber) : null;
  result.contractCreated = receipt.contractAddress ?? null;
  if (blockNumber !== null && latest !== null && latest >= blockNumber) {
    result.confirmations = Number(latest - blockNumber) + 1;
  }
  return result;
}
