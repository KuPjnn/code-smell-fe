import {defineStore} from "pinia";
import {getUserInfo} from "@/auth/auth.js";

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
            if (user)
                this.user = user;
        },
        async initUser() {
            this.setUserInfo(await getUserInfo());
        },
    },
});