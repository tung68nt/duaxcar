"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CurriculumItem } from "@/lib/types";

interface AccordionProps {
    items: CurriculumItem[];
    type: "elearning" | "onsite";
}

export function CourseAccordion({ items, type }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-[var(--color-surface)] rounded-xl overflow-hidden border border-transparent hover:border-[var(--color-border)] transition-colors"
                >
                    <button
                        onClick={() => toggle(index)}
                        className="w-full flex items-center justify-between p-4 text-left group"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                                    type === "elearning"
                                        ? "bg-purple-500/10 group-hover:bg-purple-500/20"
                                        : "bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20"
                                )}
                            >
                                <span
                                    className={cn(
                                        "text-small font-bold",
                                        type === "elearning"
                                            ? "text-purple-400"
                                            : "text-[var(--color-primary)]"
                                    )}
                                >
                                    {index + 1}
                                </span>
                            </div>
                            <span className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                                {item.title}
                            </span>
                        </div>
                        <ChevronDown
                            className={cn(
                                "w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-300",
                                openIndex === index ? "rotate-180" : ""
                            )}
                        />
                    </button>
                    <div
                        className={cn(
                            "grid transition-all duration-300 ease-in-out",
                            openIndex === index
                                ? "grid-rows-[1fr] opacity-100 pb-4"
                                : "grid-rows-[0fr] opacity-0"
                        )}
                    >
                        <div className="overflow-hidden">
                            <div className="px-4 pl-[4.5rem] pr-8">
                                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                                    {item.description}
                                </p>
                                {item.details && item.details.length > 0 && (
                                    <ul className="mt-3 space-y-1">
                                        {item.details.map((detail, idx) => (
                                            <li
                                                key={idx}
                                                className="text-sm text-[var(--color-text-muted)] list-disc list-inside"
                                            >
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
