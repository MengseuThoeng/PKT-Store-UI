import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnimeNavbar from "@/components/ui/navbar";
import Footer from "@/components/customs/footer";
import { CartProvider } from "@/lib/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'PKT Store - Premium Anime Figures, Manga & Plushies | Cambodia',
    template: '%s | PKT Store'
  },
  description: 'Discover premium anime figures, manga collections, and plushies at PKT Store Cambodia. Your ultimate destination for authentic anime merchandise with free shipping and secure checkout.',
  keywords: [
    'anime figures',
    'manga',
    'plushies',
    'anime merchandise',
    'cambodia anime store',
    'one piece figures',
    'dragon ball figures',
    'naruto merchandise',
    'anime collectibles',
    'premium figures',
    'anime store phnom penh'
  ],
  authors: [{ name: 'PKT Store' }],
  creator: 'PKT Store',
  publisher: 'PKT Store',
  metadataBase: new URL('https://pkt-store.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pkt-store.vercel.app',
    title: 'PKT Store - Premium Anime Figures, Manga & Plushies',
    description: 'Discover premium anime figures, manga collections, and plushies at PKT Store Cambodia. Your ultimate destination for authentic anime merchandise.',
    siteName: 'PKT Store',
    images: [
      {
        url: '/images/pkt-store-og.jpg', // We'll create this
        width: 1200,
        height: 630,
        alt: 'PKT Store - Premium Anime Merchandise',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PKT Store - Premium Anime Figures, Manga & Plushies',
    description: 'Discover premium anime figures, manga collections, and plushies at PKT Store Cambodia.',
    images: ['/images/pkt-store-twitter.jpg'], // We'll create this
    creator: '@PKTStore', // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with your Google verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <AnimeNavbar/>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
