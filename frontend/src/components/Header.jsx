"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Dices } from "lucide-react";

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
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
            </svg>
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
