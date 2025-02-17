import { defineStore } from 'pinia';

export const useEmployeeStore = defineStore('employee', {
    state: () => ({
        employee: null,
    }),
    actions: {
        setEmployee(data) {
            this.employee = data;
        },
    },
});
