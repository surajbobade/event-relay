import type { ReactNode } from 'react';
import { X } from 'lucide-react';

type ModalProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
    onClose: () => void;
};

export function Modal({
    title,
    subtitle,
    children,
    onClose,
}: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-xl rounded-2xl bg-white text-gray-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-semibold">{title}</h2>
                        {subtitle && (
                            <p className="mt-1 text-sm text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}