import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car Link - منصة تحليل السيارات بالذكاء الاصطناعي",
  description: "قم بتحليل السيارات من الروابط والصور باستخدام الذكاء الاصطناعي. احصل على المواصفات وتحليل الأسعار وخيارات التمويل والنصائح في مكان واحد.",
  keywords: ["Car Link", "AI", "تحليل سيارات", "مواصفات مركبات", "تمويل", "مقارنة سيارات", "سيارات"],
  authors: [{ name: "Car Link Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Car Link - منصة تحليل السيارات بالذكاء الاصطناعي",
    description: "مساعد ذكي لشراء السيارات",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
