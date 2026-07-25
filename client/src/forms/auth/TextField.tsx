import { forwardRef } from 'react';

type TextFieldProps = {
    label: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    {label}
                </label>

                <input
                    ref={ref}
                    {...props}
                    className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                        error
                            ? 'border-[var(--danger)] focus:border-[var(--danger)]'
                            : 'border-gray-300 focus:border-[var(--border-primary)]'
                    } ${className}`}
                />

                {error && <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>}
            </div>
        );
    },
);

TextField.displayName = 'TextField';
