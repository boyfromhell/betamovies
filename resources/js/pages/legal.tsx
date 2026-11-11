import { useTranslation } from '@/hooks/use-translation';
import { FileText, Scale, ShieldCheck } from 'lucide-react';
import { CatalogHeader } from '@/components/catalog-header';
import { SeoHead } from '@/components/seo-head';
import {
    CatalogFooter,
    CatalogNavigation,
} from '@/components/catalog-navigation';

type DocumentName = 'policy' | 'terms';

type LegalSection = {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    orderedItems?: string[];
};

type LegalDocument = {
    title: string;
    description: string;
    sections: LegalSection[];
};

type Props = {
    document: DocumentName;
    appName: string;
    contactEmail: string;
};

const documents: Record<DocumentName, LegalDocument> = {
    policy: {
        title: 'Privacy & DMCA Policy',
        description:
            'How {{APP_NAME}} handles site data, third-party services, and copyright complaints.',
        sections: [
            {
                title: '1. Overview',
                paragraphs: [
                    'This Privacy & DMCA Policy explains how {{APP_NAME}} handles basic site data, third-party services, and copyright complaints.',
                ],
            },
            {
                title: '2. Information We May Collect',
                paragraphs: [
                    'Depending on how you use the site, {{APP_NAME}} may process:',
                ],
                bullets: [
                    'technical information such as IP address, browser type, device information, and approximate location derived from network requests;',
                    'usage information such as visited pages, selected titles, watch progress preferences, and interaction events;',
                    'security and anti-abuse information used to protect the site from fraud, spam, scraping, and misuse;',
                    'messages or notices you send to us, including copyright complaints and support inquiries.',
                ],
            },
            {
                title: '3. How Information Is Used',
                paragraphs: ['We may use information to:'],
                bullets: [
                    'operate and secure the website;',
                    'remember viewing preferences and playback-related state;',
                    'diagnose performance and abuse issues;',
                    'comply with legal obligations;',
                    'review and respond to DMCA or other legal notices.',
                ],
            },
            {
                title: '4. Cookies, Local Storage, and Similar Technologies',
                paragraphs: [
                    '{{APP_NAME}} may use cookies, session storage, local storage, and similar browser technologies to keep the site functional, remember selected episodes, remember watched status, maintain sessions, and improve performance.',
                    'If you disable these technologies, some parts of the site may not work correctly.',
                ],
            },
            {
                title: '5. Third-Party Services',
                paragraphs: [
                    'The site may rely on third-party providers for metadata, images, trailers, embeds, anti-bot protection, analytics, infrastructure, and related services. Those providers may collect data under their own policies.',
                    'Examples may include hosting services, CDN providers, anti-bot tools, embedded playback providers, trailer providers, and metadata services.',
                    '{{APP_NAME}} does not control third-party privacy practices and encourages you to review their policies separately.',
                ],
            },
            {
                title: '6. Links, References, and Embedded Players',
                paragraphs: [
                    '{{APP_NAME}} operates as an information-location and discovery service. The site may publicly display references, links, pointers, trailers, and embedded playback interfaces made available by third-party providers.',
                    '{{APP_NAME}} does not claim ownership of third-party video content and does not upload or store third-party video files on its own servers for on-demand playback. If a rights holder identifies a specific reference, link, page, or embedded source that allegedly infringes, {{APP_NAME}} may review the notice and disable access to it.',
                ],
            },
            {
                title: '7. Data Retention',
                paragraphs: [
                    'We retain technical and operational data only as long as reasonably necessary for site operation, security, troubleshooting, legal compliance, and abuse prevention.',
                ],
            },
            {
                title: '8. Your Choices',
                paragraphs: [
                    'You can limit certain processing by clearing cookies, local storage, and browser session data, or by stopping use of the service.',
                ],
            },
            {
                title: '9. DMCA Notice',
                paragraphs: [
                    '{{APP_NAME}} is intended to function as an indexing and discovery platform. The site may make publicly available links, references, metadata, trailers, and embedded players supplied by third-party providers.',
                    '{{APP_NAME}} does not claim ownership of third-party video content. It may remove, disable, or restrict access to a complained-of reference, page, link, or embedded source after review of a valid notice.',
                    'If you are a copyright owner or authorized agent and believe that material made available through {{APP_NAME}} infringes your rights, send a written DMCA notice that includes:',
                ],
                orderedItems: [
                    'your full legal name and contact information;',
                    'identification of the copyrighted work claimed to be infringed;',
                    'identification of the specific material, including its exact URL;',
                    'a statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent, or the law;',
                    'a statement, under penalty of perjury, that the information is accurate and that you are authorized to act for the copyright owner;',
                    'your physical or electronic signature.',
                ],
            },
            {
                title: '10. DMCA Contact',
                paragraphs: [
                    'Send copyright notices to {{CONTACT_EMAIL}} with the subject line “DMCA Notice”. Submissions that do not substantially include the required information may not be processed as valid notices.',
                ],
            },
            {
                title: '11. Counter-Notice',
                paragraphs: [
                    'If you believe material was removed or disabled by mistake or misidentification, you may submit a lawful counter-notice containing:',
                ],
                orderedItems: [
                    'your physical or electronic signature;',
                    'identification of the material and its previous location;',
                    'a statement, under penalty of perjury, that it was removed because of mistake or misidentification;',
                    'your name, address, and telephone number;',
                    'the required statement consenting to applicable court jurisdiction and accepting service from the complaining party.',
                ],
            },
            {
                title: '12. Repeat Infringer Policy',
                paragraphs: [
                    '{{APP_NAME}} may remove content references, disable access, and restrict repeat infringers or abusive reporters where appropriate.',
                ],
            },
            {
                title: '13. Misrepresentation',
                paragraphs: [
                    'Anyone who knowingly submits a materially false infringement notice or counter-notice may be liable for damages, costs, and other legal consequences.',
                ],
            },
            {
                title: '14. Changes to This Policy',
                paragraphs: [
                    'This policy may be updated from time to time. Continued use of the site after changes become effective means you accept the updated policy.',
                ],
            },
        ],
    },
    terms: {
        title: 'Terms of Use',
        description: 'The terms that govern your use of {{APP_NAME}}.',
        sections: [
            {
                title: '1. Acceptance of Terms',
                paragraphs: [
                    'By accessing or using {{APP_NAME}}, you agree to these Terms of Use. If you do not agree, do not use the service.',
                ],
            },
            {
                title: '2. Nature of the Service',
                paragraphs: [
                    '{{APP_NAME}} is an informational and indexing platform that may organize titles, metadata, artwork, trailers, and information-location tools such as links, references, pointers, or embedded playback interfaces provided by third parties.',
                    '{{APP_NAME}} does not claim ownership of third-party content and may not control the availability, legality, quality, accuracy, or continued accessibility of third-party sources.',
                ],
            },
            {
                title: '3. No Hosting of Third-Party Video Files',
                paragraphs: [
                    '{{APP_NAME}} does not present itself as the owner, producer, uploader, or original distributor of third-party video content made available through linked or embedded third-party services.',
                    '{{APP_NAME}} indexes references to third-party sources and may display embeds supplied by third parties. It does not upload or store third-party video files on its own servers for on-demand playback.',
                ],
            },
            {
                title: '4. Eligibility and User Responsibility',
                paragraphs: [
                    'You are responsible for ensuring that your use of the service is lawful in your location and that you comply with all applicable laws, regulations, and contractual obligations.',
                    'You agree not to:',
                ],
                bullets: [
                    'use the service for unlawful purposes;',
                    "attempt to interfere with the site's operation or security;",
                    'scrape, copy, or redistribute protected materials without authorization;',
                    'submit false, abusive, or misleading reports, notices, or requests;',
                    'use bots or automated systems in a way that harms the platform or third-party services.',
                ],
            },
            {
                title: '5. Third-Party Content and Services',
                paragraphs: [
                    'The site may display information, links, trailers, or embedded players supplied by third-party providers. Those services operate independently under their own terms, privacy policies, and content rules.',
                    '{{APP_NAME}} is not responsible for third-party content, availability, uptime, advertisements, tracking technologies, or service interruptions.',
                ],
            },
            {
                title: '6. Intellectual Property',
                paragraphs: [
                    'All trademarks, logos, artwork, titles, and related intellectual property remain the property of their respective owners.',
                    'Site design, branding, original text, and original platform materials made available by {{APP_NAME}} remain the property of the site owner unless stated otherwise.',
                ],
            },
            {
                title: '7. Copyright Complaints and Repeat Infringer Policy',
                paragraphs: [
                    '{{APP_NAME}} respects intellectual property rights and responds to valid copyright complaints. Notices must follow the process described in the Privacy & DMCA Policy.',
                    'Where appropriate, {{APP_NAME}} may remove or disable access to complained-of material and restrict repeat infringers.',
                ],
            },
            {
                title: '8. Content Removal and Site Moderation',
                paragraphs: [
                    '{{APP_NAME}} may remove listings, links, embedded sources, pages, or accounts and restrict access to any feature at any time, with or without notice.',
                ],
            },
            {
                title: '9. No Warranty',
                paragraphs: [
                    'The service is provided on an “as is” and “as available” basis without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, non-infringement, availability, or accuracy.',
                ],
            },
            {
                title: '10. Limitation of Liability',
                paragraphs: [
                    'To the maximum extent permitted by law, {{APP_NAME}} and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of data, revenue, profits, or business opportunities arising from use of the service or a third-party service.',
                ],
            },
            {
                title: '11. Indemnification',
                paragraphs: [
                    'You agree to indemnify and hold harmless {{APP_NAME}} and its operators from claims, liabilities, losses, damages, and expenses resulting from your use of the service, violation of these Terms, or violation of any law or third-party rights.',
                ],
            },
            {
                title: '12. Changes to the Service or Terms',
                paragraphs: [
                    '{{APP_NAME}} may change, suspend, or discontinue any part of the service at any time. These Terms may also be updated. Continued use after an update constitutes acceptance of the revised Terms.',
                ],
            },
            {
                title: '13. Contact',
                paragraphs: [
                    'For legal, copyright, or terms-related questions, contact {{CONTACT_EMAIL}}.',
                ],
            },
        ],
    },
};

export default function Legal({ document, appName, contactEmail }: Props) {
    const { t } = useTranslation();
    const legalDocument = documents[document];
    const interpolate = (value: string) =>
        t(value)
            .replaceAll('{{APP_NAME}}', appName)
            .replaceAll('{{CONTACT_EMAIL}}', contactEmail);
    const Icon = document === 'policy' ? ShieldCheck : Scale;

    return (
        <div className="min-h-screen bg-[#070d1a] text-slate-100">
            <SeoHead title={`${t(legalDocument.title)} — ${appName}`} />
            <CatalogNavigation />
            <CatalogHeader />

            <main className="pb-28 lg:ml-64 lg:pb-12">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                    <header className="rounded-3xl border border-white/8 bg-white/[.025] p-6 sm:p-10">
                        <div className="grid size-12 place-items-center rounded-2xl bg-sky-500/15 text-sky-300">
                            <Icon className="size-6" />
                        </div>
                        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                            {t(legalDocument.title)}
                        </h1>
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                            {interpolate(legalDocument.description)}
                        </p>
                        <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-slate-500">
                            <FileText className="size-4" />{' '}
                            {t('Last updated: April 6, 2026')}{' '}
                        </p>
                    </header>

                    <div className="mt-8 space-y-4">
                        {legalDocument.sections.map((section) => (
                            <section
                                key={section.title}
                                className="rounded-2xl border border-white/8 bg-white/[.025] p-5 sm:p-7"
                            >
                                <h2 className="text-lg font-black text-white sm:text-xl">
                                    {t(section.title)}
                                </h2>
                                <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300 sm:text-base">
                                    {section.paragraphs?.map((paragraph) => (
                                        <p key={paragraph}>
                                            {interpolate(paragraph)}
                                        </p>
                                    ))}
                                    {section.bullets && (
                                        <ul className="list-disc space-y-2 pl-5 marker:text-sky-400">
                                            {section.bullets.map((item) => (
                                                <li key={item}>
                                                    {interpolate(item)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.orderedItems && (
                                        <ol className="list-decimal space-y-2 pl-5 marker:font-black marker:text-sky-400">
                                            {section.orderedItems.map(
                                                (item) => (
                                                    <li key={item}>
                                                        {interpolate(item)}
                                                    </li>
                                                ),
                                            )}
                                        </ol>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>
            <CatalogFooter />
        </div>
    );
}
