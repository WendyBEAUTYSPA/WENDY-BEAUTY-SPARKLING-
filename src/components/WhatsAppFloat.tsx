"use client";

import { WHATSAPP_PRIMARY, waLink } from "@/lib/whatsapp";

export default function WhatsAppFloat() {
  return (
    <a href={waLink(WHATSAPP_PRIMARY, "Hello Wendy Beauty & Spa, I'd like to know more about your products and services.")} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-24 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#1F8A57] text-white shadow-[0_14px_30px_-8px_rgba(31,138,87,0.7)] lg:bottom-6">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.9.53 3.66 1.44 5.17L2 22l5.06-1.53a9.86 9.86 0 0 0 4.98 1.35h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.06h-.01a8.13 8.13 0 0 1-4.15-1.14l-.3-.18-3.07.93.92-3.08-.19-.31a8.14 8.14 0 0 1-1.25-4.37c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.67 8.15-8.17 8.15zm4.48-6.1c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  );
}