import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Wendy Beauty & Spa — Your Beauty. Your Style. Your Signature.",
  description: "Premium Nigerian beauty, fashion, hair, cosmetics and personal-care marketplace. Hair & wigs, fashion, jewelry, shoes, makeup, handbags and beauty & spa services — all in one place."
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="pb-16 lg:pb-0">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}