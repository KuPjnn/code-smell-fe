import {createAcl, defineAclRules} from 'vue-simple-acl';
import router from "@/routers";
import {getUserInfo} from "@/auth/auth.js";

export const user = await getUserInfo();

const rules = () => defineAclRules((setRule) => {
    if (user && user.roles) {
        user.roles.forEach(role => {
            setRule(role, (user) => user.roles && user.roles.includes(role));
        });
    }
});

const simpleAcl = createAcl({
    user, // short for user: user
    rules, // short for rules: rules
    router, // OPTIONAL, short for router: router
    onDeniedRoute: '/unauthorized',
    // other optional vue-simple-acl options here... See Vue Simple ACL Options below
});

export default simpleAcl;