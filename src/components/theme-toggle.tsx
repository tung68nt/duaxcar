"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
            // Default to light theme
            setTheme("light");
            document.documentElement.setAttribute("data-theme", "light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button
                className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center"
                aria-label="Toggle theme"
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-surface-light)] flex items-center justify-center transition-all hover:scale-105"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-[var(--color-orange-400)]" />
            ) : (
                <Moon className="w-5 h-5 text-[var(--color-gray-600)]" />
            )}
        </button>
    );
}
