"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Dices, Github } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="group flex min-w-0 items-center gap-3" aria-label="VerifiDraw home">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 shadow-[0_0_24px_rgba(139,92,246,0.18)] transition group-hover:border-violet-300/60 group-hover:bg-violet-500/20">
            <Dices className="h-5 w-5 text-violet-300" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-extrabold tracking-tight text-white sm:text-lg">
              VerifiDraw
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300 sm:block">
              Polygon Amoy Lottery
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-zinc-400 lg:flex" aria-label="Primary navigation">
          <a href="#draw" className="transition hover:text-white">Live draw</a>
          <a href="#tickets" className="transition hover:text-white">Enter</a>
          <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          <a href="#winners" className="transition hover:text-white">Winners</a>
          <a
            href="https://github.com/ChristianUgo/Raffle-Lottery-Fullstack"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>

        <div className="shrink-0">
          <ConnectButton
            accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
            chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
}
