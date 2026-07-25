import { forwardRef } from 'react';

type TextareaFieldProps = {
    label: string;
    error?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextareaField = forwardRef<
    HTMLTextAreaElement,
    TextareaFieldProps
>(({ label, error, className = '', ...props }, ref) => {
    return (
        <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <textarea
                ref={ref}
                {...props}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition resize-none ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-300 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10'
                } ${className}`}
            />

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
});

TextareaField.displayName = 'TextareaField';
