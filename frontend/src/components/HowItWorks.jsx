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
      description: "When the draw becomes eligible, the smart contract requests verifiable randomness and pays the winner onchain without discretionary control."
    }
  ];

  return (
    <section className="mx-auto mt-28 w-full max-w-6xl">
      <div className="mb-12 max-w-2xl">
        <p className="section-label mb-3">Simple. Transparent. Verifiable.</p>
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">How every draw works</h2>
        <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">
          Three onchain steps take you from ticket purchase to an automated,
          cryptographically verifiable payout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={index} className="glass-card relative flex min-h-72 flex-col rounded-2xl p-7">
            <span className="absolute right-6 top-5 text-5xl font-black text-white/[0.035]">0{index + 1}</span>
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-white/8 bg-white/[0.04]">
              {step.icon}
            </div>
            <h3 className="mb-3 text-lg font-extrabold text-white">{step.title}</h3>
            <p className="text-sm leading-6 text-zinc-400">
              {step.description}
            </p>
            <div className="mt-auto pt-6">
              <div className="h-px bg-gradient-to-r from-violet-400/40 to-transparent" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
