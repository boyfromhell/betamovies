import { ConfirmActionForm } from '@/components/confirm-action';
import { Power, ShieldCheck } from 'lucide-react';
import { AdminLayout } from '@/components/admin-layout';
import { SeoHead } from '@/components/seo-head';
import { useTranslation } from '@/hooks/use-translation';
import { update } from '@/routes/admin/watch-protection';

export default function AdminWatchProtection({
    enabled,
}: {
    enabled: boolean;
}) {
    const { t } = useTranslation();

    return (
        <AdminLayout active="watch-protection">
            <SeoHead title={t('Watch protection')} />
            <section className="max-w-3xl rounded-2xl border border-white/8 bg-white/[.025] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="flex items-center gap-2 text-2xl font-black">
                        <ShieldCheck className="size-5 text-sky-400" />
                        {t('Watch protection')}
                    </h2>
                    <span
                        role="status"
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ${enabled ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/5 text-slate-400'}`}
                    >
                        {enabled ? t('Enabled') : t('Disabled')}
                    </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                    {t(
                        'Require Cloudflare verification before opening the movie or episode player.',
                    )}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    {enabled
                        ? t('Visitors must pass verification before watching.')
                        : t('Watch pages open directly without verification.')}
                </p>
                <ConfirmActionForm
                    confirmation={{
                        title: t(
                            enabled
                                ? 'Disable watch protection?'
                                : 'Enable watch protection?',
                        ),
                        description: t(
                            enabled
                                ? 'Visitors will be able to open watch pages without verification.'
                                : 'Visitors will need to pass verification before watching.',
                        ),
                        label: t(enabled ? 'Disable' : 'Enable'),
                        tone: enabled ? 'danger' : 'primary',
                    }}
                    action={update()}
                    transform={(data) => ({ ...data, is_enabled: !enabled })}
                    options={{ preserveScroll: true }}
                    className="mt-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <button
                                type="submit"
                                disabled={processing}
                                aria-label={t(
                                    enabled
                                        ? 'Disable watch protection'
                                        : 'Enable watch protection',
                                )}
                                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition disabled:cursor-wait disabled:opacity-50 ${enabled ? 'border-rose-400/20 text-rose-300 hover:bg-rose-400/10' : 'border-emerald-400/20 text-emerald-300 hover:bg-emerald-400/10'}`}
                            >
                                <Power className="size-4" />
                                {processing
                                    ? t('Saving…')
                                    : enabled
                                      ? t('Disable')
                                      : t('Enable')}
                            </button>
                            {errors.is_enabled && (
                                <p
                                    role="alert"
                                    className="mt-3 text-sm text-rose-300"
                                >
                                    {errors.is_enabled}
                                </p>
                            )}
                        </>
                    )}
                </ConfirmActionForm>
            </section>
        </AdminLayout>
    );
}
