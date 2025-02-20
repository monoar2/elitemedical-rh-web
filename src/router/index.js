// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import EmployeeDashboard from "@/views/EmployeeDashboard.vue";
import HRDashboard from "@/views/HRDashboard.vue";
import {useEmployeeStore} from "@/store/employee.js";

const routes = [
    {
        path: '/',
        redirect: '/login', // Default route
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
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const employeeStore = useEmployeeStore();

    if (to.meta.requiresAuth && !employeeStore.isLoggedIn) {
        // Redirect to log in if not authenticated
        next({ name: 'Login' });
    } else if (to.meta.requiresAdmin && !employeeStore.isAdmin) {
        // Redirect to employee dashboard if not admin
        next({ name: 'EmployeeDashboard' });
    } else if (to.meta.requiresUser && employeeStore.isAdmin) {
        // Redirect to HR dashboard if admin tries to access user-only route
        next({ name: 'HRDashboard' });
    } else {
        next();
    }
});

export default router;
