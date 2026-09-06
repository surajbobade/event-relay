import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { Modal } from '../modal/Modal';
import { Button } from '../../forms/auth/Button';
import {
    PERMISSION_DEPENDENCIES,
    PERMISSION_MASTER,
} from '../../constants/permissions';
import { updateMemberPermissions } from '../../api/users';
import type { BusinessUser } from '../../types/BusinessUser';
import type { ApiErrorResponse } from '../../types/Api';

type ManagePermissionsModalProps = {
    member: BusinessUser;
    onSaved: (member: BusinessUser) => void;
    onClose: () => void;
};

export function ManagePermissionsModal({
    member,
    onSaved,
    onClose,
}: ManagePermissionsModalProps) {
    const [selected, setSelected] = useState<string[]>(member.p || []);
    const [saving, setSaving] = useState(false);

    // Reverse of PERMISSION_DEPENDENCIES: for a "view" key, which
    // "manage" keys require it — used to lock the checkbox and to
    // cascade-remove those manage permissions if view is turned off.
    const dependents = useMemo(() => {
        const map: Record<string, string[]> = {};

        Object.entries(PERMISSION_DEPENDENCIES).forEach(
            ([manageKey, viewKeys]) => {
                viewKeys.forEach((viewKey) => {
                    map[viewKey] = [...(map[viewKey] ?? []), manageKey];
                });
            },
        );

        return map;
    }, []);

    // Group permissions by section, preserving PERMISSION_MASTER's order.
    const sections = useMemo(() => {
        const map = new Map<string, (typeof PERMISSION_MASTER)[number][]>();

        PERMISSION_MASTER.forEach((permission) => {
            const list = map.get(permission.section) ?? [];
            list.push(permission);
            map.set(permission.section, list);
        });

        return Array.from(map.entries());
    }, []);

    const togglePermission = (key: string) => {
        setSelected((current) => {
            if (current.includes(key)) {
                // Turning off a permission also turns off anything that
                // depends on it (e.g. unchecking view also unchecks manage).
                const toRemove = new Set([key, ...(dependents[key] ?? [])]);
                return current.filter((item) => !toRemove.has(item));
            }

            // Turning on a permission forces on its dependencies too
            // (e.g. checking manage also checks its required view).
            const toAdd = new Set([
                key,
                ...(PERMISSION_DEPENDENCIES[key] ?? []),
            ]);
            return [...current, ...Array.from(toAdd).filter((item) => !current.includes(item))];
        });
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            const res = await updateMemberPermissions(member._id, selected);
            onSaved(res.data);
            toast.success('Permissions updated');
            onClose();
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            title="Manage Permissions"
            subtitle={member.profile.name}
            onClose={onClose}>
            <div className="space-y-4">
                {sections.map(([section, permissions]) => (
                    <div key={section}>
                        <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
                            {section}
                        </p>

                        <div className="rounded-lg border border-gray-200">
                            {permissions.map((permission, index) => {
                                const checked = selected.includes(
                                    permission.key,
                                );
                                const requiredBy = (
                                    dependents[permission.key] ?? []
                                ).filter((manageKey) =>
                                    selected.includes(manageKey),
                                );
                                const locked = requiredBy.length > 0;

                                return (
                                    <label
                                        key={permission.key}
                                        className={`flex items-center gap-3 px-3.5 py-3 transition ${
                                            locked
                                                ? 'cursor-not-allowed opacity-70'
                                                : 'cursor-pointer hover:bg-gray-50'
                                        } ${
                                            index !== permissions.length - 1
                                                ? 'border-b border-gray-100'
                                                : ''
                                        }`}>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            disabled={locked}
                                            onChange={() =>
                                                togglePermission(
                                                    permission.key,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />

                                        <span className="text-sm text-gray-700">
                                            {permission.label}
                                            {locked && (
                                                <span className="ml-1.5 text-xs text-gray-400">
                                                    (required by manage)
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
                <Button type="button" variant="default" onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    loading={saving}
                    loadingText="Saving..."
                    onClick={handleSave}>
                    Save
                </Button>
            </div>
        </Modal>
    );
}
