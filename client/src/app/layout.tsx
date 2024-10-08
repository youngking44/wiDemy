import type { Metadata } from "next";
import "./globals.css";
import ThemeProviders from "@/providers/ThemeProviders";
import Navbar from "@/components/navbar/Navbar";
import { josefin, roboto } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${josefin.variable} font-roboto bg-white bg-no-repeat 
        dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <ThemeProviders>
          <Navbar />
          {children}
        </ThemeProviders>
      </body>
    </html>
  );
}
