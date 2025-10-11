'use client';

import { usePathname } from 'next/navigation';
import AnimeNavbar from "@/components/ui/navbar";
import Footer from "@/components/customs/footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path is admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // Don't show navbar/footer on admin pages
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Show navbar/footer on normal pages
  return (
    <>
      <AnimeNavbar />
      {children}
      <Footer />
    </>
  );
}
