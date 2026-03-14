import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import TanStackQueryProvider from "@/providers/TanStackQueryProvider";
import {Toaster} from "sonner";
import React from "react";

// const inter  = Inter(
//     {
//         subsets: ["latin"],
//         variable: "--font-inter",
//     }
// )
export const metadata: Metadata = {
  title: "WEXON",
  description: "Warehouse EXcellence & Optimization Network",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html lang="en">
        <body className={` min-h-screen`}>
            <TanStackQueryProvider>
                {children}
            </TanStackQueryProvider>
            <Toaster position="top-right" />
        </body>
    </html>
)

export default RootLayout;
