import {computed} from "vue";
import {useAuthStore} from "@/store/index.js";
import {createAcl, defineAclRules} from 'vue-simple-acl';
import router from "@/routers";

const rules = () => defineAclRules(async (setRule) => {
    const authStore = useAuthStore();
    await authStore.initUser();
    setRule('admin', (user) => user?.roles?.includes('admin'));
    setRule('user', (user) => user?.roles?.includes('user'));
    setRule('wedding', (user) => user?.roles?.includes('wedding'));
});

const simpleAcl = createAcl({
    user: computed(() => useAuthStore().currentUser), // short for user: user
    rules, // short for rules: rules
    router, // OPTIONAL, short for router: router
    onDeniedRoute: '/unauthorized',
    // other optional vue-simple-acl options here... See Vue Simple ACL Options below
});

export default simpleAcl;