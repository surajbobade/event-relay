type Props = {
    status: number;
};

function getStatusClasses(status: number) {
    if (status >= 200 && status < 300) {
        return 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20';
    }

    if (status >= 300 && status < 400) {
        return 'bg-sky-500/10 text-sky-400 ring-sky-500/20';
    }

    if (status >= 400 && status < 500) {
        return 'bg-amber-500/10 text-amber-400 ring-amber-500/20';
    }

    return 'bg-red-500/10 text-red-400 ring-red-500/20';
}

export function StatusBadge({ status }: Props) {
    return (
        <span
            className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1 ${getStatusClasses(
                status,
            )}`}>
            {status}
        </span>
    );
}