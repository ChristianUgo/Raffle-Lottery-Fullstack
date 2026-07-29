"use client";

import { useReadContract } from "wagmi";
import {
  LOTTERY_PROJECT_ABI,
  LOTTERY_PROJECT_CONTRACT_ADDRESS,
  LOTTERY_PROJECT_IS_CONFIGURED,
} from "@/constants";
import { formatEther } from "viem";
import { Award, CheckCircle2, History, Ghost } from "lucide-react";

export function HallOfFame() {
  const { data: pastWinners } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getPastWinners",
    query: { enabled: LOTTERY_PROJECT_IS_CONFIGURED },
  });

  const winners = pastWinners || [];

  return (
    <div className="mt-20 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        <Award className="text-yellow-400 w-8 h-8" />
        <h2 className="text-3xl font-bold tracking-tight">Hall of Fame</h2>
      </div>

      {winners.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Ghost className="w-10 h-10 text-zinc-500 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No Winners Yet</h3>
          <p className="text-zinc-400 max-w-md">
            The prize pool is waiting! Be the first to enter the lottery and cement your place in the Hall of Fame.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-sm text-zinc-400 uppercase tracking-wider">
                  <th className="p-5 font-semibold">Address</th>
                  <th className="p-5 font-semibold text-right">Prize Won</th>
                  <th className="p-5 font-semibold text-center">Status</th>
                  <th className="p-5 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {winners.slice().reverse().map((winner, i) => {
                  const addr = winner?.winnerAddress || winner?.[0] || "";
                  const amount = winner?.amountWon !== undefined ? winner.amountWon : (winner?.[1] || 0n);
                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-mono text-violet-300">
                        {addr ? `${addr.substring(0, 8)}...${addr.substring(36)}` : "N/A"}
                      </td>
                      <td className="p-5 font-bold text-green-400 text-right">
                        {formatEther(amount)} POL
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full w-max mx-auto text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Paid Out
                        </div>
                      </td>
                      <td className="p-5 text-right text-zinc-400 flex items-center justify-end gap-2">
                        <History className="w-4 h-4" />
                        Just now
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
