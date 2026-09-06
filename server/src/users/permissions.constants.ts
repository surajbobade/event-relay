export const PERMISSION_MASTER = [
    {
        key: 'webhooks:view',
        label: 'View webhooks',
        section: 'Webhooks',
    },
    {
        key: 'webhooks:manage',
        label: 'Create, edit & delete webhooks',
        section: 'Webhooks',
    },
    {
        key: 'api_keys:view',
        label: 'View API keys',
        section: 'API Keys',
    },
    {
        key: 'api_keys:manage',
        label: 'Create & revoke API keys',
        section: 'API Keys',
    },
    {
        key: 'events:view',
        label: 'View events',
        section: 'Events',
    },
] as const;

export const PERMISSION_KEYS = PERMISSION_MASTER.map((p) => p.key);

export type Permission = (typeof PERMISSION_MASTER)[number]['key'];

// New members start with no access at all — permissions are opt-in only.
export const DEFAULT_PERMISSIONS: Permission[] = [];

// Granting a "manage" permission forces its "view" counterpart on too,
// since managing a resource implies being able to see it.
export const PERMISSION_DEPENDENCIES: Partial<Record<Permission, Permission[]>> =
    {
        'webhooks:manage': ['webhooks:view'],
        'api_keys:manage': ['api_keys:view'],
    };

export function resolvePermissions(permissions: string[]): string[] {
    const resolved = new Set(permissions);

    for (const permission of permissions) {
        const deps = PERMISSION_DEPENDENCIES[permission as Permission];
        deps?.forEach((dep) => resolved.add(dep));
    }

    return Array.from(resolved);
}
