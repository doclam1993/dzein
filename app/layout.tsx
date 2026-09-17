import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'opendesign — Visual Website & SaaS Builder',
  description: 'Visual website and SaaS builder with interactive 3D elements, AI agent code assistant, and live React/Tailwind export.',
  openGraph: {
    title: 'opendesign — Visual Website & SaaS Builder',
    description: 'Visual website and SaaS builder with interactive 3D elements, AI agent code assistant, and live React/Tailwind export.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'opendesign — Visual Website & SaaS Builder',
    description: 'Visual website and SaaS builder with interactive 3D elements, AI agent code assistant, and live React/Tailwind export.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
