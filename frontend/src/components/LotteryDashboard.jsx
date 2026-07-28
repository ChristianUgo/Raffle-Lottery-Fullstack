"use client";

import { useReadContract } from "wagmi";
import { LOTTERY_PROJECT_ABI, LOTTERY_PROJECT_CONTRACT_ADDRESS } from "@/constants";
import { formatEther } from "viem";
import { Users, Coins, Clock, Trophy } from "lucide-react";

export function LotteryDashboard() {
  const { data: entranceFee } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getEntranceFee",
  });

  const { data: numPlayers } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getNumberOfPlayers",
  });

  const { data: recentWinner } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getRecentWinner",
  });

  const { data: lotteryState } = useReadContract({
    address: LOTTERY_PROJECT_CONTRACT_ADDRESS,
    abi: LOTTERY_PROJECT_ABI,
    functionName: "getLotteryProjectState",
  });

  const poolEth = (numPlayers && entranceFee) ? formatEther((numPlayers) * (entranceFee)) : "0.00";

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Live Jackpot Hero Banner */}
      <div className="glass-card rounded-3xl p-8 relative overflow-hidden border border-yellow-500/20 shadow-[0_0_50px_rgba(234,179,8,0.15)] bg-gradient-to-r from-yellow-950/20 via-violet-950/30 to-fuchsia-950/20">
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full text-xs font-semibold text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span>Active Pool Live</span>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-yellow-400/90 mb-1">
            Current Estimated Jackpot
          </span>
          <div className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] my-2">
            {poolEth} ETH
          </div>
          <p className="text-zinc-400 text-sm">
            Winner gets <span className="text-green-400 font-semibold">95% of total pool</span> upon automated draw
          </p>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Entrance Fee */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <Coins className="w-10 h-10 text-violet-400 mb-3" />
        <h3 className="text-zinc-400 font-medium mb-1">Entrance Fee</h3>
        <p className="text-2xl font-bold">
          {entranceFee ? formatEther(entranceFee ) : "0.0"} ETH
        </p>
      </div>

      {/* Players */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <Users className="w-10 h-10 text-blue-400 mb-3" />
        <h3 className="text-zinc-400 font-medium mb-1">Tickets Sold</h3>
        <p className="text-2xl font-bold">
          {numPlayers ? (numPlayers ).toString() : "0"}
        </p>
      </div>

      {/* LotteryProject State */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <Clock className="w-10 h-10 text-fuchsia-400 mb-3" />
        <h3 className="text-zinc-400 font-medium mb-1">LotteryProject State</h3>
        <p className="text-2xl font-bold">
          {lotteryState === 0 ? "Open" : lotteryState === 1 ? "Calculating" : "Loading..."}
        </p>
      </div>

      {/* Recent Winner */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <Trophy className="w-10 h-10 text-yellow-400 mb-3" />
        <h3 className="text-zinc-400 font-medium mb-1">Recent Winner</h3>
        <p className="text-sm font-medium truncate w-full px-2">
          {recentWinner && (recentWinner ) !== "0x0000000000000000000000000000000000000000"
            ? (recentWinner ).substring(0, 6) + "..." + (recentWinner ).substring(38)
            : "None yet"}
        </p>
      </div>
    </div>
  );
}
