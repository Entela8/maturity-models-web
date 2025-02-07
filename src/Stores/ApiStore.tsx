import {
    observable,
    action,
    makeObservable
} from 'mobx';

import axios, { AxiosRequestConfig } from 'axios';
import user from '../Utils/Types/user';
import { RootStore } from '.';
import { API_URL } from '../Utils/variables';

export default class UserStore {
    @observable user: user | undefined;

    private rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeObservable(this);
    }

    @action
    post(action: string, params: object, customHeader: object | null = null) {
        const configurationObject: AxiosRequestConfig = {
            method: 'post',
            url: API_URL + action,
            data: params,
            headers: customHeader === null ? {
                'Content-Type': 'application/json',
            } : customHeader,
            withCredentials: true,
            baseURL: API_URL
        };

        return new Promise((resolve, reject) => {
            axios(configurationObject)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    this.rootStore.userStore.disconnect()
                }

                reject(error.response);
            })
        });
    }

    @action
    get(action: string) {
        const apiUrl = `${API_URL}${action}`;

        const configurationObject: AxiosRequestConfig = {
            method: 'get',
            url: apiUrl,
            headers: {
                'content-type': 'application/json',
            },
            withCredentials: true,
            baseURL: API_URL
        };
        
        return new Promise((resolve, reject) => {
            axios(configurationObject)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    this.rootStore.userStore.disconnect()
                }

                reject(error.response);
            })
        });
    }
}
