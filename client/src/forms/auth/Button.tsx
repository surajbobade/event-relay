import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<
    ButtonHTMLAttributes<HTMLButtonElement> & {
        loading?: boolean;
        loadingText?: string;
    }
>;

export function Button({
    children,
    loading = false,
    loadingText = 'Please wait...',
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
            {loading ? loadingText : children}
        </button>
    );
}
