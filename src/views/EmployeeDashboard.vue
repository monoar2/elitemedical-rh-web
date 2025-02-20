<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar app color="primary" dark>
      <img src="@/assets/Logo_NB.png" alt="EliteMedical Bajio Logo" width="150" />

      <v-spacer></v-spacer>
      <p class="subtitle-1">Bienvenido, {{ employeeStore.getEmployee?.empleado?.nombre }}!</p>
      <v-btn text @click="handleLogout">
        <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
        <v-tooltip
            activator="parent"
            location="bottom"
        >Cerrar Sesion</v-tooltip>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-container fluid v-if="employeeStore.isLoggedIn">
      <v-row class="mb-5 justify-center">
        <v-col cols="12" class="text-center">
          <h1 class="display-1 primary--text">TABLERO DE EMPLEADO</h1>

        </v-col>
      </v-row>

      <v-row>
        <!-- Employee Info -->
        <v-col cols="12">
          <v-card class="elevation-10">
            <v-card-title class="headline primary--text text-center">INFORMACIÓN DEL EMPLEADO
              <font-awesome-icon :icon="['fas', 'address-card']" />
            </v-card-title>
            <v-card-subtitle>
              <v-row>
                <v-col>
                  <v-label>Nombre:</v-label> {{ employeeStore.getEmployee?.empleado?.nombre }} {{ employeeStore.getEmployee?.empleado?.apellidoPaterno }} {{ employeeStore.getEmployee?.empleado?.apellidoMaterno }}
                </v-col>
                <v-col>
                  <v-label>Email:</v-label> {{ employeeStore.getEmployee?.empleado?.correo }}
                </v-col>
                <v-col>
                  <v-label>Teléfono:</v-label> {{ employeeStore.getEmployee?.empleado?.telefono }}
                </v-col>
                <v-col>
                  <v-label>Vacaciones disponibles:</v-label> {{ employeeStore.getEmployee?.empleado?.vacacionesDisponibles }}
                </v-col>
                <v-col>
                  <v-label>Dias por enfermedad:</v-label> {{ employeeStore.getEmployee?.empleado?.diasPorEnfermedadDisponibles }}
                </v-col>
              </v-row>
            </v-card-subtitle>
          </v-card>
        </v-col>

        <!-- Vacation Request Form -->
        <v-col cols="12">
          <v-card class="elevation-10">
            <v-card-title class="headline primary--text text-center">SOLICITAR AUSENCIA
              <font-awesome-icon :icon="['fas', 'house-laptop']" />
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleVacationRequest" ref="vacationForm" v-model="validForm">
                <v-row>
                  <v-col>
                    <v-date-picker
                        title="-----------------------------------------------"
                        v-model="startDate"
                        label="Fecha de Inicio"
                        :year-range="[1900, 2100]"
                        :rules="[v => !!v || 'Fecha de inicio es requerida']"
                        border="lg"
                        color="blue"
                        header="Fecha inicio"

                    />
                  </v-col>
                  <v-col>
                    <v-date-picker
                        title="-----------------------------------------------"
                        v-model="endDate"
                        label="Fecha de Fin"
                        :year-range="[1900, 2100]"
                        :rules="[v => !!v || 'Fecha de fin es requerida', v => (v && v >= startDate) || 'Fecha de fin debe ser posterior a la de inicio']"
                        border="lg"
                        color="blue"
                        header="Fecha de Regreso"

                    />
                  </v-col>
                  <v-col>
                    <v-select
                        v-model="selectedVacationType"
                        :items="vacationTypes"
                        item-title="descripcion"
                        item-value="id"
                        label="Tipo de Ausencia"
                        :rules="[v => !!v || 'Tipo de Ausencia es requerido']"
                    />
                  </v-col>
                  <v-col>
                    <v-btn type="submit" color="primary" :disabled="!validForm">Enviar Solicitud</v-btn>
                  </v-col>
                </v-row>
                <v-alert v-if="feedbackMessage" :type="feedbackType" outlined class="mt-4">
                  {{ feedbackMessage }}
                </v-alert>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Vacation List -->
        <v-col cols="12">
          <v-card class="elevation-10">
            <v-card-title class="headline primary--text text-center">
              MIS SOLICITUDES DE AUSENCIAS
              <font-awesome-icon :icon="['fas', 'plane-departure']" />
            </v-card-title>
            <v-card-text>
              <v-data-table
                  :headers="tableHeaders"
                  :items="vacationList"
                  item-value="id"
                  class="elevation-1"
                  dense
              >
                <template v-slot:header="{ props }">
                  <thead>
                  <tr>
                    <th v-for="header in props.headers" :key="header.value" class="text-uppercase primary--text">
                      {{ header.text }}
                    </th>
                  </tr>
                  </thead>
                </template>
                <template v-slot:item.fechaInicio="{ item }">
                  {{ formatDate(item.fechaInicio) }}
                </template>
                <template v-slot:item.fechaFin="{ item }">
                  {{ formatDate(item.fechaFin) }}
                </template>
                <template v-slot:item.tipoVacacion.nombre="{ item }">
                  {{ item.tipoVacacion.descripcion }}
                </template>
                <template v-slot:item.estatus="{ item }">
                  {{ item.estauts || 'Pendiente' }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Not Logged In Message -->
    <v-container v-else class="text-center mt-10">
      <p>Por favor, inicia sesión para acceder al tablero.</p>
      <router-link to="/login">Ir al Login</router-link>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import { useEmployeeStore } from '@/store/employee';

export default {
  setup() {
    const employeeStore = useEmployeeStore();
    return { employeeStore };
  },
  data() {
    return {
      employee: null,
      vacationTypes: [],
      vacationList: [],
      startDate: null,
      endDate: null,
      selectedVacationType: null,
      feedbackMessage: '',
      feedbackType: 'error',
      validForm: false,
      tableHeaders: [
        { text: 'id', value: 'id' },
        { text: 'Fecha de Inicio', value: 'fechaInicio' },
        { text: 'Fecha de Fin', value: 'fechaFin' },
        { text: 'Tipo', value: 'tipoVacacion.nombre' },
        { text: 'Estado', value: 'estatus' },
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
        this.feedbackMessage = 'Error al cargar datos del empleado.';
        this.feedbackType = 'error';
      }
    },
    async loadVacationTypes() {
      try {
        const response = await axios.get('https://elitemedicalbajio.online/rh/tipo_vacacion/get');
        this.vacationTypes = response.data;
      } catch (error) {
        this.feedbackMessage = 'Error al cargar tipos de vacaciones.';
        this.feedbackType = 'error';
      }
    },
    async loadVacations() {
      try {
        const response = await axios.get(`https://elitemedicalbajio.online/rh/vacaciones/empleado/${this.employeeStore.getEmployee.empleado.id}`);
        this.vacationList = response.data;
      } catch (error) {
        this.feedbackMessage = 'Error al cargar solicitudes de vacaciones.';
        this.feedbackType = 'error';
      }
    },
    async handleVacationRequest() {
      if (!this.$refs.vacationForm.validate()) {
        this.feedbackMessage = 'Por favor, completa todos los campos correctamente.';
        this.feedbackType = 'error';
        return;
      }

      try {
        const request = {
          empleado: { id: this.employeeStore.getEmployee.empleado.id },
          tipoVacacion: { id: this.selectedVacationType },
          fechaInicio: this.startDate,
          fechaFin: this.endDate,
        };

        const response = await axios.post('https://elitemedicalbajio.online/rh/vacaciones/save', request);
        if (response.status === 201) {
          this.feedbackMessage = 'Solicitud de vacaciones enviada exitosamente!';
          this.feedbackType = 'success';
          this.startDate = null;
          this.endDate = null;
          this.selectedVacationType = null;
          this.$refs.vacationForm.reset();
          await this.loadVacations();
        } else {
          this.feedbackMessage = 'Error al enviar la solicitud de vacaciones.';
          this.feedbackType = 'error';
        }
      } catch (error) {
        this.feedbackMessage = 'Error al procesar la solicitud de vacaciones.';
        this.feedbackType = 'error';
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
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-card-title {
  background-color: #E3F2FD;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-btn--icon {
  margin-left: 8px;
}

.v-data-table thead th {
  background-color: #BBDEFB !important;
  color: #000 !important;
  font-weight: bold;
}

.v-data-table tbody tr:nth-child(even) {
  background-color: #E3F2FD;
}

.v-btn--text {
  text-transform: uppercase;
}
.v-date-picker-controls_month-btn{
  color: blue;
}
.v-date-picker-header .v-btn {
  background-color: #1976D2 !important; /* Primary blue color */
  color: white !important;
  border-radius: 4px;
}
.v-date-picker-header .v-btn:hover {
  background-color: #1565C0 !important; /* Darker blue on hover */
}

.v-date-picker-controls .v-btn:first-child  {
  background-color: #1976D2 !important; /* Primary blue color */
  color: white !important;
  border-radius: 4px;

}
</style>