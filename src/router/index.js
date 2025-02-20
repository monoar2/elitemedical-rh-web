import { createRouter, createWebHistory } from 'vue-router';
import { useEmployeeStore } from "@/store/employee.js";

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/employee-dashboard',
        name: 'EmployeeDashboard',
        component: () => import('../views/EmployeeDashboard.vue'),
        meta: { requiresAuth: true, requiresUser: true },
    },
    {
        path: '/hr-dashboard',
        name: 'HRDashboard',
        component: () => import('../views/HRDashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
];

const router = createRouter({
    history: createWebHistory('/rh-web/'),
    routes,
});

router.beforeEach((to, from, next) => {
    const employeeStore = useEmployeeStore();

    if (to.meta.requiresAuth && !employeeStore.isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.meta.requiresAdmin && !employeeStore.isAdmin) {
        next({ name: 'EmployeeDashboard' });
    } else if (to.meta.requiresUser && employeeStore.isAdmin) {
        next({ name: 'HRDashboard' });
    } else {
        next();
    }
});

export default router;