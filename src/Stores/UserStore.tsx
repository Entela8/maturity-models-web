import {
    observable,
    action,
    computed,
    makeObservable
} from 'mobx';
import user from '../Utils/Types/user';

export default class UserStore {

    @observable user: user|undefined;

    constructor() {
        makeObservable(this);
        this.getStoredUser();
    }

    @action
    async setUser(user: user|undefined) {
        this.user = user;

        if (user?._id) {
            localStorage.setItem("user", JSON.stringify(user))
        }
    }

    async getStoredUser() {
        try {
            const localStorageUser = localStorage.getItem("user")

            if (localStorageUser) {
                this.setUser(JSON.parse(localStorageUser))
            }
        }
        catch (e) {
            console.warn(e)
            return null
        }
    }

    async removeStoredUser() {
        try {
            localStorage.removeItem('user')
            this.setUser(undefined)
        }
        catch (e) {
            console.warn(e)
        }
    }

    @action
    async disconnect() {
        this.removeStoredUser();
        //window.location.replace("/login");
    }

    @computed get getUser() {
        return this.user
    }

    @computed get id() {
        return this.user?._id
    }

    @computed get fullName() {
        return this.user?.firstName + " " + this.user?.lastName
    }

    @computed get isAdmin() {
        return this.user?.role === 'ADMIN'
    }

    @computed get isConnected() 
    {
        return this.user
    }
}
