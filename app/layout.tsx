import "./globals.css";
import type { Metadata } from "next";

export const metadata = {
  title: "Smart Attendance System",
  description: "Effortless attendance tracking for companies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0B0F] text-white">{children}</body>
    </html>
  );
}
