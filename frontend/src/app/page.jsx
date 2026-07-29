"use client";

import { Header } from "@/components/Header";
import { LotteryDashboard } from "@/components/LotteryDashboard";
import { EnterLottery } from "@/components/EnterLottery";
import { HallOfFame } from "@/components/HallOfFame";
import { HowItWorks } from "@/components/HowItWorks";
import { motion } from "framer-motion";

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
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background glowing orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" 
      />

      <Header />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            Decentralized <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-500 animate-pulse">
              Fair Lottery
            </span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Connect your wallet to enter the transparent, VRF-powered Polygon Amoy lottery.
            Purchase tickets and win the prize pool!
          </p>
        </motion.div>

        <motion.div variants={itemVariants}><LotteryDashboard /></motion.div>
        <motion.div variants={itemVariants}><EnterLottery /></motion.div>
        <motion.div variants={itemVariants}><HowItWorks /></motion.div>
        <motion.div variants={itemVariants}><HallOfFame /></motion.div>
      </motion.div>
    </main>
  );
}
