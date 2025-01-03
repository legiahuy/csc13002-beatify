import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Figtree} from 'next/font/google'
import { Toaster } from 'react-hot-toast';



const font = Figtree({ subsets: ['latin']})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Beatify - Web Player: Discover, Listen, Enjoy",
  description: "Elevate Your Listening Experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
