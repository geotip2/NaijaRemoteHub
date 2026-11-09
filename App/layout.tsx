import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'NaijaRemoteHub Accessibility Auditor',
  description: 'Comprehensive WCAG 2.1/2.2 AA accessibility audit, issue explorer, remediation code diffs, and interactive accessible simulator for NaijaRemoteHub.',
  openGraph: {
    title: 'NaijaRemoteHub Accessibility Auditor',
    description: 'Comprehensive WCAG 2.1/2.2 AA accessibility audit, issue explorer, remediation code diffs, and interactive accessible simulator for NaijaRemoteHub.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NaijaRemoteHub Accessibility Auditor',
    description: 'Comprehensive WCAG 2.1/2.2 AA accessibility audit, issue explorer, remediation code diffs, and interactive accessible simulator for NaijaRemoteHub.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
