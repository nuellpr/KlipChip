// Harga & paket kredit — aman dipakai di client dan server (tanpa prisma)

export const CLIP_PRICE_IDR = 500;

export interface CreditPackage {
  code: string;
  name: string;
  credits: number;
  priceIdr: number;
  perClipIdr: number;
  tagline: string;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    code: 'starter',
    name: 'Paket Starter',
    credits: 15,
    priceIdr: 6000,
    perClipIdr: 400,
    tagline: '~Rp 400 / clip (Hemat 20%)',
  },
  {
    code: 'creator-pro',
    name: 'Creator Pro',
    credits: 50,
    priceIdr: 15000,
    perClipIdr: 300,
    tagline: '~Rp 300 / clip (Hemat 40%)',
  },
];

export function getCreditPackage(code: string): CreditPackage | null {
  return CREDIT_PACKAGES.find((p) => p.code === code) || null;
}
