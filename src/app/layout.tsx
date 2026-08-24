import type { Metadata } from 'next';
import { Inter, Outfit, Russo_One, Chakra_Petch } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-russo',
});

const chakraPetch = Chakra_Petch({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-chakra',
});

export const metadata: Metadata = {
  title: 'KlipChip - Ubah Video YouTube & Twitch Jadi Klip Vertikal 9:16 Cepat',
  description:
    'Aplikasi pembuat highlight video livestream otomatis dengan deteksi audio spike, lonjakan chat, dan auto-caption slang gaming Indonesia. Bayar per clip tanpa langganan mahal!',
  keywords: [
    'klipchip',
    'clip youtube shorts',
    'twitch clip generator',
    'gaming highlight ai',
    'auto caption bahasa indonesia',
    'slang gaming indonesia',
    'pay per clip',
    'qris video editor',
  ],
  openGraph: {
    title: 'KlipChip - AI Highlight & Auto-Caption Slang Gaming Indonesia',
    description: 'Potong momen seru livestream YouTube & Twitch jadi video 9:16 Shorts/TikTok dalam < 3 menit.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.variable} ${outfit.variable} ${russoOne.variable} ${chakraPetch.variable} min-h-screen bg-[#0F0F23] text-[#E2E8F0] flex flex-col antialiased selection:bg-[#F43F5E] selection:text-white`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
