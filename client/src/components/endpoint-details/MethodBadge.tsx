type Props = {
    method: string;
};

const METHOD_COLORS: Record<string, string> = {
    GET: 'bg-sky-500/10 text-sky-400 ring-sky-500/20',
    POST: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    PUT: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
    PATCH: 'bg-violet-500/10 text-violet-400 ring-violet-500/20',
    DELETE: 'bg-red-500/10 text-red-400 ring-red-500/20',
    OPTIONS: 'bg-gray-500/10 text-gray-400 ring-gray-500/20',
    HEAD: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20',
};

export function MethodBadge({ method }: Props) {
    return (
        <span
            className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1 ${
                METHOD_COLORS[method] ??
                'bg-gray-500/10 text-gray-400 ring-gray-500/20'
            }`}>
            {method}
        </span>
    );
}
