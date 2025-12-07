import {defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: {
            name: "Anonymouse",
            picture: "https://img.codesmell.io.vn/insecure/format:avif/plain/s3://code-smell/avatar/avatar.jpg",
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