import { Geist_Mono, Roboto  } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400","700", "900"],
  variable: "--font-roboto"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, roboto.variable, "font-roboto")}
    >
      <body suppressHydrationWarning>
        <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
        >
          {children}
          <Toaster richColors/>
        </ThemeProvider>
      </body>
    </html>
  )
}
