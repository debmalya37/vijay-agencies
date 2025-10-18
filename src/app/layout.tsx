import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CartProvider } from "@/components/cart/CartProvider";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wholesale Hotel & Restaurant Supplies in Jaipur | Vijay Agencies",
  description: "Your #1 source in Jaipur for wholesale hotel, restaurant, and housekeeping supplies. Vijay Agencies offers bulk pricing on cleaning chemicals, disposables, and more for B2B & B2C.",
  icons: {
    icon: '/icon.jpg', // Path to your favicon
    apple: '/icon.jpg', // Path to your Apple Touch Icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <CartProvider>
        <Providers>
          <Navbar/>
          {children}
          <Footer/>
        </Providers>
      </CartProvider>
      </body>
    </html>
  );
}
