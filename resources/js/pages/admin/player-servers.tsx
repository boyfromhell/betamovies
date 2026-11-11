import { ConfirmActionForm } from '@/components/confirm-action';
import { useTranslation } from '@/hooks/use-translation';
import { Form } from '@inertiajs/react';
import { Film, Plus, Power, Server, Tv } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { SeoHead } from '@/components/seo-head';
import { store, update } from '@/routes/admin/player-servers';

type PlayerServer = {
    id: number;
    key: string;
    name: string;
    quality: string;
    priority: number;
    movie_template: string | null;
    tv_template: string | null;
    response_mode: 'direct' | 'body_url';
    is_enabled: boolean;
};

const fieldClassName =
    'mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400';

function ServerField({
    name,
    label,
    error,
    help,
    ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    error?: string;
    help?: string;
}) {
    const id = `server-${name}`;

    return (
        <div>
            <label htmlFor={id} className="text-sm font-bold text-slate-300">
                {label}
            </label>
            <input
                {...inputProps}
                id={id}
                name={name}
                className={fieldClassName}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    [help && `${id}-help`, error && `${id}-error`]
                        .filter(Boolean)
                        .join(' ') || undefined
                }
            />
            {help && (
                <p id={`${id}-help`} className="mt-2 text-xs text-slate-500">
                    {help}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className="mt-2 text-xs text-rose-300">
                    {error}
                </p>
            )}
        </div>
    );
}

function ServerCard({
    server,
    isDefault,
}: {
    server: PlayerServer;
    isDefault: boolean;
}) {
    const { t } = useTranslation();
    return (
        <article className="min-w-0 rounded-2xl border border-white/8 bg-white/[.025] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black break-words">
                            {server.name}
                        </h3>
                        <span
                            className={`rounded-lg px-2 py-1 text-[10px] font-bold ${server.is_enabled ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/5 text-slate-500'}`}
                        >
                            {server.is_enabled ? t('Enabled') : t('Disabled')}
                        </span>
                        {isDefault && (
                            <span className="rounded-lg bg-sky-400/10 px-2 py-1 text-[10px] font-bold text-sky-300">
                                {t('Default')}{' '}
                            </span>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        {server.quality} {t('· Priority')} {server.priority}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                        {server.movie_template && (
                            <span className="inline-flex items-center gap-1.5">
                                <Film className="size-3.5" /> {t('Movies')}{' '}
                            </span>
                        )}
                        {server.tv_template && (
                            <span className="inline-flex items-center gap-1.5">
                                <Tv className="size-3.5" /> {t('TV shows')}{' '}
                            </span>
                        )}
                        {server.response_mode === 'body_url' && (
                            <span>{t('Resolved URL')}</span>
                        )}
                    </div>
                </div>
                <ConfirmActionForm
                    confirmation={{
                        title: t(
                            server.is_enabled
                                ? 'Disable server?'
                                : 'Enable server?',
                        ),
                        description: t(
                            server.is_enabled
                                ? 'Hide “:name” from the player?'
                                : 'Make “:name” available in the player?',
                            { name: server.name },
                        ),
                        label: t(server.is_enabled ? 'Disable' : 'Enable'),
                        tone: server.is_enabled ? 'danger' : 'primary',
                    }}
                    action={update(server.id)}
                    options={{ preserveScroll: true }}
                    className="shrink-0"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="is_enabled"
                                value={server.is_enabled ? '0' : '1'}
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                aria-label={t(
                                    server.is_enabled
                                        ? 'Disable :server'
                                        : 'Enable :server',
                                    { server: server.name },
                                )}
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition disabled:cursor-wait disabled:opacity-50 ${server.is_enabled ? 'border-rose-400/20 text-rose-300 hover:bg-rose-400/10' : 'border-emerald-400/20 text-emerald-300 hover:bg-emerald-400/10'}`}
                            >
                                <Power className="size-3.5" />
                                {processing
                                    ? t('Saving…')
                                    : server.is_enabled
                                      ? t('Disable')
                                      : t('Enable')}
                            </button>
                            {errors.is_enabled && (
                                <p
                                    role="alert"
                                    className="mt-2 max-w-48 text-xs text-rose-300"
                                >
                                    {errors.is_enabled}
                                </p>
                            )}
                        </>
                    )}
                </ConfirmActionForm>
            </div>
            <details className="mt-4 border-t border-white/8 pt-3">
                <summary className="cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-300">
                    {t('URL templates')}{' '}
                </summary>
                <dl className="mt-3 space-y-3 text-xs">
                    {server.movie_template && (
                        <div>
                            <dt className="font-bold text-slate-400">
                                {t('Movies')}
                            </dt>
                            <dd className="mt-1 font-mono break-all text-slate-500">
                                {server.movie_template}
                            </dd>
                        </div>
                    )}
                    {server.tv_template && (
                        <div>
                            <dt className="font-bold text-slate-400">
                                {t('TV shows')}{' '}
                            </dt>
                            <dd className="mt-1 font-mono break-all text-slate-500">
                                {server.tv_template}
                            </dd>
                        </div>
                    )}
                </dl>
            </details>
        </article>
    );
}

function AddServer() {
    const { t } = useTranslation();
    return (
        <section className="min-w-0 rounded-2xl border border-white/8 bg-white/[.025] p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-black">
                <Plus className="size-5 text-sky-400" /> {t('Add server')}{' '}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
                {t(
                    'Add a direct HTTPS embed URL for movies, TV shows or both. Higher priority servers appear first.',
                )}{' '}
            </p>
            <Form
                action={store()}
                options={{ preserveScroll: true }}
                resetOnSuccess
                className="mt-6 space-y-5"
            >
                {({ processing, errors }) => (
                    <>
                        <ServerField
                            name="name"
                            label={t('Name')}
                            required
                            maxLength={100}
                            autoComplete="off"
                            error={errors.name}
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <ServerField
                                name="quality"
                                label={t('Quality label')}
                                required
                                maxLength={40}
                                placeholder="1080p"
                                error={errors.quality}
                            />
                            <ServerField
                                name="priority"
                                label={t('Priority')}
                                type="number"
                                min={0}
                                max={10000}
                                required
                                defaultValue={0}
                                error={errors.priority}
                            />
                        </div>
                        <ServerField
                            name="movie_template"
                            label={t('Movie URL template')}
                            maxLength={2048}
                            placeholder="https://provider.example/embed/movie/{tmdb}"
                            spellCheck={false}
                            error={errors.movie_template}
                            help={t(
                                'Leave blank if this server only supports TV shows.',
                            )}
                        />
                        <ServerField
                            name="tv_template"
                            label={t('TV show URL template')}
                            maxLength={2048}
                            placeholder="https://provider.example/embed/tv/{tmdb}/{season}/{episode}"
                            spellCheck={false}
                            error={errors.tv_template}
                            help={t('At least one URL template is required.')}
                        />
                        <div className="rounded-xl border border-white/8 px-3 py-3 text-xs leading-6 text-slate-500">
                            {t('Available placeholders:')}{' '}
                            <code className="text-slate-300">{'{tmdb}'}</code>,{' '}
                            <code className="text-slate-300">{'{imdb}'}</code>,{' '}
                            <code className="text-slate-300">{'{season}'}</code>
                            ,{' '}
                            <code className="text-slate-300">
                                {'{episode}'}
                            </code>
                            {t('. For two-digit numbers, use')}{' '}
                            <code className="text-slate-300">
                                {'{zero|season}'}
                            </code>{' '}
                            {t('and')}{' '}
                            <code className="text-slate-300">
                                {'{zero|episode}'}
                            </code>
                            .
                        </div>
                        <div>
                            <label
                                htmlFor="server-is-enabled"
                                className="text-sm font-bold text-slate-300"
                            >
                                {t('Status')}{' '}
                            </label>
                            <select
                                id="server-is-enabled"
                                name="is_enabled"
                                defaultValue="1"
                                className={fieldClassName}
                                aria-invalid={Boolean(errors.is_enabled)}
                                aria-describedby={
                                    errors.is_enabled
                                        ? 'server-is-enabled-error'
                                        : undefined
                                }
                            >
                                <option value="1" className="bg-slate-950">
                                    {t('Enabled')}{' '}
                                </option>
                                <option value="0" className="bg-slate-950">
                                    {t('Disabled')}{' '}
                                </option>
                            </select>
                            {errors.is_enabled && (
                                <p
                                    id="server-is-enabled-error"
                                    className="mt-2 text-xs text-rose-300"
                                >
                                    {errors.is_enabled}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-50"
                        >
                            <Plus className="size-4" />
                            {processing ? t('Adding…') : t('Add server')}
                        </button>
                    </>
                )}
            </Form>
        </section>
    );
}

export default function AdminPlayerServers({
    servers,
    defaultServerKey,
}: {
    servers: PlayerServer[];
    defaultServerKey: string;
}) {
    const { t } = useTranslation();
    const enabledCount = servers.filter((server) => server.is_enabled).length;

    return (
        <AdminLayout active="player-servers">
            <SeoHead title={t('Admin player servers')} />
            <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
                <section className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="flex items-center gap-2 text-2xl font-black">
                            <Server className="size-5 text-sky-400" />{' '}
                            {t('Player servers')}{' '}
                        </h2>
                        <p className="text-xs font-bold text-slate-500">
                            {enabledCount} {t('enabled ·')} {servers.length}{' '}
                            {t('total')}{' '}
                        </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {t(
                            'Disabled servers are hidden from the player. Changes apply to the next page load.',
                        )}{' '}
                    </p>
                    <div className="mt-5 space-y-4">
                        {servers.map((server) => (
                            <ServerCard
                                key={server.id}
                                server={server}
                                isDefault={server.key === defaultServerKey}
                            />
                        ))}
                        {servers.length === 0 && (
                            <p className="rounded-2xl border border-white/8 bg-white/[.025] p-8 text-center text-sm text-slate-500">
                                {t(
                                    'No player servers. Add one to enable playback.',
                                )}{' '}
                            </p>
                        )}
                    </div>
                </section>
                <AddServer />
            </div>
        </AdminLayout>
    );
}
