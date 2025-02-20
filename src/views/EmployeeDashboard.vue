<template>
  <v-container>
    <v-row>
      <!-- header -->
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Employee Dashboard
            <v-btn color="red" @click="handleLogout">Logout</v-btn>
          </v-card-title>
          <v-card-subtitle>
            <v-row>
              <v-col>
                <v-label>Name:</v-label> {{ employeeStore.getEmployee?.empleado?.nombre }} {{ employeeStore.getEmployee?.empleado?.apellidoPaterno }} {{ employeeStore.getEmployee?.empleado?.apellidoMaterno }}
              </v-col>
              <v-col>
                <v-label>Email:</v-label> {{ employeeStore.getEmployee?.empleado?.correo }}
              </v-col>
              <v-col>
                <v-label>Phone:</v-label> {{ employeeStore.getEmployee?.empleado?.telefono }}
              </v-col>
            </v-row>

          </v-card-subtitle>
        </v-card>
      </v-col>
      <!-- header -->
      <v-col cols="12">
        <v-form @submit.prevent="handleVacationRequest">
          <v-row>
            <v-col>
              <v-date-picker
                  v-model="startDate"
                  label="Start Date"
                  :year-range="[1900, 2100]"
              />

            </v-col>
            <v-col>
              <v-date-picker
                  v-model="endDate"
                  label="Start Date"
                  :year-range="[1900, 2100]"
              />

            </v-col>
            <v-col>
              <v-select
                  v-model="selectedVacationType"
                  :items="vacationTypes"
                  item-title="descripcion"
                  item-value="id"
                  label="Vacation Type"
              />
            </v-col>
            <v-col>
              <v-btn type="submit" color="primary">Submit Request</v-btn>
            </v-col>
          </v-row>
          <v-alert v-if="feedbackMessage" :type="feedbackType" outlined>
            {{ feedbackMessage }}
          </v-alert>
          <div v-else>
            <p>Please log in to access the dashboard.</p>
            <router-link to="/login">Go to Login</router-link>
          </div>
        </v-form>
      </v-col>
      <v-col cols="12">
        <v-data-table :items="vacationList" :headers="tableHeaders" item-value="id" class="elevation-1">
          <template #item.fechaInicio="{ item }">
            {{ formatDate(item.fechaInicio) }}
          </template>
          <template #item.fechaFin="{ item }">
            {{ formatDate(item.fechaFin) }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { useEmployeeStore } from '@/store/employee';


export default {
  setup() {
    const employeeStore = useEmployeeStore();
    return { employeeStore };
  },
  data() {
    const employeeStore = useEmployeeStore();

    return {
      employee: employeeStore.employee, // Reactive employee data
      vacationTypes: [],
      vacationList: [],
      startDate: null,
      endDate: null,
      selectedVacationType: null,
      feedbackMessage: "",
      feedbackType: "error",
      tableHeaders: [
        { text: "Start Date", value: "fechaInicio" },
        { text: "End Date", value: "fechaFin" },
        { text: "Type", value: "tipoVacacion.nombre" },
        { text: "Status", value: "estatus" },
      ],
    };
  },
  methods: {
    async handleLogout() {
      this.employeeStore.logout();
      this.$router.push('/login');
    },
    async loadEmployee() {
      try {
        const response = await axios.get(`https://elitemedicalbajio.online/rh/empleados/get/${this.employeeStore.getEmployee.empleado.id}`);
        this.employee = response.data;
      } catch (error) {
        this.feedbackMessage = 'Failed to load employee data.';
        this.feedbackType = 'error';
      }
    },
    async loadVacationTypes() {
      try {
        const response = await axios.get("https://elitemedicalbajio.online/rh/tipo_vacacion/get");
        this.vacationTypes = response.data;
        this.$set(this, 'vacationTypes', response.data);

      } catch (error) {
        this.feedbackMessage = "Failed to load vacation types.";
        this.feedbackType = "error";
      }
    },
    async loadVacations() {
      try {
        const response = await axios.get(
            `https://elitemedicalbajio.online/rh/vacaciones/empleado/${this.employee.empleado.id}`
        );
        this.vacationList = response.data;
      } catch (error) {
        this.feedbackMessage = "Failed to load vacations.";
        this.feedbackType = "error";
      }
    },
    async handleVacationRequest() {
      if (!this.startDate || !this.endDate || !this.selectedVacationType) {
        this.feedbackMessage = "Please fill out all fields.";
        this.feedbackType = "error";
        return;
      }

      if (this.endDate < this.startDate) {
        this.feedbackMessage = "End date must be after start date.";
        this.feedbackType = "error";
        return;
      }

      try {
        const request = {
          empleado: { id: this.employee.empleado.id },
          tipoVacacion: { id: this.selectedVacationType },
          fechaInicio: this.startDate,
          fechaFin: this.endDate,
        };

        const response = await axios.post("https://elitemedicalbajio.online/rh/vacaciones/save", request);
        if (response.status === 201) {
          this.feedbackMessage = "Vacation request submitted successfully!";
          this.feedbackType = "success";
          await this.loadVacations();
        } else {
          this.feedbackMessage = "Failed to submit vacation request.";
          this.feedbackType = "error";
        }
      } catch (error) {
        this.feedbackMessage = "Error while submitting vacation request.";
        this.feedbackType = "error";
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  async mounted() {
    if (this.employeeStore.isLoggedIn) {
      await this.loadEmployee();
      await this.loadVacationTypes();
      await this.loadVacations();
    }
  },
  watch: {
    selectedVacationType(newVal) {
      console.log('Selected Vacation Type:', newVal);
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
