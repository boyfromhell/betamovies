import { Form } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { CatalogHeader } from '@/components/catalog-header';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';
import { SeoHead } from '@/components/seo-head';
import { useTranslation } from '@/hooks/use-translation';

export default function AdminLogin() {
    const { locale } = useTranslation();
    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title="Admin — Beta Movies" />
            <CatalogNavigation />
            <CatalogHeader />
            <main className="grid min-h-[70dvh] place-items-center px-4 py-12 lg:ml-64">
                <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[.025] p-8">
                    <ShieldCheck className="mb-5 size-9 text-sky-400" />
                    <h1 className="text-3xl font-black">Admin</h1>
                    <Form
                        action="/admin/login"
                        method="post"
                        className="mt-6 space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <label className="block text-sm font-bold">
                                    {locale === 'ro' ? 'Parolă' : 'Password'}
                                    <input
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        autoFocus
                                        className="mt-2 h-12 w-full rounded-xl border border-white/15 bg-black/20 px-4 outline-none focus:border-sky-400"
                                    />
                                </label>
                                {errors.password && (
                                    <p
                                        role="alert"
                                        className="text-sm text-rose-300"
                                    >
                                        {errors.password}
                                    </p>
                                )}
                                <button
                                    disabled={processing}
                                    className="h-12 w-full cursor-pointer rounded-xl bg-sky-500 font-bold text-white hover:bg-sky-400 disabled:opacity-50"
                                >
                                    {processing
                                        ? '…'
                                        : locale === 'ro'
                                          ? 'Autentificare'
                                          : 'Sign in'}
                                </button>
                            </>
                        )}
                    </Form>
                </section>
            </main>
            <CatalogFooter />
        </div>
    );
}
