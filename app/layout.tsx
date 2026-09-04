import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SwapsPro starter kit',
  description:
    'A working demo of every SwapsPro integration surface: widget, SDK, HTTP API and the agent path — with the documentation on the page.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#07090b] text-white antialiased">{children}</body>
    </html>
  );
}
