<template>
  <v-snackbar
      v-for="(notification, index) in notifications"
      :key="index"
      :timeout="5000"
      :color="notification.content.includes('rechazada') ? 'error' : 'success'"
      top
      right
      multi-line
  >
    {{ notification.content }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="clearNotification(index)">Cerrar</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { useEmployeeStore } from '@/store/employee';

export default {
  name: 'Notification',
  setup() {
    const employeeStore = useEmployeeStore();
    return {
      notifications: employeeStore.notifications,
      clearNotification: employeeStore.clearNotification
    };
  }
};
</script>