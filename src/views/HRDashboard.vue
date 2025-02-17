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
              GESTIONAR USUARIOS
            </v-card-title>
            <v-card-text>
              <v-btn color="primary" class="mb-3" @click="openCreateUserModal">
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
                  <v-list-item-action class="justify-end">
                    <v-btn color="red" @click.stop="deleteUser(user.id)">
                      <v-icon>mdi-delete</v-icon>
                      <span>BORRAR</span>
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
              GESTIONAR EMPLEADOS
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
                  <v-list-item-action class="justify-end">
                    <v-btn color="red" @click.stop="deleteEmployee(employee.id)">
                      <v-icon>mdi-delete</v-icon>
                      <span>BORRAR</span>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Modal for Editing User -->
        <v-dialog v-model="editUserModal" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar Usuario</span>
            </v-card-title>
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
      </v-row>

      <v-row>
        <!-- Vacation Requests Section -->
        <v-col cols="12">
          <v-card>
            <v-card-title>
              SOLICITUDES DE VACACIONES
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
                  {{ item.tipoVacacion.conGoceDeSueldo ? '(Con Goce de Sueldo)' : '(Sin Goce de Sueldo)' }}
                </template>
                <template v-slot:item.estatus="{ item }">
                  {{ item.estauts }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- ... rest of the template ... -->
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
      vacationTypes: [], // List of vacation types
      vacationRequests: [], // List of vacation requests
      roles: [], // List of Roles
      vacationHeaders: [
        { text: "Employee", value: "empleado" },
        { text: "Start Date", value: "fechaInicio" },
        { text: "End Date", value: "fechaFin" },
        { text: "Type", value: "tipoVacacion" },
        { text: "Estatus", value: "estatus" },
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
      }
    };
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
        const response = await axios.get("http://localhost:8082/rh/roles/get");
        this.roles = response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },
    // Users Management
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:8082/rh/usuarios/get");
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

        axios.post('http://localhost:8082/rh/usuarios/save', newUserDTO)
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

        axios.post("http://localhost:8082/rh/usuarios/update", usuarioDTO)
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
    deleteUser(userId) {
      // Logic to delete a user
      axios.delete(`http://localhost:8082/rh/usuarios/delete/${userId}`)
          .then(() => {
            console.log('User deleted successfully');
            this.fetchUsers();
            alert("User deleted successfully!");
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            alert("Failed to delete user!");
          });
    },

    // Employees Management
    async fetchEmployees() {
      try {
        const response = await axios.get("http://localhost:8082/rh/empleados/get");
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
        const response = await axios.get("http://localhost:8082/rh/vacaciones/get");
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
      axios.post("http://localhost:8082/rh/vacaciones/update", request)
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
/* Add any custom styling here */
.v-card {
  margin-bottom: 20px;
}
.v-data-table thead th {
  color: #000; /* Black text color for headers */
  background-color: #f5f5f5; /* Light grey background for headers */
}
</style>