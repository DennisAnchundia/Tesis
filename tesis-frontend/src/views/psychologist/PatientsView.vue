<!--
Componente PatientsView

Este componente maneja la vista de pacientes del psicólogo, permitiendo:
- Listar todos los pacientes asignados
- Buscar pacientes por nombre
- Agregar nuevos pacientes
- Editar información de pacientes existentes
- Ver detalles de cada paciente

Características:
- Formulario modal con validación en tiempo real
- Búsqueda dinámica de pacientes
- Manejo de estados de carga
- Notificaciones de éxito/error usando SweetAlert2
-->

<template>
  <div class="patients-view">
    <div class="header-section">
      <div class="title-section">
        <h2>Mis Pacientes</h2>
        <span class="patient-count">{{ users.length }} pacientes en total</span>
      </div>
      <div class="search-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Buscar paciente..."
            @input="filterPatients"
          >
        </div>
        <button class="add-btn" @click="showModal = true">
          <i class="fas fa-plus"></i>
          Agregar Estudiante
        </button>
      </div>
    </div>

    <!-- Modal para crear/editar estudiante -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedStudent ? 'Editar' : 'Agregar' }} Estudiante</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveStudent">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input 
                  type="text" 
                  v-model="formData.firstName"
                  @input="validateField('firstName')"
                  required
                  placeholder="Ingrese el nombre"
                  :class="{ 'error': formErrors.firstName }"
                >
                <span class="error-text" v-if="formErrors.firstName">{{ formErrors.firstName }}</span>
              </div>

              <div class="form-group">
                <label>Apellido *</label>
                <input 
                  type="text" 
                  v-model="formData.lastName"
                  @input="validateField('lastName')"
                  required
                  placeholder="Ingrese el apellido"
                  :class="{ 'error': formErrors.lastName }"
                >
                <span class="error-text" v-if="formErrors.lastName">{{ formErrors.lastName }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Edad *</label>
                <input 
                  type="number" 
                  v-model="formData.age"
                  @input="validateField('age')"
                  required
                  min="0"
                  max="100"
                  :class="{ 'error': formErrors.age }"
                >
                <span class="error-text" v-if="formErrors.age">{{ formErrors.age }}</span>
              </div>

              <div class="form-group">
                <label>Ciudad *</label>
                <input 
                  type="text" 
                  v-model="formData.city"
                  @input="validateField('city')"
                  required
                  placeholder="Ingrese la ciudad"
                  :class="{ 'error': formErrors.city }"
                >
                <span class="error-text" v-if="formErrors.city">{{ formErrors.city }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Teléfono *</label>
                <input 
                  type="text" 
                  v-model="formData.phone"
                  @input="validateField('phone')"
                  required
                  placeholder="Ingrese el teléfono"
                  :class="{ 'error': formErrors.phone }"
                >
                <span class="error-text" v-if="formErrors.phone">{{ formErrors.phone }}</span>
              </div>

              <div class="form-group">
                <label>Género *</label>
                <select 
                  v-model="formData.gender"
                  @change="validateField('gender')"
                  required
                  :class="{ 'error': formErrors.gender }"
                >
                  <option value="">Seleccione género</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                </select>
                <span class="error-text" v-if="formErrors.gender">{{ formErrors.gender }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Nivel de Estudios *</label>
                <input 
                  type="text" 
                  v-model="formData.level"
                  @input="validateField('level')"
                  required
                  placeholder="Ingrese el nivel de estudios"
                  :class="{ 'error': formErrors.level }"
                >
                <span class="error-text" v-if="formErrors.level">{{ formErrors.level }}</span>
              </div>

              <div class="form-group">
                <label>Estado Laboral *</label>
                <select 
                  v-model="formData.employmentStatus"
                  @change="validateField('employmentStatus')"
                  required
                  :class="{ 'error': formErrors.employmentStatus }"
                >
                  <option value="">Seleccione estado</option>
                  <option value="EMPLEADO">Empleado</option>
                  <option value="DESEMPLEADO">Desempleado</option>
                  <option value="ESTUDIANTE">Estudiante</option>
                </select>
                <span class="error-text" v-if="formErrors.employmentStatus">{{ formErrors.employmentStatus }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Ingresos</label>
                <input 
                  type="number" 
                  v-model="formData.income"
                  @input="validateField('income')"
                  placeholder="Ingrese los ingresos"
                  :class="{ 'error': formErrors.income }"
                >
                <span class="error-text" v-if="formErrors.income">{{ formErrors.income }}</span>
              </div>

              <div class="form-group">
                <label>Carrera *</label>
                <input 
                  type="text" 
                  v-model="formData.career"
                  @input="validateField('career')"
                  required
                  placeholder="Ingrese la carrera"
                  :class="{ 'error': formErrors.career }"
                >
                <span class="error-text" v-if="formErrors.career">{{ formErrors.career }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  v-model="formData.email"
                  @input="validateField('email')"
                  required
                  placeholder="ejemplo@dominio.com"
                  :class="{ 'error': formErrors.email }"
                >
                <span class="error-text" v-if="formErrors.email">{{ formErrors.email }}</span>
              </div>

              <div class="form-group" v-if="!selectedStudent">
                <label>Contraseña *</label>
                <input 
                  type="password" 
                  v-model="formData.password"
                  @input="validateField('password')"
                  required
                  placeholder="Mínimo 6 caracteres"
                  :class="{ 'error': formErrors.password }"
                >
                <span class="error-text" v-if="formErrors.password">{{ formErrors.password }}</span>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                {{ selectedStudent ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Cargando información de pacientes...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="patients-table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Carrera</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id" @click="viewStudentDetails(user)" class="student-row">
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.career }}</td>
            <td class="actions">
              <button class="action-btn edit-btn" title="Editar" @click.stop="editStudent(user)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn notes-btn" title="Notas" @click.stop>
                <i class="fas fa-notes-medical"></i>
              </button>
              <button class="action-btn calendar-btn" title="Agendar" @click.stop>
                <i class="fas fa-calendar-plus"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/**
 * Importación de dependencias
 * @requires axios - Cliente HTTP para realizar peticiones al servidor
 * @requires sweetalert2 - Biblioteca para mostrar notificaciones elegantes
 */
import axios from 'axios'
import Swal from 'sweetalert2'

/**
 * Componente para gestionar la lista de pacientes del psicólogo
 * @component
 */
export default {
  name: 'PatientsView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial con datos de pacientes, formulario y validación
   */
  data() {
    return {
      users: [],
      filteredUsers: [],
      loading: true,
      error: null,
      searchTerm: '',
      showModal: false,
      selectedStudent: null,
      formData: {
        firstName: '',
        lastName: '',
        age: '',
        city: '',
        phone: '',
        gender: '',
        level: '',
        employmentStatus: '',
        income: '',
        career: '',
        email: '',
        password: ''
      },
      formErrors: {}
    }
  },
  /**
   * Ciclo de vida: Se ejecuta cuando el componente es creado
   * Carga la lista inicial de pacientes
   */
  async created() {
    await this.fetchUsers()
  },
  /**
   * Métodos del componente para manejar la lógica de negocio
   */
  methods: {
    /**
     * Obtiene la lista de pacientes desde el servidor
     * @async
     */
    async fetchUsers() {
      try {
        this.loading = true
        this.error = null
        const token = localStorage.getItem('x-token')
        const response = await axios.get('http://localhost:3000/api/students', {
          headers: {
            'x-token': token
          }
        })

        this.users = response.data.students
        this.filteredUsers = this.users
      } catch (err) {
        this.error = 'Error al cargar los pacientes: ' + (err.response?.data?.message || err.message)
        console.error('Error:', err)
      } finally {
        this.loading = false
      }
    },
    /**
     * Genera las iniciales del nombre completo del paciente
     * @param {string} firstName - Nombre del paciente
     * @param {string} lastName - Apellido del paciente
     * @returns {string} Iniciales en mayúsculas
     */
    getInitials(firstName, lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    },
    /**
     * Filtra la lista de pacientes según el término de búsqueda
     * Actualiza la lista filtrada en tiempo real
     */
    filterPatients() {
      const searchLower = this.searchTerm.toLowerCase()
      this.filteredUsers = this.users.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower)
      )
    },
    /**
     * Cierra el modal y reinicia el formulario
     * Limpia los errores de validación
     */
    closeModal() {
      this.showModal = false
      this.selectedStudent = null
      this.formData = {
        firstName: '',
        lastName: '',
        age: '',
        city: '',
        phone: '',
        gender: '',
        level: '',
        employmentStatus: '',
        income: '',
        career: '',
        email: '',
        password: ''
      }
      this.formErrors = {}
    },
    /**
     * Valida un campo específico del formulario
     * @param {string} field - Nombre del campo a validar
     */
    validateField(field) {
      this.formErrors[field] = ''

      const value = this.formData[field]?.toString().trim() || ''
      const age = field === 'age' ? parseInt(value) : null
      const income = field === 'income' && value !== '' ? parseFloat(value) : null

      switch (field) {
        case 'firstName':
        case 'lastName':
          if (!value) {
            this.formErrors[field] = `El ${field === 'firstName' ? 'nombre' : 'apellido'} es requerido`
          } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,30}$/.test(value)) {
            this.formErrors[field] = `El ${field === 'firstName' ? 'nombre' : 'apellido'} solo debe contener letras y espacios (2-30 caracteres)`
          }
          break

        case 'age':
          if (!value) {
            this.formErrors.age = 'La edad es requerida'
          } else if (isNaN(age) || age < 0 || age > 100) {
            this.formErrors.age = 'La edad debe estar entre 0 y 100 años'
          }
          break

        case 'city':
          if (!value) {
            this.formErrors.city = 'La ciudad es requerida'
          } else if (value.length < 2 || value.length > 50) {
            this.formErrors.city = 'La ciudad debe tener entre 2 y 50 caracteres'
          }
          break

        case 'phone':
          if (!value) {
            this.formErrors.phone = 'El teléfono es requerido'
          } else if (!/^\+?[\d\s-]{6,15}$/.test(value)) {
            this.formErrors.phone = 'Formato de teléfono inválido'
          }
          break

        case 'gender':
          if (!value) {
            this.formErrors.gender = 'El género es requerido'
          }
          break

        case 'level':
          if (!value) {
            this.formErrors.level = 'El nivel de estudios es requerido'
          } else if (value.length < 2 || value.length > 50) {
            this.formErrors.level = 'El nivel de estudios debe tener entre 2 y 50 caracteres'
          }
          break

        case 'employmentStatus':
          if (!value) {
            this.formErrors.employmentStatus = 'El estado laboral es requerido'
          }
          break

        case 'income':
          if (value !== '') {
            if (isNaN(income) || income < 0) {
              this.formErrors.income = 'Los ingresos no pueden ser negativos'
            }
          }
          break

        case 'career':
          if (!value) {
            this.formErrors.career = 'La carrera es requerida'
          } else if (value.length < 2 || value.length > 50) {
            this.formErrors.career = 'La carrera debe tener entre 2 y 50 caracteres'
          }
          break

        case 'email':
          if (!value) {
            this.formErrors.email = 'El email es requerido'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.formErrors.email = 'Email inválido'
          }
          break

        case 'password':
          if (!this.selectedStudent) { // Solo validar contraseña para nuevos estudiantes
            if (!value) {
              this.formErrors.password = 'La contraseña es requerida'
            } else if (value.length < 6) {
              this.formErrors.password = 'La contraseña debe tener al menos 6 caracteres'
            }
          }
          break
      }
    },
    /**
     * Guarda o actualiza la información de un paciente
     * @async
     * Realiza validación completa antes de enviar al servidor
     */
    async saveStudent() {
      const fieldsToValidate = Object.keys(this.formData).filter(field => 
        field !== 'password' || !this.selectedStudent
      )

      fieldsToValidate.forEach(field => {
        if (field !== 'income' || this.formData[field]) { // income es opcional
          this.validateField(field)
        }
      })

      const hasErrors = Object.values(this.formErrors).some(error => error !== '')

      if (hasErrors) {
        const errorMessages = Object.values(this.formErrors)
          .filter(error => error !== '')
          .join('\n')

        Swal.fire({
          icon: 'error',
          title: 'Error de validación',
          text: errorMessages
        })
        return
      }

      try {
        const token = localStorage.getItem('x-token')
        const url = 'http://localhost:3000/api/students'
        const method = this.selectedStudent ? 'PUT' : 'POST'
        const endpoint = this.selectedStudent ? `${url}/${this.selectedStudent._id}` : url

        const dataToSend = { ...this.formData }
        if (this.selectedStudent) {
          delete dataToSend.password
        }

        const response = await axios({
          method,
          url: endpoint,
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          },
          data: dataToSend
        })

        const data = response.data

        if (response.status === 201 || response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: data.msg || (this.selectedStudent ? 'Estudiante actualizado correctamente' : 'Estudiante creado correctamente')
          })
          this.closeModal()
          await this.fetchUsers()
        } else {
          throw new Error(data.msg || 'Error al procesar la solicitud')
        }
      } catch (error) {
        console.error('Error:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || error.message || 'Error al procesar la solicitud'
        })
      }
    },
    /**
     * Prepara el formulario para editar un paciente existente
     * @param {Object} student - Datos del paciente a editar
     */
    editStudent(student) {
      this.selectedStudent = student
      this.formData = {
        firstName: student.firstName,
        lastName: student.lastName,
        age: student.age,
        city: student.city,
        phone: student.phone,
        gender: student.gender,
        level: student.level,
        employmentStatus: student.employmentStatus,
        income: student.income,
        career: student.career,
        email: student.email,
        password: '' // No incluimos la contraseña en la edición
      }
      this.showModal = true
    },
    /**
     * Navega a la vista de detalles del paciente
     * @param {Object} student - Datos del paciente a visualizar
     */
    viewStudentDetails(student) {
      console.log('Navigating to student:', student)
      this.$router.push(`/psychologist/dashboard/patients/${student._id}`)
    }
  },
  /**
   * Propiedades computadas del componente
   */
  computed: {
    /**
     * Verifica si el formulario es válido para enviar
     * @returns {boolean} true si no hay errores de validación
     */
    isFormValid() {
      return Object.values(this.formErrors).every(error => error === '')
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista de pacientes */
.patients-view {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100%;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title-section h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.patient-count {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: block;
}

.search-section {
  flex: 0 0 300px;
}

.search-box {
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 35px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #3e8e41;
}

.loading-state {
  text-align: center;
  padding: 3rem;
}

.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #42b983;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  color: #dc3545;
  padding: 2rem;
}

.error-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.patients-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.patients-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.patients-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #dee2e6;
}

.student-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.student-row:hover {
  background-color: #f8f9fa;
}

.student-row td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn {
  background-color: #e3f2fd;
  color: #1976d2;
}

.edit-btn {
  background-color: #fff3cd;
  color: #ffc107;
}

.edit-btn:hover {
  background-color: #ffe69c;
}

.notes-btn {
  background-color: #fff3e0;
  color: #f57c00;
}

.calendar-btn {
  background-color: #e8f5e9;
  color: #43a047;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.student-row .actions {
  pointer-events: none;
}

.student-row .action-btn {
  pointer-events: all;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.close-btn {
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1rem;
}

label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #495057;
}

input, select {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

input:focus, select:focus {
  color: #495057;
  background-color: #fff;
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.error-text {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary:hover {
  background-color: #3e8e41;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }

  .search-section {
    width: 100%;
  }

  .patients-table th:nth-child(1),
  .patients-table td:nth-child(1) {
    display: none;
  }
}
</style>
