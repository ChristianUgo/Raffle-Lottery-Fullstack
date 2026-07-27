
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Provider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cyfrin LotteryProject",
  description: "A modern, secure Web3 lottery application",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen antialiased`}>
        <Web3Provider>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: '',
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              },
            }} 
          />
        </Web3Provider>
      </body>
    </html>
  );
}
