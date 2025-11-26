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
        <script
            dangerouslySetInnerHTML={{
                __html: `
                    (function() {
                        function hideNextIndicator() {
                            const selectors = [
                                '[data-nextjs-toast]',
                                '.__next-dev-overlay',
                                'a[href*="__nextjs"]',
                                '#__next-build-watcher',
                                'div[data-nextjs-toast]',
                                'a[href*="__nextjs"]',
                                'body > a[href*="__nextjs"]',
                                'body > div[id*="__next"]'
                            ];
                            
                            selectors.forEach(function(selector) {
                                try {
                                    const elements = document.querySelectorAll(selector);
                                    elements.forEach(function(el) {
                                        el.style.display = 'none';
                                        el.style.visibility = 'hidden';
                                        el.style.opacity = '0';
                                        el.style.pointerEvents = 'none';
                                        el.style.width = '0';
                                        el.style.height = '0';
                                        el.style.overflow = 'hidden';
                                    });
                                } catch(e) {}
                            });
                            
                            const allElements = document.querySelectorAll('body > *');
                            allElements.forEach(function(el) {
                                if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
                                
                                try {
                                    const style = window.getComputedStyle(el);
                                    const rect = el.getBoundingClientRect();
                                    
                                    if (style.position === 'fixed' && 
                                        rect.bottom < 100 && 
                                        rect.left < 100 &&
                                        (el.textContent === 'N' || el.textContent.trim() === 'N' || 
                                         el.href && el.href.includes('__nextjs'))) {
                                        el.style.display = 'none';
                                        el.style.visibility = 'hidden';
                                        el.style.opacity = '0';
                                        el.style.pointerEvents = 'none';
                                        el.style.width = '0';
                                        el.style.height = '0';
                                        el.style.overflow = 'hidden';
                                    }
                                } catch(e) {}
                            });
                        }
                        
                        if (document.readyState === 'loading') {
                            document.addEventListener('DOMContentLoaded', hideNextIndicator);
                        } else {
                            hideNextIndicator();
                        }
                        
                        setInterval(hideNextIndicator, 500);
                        
                        if (typeof MutationObserver !== 'undefined') {
                            const observer = new MutationObserver(hideNextIndicator);
                            observer.observe(document.body, {
                                childList: true,
                                subtree: true
                            });
                        }
                    })();
                `,
            }}
        />
        </body>
        </html>
    );
}
