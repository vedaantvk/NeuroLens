import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";

const geistsans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-family",
});

export const metadata: Metadata = {
  title: "NeuroLens",
  description: "Dark mode enabled",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistsans.className}>
        <ThemeProvider
          attribute="class"
          enableSystem
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}