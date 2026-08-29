export default function CourseDetailLoading() {
    return (
        <>
            {/* Breadcrumb Skeleton */}
            <section className="py-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-24 bg-[var(--color-surface-light)] rounded animate-pulse" />
                        <span className="text-[var(--color-text-muted)]">/</span>
                        <div className="h-4 w-40 bg-[var(--color-surface-light)] rounded animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Hero Skeleton */}
            <section className="section-sm bg-[var(--color-surface)]/40 border-b border-[var(--color-border)]">
                <div className="container">
                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Image Skeleton */}
                        <div className="lg:col-span-7">
                            <div className="relative aspect-video rounded-2xl bg-[var(--color-surface-light)] animate-pulse overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer" />
                            </div>
                        </div>

                        {/* Info Skeleton */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Badge */}
                            <div className="flex gap-2">
                                <div className="h-6 w-20 bg-[var(--color-surface-light)] rounded-full animate-pulse" />
                                <div className="h-6 w-16 bg-[var(--color-surface-light)] rounded-full animate-pulse" />
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <div className="h-8 w-full bg-[var(--color-surface-light)] rounded animate-pulse" />
                                <div className="h-8 w-3/4 bg-[var(--color-surface-light)] rounded animate-pulse" />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-[var(--color-surface-light)] rounded animate-pulse" />
                                <div className="h-4 w-5/6 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                <div className="h-4 w-4/6 bg-[var(--color-surface-light)] rounded animate-pulse" />
                            </div>

                            {/* Meta Info */}
                            <div className="flex gap-4">
                                <div className="h-5 w-24 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                <div className="h-5 w-20 bg-[var(--color-surface-light)] rounded animate-pulse" />
                            </div>

                            {/* Price Card */}
                            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
                                <div className="h-4 w-16 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                <div className="h-8 w-32 bg-[var(--color-primary)]/20 rounded animate-pulse" />
                                <div className="h-12 w-full bg-[var(--color-primary)]/20 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Skeleton */}
            <section className="section bg-[var(--color-background)]">
                <div className="container">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Highlights */}
                            <div className="space-y-4">
                                <div className="h-6 w-48 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[var(--color-surface-light)] animate-pulse flex-shrink-0" />
                                        <div className="h-4 flex-1 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>

                            {/* Curriculum */}
                            <div className="space-y-4">
                                <div className="h-6 w-56 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                                        <div className="h-5 w-3/4 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                        <div className="h-3 w-1/2 bg-[var(--color-surface-light)] rounded animate-pulse mt-2" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Instructor Card */}
                            <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
                                <div className="h-5 w-24 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-surface-light)] animate-pulse" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                        <div className="h-3 w-24 bg-[var(--color-surface-light)] rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
