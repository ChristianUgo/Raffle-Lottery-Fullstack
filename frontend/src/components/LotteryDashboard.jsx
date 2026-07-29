"use client";

import { useReadContract } from "wagmi";
import {
  LOTTERY_PROJECT_ABI,
  LOTTERY_PROJECT_CONTRACT_ADDRESS,
  LOTTERY_PROJECT_IS_CONFIGURED,
} from "@/constants";
import { formatEther } from "viem";
import { Users, Coins, Clock, Trophy, Radio, ShieldCheck } from "lucide-react";

export function LotteryDashboard() {
  const { data: entranceFee } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getEntranceFee",
    query: { enabled: LOTTERY_PROJECT_IS_CONFIGURED },
  });

  const { data: numPlayers } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getNumberOfPlayers",
    query: { enabled: LOTTERY_PROJECT_IS_CONFIGURED },
  });

  const { data: recentWinner } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getRecentWinner",
    query: { enabled: LOTTERY_PROJECT_IS_CONFIGURED },
  });

  const { data: lotteryState } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getLotteryProjectState",
    query: { enabled: LOTTERY_PROJECT_IS_CONFIGURED },
  });

  const poolPol = (numPlayers && entranceFee) ? formatEther((numPlayers) * (entranceFee)) : "0.00";
  const stats = [
    {
      label: "Entrance fee",
      value: `${entranceFee ? formatEther(entranceFee) : "0.0"} POL`,
      icon: Coins,
      color: "text-violet-300",
      surface: "bg-violet-400/10 border-violet-400/15",
    },
    {
      label: "Tickets sold",
      value: numPlayers ? numPlayers.toString() : "0",
      icon: Users,
      color: "text-cyan-300",
      surface: "bg-cyan-400/10 border-cyan-400/15",
    },
    {
      label: "Draw status",
      value: !LOTTERY_PROJECT_IS_CONFIGURED
        ? "Pending"
        : lotteryState === 0
          ? "Open"
          : lotteryState === 1
            ? "Calculating"
            : "Loading...",
      icon: Clock,
      color: "text-fuchsia-300",
      surface: "bg-fuchsia-400/10 border-fuchsia-400/15",
    },
    {
      label: "Recent winner",
      value: recentWinner && recentWinner !== "0x0000000000000000000000000000000000000000"
        ? `${recentWinner.substring(0, 6)}...${recentWinner.substring(38)}`
        : "None yet",
      icon: Trophy,
      color: "text-amber-300",
      surface: "bg-amber-400/10 border-amber-400/15",
    },
  ];

  return (
    <div className="mb-12 flex flex-col gap-5">
      <div className="glass-card relative overflow-hidden rounded-[2rem] border-violet-400/15 p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <Radio className="h-3.5 w-3.5" />
                Active pool
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500">
                <ShieldCheck className="h-4 w-4 text-violet-300" />
                95% automated winner payout
              </span>
            </div>
            <p className="section-label mb-3">Current estimated jackpot</p>
            <div className="break-all text-5xl font-black tracking-[-0.05em] text-white sm:text-7xl">
              {poolPol}
              <span className="ml-3 text-2xl tracking-normal text-violet-300 sm:text-3xl">POL</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
              Every confirmed ticket increases the live prize pool. The draw
              remains transparent and verifiable from entry to payout.
            </p>
          </div>
          <div className="grid min-w-52 grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-black/20 p-3 lg:grid-cols-1">
            <div className="rounded-xl bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Network</p>
              <p className="mt-1 text-sm font-bold text-white">Polygon Amoy</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">Randomness</p>
              <p className="mt-1 text-sm font-bold text-white">Chainlink VRF</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, surface }) => (
          <div key={label} className="glass-card flex min-h-32 items-center gap-4 rounded-2xl p-5">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${surface}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">{label}</p>
              <p className="mt-2 truncate text-xl font-extrabold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
