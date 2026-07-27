"use client";

import { ShieldCheck, Dices, Coins } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Coins className="w-8 h-8 text-violet-400" />,
      title: "1. Buy a Ticket",
      description: "Connect your wallet and pay the entrance fee to securely enter the lottery. All funds go directly into the smart contract prize pool."
    },
    {
      icon: <Dices className="w-8 h-8 text-fuchsia-400" />,
      title: "2. Verifiable Randomness",
      description: "Once the lottery period ends, Chainlink VRF provides a cryptographically secure, verifiable random number to guarantee absolute fairness."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-400" />,
      title: "3. Automated Payouts",
      description: "Chainlink Automation triggers the smart contract to automatically pick the winner and transfer the entire prize pool instantly. No human intervention."
    }
  ];

  return (
    <div className="mt-20 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">How it Works</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          A fully decentralized lottery powered by Chainlink. Trust the code, not the casino.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="glass-card rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
