"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
    content: string;
}

interface Heading {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Parse content to find h2 and h3 tags
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        const elements = tempDiv.querySelectorAll("h2, h3");
        const headingData: Heading[] = Array.from(elements).map((el, index) => {
            const id = `heading-${index}`;
            // Add id to the actual content in the DOM (this needs to be handled in the parent/renderer)
            // For now, we just assume the renderer will add IDs or we use a different approach.
            // A better approach for this component is to rely on client-side parsing after render usually,
            // but since we are passing raw HTML string to the page, we can extract here.

            return {
                id,
                text: el.textContent || "",
                level: el.tagName === "H2" ? 2 : 3,
            };
        });

        setHeadings(headingData);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveId(id);
        }
    };

    if (headings.length === 0) return null;

    return (
        <nav className="toc p-6 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] h-fit sticky top-24">
            <h4 className="font-heading font-semibold mb-4 text-[var(--color-text)]">
                Mục lục
            </h4>
            <ul className="space-y-2 text-small">
                {headings.map(({ id, text, level }) => (
                    <li
                        key={id}
                        style={{ paddingLeft: level === 3 ? "1rem" : "0" }}
                    >
                        <a
                            href={`#${id}`}
                            onClick={(e) => scrollToHeading(id, e)}
                            className={cn(
                                "block transition-colors hover:text-[var(--color-primary)] py-1",
                                activeId === id
                                    ? "text-[var(--color-primary)] font-medium"
                                    : "text-[var(--color-text-secondary)]"
                            )}
                        >
                            {text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
