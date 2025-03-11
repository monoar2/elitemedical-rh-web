<template>
  <v-app>
    <v-container class="d-flex justify-center align-center" style="height: 100vh; background: linear-gradient(45deg, #2196f3, #4caf50);">
      <v-card elevation="10" max-width="400" class="rounded-3 shadow-lg">
        <div class="text-center py-4">
          <img src="@/assets/Logo_NB.png" alt="EliteMedical Bajio Logo" width="250" />
        </div>
        <v-card-title class="text-h6 text-center py-4">
          Tablero de gestión de empleados
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
                v-model="username"
                label="USUARIO"
                outlined
                dense
                color="primary"
                class="mb-3"
                required
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="CONTRASEÑA"
                outlined
                dense
                color="primary"
                type="password"
                class="mb-4"
                required
            ></v-text-field>
            <v-btn :disabled="!valid" block color="primary" class="py-3 text-body-2 font-weight-bold" @click="login">
              Log In
            </v-btn>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-center py-3">
          <v-btn text small color="secondary">¿Olvidó su contraseña?</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import { useEmployeeStore } from '@/store/employee';

export default {
  data() {
    return {
      username: '',
      password: '',
      valid: false,
    };
  },
  setup() {
    const employeeStore = useEmployeeStore();
    return { employeeStore };
  },
  methods: {
    async login() {
      const endpoint = `https://elitemedicalbajio.online/rh/login?usuario=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`;

      try {
        const response = await axios.post(endpoint);
        const employeeData = response.data;

        this.employeeStore.setEmployee(employeeData);

        if (employeeData.role.nombre === 'admin') {
          this.$router.push('/hr-dashboard');
        } else if (employeeData.role.nombre === 'user') {
          this.$router.push('/employee-dashboard');
        } else {
          alert('Rol Inválido');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Usuario o contraseña inválidos.');
      }
    },
  },
};
</script>

<style>


.v-btn {
  border-radius: 8px;
}

.v-divider {
  border-color: rgba(0, 0, 0, 0.1);
}
</style>