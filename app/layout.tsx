import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'SmartInvoice - Professional Invoice Management',
  description: 'Create and download professional invoices, manage clients and expenses, and track payment status with SmartInvoice.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600;1,700&family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#121212" />
      </head>
      <body className="bg-black text-white" style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <AuthProvider>
          <div className="relative z-10">
            {children}
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
