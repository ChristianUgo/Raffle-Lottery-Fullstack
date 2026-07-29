"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Dices } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-white/10 glass sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dices className="text-violet-500 w-8 h-8" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500">
            VerifiDraw Lottery
          </h1>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
