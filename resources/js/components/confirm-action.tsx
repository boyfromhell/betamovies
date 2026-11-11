import type { FormComponentRef } from '@inertiajs/core';
import { Form } from '@inertiajs/react';
import { CircleAlert, LoaderCircle } from 'lucide-react';
import {
    useRef,
    useState,
    type ComponentProps,
    type ReactElement,
} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';
import { ActionConfirmation } from '@/lib/action-confirmation';

type Confirmation = {
    title: string;
    description: string;
    label?: string;
    tone?: 'danger' | 'primary';
};

type DialogProps = {
    confirmation: Confirmation;
    open: boolean;
    processing: boolean;
    error: string | null;
    trigger?: ReactElement;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
};

function ActionConfirmationDialog({
    confirmation,
    open,
    processing,
    error,
    trigger,
    onOpenChange,
    onConfirm,
}: DialogProps) {
    const { t } = useTranslation();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const returnFocusRef = useRef<HTMLElement | null>(null);
    const danger = confirmation.tone !== 'primary';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                role="alertdialog"
                aria-busy={processing}
                showCloseButton={!processing}
                className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border-white/10 bg-[#0d1728] text-slate-100 shadow-2xl shadow-black/60 sm:max-w-md"
                onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    returnFocusRef.current =
                        document.activeElement instanceof HTMLElement
                            ? document.activeElement
                            : null;
                    cancelRef.current?.focus();
                }}
                onCloseAutoFocus={(event) => {
                    if (returnFocusRef.current?.isConnected) {
                        event.preventDefault();
                        returnFocusRef.current.focus();
                    }
                }}
                onEscapeKeyDown={(event) => {
                    if (processing) {
                        event.preventDefault();
                    }
                }}
                onInteractOutside={(event) => {
                    if (processing) {
                        event.preventDefault();
                    }
                }}
            >
                <div
                    className={`grid size-11 place-items-center rounded-xl ${danger ? 'bg-rose-400/10 text-rose-300' : 'bg-sky-400/10 text-sky-300'}`}
                >
                    <CircleAlert className="size-6" aria-hidden="true" />
                </div>
                <DialogHeader className="text-left">
                    <DialogTitle className="pr-5 text-xl leading-7 font-black">
                        {confirmation.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm leading-6 text-slate-400">
                        {confirmation.description}
                    </DialogDescription>
                </DialogHeader>
                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200"
                    >
                        {error}
                    </p>
                )}
                <DialogFooter className="mt-2 gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        disabled={processing}
                        onClick={() => onOpenChange(false)}
                        className="min-h-11 cursor-pointer rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-50"
                    >
                        {t('Cancel')}
                    </button>
                    <button
                        type="button"
                        disabled={processing}
                        onClick={onConfirm}
                        className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 disabled:cursor-wait disabled:opacity-50 ${danger ? 'bg-rose-500 hover:bg-rose-400' : 'bg-sky-500 hover:bg-sky-400'}`}
                    >
                        {processing && (
                            <LoaderCircle
                                className="size-4 animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        {processing
                            ? t('Processing…')
                            : (confirmation.label ?? t('Confirm'))}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type Fields = Record<string, unknown>;
type FormProps = Omit<ComponentProps<typeof Form<Fields>>, 'ref'> & {
    confirmation: Confirmation;
};

export function ConfirmActionForm({
    confirmation,
    onBefore,
    onStart,
    onSuccess,
    onError,
    onFinish,
    ...props
}: FormProps) {
    const { t } = useTranslation();
    const formRef = useRef<FormComponentRef<Fields>>(null);
    const [gate] = useState(() => new ActionConfirmation());
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <Form<Fields>
                {...props}
                ref={formRef}
                onBefore={(visit) => {
                    if (!gate.begin()) {
                        if (!gate.processing) {
                            setError(null);
                            setOpen(true);
                        }
                        return false;
                    }
                    const proceed = onBefore?.(visit);
                    if (proceed === false) {
                        gate.reset();
                    }
                    return proceed;
                }}
                onStart={(visit) => {
                    setProcessing(true);
                    onStart?.(visit);
                }}
                onSuccess={(page) => {
                    setOpen(false);
                    return onSuccess?.(page);
                }}
                onError={(errors) => {
                    setError(
                        Object.values(errors).find(
                            (value): value is string =>
                                typeof value === 'string',
                        ) ??
                            t(
                                'The action could not be completed. Please try again.',
                            ),
                    );
                    return onError?.(errors);
                }}
                onFinish={(visit) => {
                    gate.reset();
                    setProcessing(false);
                    onFinish?.(visit);
                }}
            />
            <ActionConfirmationDialog
                confirmation={confirmation}
                open={open}
                processing={processing}
                error={error}
                onOpenChange={(next) => {
                    if (!gate.processing) {
                        gate.reset();
                        setOpen(next);
                    }
                }}
                onConfirm={() => {
                    if (formRef.current && gate.approve()) {
                        formRef.current.submit();
                    }
                }}
            />
        </>
    );
}

export function ConfirmActionButton({
    children,
    confirmation,
    onConfirm,
}: {
    children: ReactElement;
    confirmation: Confirmation;
    onConfirm: () => Promise<void> | void;
}) {
    const { t } = useTranslation();
    const [gate] = useState(() => new ActionConfirmation());
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirm = async () => {
        if (!gate.approve() || !gate.begin()) {
            return;
        }
        setProcessing(true);
        setError(null);
        try {
            await onConfirm();
            setOpen(false);
        } catch {
            setError(t('The action could not be completed. Please try again.'));
        } finally {
            gate.reset();
            setProcessing(false);
        }
    };

    return (
        <ActionConfirmationDialog
            trigger={children}
            confirmation={confirmation}
            open={open}
            processing={processing}
            error={error}
            onOpenChange={(next) => {
                if (!gate.processing) {
                    gate.reset();
                    setError(null);
                    setOpen(next);
                }
            }}
            onConfirm={() => {
                void confirm();
            }}
        />
    );
}
