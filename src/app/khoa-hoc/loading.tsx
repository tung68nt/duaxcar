export default function CoursesLoading() {
    return (
        <>
            {/* Hero Skeleton */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gray-900)] via-[var(--color-gray-800)] to-[var(--color-gray-900)]" />
                <div className="container relative z-10">
                    <div className="max-w-3xl space-y-4">
                        <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
                        <div className="h-12 w-full bg-white/10 rounded animate-pulse" />
                        <div className="h-12 w-2/3 bg-white/10 rounded animate-pulse" />
                        <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Type Cards Skeleton */}
            <section className="py-8 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-light)] animate-pulse" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-28 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                        <div className="h-3 w-20 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Grid Skeleton */}
            <section className="section bg-[var(--color-surface)]">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-2">
                            <div className="h-6 w-36 bg-[var(--color-surface-light)] rounded animate-pulse" />
                            <div className="h-4 w-28 bg-[var(--color-surface-light)] rounded animate-pulse" />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
                                {/* Image */}
                                <div className="h-48 bg-[var(--color-surface-light)] animate-pulse" />
                                {/* Content */}
                                <div className="p-5 space-y-3">
                                    <div className="h-3 w-20 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    <div className="h-5 w-full bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    <div className="h-4 w-5/6 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    <div className="h-4 w-3/4 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    <div className="flex gap-4 pt-2">
                                        <div className="h-4 w-16 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                        <div className="h-4 w-12 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]">
                                        <div className="h-4 w-24 bg-[var(--color-primary)]/20 rounded animate-pulse" />
                                        <div className="h-4 w-20 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
