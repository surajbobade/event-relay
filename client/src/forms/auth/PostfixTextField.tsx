import { forwardRef } from 'react';

type PostfixTextFieldProps = {
    label: string;
    postfix: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const PostfixTextField = forwardRef<
    HTMLInputElement,
    PostfixTextFieldProps
>(({ label, postfix, error, className = '', ...props }, ref) => {
    return (
        <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div
                className={`flex overflow-hidden rounded-lg border bg-white transition ${
                    error
                        ? 'border-red-500 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10'
                        : 'border-gray-300 focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary)]/10'
                }`}>
                

                <input
                    ref={ref}
                    {...props}
                    className={`flex-1 border-0 bg-transparent px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 ${className}`}
                />
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 text-sm text-gray-500">
                    {postfix}
                </span>
            </div>

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
});

PostfixTextField.displayName = 'PostfixTextField';
