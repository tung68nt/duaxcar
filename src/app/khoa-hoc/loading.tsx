import { ChefHat, BookOpen } from "lucide-react";

export default function CoursesLoading() {
    return (
        <div className="min-h-screen bg-[var(--color-background)] animate-pulse">
            {/* Hero Skeleton */}
            <section className="relative py-16 md:py-24 overflow-hidden border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="max-w-2xl space-y-4">
                        <div className="w-28 h-6 rounded-full bg-[var(--color-surface)]" />
                        <div className="w-3/4 h-10 rounded-xl bg-[var(--color-surface)]" />
                        <div className="w-full h-5 rounded-lg bg-[var(--color-surface)]" />
                    </div>
                </div>
            </section>

            {/* Type Cards Skeleton */}
            <section className="py-6 bg-[var(--color-surface)]/50 border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-light)]" />
                                <div className="space-y-2 flex-1">
                                    <div className="w-28 h-4 rounded bg-[var(--color-surface-light)]" />
                                    <div className="w-20 h-3 rounded bg-[var(--color-surface-light)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Courses Grid Skeleton */}
            <section className="py-12">
                <div className="container">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
                                <div className="h-48 bg-[var(--color-surface-light)]" />
                                <div className="p-5 space-y-3">
                                    <div className="w-24 h-3 rounded bg-[var(--color-surface-light)]" />
                                    <div className="w-4/5 h-5 rounded bg-[var(--color-surface-light)]" />
                                    <div className="w-full h-3 rounded bg-[var(--color-surface-light)]" />
                                    <div className="w-2/3 h-3 rounded bg-[var(--color-surface-light)]" />
                                    <div className="pt-4 border-t border-[var(--color-border)] flex justify-between">
                                        <div className="w-20 h-4 rounded bg-[var(--color-surface-light)]" />
                                        <div className="w-24 h-4 rounded bg-[var(--color-surface-light)]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
