<template>
  <v-app>
    <v-container class="d-flex justify-center align-center" style="height: 100vh; background: linear-gradient(45deg, #2196f3, #4caf50);">
      <v-card elevation="10" max-width="400" class="rounded-3 shadow-lg">
        <v-card-title class="text-h5 text-left py-4">
         Dashoard EliteMedical Bajio RH
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
                v-model="username"
                label="Username"
                outlined
                dense
                color="primary"
                class="mb-3"
                required
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Password"
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
          <v-btn text small color="secondary">Olvido su contraseña?</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      valid: false,
    };
  },
  methods: {
    async login() {
      const endpoint = `https://elitemedicalbajio.online/rh/login?usuario=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`;

      try {
        const response = await axios.post(endpoint);

        if (response.data.role.nombre === "admin") {
          this.$router.push('/hr-dashboard');
        } else
          if (response.data.role.nombre === "user") {
            this.$router.push('/employee-dashboard');
          } else {
              alert('Invalid username or password.');
            }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login.');
      }
    },
  },
};
</script>

<style>
/* Center the card and create an eye-catching background */
.v-card {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
}

.v-btn {
  border-radius: 8px;
}

.v-divider {
  border-color: rgba(0, 0, 0, 0.1);
}
</style>
