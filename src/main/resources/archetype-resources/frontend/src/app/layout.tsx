import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${artifactId}',
  description: 'Full-stack application with Spring Boot and Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
