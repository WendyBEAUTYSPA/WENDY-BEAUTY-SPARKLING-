export const WHATSAPP_PRIMARY = process.env.NEXT_PUBLIC_WHATSAPP_PRIMARY || "2348137609506";
export const WHATSAPP_SECONDARY = process.env.NEXT_PUBLIC_WHATSAPP_SECONDARY || "2349012314878";
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "dannydj786@gmail.com";

export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function productEnquiryMessage(params: { name: string; price: string; negotiable: boolean }): string {
  const { name, price, negotiable } = params;
  return [
    "Hello Wendy Beauty & Spa,", "", "I am interested in:", "",
    `Product: ${name}`, `Displayed Price: ${price}`, "",
    negotiable ? "Please let me know your best available price." : "Please confirm availability.",
    "", "Thank you."
  ].join("\n");
}

export function cartCheckoutMessage(params: { lines: { name: string; qty: number; price: string }[]; total: string }): string {
  const { lines, total } = params;
  const itemLines = lines.map((l) => `- ${l.name} x${l.qty} (${l.price})`).join("\n");
  return [
    "Hello Wendy Beauty & Spa,", "", "I would like to order:", "", itemLines, "",
    `Estimated Total: ${total}`, "", "Please confirm availability and best price.", "", "Thank you."
  ].join("\n");
}

export function bookingMessage(params: { name: string; phone: string; email?: string; service: string; date?: string; notes?: string }): string {
  const { name, phone, email, service, date, notes } = params;
  return [
    "Hello Wendy Beauty & Spa,", "", "I'd like to book an appointment:", "",
    `Name: ${name}`, `Phone: ${phone}`,
    email ? `Email: ${email}` : null, `Service: ${service}`,
    date ? `Preferred Date: ${date}` : null, notes ? `Notes: ${notes}` : null,
    "", "Please confirm availability.", "", "Thank you."
  ].filter((l) => l !== null).join("\n");
}