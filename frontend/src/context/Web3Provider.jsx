"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, sepolia, foundry } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

const config = getDefaultConfig({
  appName: "Cyfrin LotteryProject",
  // A 32-character hex string is required for WalletConnect v2. 
  // Get one for free at https://cloud.reown.com
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID_HERE",
  chains: [foundry, sepolia, mainnet],
  ssr: true, // Server-side rendering support
});

const queryClient = new QueryClient();

export function Web3Provider({ children }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#8b5cf6", // Violet-500
            accentColorForeground: "white",
            borderRadius: "large",
            overlayBlur: "small",
          })}
        >
          {mounted ? children : null}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
