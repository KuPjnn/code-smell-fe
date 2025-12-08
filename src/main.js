import './assets/style.css'
import {createApp} from 'vue';
import {createPinia} from 'pinia'
import App from '@/App.vue';
import router from "@/routers";
import acl from '@/auth/acl.js';
import ElementPlus from 'element-plus';
import lazy from '@/utils/Lazy.js';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {useAuthStore} from "@/store/index.js";

const app = createApp(App);
const pinia = createPinia();

app.directive('lazy', lazy);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus);
app.use(pinia);
await useAuthStore().initUser();
app.use(router);
app.use(acl);

app.mount('#app');