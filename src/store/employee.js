import { defineStore } from 'pinia';
import { connectWebSocket, disconnectWebSocket, onNotification } from '@/services/websocket';

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        employee: null,
        isAuthenticated: false,
        notifications: [],
    }),
    actions: {
        setEmployee(employeeData) {
            this.employee = employeeData;
            this.isAuthenticated = true;
            localStorage.setItem('employee', JSON.stringify(employeeData));
            if (employeeData?.empleado?.id) { // Adjusted to nested empleado.id
                connectWebSocket(employeeData.empleado.id.toString());
                onNotification((message) => {
                    this.notifications.push({ content: message, timestamp: new Date() });
                    setTimeout(() => {
                        this.notifications.shift();
                    }, 5000);
                });
            }
        },

        loadSession() {
            const storedEmployee = localStorage.getItem('employee');
            if (storedEmployee) {
                this.employee = JSON.parse(storedEmployee);
                this.isAuthenticated = true;
                if (this.employee?.empleado?.id) {
                    connectWebSocket(this.employee.empleado.id.toString());
                    onNotification((message) => {
                        this.notifications.push({ content: message, timestamp: new Date() });
                        setTimeout(() => {
                            this.notifications.shift();
                        }, 5000);
                    });
                }
            }
        },

        logout() {
            this.employee = null;
            this.isAuthenticated = false;
            this.notifications = [];
            localStorage.removeItem('employee');
            disconnectWebSocket();
        },

        clearNotification(index) {
            this.notifications.splice(index, 1);
        },
    },
    getters: {
        getEmployee: (state) => state.employee,
        isLoggedIn: (state) => state.isAuthenticated,
        isAdmin: (state) => state.employee?.role?.nombre === 'admin',
    },
});