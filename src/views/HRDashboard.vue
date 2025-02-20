<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>TABLERO DE RH</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar v-if="currentUser" size="36" class="mr-2">
        <span>{{ currentUser.empleado?.nombre?.charAt(0) }}</span>
      </v-avatar>
      <v-btn text @click="logout">
        <v-icon left>mdi-logout</v-icon> Cerrar Sesión
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-row class="mb-5 justify-center">
        <v-col cols="12" class="text-center">
          <h1 class="display-1 primary--text">TABLERO DE RH</h1>
          <p class="subtitle-1">Bienvenido, {{ currentUser?.empleado?.nombre }}!</p>
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
                <v-list-item v-for="user in users" :key="user.id" @click="editUser(user)">
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
                <v-list-item v-for="employee in employees" :key="employee.id" @click="editEmployee(employee)">
                  <v-list-item-content>
                    <v-list-item-title>{{ employee.nombre }} {{ employee.apellidoPaterno }} {{ employee.apellidoMaterno }}</v-list-item-title>
                    <v-list-item-subtitle>{{ employee.correo }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ employee.telefono }}</v-list-item-subtitle>
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
            <v-form ref="editUserForm" v-model="validEditUserForm">
              <v-text-field v-model="editingUser.nombre" label="Nombre" required :rules="[v => !!v || 'Nombre es requerido']"></v-text-field>
              <v-text-field v-model="editingUser.password" label="Contraseña" type="password" required :rules="[v => !!v || 'Contraseña es requerida']"></v-text-field>
              <v-select
                  v-model="editingUser.role"
                  :items="roles"
                  item-title="nombre"
                  return-object
                  label="Rol del usuario"
                  required
                  :rules="[v => !!v || 'Rol es requerido']"
              ></v-select>
              <v-select
                  v-model="editingUser.empleado"
                  :items="employees"
                  item-title="nombre"
                  return-object
                  label="Empleado para asociar al usuario"
                  required
                  :rules="[v => !!v || 'Empleado es requerido']"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEditUserModal">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click="saveUserChanges" :disabled="!validEditUserForm">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="createUserModal" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Crear Usuario</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="createUserForm" v-model="validCreateUserForm">
              <v-text-field v-model="newUser.nombre" label="Nombre" required :rules="[v => !!v || 'Nombre es requerido']"></v-text-field>
              <v-text-field v-model="newUser.password" label="Contraseña" type="password" required :rules="[v => !!v || 'Contraseña es requerida']"></v-text-field>
              <v-select
                  v-model="newUser.role"
                  :items="roles"
                  item-title="nombre"
                  return-object
                  label="Rol del usuario"
                  required
                  :rules="[v => !!v || 'Rol es requerido']"
              ></v-select>
              <v-select
                  v-model="newUser.empleado"
                  :items="employees"
                  item-title="nombre"
                  return-object
                  label="Empleado para asociar al usuario"
                  required
                  :rules="[v => !!v || 'Empleado es requerido']"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeCreateUserModal">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click="createUser" :disabled="!validCreateUserForm">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="createEmployeeModal" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Crear Empleado</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="createEmployeeForm" v-model="validCreateEmployeeForm">
              <v-text-field v-model="newEmployee.nombre" label="Nombre" required :rules="[v => !!v || 'Nombre es requerido']"></v-text-field>
              <v-text-field v-model="newEmployee.apellidoPaterno" label="Apellido Paterno" required :rules="[v => !!v || 'Apellido Paterno es requerido']"></v-text-field>
              <v-text-field v-model="newEmployee.apellidoMaterno" label="Apellido Materno" required :rules="[v => !!v || 'Apellido Materno es requerido']"></v-text-field>
              <v-text-field v-model="newEmployee.correo" label="Correo" type="email" required :rules="[v => !!v || 'Correo es requerido', v => /.+@.+\..+/.test(v) || 'Correo debe ser válido']"></v-text-field>
              <v-text-field v-model="newEmployee.telefono" label="Teléfono" required :rules="[v => !!v || 'Teléfono es requerido']"></v-text-field>
              <v-text-field v-model="newEmployee.vacacionesDisponibles" label="Vacaciones Disponibles" type="number" required :rules="[v => v >= 0 || 'Debe ser un número positivo']"></v-text-field>
              <v-text-field v-model="newEmployee.diasPorEnfermedadDisponibles" label="Días por Enfermedad Disponibles" type="number" required :rules="[v => v >= 0 || 'Debe ser un número positivo']"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeCreateEmployeeModal">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click="saveNewEmployee" :disabled="!validCreateEmployeeForm">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editEmployeeModal" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Editar Empleado</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="editEmployeeForm" v-model="validEditEmployeeForm">
              <v-text-field v-model="editingEmployee.nombre" label="Nombre" required :rules="[v => !!v || 'Nombre es requerido']"></v-text-field>
              <v-text-field v-model="editingEmployee.apellidoPaterno" label="Apellido Paterno" required :rules="[v => !!v || 'Apellido Paterno es requerido']"></v-text-field>
              <v-text-field v-model="editingEmployee.apellidoMaterno" label="Apellido Materno" required :rules="[v => !!v || 'Apellido Materno es requerido']"></v-text-field>
              <v-text-field v-model="editingEmployee.correo" label="Correo" type="email" required :rules="[v => !!v || 'Correo es requerido', v => /.+@.+\..+/.test(v) || 'Correo debe ser válido']"></v-text-field>
              <v-text-field v-model="editingEmployee.telefono" label="Teléfono" required :rules="[v => !!v || 'Teléfono es requerido']"></v-text-field>
              <v-text-field v-model="editingEmployee.vacacionesDisponibles" label="Vacaciones Disponibles" type="number" required :rules="[v => v >= 0 || 'Debe ser un número positivo']"></v-text-field>
              <v-text-field v-model="editingEmployee.diasPorEnfermedadDisponibles" label="Días por Enfermedad Disponibles" type="number" required :rules="[v => v >= 0 || 'Debe ser un número positivo']"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEditEmployeeModal">Cerrar</v-btn>
            <v-btn color="blue darken-1" text @click="saveEmployeeChanges" :disabled="!validEditEmployeeForm">Guardar</v-btn>
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
          <v-card-title class="headline">Confirmar Eliminación</v-card-title>
          <v-card-text>¿Estás seguro de que deseas eliminar este {{ itemToDelete?.type === 'user' ? 'usuario' : 'empleado' }}?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="dark" text @click="confirmDeleteDialog = false">Cancelar</v-btn>
            <v-btn color="red darken-1" text @click="confirmDelete">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import { useEmployeeStore } from '@/store/employee';

export default {
  data() {
    return {
      users: [],
      employees: [],
      vacationTypes: [],
      vacationRequests: [],
      roles: [],
      vacationHeaders: [
        { text: 'Empleado', value: 'empleado' },
        { text: 'Fecha Inicio', value: 'fechaInicio' },
        { text: 'Fecha Fin', value: 'fechaFin' },
        { text: 'Tipo', value: 'tipoVacacion' },
        { text: 'Estado', value: 'estatus' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      editUserModal: false,
      validEditUserForm: false,
      editingUser: { id: null, nombre: '', password: '', role: null, empleado: null },
      createUserModal: false,
      validCreateUserForm: false,
      newUser: { nombre: '', password: '', role: null, empleado: null },
      createEmployeeModal: false,
      validCreateEmployeeForm: false,
      editEmployeeModal: false,
      validEditEmployeeForm: false,
      newEmployee: {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        vacacionesDisponibles: 0,
        diasPorEnfermedadDisponibles: 0,
      },
      editingEmployee: {
        id: null,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        vacacionesDisponibles: 0,
        diasPorEnfermedadDisponibles: 0,
      },
      confirmDeleteDialog: false,
      itemToDelete: null,
    };
  },
  computed: {
    currentUser() {
      const employeeStore = useEmployeeStore();
      return employeeStore.getEmployee;
    },
  },
  methods: {
    // Fetch Roles
    async fetchRoles() {
      try {
        const response = await axios.get('https://elitemedicalbajio.online/rh/roles/get');
        this.roles = response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },

    // Users Management
    async fetchUsers() {
      try {
        const response = await axios.get('https://elitemedicalbajio.online/rh/usuarios/get');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    openCreateUserModal() {
      this.createUserModal = true;
    },
    closeCreateUserModal() {
      this.createUserModal = false;
      this.$refs.createUserForm.reset();
      this.newUser = { nombre: '', password: '', role: null, empleado: null };
    },
    async createUser() {
      if (this.$refs.createUserForm.validate()) {
        const newUserDTO = {
          nombre: this.newUser.nombre,
          password: this.newUser.password,
          role: { id: this.newUser.role.id },
          empleado: { id: this.newUser.empleado.id },
        };
        try {
          await axios.post('https://elitemedicalbajio.online/rh/usuarios/save', newUserDTO);
          this.fetchUsers();
          this.closeCreateUserModal();
          alert('Usuario creado exitosamente!');
        } catch (error) {
          console.error('Error saving user:', error);
          alert('Error al crear usuario!');
        }
      }
    },
    editUser(user) {
      this.editingUser = { ...user, role: user.role, empleado: user.empleado };
      this.editUserModal = true;
    },
    closeEditUserModal() {
      this.editUserModal = false;
      this.$refs.editUserForm.reset();
    },
    async saveUserChanges() {
      if (this.$refs.editUserForm.validate()) {
        const usuarioDTO = {
          id: this.editingUser.id,
          nombre: this.editingUser.nombre,
          password: this.editingUser.password,
          role: { id: this.editingUser.role.id },
          empleado: { id: this.editingUser.empleado.id },
        };
        try {
          await axios.post('https://elitemedicalbajio.online/rh/usuarios/update', usuarioDTO);
          this.fetchUsers();
          this.closeEditUserModal();
          alert('Usuario actualizado exitosamente!');
        } catch (error) {
          console.error('Error updating user:', error);
          alert('Error al actualizar usuario!');
        }
      }
    },

    // Employees Management
    async fetchEmployees() {
      try {
        const response = await axios.get('https://elitemedicalbajio.online/rh/empleados/get');
        this.employees = response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    },
    createEmployee() {
      this.createEmployeeModal = true;
    },
    closeCreateEmployeeModal() {
      this.createEmployeeModal = false;
      this.$refs.createEmployeeForm.reset();
      this.newEmployee = {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        correo: '',
        telefono: '',
        vacacionesDisponibles: 0,
        diasPorEnfermedadDisponibles: 0,
      };
    },
    async saveNewEmployee() {
      if (this.$refs.createEmployeeForm.validate()) {
        try {
          await axios.post('https://elitemedicalbajio.online/rh/empleados/save', this.newEmployee);
          this.fetchEmployees();
          this.closeCreateEmployeeModal();
          alert('Empleado creado exitosamente!');
        } catch (error) {
          console.error('Error saving employee:', error);
          alert('Error al crear empleado!');
        }
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
    async saveEmployeeChanges() {
      if (this.$refs.editEmployeeForm.validate()) {
        try {
          await axios.post('https://elitemedicalbajio.online/rh/empleados/update', this.editingEmployee);
          this.fetchEmployees();
          this.closeEditEmployeeModal();
          alert('Empleado actualizado exitosamente!');
        } catch (error) {
          console.error('Error updating employee:', error);
          alert('Error al actualizar empleado!');
        }
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
    async confirmDelete() {
      try {
        if (this.itemToDelete.type === 'user') {
          await axios.delete(`https://elitemedicalbajio.online/rh/usuarios/delete/${this.itemToDelete.id}`);
          this.fetchUsers();
          alert('Usuario eliminado exitosamente!');
        } else if (this.itemToDelete.type === 'employee') {
          await axios.delete(`https://elitemedicalbajio.online/rh/empleados/delete/${this.itemToDelete.id}`);
          this.fetchEmployees();
          alert('Empleado eliminado exitosamente!');
        }
      } catch (error) {
        console.error(`Error deleting ${this.itemToDelete.type}:`, error);
        alert(`Error al eliminar ${this.itemToDelete.type === 'user' ? 'usuario' : 'empleado'}!`);
      }
      this.confirmDeleteDialog = false;
    },

    // Vacation Requests Management
    async fetchVacationRequests() {
      try {
        const response = await axios.get('https://elitemedicalbajio.online/rh/vacaciones/get');
        this.vacationRequests = response.data;
      } catch (error) {
        console.error('Error fetching vacation requests:', error);
      }
    },
    approveRequest(request) {
      request.estatus = 'APROBADA';
      this.updateVacationStatus(request);
    },
    rejectRequest(request) {
      request.estatus = 'RECHAZADA';
      this.updateVacationStatus(request);
    },
    async updateVacationStatus(request) {
      try {
        await axios.post('https://elitemedicalbajio.online/rh/vacaciones/update', request);
        this.fetchVacationRequests();
        alert('Solicitud de vacaciones actualizada exitosamente!');
      } catch (error) {
        console.error('Error updating vacation request:', error);
        alert('Error al actualizar solicitud de vacaciones!');
      }
    },

    // Logout
    logout() {
      const employeeStore = useEmployeeStore();
      employeeStore.logout(); // Use the logout method from the store
      this.$router.push('/login');
    },
  },
  created() {
    this.fetchUsers();
    this.fetchEmployees();
    this.fetchVacationRequests();
    this.fetchRoles();
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