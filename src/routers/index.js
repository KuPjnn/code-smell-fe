import {createRouter, createWebHistory} from 'vue-router';
import {
    exchangeCodeForToken,
    getKeycloakAuthUrl,
    getRedirectUrl,
    isAuthenticated,
    saveRedirectUrl
} from '@/auth/auth.js';

const router = createRouter({
    history: createWebHistory("/blog/"),
    routes: [
        // Web routes
        {
            path: '/',
            meta: {
                layout: 'default'
            },
            component: () => import('@/layouts/DefaultLayout.vue'),
            children: [
                {
                    path: 'unauthorized',
                    meta: {
                        title: 'Unauthorized',
                    },
                    component: () => import('@/views/Unauthorized.vue'),
                },
                {
                    path: '',
                    component: () => import('@/views/web/Home.vue'),
                    meta: {
                        title: 'Home Page',
                    }
                },
                {
                    path: 'posts/:id/:slug(.*)*',
                    props: true,
                    component: () => import('@/views/web/Detail.vue'),
                    meta: {
                        title: 'Post Detail',
                    }
                },
                {
                    path: 'explore',
                    component: () => import('@/views/web/Explore.vue'),
                    meta: {
                        title: 'Explore',
                    }
                },
            ]
        },
        // Admin routes
        {
            path: '/admin',
            meta: {
                requiresAuth: true,
                permissions: 'admin',
                layout: 'admin',
            },
            component: () => import('@/layouts/AdminLayout.vue'),
            children: [
                {
                    path: '',
                    component: () => import('@/views/admin/dashboard/index.vue'),
                },
                {
                    path: 'categories',
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/admin/categories/index.vue'),
                        },
                        {
                            path: 'create',
                            component: () => import('@/views/admin/categories/add.vue'),
                        },
                        {
                            path: ':id',
                            props: true,
                            component: () => import('@/views/admin/categories/update.vue'),
                        },
                    ]
                },
                {
                    path: 'tags',
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/admin/tags/index.vue'),
                        },
                        {
                            path: 'create',
                            component: () => import('@/views/admin/tags/add.vue'),
                        },
                        {
                            path: ':id',
                            props: true,
                            component: () => import('@/views/admin/tags/update.vue'),
                        },
                    ]
                },
                {
                    path: 'posts',
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/admin/posts/index.vue'),
                        },
                        {
                            path: 'create',
                            component: () => import('@/views/admin/posts/add.vue'),
                        },
                        {
                            path: ':id',
                            props: true,
                            component: () => import('@/views/admin/posts/update.vue'),
                        },
                    ]
                },
                {
                    path: 'files',
                    children: [
                        {
                            path: '',
                            component: () => import('@/views/admin/files/index.vue'),
                        },
                    ]
                },
            ]
        },
    ]
});

router.beforeEach(async (to) => {
    if (to.path === '/callback') {
        const urlParams = new URLSearchParams(window.location.search);
        const authorizationCode = urlParams.get('code');

        if (authorizationCode) {
            try {
                await exchangeCodeForToken(authorizationCode);
                return getRedirectUrl();
            } catch (error) {
                console.error('Token exchange failed', error);
                window.location.href = getKeycloakAuthUrl();
            }
        }
    }

    if (to.meta.requiresAuth && !await isAuthenticated()) {
        await saveRedirectUrl();
        window.location.href = getKeycloakAuthUrl();
    }
    return true;
});

export default router;