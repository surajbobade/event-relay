export type UserRole = 'admin' | 'member';

export type BusinessUser = {
    _id: string;
    profile: {
        name: string;
    };
    email: {
        address: string;
    };
    role: UserRole;
    p: string[];
    cAt: string;
};
