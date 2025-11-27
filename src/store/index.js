import {defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: {
            name: "",
            picture: "",
        },
    }),
    getters: {
        currentUser() {
            return this.user;
        }
    },
    actions: {
        setUserInfo(user) {
            this.user = user;
        },
    },
});