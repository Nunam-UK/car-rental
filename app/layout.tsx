import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Header from "@/components/Header/Header";
import "./globals.css";

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope' 
});

export const metadata: Metadata = {
  title: "RentalCar - Find your perfect car",
  description: "Best car rental service in Ukraine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}