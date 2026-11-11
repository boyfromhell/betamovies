import { useTranslation } from '@/hooks/use-translation';

export function CatalogSkeletonGrid({ title }: { title: string }) {
    const { t } = useTranslation();
    return (
        <div
            className="grid grid-cols-2 gap-x-4 gap-y-8 py-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            aria-label={t('Loading more :title', {
                title: title.toLowerCase(),
            })}
            role="status"
        >
            {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="animate-pulse">
                    <div className="aspect-[2/3] rounded-2xl bg-slate-800/70" />
                    <div className="mt-3 h-4 w-4/5 rounded bg-slate-800/70" />
                    <div className="mt-2 h-3 w-2/5 rounded bg-slate-800/50" />
                </div>
            ))}
            <span className="sr-only">{t('Loading more results…')}</span>
        </div>
    );
}
