"use client";

import { Header } from "@/components/Header";
import { LotteryDashboard } from "@/components/LotteryDashboard";
import { EnterLottery } from "@/components/EnterLottery";
import { HallOfFame } from "@/components/HallOfFame";
import { HowItWorks } from "@/components/HowItWorks";
import { motion } from "framer-motion";
import { ArrowDown, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  return (
    <main id="top" className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="subtle-grid pointer-events-none absolute inset-x-0 top-0 h-[52rem] opacity-70" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[-20%] top-[-15%] h-[34rem] w-[34rem] rounded-full bg-violet-600/15 blur-[130px]"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute right-[-20%] top-[18rem] h-[34rem] w-[34rem] rounded-full bg-cyan-500/10 blur-[130px]"
      />

      <Header />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pb-20 pt-14 sm:px-6 sm:pt-20"
      >
        <motion.div variants={itemVariants} className="mx-auto mb-16 max-w-4xl text-center sm:mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-200">
            <Sparkles className="h-4 w-4" />
            Transparent by design
          </div>
          <h2 className="text-balance text-5xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl md:text-8xl">
            A fair draw you can
            <span className="block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              verify onchain.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Enter the Polygon Amoy lottery, follow the prize pool in real time,
            and let Chainlink VRF select the winner transparently.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#tickets"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-[0_14px_40px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(124,58,237,0.38)]"
            >
              Enter the draw
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              See how it works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-zinc-500">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Non-custodial</span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-cyan-400" /> Chainlink VRF</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-violet-400" /> Polygon Amoy</span>
          </div>
        </motion.div>

        <motion.div id="draw" variants={itemVariants}><LotteryDashboard /></motion.div>
        <motion.div id="tickets" variants={itemVariants} className="scroll-mt-28"><EnterLottery /></motion.div>
        <motion.div id="how-it-works" variants={itemVariants} className="scroll-mt-28"><HowItWorks /></motion.div>
        <motion.div id="winners" variants={itemVariants} className="scroll-mt-28"><HallOfFame /></motion.div>
      </motion.div>
    </main>
  );
}
