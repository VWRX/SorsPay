import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { LanguageProvider } from '@/lib/i18n';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'SorsPay — P2P Processing',
  description: 'P2P processing for iGaming and fintech businesses.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
