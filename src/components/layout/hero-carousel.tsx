"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerItem {
    id: number;
    image: string;
    alt: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
    {
        id: 1,
        image: "/images/courses/pho-bo.jpg",
        alt: "Phở Bò Truyền Thống",
    },
    {
        id: 2,
        image: "/images/courses/bun-bo-hue.jpg",
        alt: "Bún Bò Huế",
    },
    {
        id: 3,
        image: "/images/courses/bun-cha.jpg",
        alt: "Bún Chả",
    },
    {
        id: 4,
        image: "/images/courses/lau-nuong.jpg",
        alt: "Lẩu Nướng Kinh Doanh",
    },
];

interface HeroCarouselProps {
    initialBanners?: BannerItem[];
}

export default function HeroCarousel({ initialBanners }: HeroCarouselProps) {
    const [banners, setBanners] = useState<BannerItem[]>(
        initialBanners && initialBanners.length > 0 ? initialBanners : DEFAULT_BANNERS
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (initialBanners && initialBanners.length > 0) {
            setBanners(initialBanners);
            return;
        }

        // Live fetch from CMS Settings API
        fetch("/api/cms/settings")
            .then((res) => res.json())
            .then((data) => {
                if (data.settings?.heroBanners && data.settings.heroBanners.length > 0) {
                    setBanners(data.settings.heroBanners);
                }
            })
            .catch(() => {});
    }, [initialBanners]);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    if (banners.length === 0) return null;

    return (
        <section className="relative w-full h-[45vh] sm:h-[60vh] lg:h-[80vh] bg-[var(--color-gray-900)] overflow-hidden group">
            {/* Slides */}
            {banners.map((banner, index) => (
                <div
                    key={banner.id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    <Image
                        src={banner.image}
                        alt={banner.alt || "DuaxCar Banner"}
                        fill
                        priority={index === 0}
                        className="object-cover"
                        sizes="100vw"
                    />
                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-black/10" />
                </div>
            ))}

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/35 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
                        aria-label="Slide trước"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/35 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/50"
                        aria-label="Slide tiếp theo"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Slide Indicators (Dots) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? "bg-[var(--color-orange-500)] w-8"
                                        : "bg-white/40 hover:bg-white/60"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
