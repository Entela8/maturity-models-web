import {
    observable,
    action,
    computed,
    makeObservable
} from 'mobx';
import user from '../Utils/Types/user';
import { AuthPayload } from '../Utils/Types/authPayload';

export default class UserStore {

    @observable user: user | undefined;
    @observable token: string | undefined;
    @observable teamId: string | undefined;
    @observable refreshToken: string | undefined;

    constructor() {
        makeObservable(this);
        this.getStoredUser();
    }

    @action
    async setUser(user: user | undefined, token?: string, refreshToken?: string) {
        this.user = user;
        this.token = token;
        this.refreshToken = refreshToken;

        if (user?.id) {
            localStorage.setItem("user", JSON.stringify(user));
            if (token) localStorage.setItem("token", token);
            if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        }
    }


    @action
    async setUserFromApiResponse(payload: AuthPayload) {
        const { user, token, refreshToken} = payload;
        this.setUser(user, token, refreshToken);
    }


    async getStoredUser() {
        try {
            const localStorageUser = localStorage.getItem("user");
            const localStorageToken = localStorage.getItem("token");
            const localStorageRefreshToken = localStorage.getItem("refreshToken");

            if (localStorageUser) {
                this.setUser(
                    JSON.parse(localStorageUser),
                    localStorageToken || undefined,
                    localStorageRefreshToken || undefined
                );
            }
        } catch (e) {
            console.warn(e);
            return null;
        }
    }

    async removeStoredUser() {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            this.setUser(undefined);
        } catch (e) {
            console.warn(e);
        }
    }

    @action
    async disconnect() {
        this.removeStoredUser();
        window.location.replace("/");
    }

    @computed get getUser() {
        return this.user;
    }

    @computed get id() {
        return this.user?.id;
    }

    @computed get fullName() {
        return this.user?.firstName + " " + this.user?.lastName;
    }

    @computed get isAdmin() {
        return this.user?.role === 'OWNER'
    }

    @computed get isConnected() {
        return this.user;
    }
}
