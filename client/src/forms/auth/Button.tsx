import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'danger' | 'default';

type ButtonProps = PropsWithChildren<
    ButtonHTMLAttributes<HTMLButtonElement> & {
        loading?: boolean;
        loadingText?: string;
        variant?: ButtonVariant;
    }
>;

const variants: Record<ButtonVariant, string> = {
    primary:
        'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]',

    danger:
        'bg-[var(--danger)] text-white hover:opacity-90',

    default:
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
};

export function Button({
    children,
    loading = false,
    loadingText = 'Please wait...',
    disabled,
    variant = 'primary',
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`
                inline-flex
                w-full
                items-center
                justify-center
                rounded-lg
                px-4
                py-3
                font-semibold
                transition
                focus:outline-none
                focus:ring-4
                focus:ring-[var(--primary)]/20
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${variants[variant]}
                ${className}
            `}
        >
            {loading ? loadingText : children}
        </button>
    );
}
