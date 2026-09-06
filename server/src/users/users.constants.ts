export const PERMISSION_MASTER = {
    webhooks: {
        manage: {
            key: 'wb',
            label: 'Manage Webhooks',
            defaultPermissions: ['wb.v'],
        },
        view: {
            key: 'wb.v',
            label: 'View Webhooks',
        }
    },
    apiKey: {
        manage: {
            key: 'aK',
            label: 'Manage Api Keys',
        },
    },
    events: {
        view: {
            key: 'e.v',
            label: 'View Events',
            defaultPermissions: ['r.v'],
        },
    },
    report: {
        view: {
            key: 'r.v',
            label: 'View Daily Reports',
        },
    },
};
