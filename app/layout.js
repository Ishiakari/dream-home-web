import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PublicFooter from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DreamHome | UK Property Management",
  description: "Specializing in the management of furnished properties for rent across the UK.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 2. 'flex-col' ensures the footer pushes to the bottom */}
      <body className="min-h-full flex flex-col">
        
        {/* Main content area expands to fill space */}
        <main className="flex-grow">
          {children}
        </main>

        {/* 3. Footer sits at the bottom of the layout */}
        <PublicFooter />
        
      </body>
    </html>
  );
}