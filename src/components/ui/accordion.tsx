"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionItemProps {
    title: string
    children: React.ReactNode
    className?: string
    defaultOpen?: boolean
}

export function AccordionItem({ title, children, className, defaultOpen = false }: AccordionItemProps) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)

    return (
        <div className={cn("border-b border-[var(--color-border)] last:border-none", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between py-4 text-left font-medium text-[var(--color-text)] transition-all hover:text-[var(--color-primary)]"
            >
                {title}
                <ChevronDown
                    className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200 text-[var(--color-text-secondary)]",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"
                )}
            >
                <div className="text-[var(--color-text-secondary)] leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    )
}

interface AccordionProps {
    items: {
        title: string
        content: React.ReactNode
    }[]
    className?: string
}

export function Accordion({ items, className }: AccordionProps) {
    return (
        <div className={cn("w-full divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6", className)}>
            {items.map((item, index) => (
                <AccordionItem key={index} title={item.title}>
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    )
}
