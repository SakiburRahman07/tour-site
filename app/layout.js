import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RouteChangeLoader } from "./components/route-change-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tour Planner - Your Travel Companion",
  description: "Plan your perfect tour with us",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased relative`}
      >
        <Providers>
          <RouteChangeLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
