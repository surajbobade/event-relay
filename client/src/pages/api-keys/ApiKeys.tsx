import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Check,
    Copy,
    KeyRound,
    MoreHorizontal,
    Plus,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { Button } from '../../forms/auth/Button';
import { createApiKey, deleteApiKey, getApiKeys } from '../../api/api-keys';
import { usePermissions } from '../../hooks/usePermissions';
import type { ApiKey } from '../../types/ApiKey';
import type { ApiErrorResponse } from '../../types/Api';

export function ApiKeys() {
    const { hasPermission } = usePermissions();
    const canManage = hasPermission('api_keys:manage');
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState('');
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchApiKeys = async () => {
            try {
                const res = await getApiKeys();
                setApiKeys(res.data);
            } catch (err: unknown) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
            }
        };

        fetchApiKeys();
    }, []);

    useEffect(() => {
        if (!openMenuId) {
            return;
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const handleCreate = useCallback(async () => {
        try {
            const res = await createApiKey({ name: name.trim() || undefined });
            setApiKeys((current) => [
                {
                    _id: res.data._id,
                    n: res.data.name,
                    cAt: res.data.cAt,
                },
                ...current,
            ]);
            setCreatedKey(res.data.key);
            setCreating(false);
            setName('');
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    }, [name]);

    const handleCopy = useCallback(() => {
        if (!createdKey) {
            return;
        }

        navigator.clipboard.writeText(createdKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [createdKey]);

    const handleDelete = async (apiKey: ApiKey) => {
        setOpenMenuId(null);

        if (
            !window.confirm(
                `Revoke API key "${apiKey.n || apiKey._id}"? Any service using it will stop working.`,
            )
        ) {
            return;
        }

        try {
            await deleteApiKey(apiKey._id);
            setApiKeys((current) =>
                current.filter((item) => item._id !== apiKey._id),
            );
            toast.success('API key revoked');
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    };

    return (
        <div className="min-h-full p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            API Keys
                        </h1>

                        <p className="mt-1 text-sm">
                            Use an API key to send events from your backend.
                        </p>
                    </div>

                    {canManage && (
                        <Button
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition"
                            onClick={() => setCreating(true)}>
                            <Plus className="h-4 w-4" />
                            Create API Key
                        </Button>
                    )}
                </div>

                {/* Newly created key banner */}
                {createdKey && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-medium text-amber-900">
                            Copy this key now — you won't be able to see it
                            again.
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                            <code className="flex-1 truncate rounded-lg border border-amber-200 bg-white px-3 py-2 font-mono text-sm text-gray-800">
                                {createdKey}
                            </code>

                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-100">
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => setCreatedKey(null)}
                            className="mt-3 text-sm font-medium text-amber-900 underline">
                            Done
                        </button>
                    </div>
                )}

                {/* Create form */}
                {canManage && creating && (
                    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <label
                            htmlFor="api-key-name"
                            className="mb-1.5 block text-sm font-medium text-gray-700">
                            Name (optional)
                        </label>

                        <div className="flex items-center gap-2">
                            <input
                                id="api-key-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Production backend"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-100"
                            />

                            <Button
                                type="button"
                                variant="default"
                                onClick={() => {
                                    setCreating(false);
                                    setName('');
                                }}
                                className="w-auto whitespace-nowrap">
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={handleCreate}
                                className="w-auto whitespace-nowrap">
                                Create
                            </Button>
                        </div>
                    </div>
                )}

                {/* API keys table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="grid grid-cols-[2fr_1.5fr_1.5fr_40px] items-center gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3">
                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Name
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Created
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Last used
                        </div>

                        <div />
                    </div>

                    {apiKeys.map((apiKey) => (
                        <div
                            key={apiKey._id}
                            className="grid grid-cols-[2fr_1.5fr_1.5fr_40px] items-center gap-4 border-b border-gray-100 px-5 py-4 transition last:border-b-0 hover:bg-gray-50">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                    <KeyRound className="h-4 w-4 text-gray-600" />
                                </div>

                                <p className="truncate text-sm font-medium text-gray-900">
                                    {apiKey.n || 'Unnamed key'}
                                </p>
                            </div>

                            <div className="text-sm text-gray-600">
                                {new Date(apiKey.cAt).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    },
                                )}
                            </div>

                            <div className="text-sm text-gray-600">
                                {apiKey.lUAt
                                    ? new Date(
                                          apiKey.lUAt,
                                      ).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                      })
                                    : 'Never'}
                            </div>

                            <div className="relative">
                                {canManage && (
                                <button
                                    onClick={() =>
                                        setOpenMenuId((current) =>
                                            current === apiKey._id
                                                ? null
                                                : apiKey._id,
                                        )
                                    }
                                    className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>
                                )}

                                {canManage && openMenuId === apiKey._id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 bottom-full z-10 mb-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(apiKey)
                                            }
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                            Revoke
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {apiKeys.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <KeyRound className="h-5 w-5 text-gray-500" />
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900">
                                No API keys yet
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-gray-500">
                                Create an API key to send events from your
                                backend.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
