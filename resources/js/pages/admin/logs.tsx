import { ConfirmActionForm } from '@/components/confirm-action';
import { useTranslation } from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { Eraser, FileText } from 'lucide-react';
import { AdminLayout } from '@/components/admin-layout';
import { SeoHead } from '@/components/seo-head';
import { clear, index } from '@/routes/admin/logs';

type LogFile = { name: string; size: number; updatedAt: number };

export default function AdminLogs({
    files,
    selected,
    content,
}: {
    files: LogFile[];
    selected: string | null;
    content: string;
}) {
    const { t } = useTranslation();
    return (
        <AdminLayout active="logs">
            <SeoHead title={t('Admin logs')} />
            <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="rounded-2xl border border-white/8 bg-white/[.025] p-3">
                    <h2 className="px-3 py-2 text-sm font-black text-white">
                        {t('Log files')}{' '}
                    </h2>
                    <div className="mt-1 space-y-1">
                        {files.map((file) => (
                            <Link
                                key={file.name}
                                href={index({ query: { file: file.name } })}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${selected === file.name ? 'bg-sky-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <FileText className="size-4 shrink-0" />
                                <span className="min-w-0 flex-1 truncate">
                                    {file.name}
                                </span>
                                <span className="text-[10px] opacity-70">
                                    {Math.ceil(file.size / 1024)} {t('KB')}{' '}
                                </span>
                            </Link>
                        ))}
                        {files.length === 0 && (
                            <p className="px-3 py-8 text-center text-sm text-slate-500">
                                {t('No log files.')}{' '}
                            </p>
                        )}
                    </div>
                </aside>
                <section className="min-w-0 rounded-2xl border border-white/8 bg-[#050914]">
                    <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                        <h2 className="truncate text-sm font-black">
                            {selected ?? t('Application log')}
                        </h2>
                        {selected && (
                            <ConfirmActionForm
                                confirmation={{
                                    title: t('Clear logs?'),
                                    description: t(
                                        'All entries in this log will be permanently deleted.',
                                    ),
                                    label: t('Clear'),
                                }}
                                action={clear(selected)}
                            >
                                {({ processing }) => (
                                    <button
                                        disabled={processing}
                                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-rose-400/25 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-400/10 disabled:opacity-50"
                                    >
                                        <Eraser className="size-3.5" />{' '}
                                        {t('Clear')}{' '}
                                    </button>
                                )}
                            </ConfirmActionForm>
                        )}
                    </div>
                    <pre className="max-h-[65vh] min-h-96 overflow-auto p-4 font-mono text-xs leading-5 whitespace-pre-wrap text-slate-400">
                        {content || t('The selected log is empty.')}
                    </pre>
                </section>
            </div>
        </AdminLayout>
    );
}
