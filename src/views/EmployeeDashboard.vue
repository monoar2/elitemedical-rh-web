<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <img src="@/assets/Logo_NB.png" alt="EliteMedical Bajio Logo" width="150" />
      <v-spacer></v-spacer>
      <p class="subtitle-1">Bienvenido, {{ employeeStore.getEmployee?.empleado?.nombre }}!</p>
      <v-btn text @click="handleLogout">
        <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
        <v-tooltip activator="parent" location="bottom">Cerrar Sesión</v-tooltip>
      </v-btn>
    </v-app-bar>

    <v-main >
      <v-container fluid v-if="employeeStore.isLoggedIn" > 


        <v-row>
          <v-col cols="12">
            <v-card class="elevation-10">
              <v-card-title class="primary--text text-center">INFORMACIÓN DEL EMPLEADO
                <font-awesome-icon :icon="['fas', 'address-card']" />
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card outlined class="pa-3 mb-3">
                      <v-card-title class="text-subtitle-1 primary--text">Información Básica</v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Vacaciones disponibles:</v-list-item-title>
                              <v-list-item-subtitle>{{ employeeStore.getEmployee?.empleado?.vacacionesDisponibles }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Ausencia Justificada:</v-list-item-title>
                              <v-list-item-subtitle>{{ employeeStore.getEmployee?.empleado?.ausenciasJustificadas }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card outlined class="pa-3 mb-3">
                      <v-card-title class="text-subtitle-1 primary--text">Métricas de Vacaciones</v-card-title>
                      <v-card-text v-if="employeeStore.getEmployee?.empleado?.fechaDeAlta">
                        <v-row>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Días Trabajados:</v-list-item-title>
                              <v-list-item-subtitle>{{ calculateDaysWorked(employeeStore.getEmployee?.empleado?.fechaDeAlta) }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Años Trabajados:</v-list-item-title>
                              <v-list-item-subtitle>{{ calculateYearsWorked(employeeStore.getEmployee?.empleado?.fechaDeAlta) }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Meses Trabajados:</v-list-item-title>
                              <v-list-item-subtitle>{{ calculateMonthsWorked(employeeStore.getEmployee?.empleado?.fechaDeAlta) }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Días de Vacaciones:</v-list-item-title>
                              <v-list-item-subtitle>{{ calculateVacationDays(employeeStore.getEmployee?.empleado?.fechaDeAlta) }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Días Proporcionales:</v-list-item-title>
                              <v-list-item-subtitle>{{ calculateProportionalDays(employeeStore.getEmployee?.empleado?.fechaDeAlta) }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Días Disponibles 2025:</v-list-item-title>
                              <v-list-item-subtitle>{{ calculateAvailableDays(employeeStore.getEmployee?.empleado?.fechaDeAlta, employeeStore.getEmployee?.empleado?.diasDevengados - employeeStore.getEmployee?.empleado?.vacacionesDisponibles) }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                          <v-col cols="6">
                            <v-list-item>
                              <v-list-item-title>Días Acumulados:</v-list-item-title>
                              <v-list-item-subtitle>{{ calculateAccumulatedDays(employeeStore.getEmployee?.empleado?.fechaDeAlta, employeeStore.getEmployee?.empleado?.diasDevengados - employeeStore.getEmployee?.empleado?.vacacionesDisponibles) }}</v-list-item-subtitle>
                            </v-list-item>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card class="elevation-10">
              <v-card-title class="headline primary--text text-center">SOLICITAR AUSENCIA
                <font-awesome-icon :icon="['fas', 'house-laptop']" />
              </v-card-title>
              <v-card-text>
                <v-form @submit.prevent="handleVacationRequest" ref="vacationForm" v-model="validForm">
                  <v-row>
                    <v-col>
                      <Text class="headerline primary--text text-center" text="Fecha de Inicio" >
                        Fecha de Inicio
                      </Text>  
                      <v-date-picker
                          v-model="startDate"
                          label="Fecha de Inicio"
                          :rules="[v => !!v || 'Fecha de inicio es requerida']"
                          color="blue"
                          hide-header="true"
                      />
                    </v-col>
                    <v-col>
                      <Text class="headerline primary--text text-center" text="Fecha de Regreso" >
                        Fecha de Regreso
                      </Text>  
                      <v-date-picker
                          v-model="endDate"
                          label="Fecha de Fin"
                          :rules="[v => !!v || 'Fecha de fin es requerida', v => (v && v >= startDate) || 'Fecha de fin debe ser posterior a la de inicio']"
                          color="blue"
                          hide-header="true"
                      />
                    </v-col>


                  </v-row>
                  <v-row>
                    TIPO DE AUSENCIA
                  </v-row>  
                  <v-row>
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
                      <v-btn type="submit" color="primary" :disabled="!validForm">Enviar</v-btn>
                    </v-col>
                  </v-row>  
                  <v-alert v-if="feedbackMessage" :type="feedbackType" outlined class="mt-4">
                    {{ feedbackMessage }}
                  </v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card class="elevation-10">
              <v-card-title class="headline primary--text text-center">
                MIS SOLICITUDES DE AUSENCIAS
                <font-awesome-icon :icon="['fas', 'plane-departure']" />
              </v-card-title>
              <divider></divider>
              <v-card-text>
                <v-data-table
                    :headers="tableHeaders"
                    :items="vacationList"
                    item-value="id"
                    class="elevation-1"
                    dense
                >
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-else class="text-center mt-10">
        <p>Por favor, inicia sesión para acceder al tablero.</p>
        <router-link to="/login">Ir al Login</router-link>
      </v-container>
      <Notification />
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import { useEmployeeStore } from '@/store/employee';
import Notification from '@/components/Notification.vue';
import { Text } from 'vue';
import { calculateVacationMetrics } from '@/services/vacationCalculator';

export default {
  components: { Notification },
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
        { title: 'Fecha de Inicio', key: 'fechaInicio' },
        { title: 'Fecha de Fin', key: 'fechaFin' },
        { title: 'Tipo', key: 'tipoVacacion.descripcion' },
        { title: 'Estado', key: 'estatus' },
      ],
    };
  },
  methods: {
    calculateDaysWorked(hireDate) {
      if (!hireDate) return 0;
      return calculateVacationMetrics(hireDate).daysWorked;
    },
    calculateYearsWorked(hireDate) {
      if (!hireDate) return 0;
      return calculateVacationMetrics(hireDate).yearsWorked;
    },
    calculateMonthsWorked(hireDate) {
      if (!hireDate) return 0;
      return calculateVacationMetrics(hireDate).monthsWorked;
    },
    calculateVacationDays(hireDate) {
      if (!hireDate) return 0;
      return calculateVacationMetrics(hireDate).vacationDays;
    },
    calculateProportionalDays(hireDate) {
      if (!hireDate) return 0;
      return calculateVacationMetrics(hireDate).proportionalDays;
    },
    calculateAvailableDays(hireDate, daysTaken) {
      if (!hireDate) return 0;
      return calculateVacationMetrics(hireDate, daysTaken).availableDays;
    },
    calculateAccumulatedDays(hireDate, daysTaken) {
      if (!hireDate) return 0;
      return calculateVacationMetrics(hireDate, daysTaken).accumulatedDays;
    },
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
          await this.employeeStore.fetchEmployeeDetails();
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
      return new Date(date).toLocaleDateString('es-ES');
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
  background-color: #1a75b6;
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

.v-date-picker-header .v-btn {
  background-color: #1976D2 !important;
  color: white !important;
  border-radius: 4px;
}

.v-date-picker-header .v-btn:hover {
  background-color: #1565C0 !important;
}

.v-date-picker-controls .v-btn:first-child {
  background-color: #1976D2 !important;
  color: white !important;
  border-radius: 4px;
}
.headerline {
  font-size: large;
  color: #9cbcd3;
  border-bottom: 2px solid #1976D2;
  padding-bottom: 5px;
}

.with-divider {
  border-right: 1px solid grey;
}
</style>
