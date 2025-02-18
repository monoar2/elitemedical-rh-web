// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import EmployeeDashboard from "@/views/EmployeeDashboard.vue";
import HRDashboard from "@/views/HRDashboard.vue";

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/hr-dashboard',
        name: 'HR-Dashboard',
        component: HRDashboard,
    },
    {
        path: '/employee-dashboard',
        name: 'Employee-Dashboard',
        component: EmployeeDashboard,
    },
];

const router = createRouter({
    history: createWebHistory('/herramientas/'), // Base path for deployment
    routes,
});

export default router;
