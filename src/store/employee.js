import { defineStore } from 'pinia';
import { connectWebSocket, disconnectWebSocket, onNotification } from '@/services/websocket';
import axios from 'axios'; // Import axios if not already imported
import { API_BASE_URL } from '@/config/env';

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
            if (employeeData?.empleado?.id) {
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

        async fetchEmployeeDetails() {
            try {
                if (this.employee?.empleado?.id) {
                    const response = await axios.get(`${API_BASE_URL}/empleados/get/${this.employee.empleado.id}`);
                    this.employee = response.data; // Update the entire employee state
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
                // Handle error appropriately
            }
        },
    },
    getters: {
        getEmployee: (state) => state.employee,
        isLoggedIn: (state) => state.isAuthenticated,
        isAdmin: (state) => state.employee?.role?.nombre === 'admin',
    },
});