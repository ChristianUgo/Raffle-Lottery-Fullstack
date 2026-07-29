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
    <section className="mx-auto mt-28 w-full max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="section-label mb-3">Onchain results</p>
          <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            <Award className="h-8 w-8 text-amber-300" />
            Hall of Fame
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-zinc-500">
          A public record of every winning address and automated prize payout.
        </p>
      </div>

      {winners.length === 0 ? (
        <div className="glass-card relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_48%)]" />
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04]">
            <Ghost className="h-9 w-9 text-violet-300" />
          </div>
          <h3 className="relative mb-2 text-2xl font-extrabold text-white">The first winner could be you</h3>
          <p className="relative mx-auto max-w-md text-sm leading-6 text-zinc-400">
            The prize pool is waiting! Be the first to enter the lottery and cement your place in the Hall of Fame.
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.035] text-xs uppercase tracking-[0.12em] text-zinc-500">
                  <th className="p-5 font-bold">Address</th>
                  <th className="p-5 text-right font-bold">Prize won</th>
                  <th className="p-5 text-center font-bold">Status</th>
                  <th className="p-5 text-right font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {winners.slice().reverse().map((winner, i) => {
                  const addr = winner?.winnerAddress || winner?.[0] || "";
                  const amount = winner?.amountWon !== undefined ? winner.amountWon : (winner?.[1] || 0n);
                  return (
                    <tr key={i} className="transition-colors hover:bg-white/[0.025]">
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
    </section>
  );
}
