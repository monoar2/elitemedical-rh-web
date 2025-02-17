<template>
  <v-app>
    <v-container fluid>
      <v-row class="mb-5">
        <v-col cols="12" class="text-center">
          <h1>HR Dashboard</h1>
          <p>Welcome, HR Manager!</p>
        </v-col>
      </v-row>

      <v-row>
        <!-- Users Section -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              Manage Users
            </v-card-title>
            <v-card-text>
              <v-btn color="primary" class="mb-3" @click="createUser">
                Create New User
              </v-btn>
              <v-list>
                <v-list-item
                    v-for="user in users"
                    :key="user.id"
                    @click="editUser(user)"
                >
                  <v-list-item>
                    <v-list-item-title>{{ user.nombre }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.role }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item-action>
                    <v-btn icon color="red" @click.stop="deleteUser(user.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Employees Section -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              Manage Employees
            </v-card-title>
            <v-card-text>
              <v-btn color="primary" class="mb-3" @click="createEmployee">
                Add New Employee
              </v-btn>
              <v-list>
                <v-list-item
                    v-for="employee in employees"
                    :key="employee.id"
                    @click="editEmployee(employee)"
                >
                  <v-list-item>
                    <v-list-item-title>{{ employee.nombre }}</v-list-item-title>
                    <v-list-item-subtitle>{{ employee.correo }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item-action>
                    <v-btn icon color="red" @click.stop="deleteEmployee(employee.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Vacation Requests Section -->
        <v-col cols="12">
          <v-card>
            <v-card-title>
              Vacation Requests
            </v-card-title>
            <v-card-text>
              <v-data-table
                  :headers="vacationHeaders"
                  :items="vacationRequests"
                  item-value="id"
                  class="elevation-1"
              >
                <template v-slot:item.empleado="{ item }">
                  {{ item.empleado.nombre }} {{ item.empleado.apellidoPaterno }} {{ item.empleado.apellidoMaterno }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                      color="green"
                      text
                      @click="approveRequest(item.id)"
                  >
                    Approve
                  </v-btn>
                  <v-btn
                      color="red"
                      text
                      @click="rejectRequest(item.id)"
                  >
                    Reject
                  </v-btn>
                </template>
                <template v-slot:item.tipoVacacion="{ item }">
                  {{ item.tipoVacacion.descripcion }}
                  {{ item.tipoVacacion.conGoceDeSueldo ? '(Con Goce de Sueldo)' : '(Sin Goce de Sueldo)' }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [], // List of users
      employees: [], // List of employees
      vacationTypes: [],// List of vacation types
      vacationRequests: [], // List of vacation requests
      vacationHeaders: [
        { text: "Employee", value: "empleado" },
        { text: "Start Date", value: "fechaInicio" },
        { text: "End Date", value: "fechaFin" },
        { text: "Type", value: "tipoVacacion" },
        { text: "Status", value: "estatus" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    // Users Management
    async fetchUsers() {
      try {
        const response = await axios.get("https://elitemedicalbajio.online/rh/usuarios/get");
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    createUser() {
      // Logic to create a new user
      alert("Create User logic here");
    },
    editUser(user) {
      // Logic to edit a user
      alert(`Edit User: ${user.nombre}`);
    },
    deleteUser(userId) {
      // Logic to delete a user
      alert(`Delete User with ID: ${userId}`);
    },

    // Employees Management
    async fetchEmployees() {
      try {
        const response = await axios.get("https://elitemedicalbajio.online/rh/empleados/get");
        this.employees = response.data;
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
    createEmployee() {
      // Logic to add a new employee
      alert("Create Employee logic here");
    },
    editEmployee(employee) {
      // Logic to edit employee details
      alert(`Edit Employee: ${employee.nombre}`);
    },
    deleteEmployee(employeeId) {
      // Logic to delete an employee
      alert(`Delete Employee with ID: ${employeeId}`);
    },

    // Vacation Requests Management
    async fetchVacationRequests() {
      try {
        const response = await axios.get("https://elitemedicalbajio.online/rh/vacaciones/get");
        this.vacationRequests = response.data;
      } catch (error) {
        console.error("Error fetching vacation requests:", error);
      }
    },
    approveRequest(requestId) {
      // Logic to approve a vacation request
      alert(`Approve Vacation Request with ID: ${requestId}`);
    },
    rejectRequest(requestId) {
      // Logic to reject a vacation request
      alert(`Reject Vacation Request with ID: ${requestId}`);
    },
  },
  created() {
    this.fetchUsers();
    this.fetchEmployees();
    this.fetchVacationRequests();
    console.log('Headers:', this.vacationHeaders);
  },
};
</script>

<style>
/* Add any custom styling here */
.v-card {
  margin-bottom: 20px;
}
.v-data-table thead th {
  color: #000; /* Black text color for headers */
  background-color: #f5f5f5; /* Light grey background for headers */
}
</style>
