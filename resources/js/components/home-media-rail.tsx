import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useHorizontalScroll } from '@/hooks/use-horizontal-scroll';
import { useTranslation } from '@/hooks/use-translation';
import type { index as moviesIndex } from '@/routes/movies';

export function HomeMediaRail({
    title,
    subtitle,
    href,
    children,
}: {
    title: string;
    subtitle: string;
    href?: ReturnType<typeof moviesIndex>;
    children: ReactNode;
}) {
    const { t } = useTranslation();
    const rail = useHorizontalScroll(true);
    const scroll = (direction: number) =>
        rail.current?.scrollBy({
            left: direction * rail.current.clientWidth * 0.8,
            behavior: 'smooth',
        });

    return (
        <section>
            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                        {t(title)}
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">{t(subtitle)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {href && (
                        <Link
                            href={href}
                            className="hidden rounded-full px-3 py-2 text-xs font-bold text-sky-300 transition hover:bg-white/5 hover:text-white sm:block"
                        >
                            {t('View all')}{' '}
                            <ArrowRight className="ml-1 inline size-3.5" />
                        </Link>
                    )}
                    <button
                        type="button"
                        onClick={() => scroll(-1)}
                        className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-sky-400/50 hover:text-white"
                        aria-label={t('Scroll :title left', {
                            title: t(title),
                        })}
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll(1)}
                        className="grid size-9 cursor-pointer place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-sky-400/50 hover:text-white"
                        aria-label={t('Scroll :title right', {
                            title: t(title),
                        })}
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
            <div
                ref={rail}
                className="grid cursor-grab snap-x snap-mandatory [scrollbar-width:none] auto-cols-[42%] grid-flow-col gap-4 overflow-x-auto pb-4 sm:auto-cols-[28%] lg:auto-cols-[21%] xl:auto-cols-[17%] [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>
        </section>
    );
}
