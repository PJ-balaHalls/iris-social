import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'IRIS – Memórias que conectam. Presença que permanece.',
  description: 'Uma rede social de significado, identidade e memória. Guarde suas lembranças, escreva cartas, cultive sonhos e conecte-se profundamente.',
  keywords: 'memórias, rede social, identidade, conexões profundas, IRIS',
  authors: [{ name: 'IRIS' }],
  openGraph: {
    title: 'IRIS – O tempo passa, mas o que sentimos permanece.',
    description: 'Descubra um novo jeito de preservar memórias e fortalecer vínculos.',
    url: 'https://iris.social',
    siteName: 'IRIS',
    images: [{ url: '/iris/brand/og-image.png', width: 1200, height: 630 }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IRIS – Rede social de memórias',
    description: 'Guarde o que importa, reviva o que te fez sentir.',
    images: ['/iris/brand/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/iris/brand/favicon/svg/gradiente/favicon.svg',
    shortcut: '/iris/brand/favicon/svg/gradiente/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}