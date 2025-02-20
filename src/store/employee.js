// src/store/employee.js
import { defineStore } from 'pinia';

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        employee: null,        // Employee data from login response
        isAuthenticated: false // Tracks login state
    }),
    actions: {
        // Set employee data after login
        setEmployee(employeeData) {
            this.employee = employeeData;
            this.isAuthenticated = true;
            // Persist to localStorage
            localStorage.setItem('employee', JSON.stringify(employeeData));
        },

        // Load session from localStorage on app start
        loadSession() {
            const storedEmployee = localStorage.getItem('employee');
            if (storedEmployee) {
                this.employee = JSON.parse(storedEmployee);
                this.isAuthenticated = true;
            }
        },

        // Logout action
        logout() {
            this.employee = null;
            this.isAuthenticated = false;
            localStorage.removeItem('employee');
        },
    },
    getters: {
        getEmployee: (state) => state.employee,
        isLoggedIn: (state) => state.isAuthenticated,
        isAdmin: (state) => state.employee?.role?.nombre === 'admin',
    },
});