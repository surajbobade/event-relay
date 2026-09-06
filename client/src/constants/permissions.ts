// Mirrors server/src/users/permissions.constants.ts — keep in sync.
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

// Granting a "manage" permission forces its "view" counterpart on too,
// since managing a resource implies being able to see it.
export const PERMISSION_DEPENDENCIES: Record<string, string[]> = {
    'webhooks:manage': ['webhooks:view'],
    'api_keys:manage': ['api_keys:view'],
};
