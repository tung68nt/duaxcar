"use client";

/**
 * Modal Component — Portal-based modal that prevents unmount bugs
 * 
 * Giải quyết:
 * - Bug file picker đóng modal (event bubbling → backdrop)
 * - Modal content bị unmount khi parent re-render
 * - z-index conflicts
 * 
 * Sử dụng createPortal để render ngoài DOM tree của parent.
 */
import { useEffect, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    titleIcon?: ReactNode;
    children: ReactNode;
    /** Max width class (default: max-w-xl) */
    maxWidth?: string;
    /** Show close button in header (default: true) */
    showCloseButton?: boolean;
    /** Close on backdrop click (default: true) */
    closeOnBackdrop?: boolean;
    /** Close on Escape key (default: true) */
    closeOnEscape?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    titleIcon,
    children,
    maxWidth = "max-w-xl",
    showCloseButton = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
}: ModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle Escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (closeOnEscape && e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        },
        [closeOnEscape, onClose]
    );

    useEffect(() => {
        if (!isOpen) return;

        document.addEventListener("keydown", handleKeyDown);
        // Prevent body scroll when modal is open
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, handleKeyDown]);

    // Handle backdrop click — ONLY triggers when clicking the backdrop itself
    const handleBackdropClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            // CRITICAL: Only close if clicking the backdrop directly,
            // NOT if event bubbled up from content (e.g., file input click)
            if (closeOnBackdrop && e.target === e.currentTarget) {
                onClose();
            }
        },
        [closeOnBackdrop, onClose]
    );

    if (!isOpen) return null;

    // Use createPortal to render outside parent DOM tree
    // This prevents:
    // 1. Modal content unmounting when parent re-renders
    // 2. z-index conflicts with parent elements
    // 3. Event bubbling issues from file inputs
    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            {/* Backdrop — separate div, click handler only on this element */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
                onClick={handleBackdropClick}
            />

            {/* Content — stopPropagation prevents backdrop from catching clicks */}
            <div
                ref={contentRef}
                className={`relative ${maxWidth} w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl animate-scaleIn z-10`}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-5 pb-0">
                        {title && (
                            <div className="flex items-center gap-2.5">
                                {titleIcon && (
                                    <div className="p-2 rounded-lg bg-orange-500/10 text-[var(--color-primary)]">
                                        {titleIcon}
                                    </div>
                                )}
                                <h3 className="font-heading font-bold text-base text-[var(--color-text)]">
                                    {title}
                                </h3>
                            </div>
                        )}
                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-light)] transition-colors"
                                aria-label="Đóng"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-5">{children}</div>
            </div>
        </div>,
        document.body
    );
}
