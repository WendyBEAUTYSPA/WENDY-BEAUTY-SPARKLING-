// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "hair", name: "Hair & Wigs", heroLabel: "Real inventory, more added weekly", gradient: "linear-gradient(145deg,#6E1E3D,#2A0E1C)", sortOrder: 1 },
  { slug: "fashion", name: "Women's Fashion", heroLabel: "Real inventory, more added weekly", gradient: "linear-gradient(145deg,#E23E7C,#6E1E3D)", sortOrder: 2 },
  { slug: "jewelry", name: "Jewelry", heroLabel: "Real inventory, more added weekly", gradient: "linear-gradient(145deg,#C9A467,#6E1E3D)", sortOrder: 3 },
  { slug: "shoes", name: "Shoes", heroLabel: "Real inventory, more added weekly", gradient: "linear-gradient(145deg,#2A0E1C,#C9A467)", sortOrder: 4 },
  { slug: "makeup", name: "Makeup", heroLabel: "Real inventory, more added weekly", gradient: "linear-gradient(145deg,#D98CA3,#2A0E1C)", sortOrder: 5 },
  { slug: "lips", name: "Lip Gloss", heroLabel: "Real inventory, more added weekly", gradient: "linear-gradient(145deg,#E23E7C,#C9A467)", sortOrder: 6 },
  { slug: "bags", name: "Handbags", heroLabel: "Real inventory, more added weekly", gradient: "linear-gradient(145deg,#6E1E3D,#C9A467)", sortOrder: 7 }
];

// 70 launch products across every category. This is real seed data the
// pagination/search/filter API actually queries — not decoration. Add more
// rows the same shape any time; the catalogue has no hardcoded size limit.
const PRODUCTS = [
  { slug: "bone-straight-human-hair-wig", name: "Bone Straight Human Hair Wig", cat: "hair", price: 96000, oldPrice: undefined, negotiable: true, tag: "Trending", rating: 4.3 },
  { slug: "hd-lace-frontal-wig-body-wave", name: "HD Lace Frontal Wig - Body Wave", cat: "hair", price: 11800, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.5 },
  { slug: "blonde-highlight-closure-wig", name: "Blonde Highlight Closure Wig", cat: "hair", price: 62000, oldPrice: 78200, negotiable: true, tag: undefined, rating: 4.3 },
  { slug: "kinky-curly-glueless-wig", name: "Kinky Curly Glueless Wig", cat: "hair", price: 96000, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.4 },
  { slug: "burgundy-ombre-bob-wig", name: "Burgundy Ombre Bob Wig", cat: "hair", price: 62000, oldPrice: 70200, negotiable: false, tag: "Sale", rating: 4.4 },
  { slug: "champagne-bridal-wig", name: "Champagne Bridal Wig", cat: "hair", price: 118500, oldPrice: 120500, negotiable: false, tag: undefined, rating: 4.3 },
  { slug: "deep-wave-lace-wig", name: "Deep Wave Lace Wig", cat: "hair", price: 84500, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.3 },
  { slug: "pixie-cut-human-hair-wig", name: "Pixie Cut Human Hair Wig", cat: "hair", price: 66500, oldPrice: 71500, negotiable: true, tag: undefined, rating: 4.3 },
  { slug: "straight-ponytail-extension", name: "Straight Ponytail Extension", cat: "hair", price: 19800, oldPrice: 24800, negotiable: true, tag: "New", rating: 4.8 },
  { slug: "613-blonde-full-lace-wig", name: "613 Blonde Full Lace Wig", cat: "hair", price: 118500, oldPrice: undefined, negotiable: true, tag: "Trending", rating: 4.5 },
  { slug: "silk-two-piece-evening-set", name: "Silk Two-Piece Evening Set", cat: "fashion", price: 18500, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.6 },
  { slug: "emerald-wrap-midi-dress", name: "Emerald Wrap Midi Dress", cat: "fashion", price: 24000, oldPrice: 29000, negotiable: false, tag: "Sale", rating: 4.9 },
  { slug: "corporate-tailored-trouser-set", name: "Corporate Tailored Trouser Set", cat: "fashion", price: 31000, oldPrice: 36000, negotiable: false, tag: "New", rating: 4.4 },
  { slug: "blush-satin-slip-dress", name: "Blush Satin Slip Dress", cat: "fashion", price: 22000, oldPrice: undefined, negotiable: false, tag: "Trending", rating: 4.8 },
  { slug: "ankara-print-jumpsuit", name: "Ankara Print Jumpsuit", cat: "fashion", price: 19500, oldPrice: 24500, negotiable: false, tag: undefined, rating: 4.8 },
  { slug: "sequin-party-mini-dress", name: "Sequin Party Mini Dress", cat: "fashion", price: 29000, oldPrice: 33000, negotiable: true, tag: undefined, rating: 4.6 },
  { slug: "linen-wide-leg-trousers", name: "Linen Wide-Leg Trousers", cat: "fashion", price: 17500, oldPrice: undefined, negotiable: true, tag: "Trending", rating: 4.9 },
  { slug: "off-shoulder-maxi-dress", name: "Off-Shoulder Maxi Dress", cat: "fashion", price: 26500, oldPrice: 30500, negotiable: true, tag: "New", rating: 4.3 },
  { slug: "denim-two-piece-set", name: "Denim Two-Piece Set", cat: "fashion", price: 21000, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.5 },
  { slug: "chiffon-wrap-blouse", name: "Chiffon Wrap Blouse", cat: "fashion", price: 14000, oldPrice: undefined, negotiable: true, tag: "New", rating: 4.7 },
  { slug: "gold-layered-necklace-set", name: "Gold Layered Necklace Set", cat: "jewelry", price: 14500, oldPrice: undefined, negotiable: false, tag: "New", rating: 4.4 },
  { slug: "crystal-drop-earrings", name: "Crystal Drop Earrings", cat: "jewelry", price: 8200, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.7 },
  { slug: "rose-gold-bangle-set", name: "Rose Gold Bangle Set", cat: "jewelry", price: 11800, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.6 },
  { slug: "pearl-statement-ring", name: "Pearl Statement Ring", cat: "jewelry", price: 6200, oldPrice: 8200, negotiable: true, tag: undefined, rating: 4.4 },
  { slug: "diamante-tennis-bracelet", name: "Diamante Tennis Bracelet", cat: "jewelry", price: 18500, oldPrice: undefined, negotiable: true, tag: "Trending", rating: 4.2 },
  { slug: "gold-hoop-earring-set", name: "Gold Hoop Earring Set", cat: "jewelry", price: 9800, oldPrice: 12800, negotiable: false, tag: "New", rating: 4.9 },
  { slug: "beaded-waist-chain", name: "Beaded Waist Chain", cat: "jewelry", price: 13500, oldPrice: 16500, negotiable: false, tag: undefined, rating: 4.3 },
  { slug: "minimalist-gold-anklet", name: "Minimalist Gold Anklet", cat: "jewelry", price: 6400, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.7 },
  { slug: "statement-chandelier-earrings", name: "Statement Chandelier Earrings", cat: "jewelry", price: 15500, oldPrice: undefined, negotiable: false, tag: undefined, rating: 4.8 },
  { slug: "layered-charm-bracelet", name: "Layered Charm Bracelet", cat: "jewelry", price: 10500, oldPrice: 13500, negotiable: true, tag: "New", rating: 4.6 },
  { slug: "champagne-strap-heels", name: "Champagne Strap Heels", cat: "shoes", price: 23500, oldPrice: 26500, negotiable: false, tag: "Trending", rating: 4.2 },
  { slug: "black-stiletto-pumps", name: "Black Stiletto Pumps", cat: "shoes", price: 21000, oldPrice: 26000, negotiable: false, tag: "Sale", rating: 4.7 },
  { slug: "white-platform-sneakers", name: "White Platform Sneakers", cat: "shoes", price: 26500, oldPrice: undefined, negotiable: true, tag: "Trending", rating: 4.7 },
  { slug: "nude-block-heel-sandals", name: "Nude Block Heel Sandals", cat: "shoes", price: 18500, oldPrice: 22500, negotiable: true, tag: "Sale", rating: 4.5 },
  { slug: "metallic-gold-mules", name: "Metallic Gold Mules", cat: "shoes", price: 19800, oldPrice: 21800, negotiable: false, tag: "New", rating: 4.5 },
  { slug: "suede-ankle-boots", name: "Suede Ankle Boots", cat: "shoes", price: 27500, oldPrice: 32500, negotiable: false, tag: "Trending", rating: 4.6 },
  { slug: "pointed-toe-flats", name: "Pointed Toe Flats", cat: "shoes", price: 13500, oldPrice: 16500, negotiable: true, tag: "New", rating: 4.5 },
  { slug: "chunky-sole-loafers", name: "Chunky Sole Loafers", cat: "shoes", price: 24500, oldPrice: undefined, negotiable: true, tag: "New", rating: 4.8 },
  { slug: "strappy-gladiator-sandals", name: "Strappy Gladiator Sandals", cat: "shoes", price: 19800, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.8 },
  { slug: "velvet-evening-pumps", name: "Velvet Evening Pumps", cat: "shoes", price: 22000, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.4 },
  { slug: "matte-foundation-full-coverage", name: "Matte Foundation - Full Coverage", cat: "makeup", price: 9800, oldPrice: undefined, negotiable: false, tag: "Sale", rating: 4.4 },
  { slug: "rose-blush-and-highlight-duo", name: "Rose Blush and Highlight Duo", cat: "makeup", price: 7200, oldPrice: undefined, negotiable: false, tag: "New", rating: 4.2 },
  { slug: "24-shade-eyeshadow-palette", name: "24-Shade Eyeshadow Palette", cat: "makeup", price: 13500, oldPrice: 16500, negotiable: true, tag: "New", rating: 4.9 },
  { slug: "waterproof-liquid-eyeliner", name: "Waterproof Liquid Eyeliner", cat: "makeup", price: 6200, oldPrice: 7500, negotiable: false, tag: "Trending", rating: 4.5 },
  { slug: "brow-definer-kit", name: "Brow Definer Kit", cat: "makeup", price: 8200, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.7 },
  { slug: "setting-spray-all-day-wear", name: "Setting Spray - All Day Wear", cat: "makeup", price: 9800, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.4 },
  { slug: "contour-and-bronzer-duo", name: "Contour and Bronzer Duo", cat: "makeup", price: 11800, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.9 },
  { slug: "longwear-concealer", name: "Longwear Concealer", cat: "makeup", price: 8500, oldPrice: undefined, negotiable: true, tag: "New", rating: 4.6 },
  { slug: "makeup-brush-set-12pc", name: "Makeup Brush Set 12pc", cat: "makeup", price: 18500, oldPrice: undefined, negotiable: true, tag: "Trending", rating: 4.5 },
  { slug: "illuminating-primer", name: "Illuminating Primer", cat: "makeup", price: 8200, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.9 },
  { slug: "velvet-matte-lip-gloss-set", name: "Velvet Matte Lip Gloss Set", cat: "lips", price: 6200, oldPrice: undefined, negotiable: true, tag: "New", rating: 4.9 },
  { slug: "hydrating-lip-oil-trio", name: "Hydrating Lip Oil Trio", cat: "lips", price: 5400, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.4 },
  { slug: "nude-collection-lipstick-bundle", name: "Nude Collection Lipstick Bundle", cat: "lips", price: 8900, oldPrice: 11500, negotiable: false, tag: undefined, rating: 4.5 },
  { slug: "clear-shine-lip-gloss", name: "Clear Shine Lip Gloss", cat: "lips", price: 4800, oldPrice: undefined, negotiable: true, tag: "New", rating: 4.2 },
  { slug: "berry-tint-lip-balm", name: "Berry Tint Lip Balm", cat: "lips", price: 5200, oldPrice: 6500, negotiable: false, tag: undefined, rating: 4.7 },
  { slug: "matte-liquid-lipstick-set", name: "Matte Liquid Lipstick Set", cat: "lips", price: 7200, oldPrice: 9200, negotiable: true, tag: undefined, rating: 4.2 },
  { slug: "plumping-lip-gloss", name: "Plumping Lip Gloss", cat: "lips", price: 6800, oldPrice: 8200, negotiable: false, tag: "New", rating: 4.4 },
  { slug: "rosy-lip-stain-duo", name: "Rosy Lip Stain Duo", cat: "lips", price: 5800, oldPrice: 7200, negotiable: false, tag: "New", rating: 4.4 },
  { slug: "classic-red-lipstick", name: "Classic Red Lipstick", cat: "lips", price: 5500, oldPrice: undefined, negotiable: false, tag: "Trending", rating: 4.8 },
  { slug: "glass-shine-lip-gloss", name: "Glass Shine Lip Gloss", cat: "lips", price: 4500, oldPrice: 5800, negotiable: false, tag: undefined, rating: 4.8 },
  { slug: "quilted-gold-chain-crossbody", name: "Quilted Gold-Chain Crossbody", cat: "bags", price: 19800, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.8 },
  { slug: "structured-tote-bag", name: "Structured Tote Bag", cat: "bags", price: 24500, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.4 },
  { slug: "blush-mini-clutch", name: "Blush Mini Clutch", cat: "bags", price: 12500, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.4 },
  { slug: "woven-straw-beach-bag", name: "Woven Straw Beach Bag", cat: "bags", price: 9800, oldPrice: 13800, negotiable: false, tag: undefined, rating: 4.4 },
  { slug: "leather-shoulder-bag", name: "Leather Shoulder Bag", cat: "bags", price: 26200, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.9 },
  { slug: "evening-box-clutch", name: "Evening Box Clutch", cat: "bags", price: 21000, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.5 },
  { slug: "canvas-everyday-tote", name: "Canvas Everyday Tote", cat: "bags", price: 15800, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.2 },
  { slug: "two-tone-satchel", name: "Two-Tone Satchel", cat: "bags", price: 27500, oldPrice: undefined, negotiable: true, tag: "Sale", rating: 4.5 },
  { slug: "pearl-handle-clutch", name: "Pearl-Handle Clutch", cat: "bags", price: 16500, oldPrice: undefined, negotiable: false, tag: "Sale", rating: 4.6 },
  { slug: "convertible-backpack-bag", name: "Convertible Backpack Bag", cat: "bags", price: 32000, oldPrice: undefined, negotiable: true, tag: undefined, rating: 4.3 }
];

async function main() {
  const catId: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const created = await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
    catId[c.slug] = created.id;
  }
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, price: p.price, oldPrice: p.oldPrice ?? null, negotiable: p.negotiable, tag: p.tag ?? null, rating: p.rating, categoryId: catId[p.cat], status: "ACTIVE", stock: 20 },
      create: { slug: p.slug, name: p.name, price: p.price, oldPrice: p.oldPrice ?? null, negotiable: p.negotiable, tag: p.tag ?? null, rating: p.rating, categoryId: catId[p.cat], status: "ACTIVE", stock: 20 }
    });
  }
  console.log(`Seeded ${CATEGORIES.length} categories, ${PRODUCTS.length} products.`);
}

main().finally(() => prisma.$disconnect());