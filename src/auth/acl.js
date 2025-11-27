import {createAcl, defineAclRules} from 'vue-simple-acl';
import router from "@/routers";
import {getUserInfo} from "@/auth/auth.js";

export const user = await getUserInfo();

const rules = () => defineAclRules((setRule) => {
    // setRule('unique-ability', callbackFunction(user, arg1, arg2, ...) { });
    // setRule(['unique-ability-1', 'unique-ability-2'], callbackFunction(user, arg1, arg2, ...) { });

    // Define a simple rule for ability with no argument
    // setRule('create-post', (user) => user.is_admin || user.is_editor);
    // setRule('is-admin', (user) => user.is_admin);
    // setRule('is-editor', (user) => user.is_editor);
    // Define a simple rule for ability with an argument
    // setRule('edit-post', (user, post) => user.id === post.user_id);
    // setRule('delete-post', (user, post) => {
    //     return user.id === post.user_id || user.is_admin;
    // });
    // Define rule for array of multiple abilities that share same arguments and callback function
    // setRule(['publish-post', 'unpublish-post'], (user, post) => user.id === post.user_id);
    // Define rule for ability with multiple arguments
    // setRule('hide-comment', (user, post, comment) => {
    //     return user.is_admin || user.id === post.user_id || (user.id === comment.user_id && post.id === comment.post_id);
    // });
    // setRule('moderator', (user) => user.permissions && user.permissions.includes('moderator'));
});

const simpleAcl = createAcl({
    user, // short for user: user
    rules, // short for rules: rules
    router, // OPTIONAL, short for router: router
    onDeniedRoute: '/unauthorized',
    // other optional vue-simple-acl options here... See Vue Simple ACL Options below
});

export default simpleAcl;