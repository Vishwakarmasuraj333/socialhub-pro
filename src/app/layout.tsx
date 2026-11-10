import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SOCIALHUB PRO | All Your Social Media. One Powerful Dashboard.',
  description:
    'Enterprise-grade social media management platform. Connect Instagram, Facebook, YouTube, LinkedIn, TikTok, X, and Pinterest. Schedule, analyze, collaborate, and unify your social communications.',
  keywords: [
    'Social Media Management',
    'Enterprise SaaS',
    'Social Inbox',
    'Instagram Scheduler',
    'LinkedIn Analytics',
    'TikTok Management',
    'SOCIALHUB PRO',
  ],
  authors: [{ name: 'SOCIALHUB PRO Global Technologies' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-maroon-700 selection:text-gold-300">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

