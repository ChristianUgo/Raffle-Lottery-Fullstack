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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
