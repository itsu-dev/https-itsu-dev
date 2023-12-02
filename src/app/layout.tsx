import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'itsu.dev',
  description: 'ちゅるりのサイトだぞ〜',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
    <head>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin={''} />
      <link
        href='https://fonts.googleapis.com/css2?family=BIZ+UDPGothic&family=Noto+Sans+JP&family=Source+Code+Pro&display=swap'
        rel='stylesheet' />
    </head>
    <body>{children}</body>
    </html>
  );
}
