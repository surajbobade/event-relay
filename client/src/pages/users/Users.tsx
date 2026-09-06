import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Plus, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { Button } from '../../forms/auth/Button';
import { useModal } from '../../components/modal/useModal';
import { ManagePermissionsModal } from '../../components/users/ManagePermissionsModal';
import { getUsers } from '../../api/users';
import type { BusinessUser } from '../../types/BusinessUser';
import type { ApiErrorResponse } from '../../types/Api';

export function Users() {
    const navigate = useNavigate();
    const { openModal } = useModal();
    const [members, setMembers] = useState<BusinessUser[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setMembers(res.data);
            } catch (err: unknown) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
            }
        };

        fetchUsers();
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

    const handleManagePermissions = (member: BusinessUser) => {
        setOpenMenuId(null);

        openModal({
            component: ManagePermissionsModal,
            props: {
                member,
                onSaved: (updated: BusinessUser) => {
                    setMembers((current) =>
                        current.map((item) =>
                            item._id === updated._id ? updated : item,
                        ),
                    );
                },
            },
        });
    };

    return (
        <div className="min-h-full p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Users
                        </h1>

                        <p className="mt-1 text-sm">
                            Manage who has access to your business.
                        </p>
                    </div>

                    <Button
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition"
                        onClick={() => navigate('/users/create')}>
                        <Plus className="h-4 w-4" />
                        Create User
                    </Button>
                </div>

                {/* Users table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="grid grid-cols-[2fr_2.5fr_1.5fr_40px] items-center gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3">
                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Name
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Email
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Joined
                        </div>

                        <div />
                    </div>

                    {members.map((member) => (
                        <div
                            key={member._id}
                            className="grid grid-cols-[2fr_2.5fr_1.5fr_40px] items-center gap-4 border-b border-gray-100 px-5 py-4 transition last:border-b-0 hover:bg-gray-50">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                    <UserIcon className="h-4 w-4 text-gray-600" />
                                </div>

                                <p className="truncate text-sm font-medium text-gray-900">
                                    {member.profile.name}
                                </p>
                            </div>

                            <div className="min-w-0">
                                <code className="block truncate text-sm text-gray-600">
                                    {member.email.address}
                                </code>
                            </div>

                            <div className="text-sm text-gray-600">
                                {new Date(member.cAt).toLocaleDateString(
                                    'en-US',
                                    {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    },
                                )}
                            </div>

                            {/* Actions */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setOpenMenuId((current) =>
                                            current === member._id
                                                ? null
                                                : member._id,
                                        )
                                    }
                                    className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>

                                {openMenuId === member._id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 bottom-full z-10 mb-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleManagePermissions(
                                                    member,
                                                )
                                            }
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
                                            <ShieldCheck className="h-4 w-4" />
                                            Manage Permissions
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {members.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900">
                                No members found.
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-gray-500">
                                Create a member to give someone else access to
                                this business.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-4 text-xs">{members.length} members</div>
            </div>
        </div>
    );
}
