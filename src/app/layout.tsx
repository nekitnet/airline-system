import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Система Авиакомпания",
    description: "Современная система управления авиакомпанией: рейсы, билеты, персонал.",
    keywords: ["авиакомпания", "рейсы", "билеты", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    authors: [{ name: "Aero System" }],
    icons: {
        icon: "/plane.svg",
    },
    openGraph: {
        title: "Система Авиакомпания",
        description: "Управление полётами и бронированием билетов",
        url: "https://example.com",
        siteName: "Система Авиакомпания",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Система Авиакомпания",
        description: "Современная система для авиаперевозчиков",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
        {children}
        <Toaster />
        </body>
        </html>
    );
}
