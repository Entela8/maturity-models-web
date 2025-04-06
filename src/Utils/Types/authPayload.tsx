import User from "./user";

export interface AuthPayload {
    type: string;
    user: User;
    token: string;
    refreshToken: string;
}
