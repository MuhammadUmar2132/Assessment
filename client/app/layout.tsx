import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Small Web Browser — The Sites and the Browser You Read Them In',
  description: 'A custom web browser simulation navigating hundreds of decentralized one-page sites living in MongoDB.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-sky-100 selection:text-sky-900">{children}</body>
    </html>
  );
}

