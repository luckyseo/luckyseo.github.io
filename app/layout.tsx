import type { Metadata } from "next";
import { ContentProvider } from "@/services/content/ContentProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yunseo Park · Portfolio",
  description:
    "A playful, readable portfolio for Yunseo Park: projects, notes, education and ways to get in touch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
