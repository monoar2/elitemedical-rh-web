<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Employee Dashboard
          </v-card-title>
          <v-card-subtitle>
            <v-row>
              <v-col>
                <v-label>Name:</v-label> {{ employee.empleado.nombre }} {{ employee.empleado.apellidoPaterno }} {{ employee.empleado.apellidoMaterno }}
              </v-col>
              <v-col>
                <v-label>Email:</v-label> {{ employee.empleado.correo }}
              </v-col>
              <v-col>
                <v-label>Phone:</v-label> {{ employee.empleado.telefono }}
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-label>Vacation Days Available:</v-label> {{ employee.empleado.vacacionesDisponibles }}
              </v-col>
              <v-col>
                <v-label>Sick Days Available:</v-label> {{ employee.empleado.diasPorEnfermedadDisponibles }}
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-form @submit.prevent="handleVacationRequest">
          <v-row>
            <v-col>
              <v-date-picker v-model="startDate" label="Start Date" />
            </v-col>
            <v-col>
              <v-date-picker v-model="endDate" label="End Date" />
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
    async loadEmployee() {
      try {
        const response = await axios.get(`https://elitemedicalbajio.online/rh/empleados/get/${employeeStore.employee.empleado.id}`);
        this.employee = response.data;
      } catch (error) {
        this.feedbackMessage = "Failed to load employee data.";
        this.feedbackType = "error";
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
          this.loadVacations();
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
    await this.loadEmployee();
    await this.loadVacationTypes();
    await this.loadVacations();

    console.log('Vacation Types:', this.vacationTypes);

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
