import { forwardRef, useState } from 'react';

type PasswordFieldProps = {
    label: string;
    error?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
    ({ label, error, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    {label}
                </label>

                <div className="relative">
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        {...props}
                        className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none transition ${
                            error
                                ? 'border-[var(--danger)] focus:border-[var(--danger)]'
                                : 'border-gray-300 focus:border-[var(--border-primary)]'
                        } ${className}`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500 hover:text-gray-700">
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                {error && <p className="mt-1 text-sm text-[var(--danger)]">{error}</p>}
            </div>
        );
    },
);

PasswordField.displayName = 'PasswordField';
