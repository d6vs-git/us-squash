import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ModeToggle } from "@/components/theme/mode-toggle";

export const metadata: Metadata = {
  title: "Squash Dashboard",
  description: "Next.js integration with US Squash API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </>

  );
}
