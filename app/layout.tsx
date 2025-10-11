import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ui/ConditionalLayout";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://pkt-store.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/pkt.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/images/pkt.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://pkt-store.vercel.app',
    title: 'PKT Store - Premium Anime Figures, Manga & Plushies',
    description: 'Discover premium anime figures, manga collections, and plushies at PKT Store Cambodia. Your ultimate destination for authentic anime merchandise.',
    siteName: 'PKT Store',
    images: [
      {
        url: '/images/pngkt.png',
        width: 1200,
        height: 630,
        alt: 'PKT Store - Premium Anime Merchandise',
      },
      {
        url: '/images/pkt.jpg',
        width: 800,
        height: 600,
        alt: 'PKT Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PKT Store - Premium Anime Figures, Manga & Plushies',
    description: 'Discover premium anime figures, manga collections, and plushies at PKT Store Cambodia.',
    images: ['/images/pngkt.png'],
    creator: '@PKTStore',
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
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
