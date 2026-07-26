export type Request = {
    _id: string;
    method: string;
    path: string;
    status: number;
    cAt: string;
    body?: Record<string, any>;
    response?: {
        status: number;
        body?: Record<string, any>;
    }
};
