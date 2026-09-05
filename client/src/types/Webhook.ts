export type Webhook = {
    _id: string;
    name: string;
    targetUrl: string;
    events: string[];
    active: boolean;
    cAt: string;
};
