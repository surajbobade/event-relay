export type Endpoint = {
    _id: string;
    name: string;
    domain: string;
    desc?: string;
    ia?: boolean;
    cAt: string;
};

export type EndpointDetails = Endpoint & {
    hasRequests?: boolean;
};