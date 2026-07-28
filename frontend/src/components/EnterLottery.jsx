"use client";

import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { LOTTERY_PROJECT_ABI, LOTTERY_PROJECT_CONTRACT_ADDRESS } from "@/constants";
import { parseEther, formatEther } from "viem";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function EnterLottery() {
  const [tickets, setTickets] = useState(1);

  const { data: entranceFee } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getEntranceFee",
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
  const costInEth = entranceFee ? formatEther((entranceFee ) * BigInt(tickets)) : "0";

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-card rounded-3xl max-w-lg mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 z-0" />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-2">Buy Tickets</h2>
        <p className="text-zinc-400 mb-8 text-center">
          Increase your chances of winning by purchasing multiple tickets!
        </p>

        <div className="flex items-center gap-4 mb-6 bg-black/40 p-2 rounded-2xl border border-white/10">
          <button
            onClick={() => setTickets(Math.max(1, tickets - 1))}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition text-2xl font-bold"
            disabled={isLoading}
          >
            -
          </button>
          <div className="text-4xl font-black w-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
            {tickets}
          </div>
          <button
            onClick={() => setTickets(tickets + 1)}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition text-2xl font-bold"
            disabled={isLoading}
          >
            +
          </button>
        </div>

        {/* Ticket Presets */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 3, 5, 10].map((count) => (
            <button
              key={count}
              onClick={() => setTickets(count)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                tickets === count
                  ? "bg-violet-600/30 border-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
              }`}
              disabled={isLoading}
            >
              {count}x Ticket{count > 1 ? "s" : ""}
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleEnter}
          disabled={isLoading || !entranceFee}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 font-bold text-lg hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-6 h-6 text-white" />
              <span>Processing Transaction...</span>
            </div>
          ) : (
            `Pay ${costInEth} ETH`
          )}
        </motion.button>
      </div>
    </div>
  );
}
