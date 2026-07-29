"use client";

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import {
  LOTTERY_PROJECT_ABI,
  LOTTERY_PROJECT_CONTRACT_ADDRESS,
  LOTTERY_PROJECT_IS_CONFIGURED,
} from "@/constants";
import { formatEther } from "viem";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, Ticket, WalletCards } from "lucide-react";
import toast from "react-hot-toast";

export function EnterLottery() {
  const [tickets, setTickets] = useState(1);

  const { data: entranceFee } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getEntranceFee",
    query: { enabled: LOTTERY_PROJECT_IS_CONFIGURED },
  });

  const { data: hash, isPending, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isPending) {
      toast.loading("Awaiting wallet approval...", { id: "lottery-tx" });
    }
  }, [isPending]);

  useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction is being mined...", { id: "lottery-tx" });
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully entered the lottery!", { id: "lottery-tx" });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error("Transaction failed or rejected.", { id: "lottery-tx" });
    }
  }, [error]);

  const handleEnter = async () => {
    if (!LOTTERY_PROJECT_IS_CONFIGURED) {
      toast.error("The Polygon Amoy lottery contract is not configured yet.");
      return;
    }
    if (!entranceFee) return;
    const totalCost = (entranceFee ) * BigInt(tickets);

    writeContract({
      address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
      abi: LOTTERY_PROJECT_ABI,
      functionName: "enterLotteryProject",
      value: totalCost,
    });
  };

  const isLoading = isPending || isConfirming;
  const costInPol = entranceFee ? formatEther((entranceFee ) * BigInt(tickets)) : "0";

  return (
    <section className="glass-card relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] p-6 sm:p-10">
      <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
            <Ticket className="h-6 w-6 text-violet-300" />
          </div>
          <p className="section-label mb-3">Enter the live draw</p>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Choose your tickets</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
            Each ticket is recorded by the lottery contract. Select an amount,
            review the total, then approve the transaction in your wallet.
          </p>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-xs text-zinc-400">
            <WalletCards className="h-5 w-5 shrink-0 text-cyan-300" />
            Payment is made directly from your connected wallet in POL.
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/25 p-4 sm:p-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">Number of tickets</p>
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-2">
          <button
            onClick={() => setTickets(Math.max(1, tickets - 1))}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white transition hover:border-violet-400/30 hover:bg-violet-400/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isLoading}
            aria-label="Remove one ticket"
          >
            <Minus className="h-5 w-5" />
          </button>
          <div className="w-20 text-center text-4xl font-black text-white">
            {tickets}
          </div>
          <button
            onClick={() => setTickets(tickets + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white transition hover:border-violet-400/30 hover:bg-violet-400/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={isLoading}
            aria-label="Add one ticket"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-2">
          {[1, 3, 5, 10].map((count) => (
            <button
              key={count}
              onClick={() => setTickets(count)}
              className={`rounded-xl border px-2 py-2.5 text-xs font-bold transition ${
                tickets === count
                  ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                  : "border-white/8 bg-white/[0.03] text-zinc-400 hover:border-white/15 hover:bg-white/[0.06]"
              }`}
              disabled={isLoading}
            >
              {count} ticket{count > 1 ? "s" : ""}
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <span className="text-sm font-semibold text-zinc-400">Total due</span>
          <span className="text-lg font-black text-white">{costInPol} POL</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          disabled={isLoading || !entranceFee || !LOTTERY_PROJECT_IS_CONFIGURED}
          className="flex min-h-14 w-full items-center justify-center rounded-xl border border-white/15 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 px-5 py-4 text-base font-extrabold text-white shadow-[0_14px_35px_rgba(124,58,237,0.22)] transition-all hover:shadow-[0_18px_45px_rgba(168,85,247,0.4)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-6 h-6 text-white" />
              <span>Processing Transaction...</span>
            </div>
          ) : (
            LOTTERY_PROJECT_IS_CONFIGURED
              ? `Pay ${costInPol} POL`
              : "Testnet contract pending"
          )}
        </motion.button>
        {!LOTTERY_PROJECT_IS_CONFIGURED && (
          <p className="mt-4 text-center text-xs leading-5 text-amber-300">
            The public interface is live. Ticket purchases will unlock after
            the verified Polygon Amoy VRF contract is connected.
          </p>
        )}
        </div>
      </div>
    </section>
  );
}
