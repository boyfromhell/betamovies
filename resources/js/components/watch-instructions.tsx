import { useTranslation } from '@/hooks/use-translation';
import { ChevronDown, Info } from 'lucide-react';

export function WatchInstructions() {
    const { t } = useTranslation();
    return (
        <details className="group mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] transition open:border-sky-400/35 open:bg-sky-400/[.04]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/5 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-full bg-sky-500 text-white">
                        <Info className="size-4" />
                    </span>
                    {t('Viewing Instructions')}{' '}
                </span>
                <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                    {t('Open')}{' '}
                    <ChevronDown className="size-4 transition group-open:rotate-180" />
                </span>
            </summary>

            <div className="space-y-3 border-t border-white/8 px-4 py-4 text-sm leading-6 text-slate-300">
                <p>
                    {t('For a better viewing experience, install')}{' '}
                    <strong className="text-white">{t('Brave')}</strong>{' '}
                    {t('on your PC, laptop, phone, or tablet.')}{' '}
                </p>
                <p>
                    {t(
                        'After installation, open the episode or movie in Brave for more stable playback and fewer interruptions.',
                    )}{' '}
                </p>
                <p className="font-bold text-sky-300">{t('Happy watching.')}</p>
            </div>
        </details>
    );
}
