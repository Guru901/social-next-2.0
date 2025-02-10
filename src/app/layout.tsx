import { Providers } from "./components/providers";
import { Spline_Sans } from "next/font/google";
import type { Metadata } from "next";

const splineSans = Spline_Sans({
  weight: ["400", "500", "300"],
  subsets: ["latin"],
});
import "./globals.css";

export const metadata: Metadata = {
  title: "JStack App",
  description: "Created using JStack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${splineSans.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
