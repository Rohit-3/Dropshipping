import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./providers/AuthProvider";
import { CartProvider } from "./providers/CartProvider";
import AIChatAssistant from "./components/AIChatAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EasyBuy",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
            }}
          />
        )}
        {/* SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Modern dropshipping eCommerce store. Shop the latest products with fast shipping and secure checkout." />
        <meta property="og:title" content="Dropshipping Store" />
        <meta property="og:description" content="Modern dropshipping eCommerce store. Shop the latest products with fast shipping and secure checkout." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dropshipping Store" />
        <meta name="twitter:description" content="Modern dropshipping eCommerce store. Shop the latest products with fast shipping and secure checkout." />
        <meta name="twitter:image" content="/og-image.png" />
      </head>
      <body className={`bg-gray-50 min-h-screen ${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <CartProvider>
            <NavBar />
            <main className="container mx-auto pt-4 pb-8 px-2 md:px-0">
              {children}
            </main>
            <AIChatAssistant />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
