<template>
  <v-app>
    <!-- Top Bar -->


    <v-container fluid>
      <v-row class="mb-5 justify-center">
        <v-col cols="12" class="text-center">

          <h1 class="display-1 primary--text">TABLERO DE RH</h1>
          <p class="subtitle-1">Bienvenido, RH administrativo!</p>
        </v-col>
      </v-row>

      <v-row>
        <!-- Users Section -->
        <v-col cols="12" md="6" class="pa-4">
          <v-card class="elevation-10">
            <v-card-title class="headline primary--text text-center">GESTIONAR USUARIOS</v-card-title>
            <v-card-text>
              <v-btn color="primary" class="mb-6 elevation-2" @click="openCreateUserModal">
                <v-icon left>mdi-plus</v-icon> Crear usuario
              </v-btn>
              <v-list two-line>
                <v-divider></v-divider>
                <v-list-item
                    v-for="user in users"
                    :key="user.id"
                    @click="editUser(user)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ user.nombre }}</v-list-item-title>
                    <v-list-item-subtitle>{{ user.role.nombre }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click.stop="deleteUser(user.id)">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-divider></v-divider>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Employees Section -->
        <v-col cols="12" md="6" class="pa-4">
          <v-card class="elevation-10">
            <v-card-title class="headline primary--text text-center">GESTIONAR EMPLEADOS</v-card-title>
            <v-card-text>
              <v-btn color="primary" class="mb-6 elevation-2" @click="createEmployee">
                <v-icon left>mdi-account-plus</v-icon> Crear Empleado
              </v-btn>
              <v-list two-line>
                <v-divider></v-divider>
                <v-list-item
                    v-for="employee in employees"
                    :key="employee.id"
                    @click="editEmployee(employee)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ employee.nombre }} {{ employee.apellidoPaterno }} {{ employee.apellidoMaterno }}</v-list-item-title>
                    <v-list-item-subtitle>{{ employee.correo }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click.stop="deleteEmployee(employee.id)">
                      <v-icon color="red">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                  <v-divider></v-divider>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Modals -->
      <v-dialog v-model="editUserModal" max-width="600px">
        <v-card>
          <v-card-title class="headline primary--text">Editar Usuario</v-card-title>
          <v-card-text>
            <v-form ref="editUserForm">
              <v-text-field v-model="editingUser.nombre" label="Nombre" required></v-text-field>
              <v-text-field v-model="editingUser.password" label="Contraseña" type="password" required></v-text-field>
              <v-select
                  v-model="editingUser.role"
                  :items="roles"
                  item-title="nombre"
                  item-value="id"
                  label="Rol del usuario"
                  required
              ></v-select>
              <v-select
                  v-model="editingUser.empleado"
                  :items="employees"
                  item-title="nombre"
                  item-value="id"
                  label="Empleado para asociar al usuario"
                  required
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEditUserModal">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click="saveUserChanges">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

        <!-- Modal for Creating User -->
        <v-dialog v-model="createUserModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Crear Usuario</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="createUserForm">
                <v-text-field v-model="newUser.nombre" label="Nombre" required></v-text-field>
                <v-text-field v-model="newUser.password" label="Contraseña" type="password" required></v-text-field>
                <v-select
                    v-model="newUser.role"
                    :items="roles"
                    item-title="nombre"
                    item-value="id"
                    label="Rol del usuario"
                    required
                ></v-select>
                <v-select
                    v-model="newUser.empleado"
                    :items="employees"
                    item-title="nombre"
                    item-value="id"
                    label="Empleado para asociar al usuario"
                    required
                ></v-select>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeCreateUserModal">Cerrar</v-btn>
              <v-btn color="blue darken-1" text @click="createUser">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal for Creating Employee -->
        <v-dialog v-model="createEmployeeModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Crear Empleado</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="createEmployeeForm">
                <v-text-field v-model="newEmployee.nombre" label="Nombre" required></v-text-field>
                <v-text-field v-model="newEmployee.apellidoPaterno" label="Apellido Paterno" required></v-text-field>
                <v-text-field v-model="newEmployee.apellidoMaterno" label="Apellido Materno" required></v-text-field>
                <v-text-field v-model="newEmployee.correo" label="Correo" type="email" required></v-text-field>
                <v-text-field v-model="newEmployee.telefono" label="Teléfono" required></v-text-field>
                <v-text-field v-model="newEmployee.vacacionesDisponibles" label="Vacaciones Disponibles" type="number" required></v-text-field>
                <v-text-field v-model="newEmployee.diasPorEnfermedadDisponibles" label="Días por Enfermedad Disponibles" type="number" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeCreateEmployeeModal">Cerrar</v-btn>
              <v-btn color="blue darken-1" text @click="saveNewEmployee">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Modal for Editing Employee -->
        <v-dialog v-model="editEmployeeModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar Empleado</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="editEmployeeForm">
                <v-text-field v-model="editingEmployee.nombre" label="Nombre" required></v-text-field>
                <v-text-field v-model="editingEmployee.apellidoPaterno" label="Apellido Paterno" required></v-text-field>
                <v-text-field v-model="editingEmployee.apellidoMaterno" label="Apellido Materno" required></v-text-field>
                <v-text-field v-model="editingEmployee.correo" label="Correo" type="email" required></v-text-field>
                <v-text-field v-model="editingEmployee.telefono" label="Teléfono" required></v-text-field>
                <v-text-field v-model="editingEmployee.vacacionesDisponibles" label="Vacaciones Disponibles" type="number" required></v-text-field>
                <v-text-field v-model="editingEmployee.diasPorEnfermedadDisponibles" label="Días por Enfermedad Disponibles" type="number" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeEditEmployeeModal">Cerrar</v-btn>
              <v-btn color="blue darken-1" text @click="saveEmployeeChanges">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


      <v-row>
        <!-- Vacation Requests Section -->
        <v-col cols="12" class="pa-4">
          <v-card class="elevation-10">
            <v-card-title class="headline primary--text text-center">SOLICITUDES DE VACACIONES</v-card-title>
            <v-card-text>
              <v-data-table
                  :headers="vacationHeaders"
                  :items="vacationRequests"
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
                <template v-slot:item.empleado="{ item }">
                  {{ item.empleado.nombre }} {{ item.empleado.apellidoPaterno }} {{ item.empleado.apellidoMaterno }}
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-btn
                      color="green"
                      text
                      :disabled="item.estauts !== null"
                      @click="approveRequest(item)"
                  >
                    APROBAR
                  </v-btn>
                  <v-btn
                      color="red"
                      text
                      :disabled="item.estauts !== null"
                      @click="rejectRequest(item)"
                  >
                    RECHAZAR
                  </v-btn>
                </template>
                <template v-slot:item.tipoVacacion="{ item }">
                  {{ item.tipoVacacion.descripcion }}
                  <span v-if="item.tipoVacacion.conGoceDeSueldo">(Con Goce de Sueldo)</span>
                  <span v-else>(Sin Goce de Sueldo)</span>
                </template>
                <template v-slot:item.estatus="{ item }">
                  {{ item.estauts || 'Pendiente' }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog v-model="confirmDeleteDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this {{ itemToDelete.type }}?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="dark" text @click="confirmDeleteDialog = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="confirmDelete">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";
import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VBtn, VAppBar, VToolbarTitle, VSpacer, VAvatar } from 'vuetify/components';import { useEmployeeStore } from '@/store/employee';

export default {
  components: {
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VAppBar,
    VToolbarTitle,
    VSpacer,
    VAvatar
  },
  data() {
    return {
      users: [], // List of users
      employees: [], // List of employees
      vacationTypes: [], // List of vacation types
      vacationRequests: [], // List of vacation requests
      roles: [], // List of Roles
      vacationHeaders: [
        { text: "Employee", value: "empleado" },
        { text: "Start Date", value: "fechaInicio" },
        { text: "End Date", value: "fechaFin" },
        { text: "Type", value: "tipoVacacion" },
        { text: "Status", value: "estatus" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      editUserModal: false,
      editingUser: {
        id: null,
        nombre: '',
        password: '',
        role: '',
        empleado: '',
      },
      createUserModal: false,
      newUser: {
        nombre: '',
        password: '',
        role: '',
        empleado: ''
      },
      createEmployeeModal: false,
      editEmployeeModal: false,
      newEmployee: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        vacacionesDisponibles: 0,
        diasPorEnfermedadDisponibles: 0
      },
      editingEmployee: {
        id: null,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        vacacionesDisponibles: 0,
        diasPorEnfermedadDisponibles: 0
      },
      confirmDeleteDialog: false,
      itemToDelete: null
    };
  },
  computed: {
    currentUser() {
      const employeeStore = useEmployeeStore();
      return employeeStore.employee;
    }
  },
  watch: {
    vacationHeaders(newVal) {
      console.log('Headers changed:', newVal);
    }
  },
  methods: {
    // Fetch Roles
    async fetchRoles() {
      try {
        const response = await axios.get("https://elitemedicalbajio.online/rh/roles/get");
        this.roles = response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    // Users Management
    async fetchUsers() {
      try {
        const response = await axios.get("https://elitemedicalbajio.online/rh/usuarios/get");
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    openCreateUserModal() {
      this.createUserModal = true;
    },
    closeCreateUserModal() {
      this.createUserModal = false;
      this.$refs.createUserForm.reset();
      this.newUser = { nombre: '', password: '', role: '' , empleado: '' };
    },
    createUser() {
      // Validate form
      if (this.$refs.createUserForm.validate()) {
        const newUserDTO = {
          nombre: this.newUser.nombre,
          password: this.newUser.password,
          role: { id: this.newUser.role },
          empleado: { id: this.newUser.empleado }
        };

        axios.post('https://elitemedicalbajio.online/rh/usuarios/save', newUserDTO)
            .then(response => {
              console.log('User saved:', response.data);
              this.fetchUsers();
              this.closeCreateUserModal();
              alert("User saved successfully!");
            })
            .catch(error => {
              console.error('Error saving user:', error);
              alert("Failed to save user!");
            });
      }
    },
    editUser(user) {
      // Copy user data to editingUser object for editing
      this.editingUser = { ...user };
      this.editUserModal = true; // Open the modal
    },
    closeEditUserModal() {
      this.editUserModal = false;
      this.$refs.editUserForm.reset();
    },
    saveUserChanges() {
      // Validate form
      if (this.$refs.editUserForm.validate()) {
        const usuarioDTO = {
          id: this.editingUser.id,
          nombre: this.editingUser.nombre,
          password: this.editingUser.password,
          role: this.editingUser.role,
          empleado: this.editingUser.empleado
        };

        axios.post("https://elitemedicalbajio.online/rh/usuarios/update", usuarioDTO)
            .then(response => {
              console.log('User updated successfully:', response.data);
              this.fetchUsers();
              this.closeEditUserModal();
              alert("User updated successfully!");
            })
            .catch(error => {
              console.error('Error updating user:', error);
              alert("Failed to update user!");
            });
      }
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
      this.createEmployeeModal = true;
    },
    closeCreateEmployeeModal() {
      this.createEmployeeModal = false;
      this.$refs.createEmployeeForm.reset();
      this.newEmployee = { nombre: '', correo: '' };
    },
    saveNewEmployee() {
      if (this.$refs.createEmployeeForm.validate()) {
        axios.post('https://elitemedicalbajio.online/rh/empleados/save', this.newEmployee)
            .then(response => {
              console.log('Employee saved:', response.data);
              this.fetchEmployees(); // Refresh employee list
              this.closeCreateEmployeeModal();
              alert("Employee saved successfully!");
            })
            .catch(error => {
              console.error('Error saving employee:', error);
              alert("Failed to save employee!");
            });
      }
    },
    editEmployee(employee) {
      this.editingEmployee = { ...employee };
      this.editEmployeeModal = true;
    },
    closeEditEmployeeModal() {
      this.editEmployeeModal = false;
      this.$refs.editEmployeeForm.reset();
    },
    saveEmployeeChanges() {
      if (this.$refs.editEmployeeForm.validate()) {
        axios.post('https://elitemedicalbajio.online/rh/empleados/update', this.editingEmployee)
            .then(response => {
              console.log('Employee updated:', response.data);
              this.fetchEmployees(); // Refresh employee list
              this.closeEditEmployeeModal();
              alert("Employee updated successfully!");
            })
            .catch(error => {
              console.error('Error updating employee:', error);
              alert("Failed to update employee!");
            });
      }
    },
    deleteUser(userId) {
      this.itemToDelete = { type: 'user', id: userId };
      this.confirmDeleteDialog = true;
    },
    deleteEmployee(employeeId) {
      this.itemToDelete = { type: 'employee', id: employeeId };
      this.confirmDeleteDialog = true;
    },
    confirmDelete() {
      if (this.itemToDelete.type === 'user') {
        axios.delete(`https://elitemedicalbajio.online/rh/usuarios/delete/${this.itemToDelete.id}`)
            .then(() => {
              this.fetchUsers(); // Refresh the users list
              alert("User deleted successfully!");
            })
            .catch(() => {
              console.error('Error deleting user');
              alert("Failed to delete user!");
            });
      } else if (this.itemToDelete.type === 'employee') {
        axios.delete(`https://elitemedicalbajio.online/rh/empleados/delete/${this.itemToDelete.id}`)
            .then(() => {
              this.fetchEmployees(); // Refresh the employees list
              alert("Employee deleted successfully!");
            })
            .catch(() => {
              console.error('Error deleting employee');
              alert("Failed to delete employee!");
            });
      }
      this.confirmDeleteDialog = false;
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
    approveRequest(request) {
      // Update the status to approve
      request.estauts = "APROBADA"; // Correct enum value for approved
      this.updateVacationStatus(request);
    },
    rejectRequest(request) {
      // Update the status to reject
      request.estauts = "RECHAZADA"; // Correct enum value for rejected
      this.updateVacationStatus(request);
    },
    updateVacationStatus(request) {
      axios.post("https://elitemedicalbajio.online/rh/vacaciones/update", request)
          .then(response => {
            console.log('Vacation request updated:', response.data);
            this.fetchVacationRequests(); // Refresh the list
            alert("Vacation request updated successfully!");
          })
          .catch(error => {
            console.error('Error updating vacation request:', error);
            alert("Failed to update vacation request!");
          });
    },
    logout() {
      const employeeStore = useEmployeeStore();
      employeeStore.clearEmployee(); // Clear user data from the store
      this.$router.push('/login'); // Redirect to login page after logout
    },
  },
  created() {
    this.fetchUsers();
    this.fetchEmployees();
    this.fetchVacationRequests();
    this.fetchRoles();
    console.log('Headers:', this.vacationHeaders);
  },
};
</script>

<style>
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

.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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
</style>