<!--
Componente StudentDetailsView

Este componente muestra la información detallada de un estudiante y permite su gestión.
Características principales:
- Visualización de información personal, académica y laboral
- Gestión de notas clínicas
- Gestión de citas médicas
- Evaluaciones de riesgo suicida
- Acciones de edición y eliminación del estudiante
-->

<template>
  <div class="student-details-container">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <div class="header-section">
      <button class="back-btn" @click="goBack">
        <i class="ri-arrow-left-line"></i> Volver
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="ri-loader-4-line loading-spinner"></i>
      <p>Cargando información del estudiante...</p>
    </div>

    <div v-else-if="student" class="student-profile">
      <div class="profile-header">
        <div class="profile-avatar">
          <i class="ri-user-3-line"></i>
        </div>
        <h1>{{ student.firstName }} {{ student.lastName }}</h1>
      </div>

      <div class="action-buttons">
        <button class="btn btn-warning" @click="editStudent">
          <i class="ri-edit-line"></i> Editar
        </button>
        <button class="btn btn-danger" @click="confirmDelete">
          <i class="ri-delete-bin-line"></i> Eliminar
        </button>
        <button class="btn btn-info" @click="addNote">
          <i class="ri-sticky-note-line"></i> Agregar Nota
        </button>
        <button class="btn btn-primary" @click="fetchAppointments">
          <i class="ri-calendar-2-line"></i> Citas Médicas
        </button>
      </div>

      <div class="info-sections">
        <div class="info-section">
          <h2><i class="ri-information-line"></i> Información Personal</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Edad:</label>
              <span>{{ student.age }} años</span>
            </div>
            <div class="info-item">
              <label>Género:</label>
              <span>{{ student.gender }}</span>
            </div>
            <div class="info-item">
              <label>Ciudad:</label>
              <span>{{ student.city }}</span>
            </div>
            <div class="info-item">
              <label>Teléfono:</label>
              <span>{{ student.phone }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ student.email }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2><i class="ri-graduation-cap-line"></i> Información Académica</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Nivel de Estudios:</label>
              <span>{{ student.level }}</span>
            </div>
            <div class="info-item">
              <label>Carrera:</label>
              <span>{{ student.career }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h2><i class="ri-briefcase-line"></i> Información Laboral</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Estado Laboral:</label>
              <span>{{ student.employmentStatus }}</span>
            </div>
            <div class="info-item">
              <label>Ingresos:</label>
              <span>{{ student.income ? `$${student.income}` : 'No especificado' }}</span>
            </div>
          </div>
        </div>

        <div class="info-section" v-if="student.assignedPsychologist">
          <h2><i class="ri-user-md-line"></i> Psicólogo Asignado</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Nombre completo:</label>
              <span>{{ student.assignedPsychologist.firstName }} {{ student.assignedPsychologist.lastName }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ student.assignedPsychologist.email }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="section-header">
            <h2><i class="ri-file-list-3-line"></i> Notas Clínicas</h2>
            <button class="btn btn-primary" @click="addNote">
              <i class="ri-add-line"></i> Nueva Nota
            </button>
          </div>
          
          <div class="notes-list">
            <div v-if="student.clinicalNotes && student.clinicalNotes.length > 0">
              <div v-for="note in student.clinicalNotes" :key="note._id" class="clinical-note">
                <div class="note-header">
                  <div class="note-metadata">
                    <span class="note-date">
                      <i class="ri-time-line"></i> {{ formatDate(note.createdAt) }}
                    </span>
                    <span class="note-author">
                      <i class="ri-user-line"></i> {{ getPsychologistName(note.createdBy) }}
                    </span>
                  </div>
                  <div class="note-actions">
                    <button class="btn btn-warning btn-sm" @click="editNote(note)">
                      <i class="ri-edit-line"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" @click="deleteNote(note._id)">
                      <i class="ri-delete-bin-line"></i> Eliminar
                    </button>
                  </div>
                </div>
                <div class="note-content">
                  {{ note.note }}
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="ri-clipboard-line"></i>
              <p>No hay notas clínicas registradas</p>
            </div>
          </div>
        </div>
        <div class="info-section">
          <div class="section-header">
            <h2><i class="ri-calendar-2-line"></i> Citas Médicas</h2>
            <div class="section-actions">
              <button class="btn btn-warning" @click="showSuicideAssessmentForm = true">
                <i class="ri-mental-health-line"></i> Realizar Evaluación
              </button>
              <button class="btn btn-primary" @click="showAppointmentForm = true">
                <i class="ri-add-line"></i> Nueva Cita
              </button>
            </div>
          </div>
          
          <div class="appointments-list">
            <div v-if="appointments && appointments.length > 0">
              <div v-for="appointment in appointments" :key="appointment._id" class="appointment-card">
                <div class="appointment-header">
                  <div class="appointment-metadata">
                    <span class="appointment-date">
                      <i class="ri-calendar-line"></i> {{ formatDate(appointment.date) }}
                    </span>
                    <span class="appointment-status" :class="'status-' + appointment.status.toLowerCase()">
                      {{ appointment.status === 'PENDIENTE' ? 'Pendiente' :
                         appointment.status === 'COMPLETADA' ? 'Completada' : 'Cancelada' }}
                    </span>
                    <span class="appointment-psychologist">
                      <i class="ri-user-star-line"></i> Dr. {{ appointment.psychologist.firstName }} {{ appointment.psychologist.lastName }}
                    </span>
                  </div>
                  <div class="appointment-actions" v-if="appointment.status === 'PENDIENTE'">
                    <select 
                      v-model="appointment.status" 
                      class="status-select"
                      @change="updateAppointmentStatus(appointment._id, $event.target.value)"
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="COMPLETADA">Completada</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                    <button class="btn btn-warning btn-sm" @click="editAppointment(appointment)">
                      <i class="ri-edit-line"></i> Editar
                    </button>
                    <button class="btn btn-danger btn-sm" @click="cancelAppointment(appointment._id)">
                      <i class="ri-close-circle-line"></i> Cancelar
                    </button>
                  </div>
                </div>
                <div class="appointment-details">
                  <div class="appointment-reason">
                    <strong>Motivo:</strong> {{ appointment.reason }}
                  </div>
                  <div class="appointment-notes" v-if="appointment.notes">
                    <strong>Notas:</strong> {{ appointment.notes }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <i class="ri-calendar-line"></i>
              <p>No hay citas programadas</p>
              <button class="btn btn-primary" @click="showAppointmentForm = true">
                <i class="ri-add-line"></i> Agendar Primera Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SuicideAssessmentForm
      v-if="showSuicideAssessmentForm"
      :studentId="$route.params.id"
      @close="showSuicideAssessmentForm = false"
      @assessment-created="onAssessmentCreated"
    />

    <div v-if="showAddNoteModal" class="modal-backdrop">
      <div class="modal-window">
        <div class="modal-header">
          <h3>{{ editingNote ? 'Editar Nota Clínica' : 'Nueva Nota Clínica' }}</h3>
          <button class="btn-close" @click="showAddNoteModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <textarea
            v-model="noteContent"
            class="form-control"
            rows="4"
            placeholder="Escribe la nota clínica aquí..."
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showAddNoteModal = false">Cancelar</button>
          <button class="btn btn-primary" @click="saveNote">Guardar</button>
        </div>
      </div>
    </div>

    <div v-if="showAppointmentForm" class="modal-backdrop">
      <div class="modal-window">
        <div class="modal-header">
          <h3>{{ editingAppointment ? 'Editar Cita' : 'Nueva Cita' }}</h3>
          <button class="btn-close" @click="showAppointmentForm = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="info-section" v-if="suicideAssessments.length > 0">
            <h2><i class="ri-mental-health-line"></i> Evaluaciones de Riesgo</h2>
            <div class="assessment-list">
              <div v-for="assessment in suicideAssessments" :key="assessment._id" class="assessment-card">
                <div class="assessment-header">
                  <span class="assessment-date">
                    <i class="ri-calendar-line"></i> {{ formatDate(assessment.date) }}
                  </span>
                  <span :class="['risk-level', 'risk-' + assessment.riskLevel.toLowerCase()]">
                    Riesgo: {{ assessment.riskLevel }}
                  </span>
                </div>
                <div class="assessment-details">
                  <div v-if="assessment.deathWish.present" class="assessment-item">
                    <strong>Deseos de morir:</strong> {{ assessment.deathWish.description }}
                  </div>
                  <div v-if="assessment.nonSpecificActiveSuicidalThoughts.present" class="assessment-item">
                    <strong>Pensamientos suicidas:</strong> {{ assessment.nonSpecificActiveSuicidalThoughts.description }}
                  </div>
                  <div v-if="assessment.activeSuicidalIdeationWithMethods.present" class="assessment-item">
                    <strong>Ideación con métodos:</strong> {{ assessment.activeSuicidalIdeationWithMethods.description }}
                  </div>
                  <div v-if="assessment.activeSuicidalIdeationWithIntent.present" class="assessment-item">
                    <strong>Ideación con intención:</strong> {{ assessment.activeSuicidalIdeationWithIntent.description }}
                  </div>
                  <div v-if="assessment.activeSuicidalIdeationWithPlan.present" class="assessment-item">
                    <strong>Ideación con plan:</strong> {{ assessment.activeSuicidalIdeationWithPlan.description }}
                  </div>
                  <div v-if="assessment.observations" class="assessment-item">
                    <strong>Observaciones:</strong> {{ assessment.observations }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AppointmentForm
            :student-id="$route.params.id"
            @created="onAppointmentCreated"
            @cancel="showAppointmentForm = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import AppointmentForm from '@/components/AppointmentForm.vue'
import SuicideAssessmentForm from '@/components/SuicideAssessmentForm.vue'

/**
 * Componente para visualizar y gestionar los detalles de un estudiante
 * @component
 */
export default {
  name: 'StudentDetailsView',
  components: {
    AppointmentForm,
    SuicideAssessmentForm
  },
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial con datos del estudiante, citas, notas y formularios
   */
  data() {
    return {
      student: null,
      loading: true,
      showAddNoteModal: false,
      showAppointmentForm: false,
      noteContent: '',
      editingNote: false,
      editingNoteId: null,
      appointments: [],
      editingAppointment: null,
      psychologists: {},
      showSuicideAssessmentForm: false,
      suicideAssessments: []
    }
  },
  /**
   * Ciclo de vida: Se ejecuta cuando el componente es creado
   * Carga los detalles del estudiante y sus citas
   */
  async created() {
    await this.fetchStudentDetails()
    await this.fetchAppointments()
    await this.fetchSuicideAssessments()
  },
  /**
   * Métodos del componente para manejar la lógica de negocio
   */
  methods: {
    /**
     * Obtiene la lista de citas del estudiante desde el servidor
     * @async
     */
    async fetchAppointments() {
      try {
        const token = localStorage.getItem('x-token');
        const response = await axios.get(
          `http://localhost:3000/api/appointments?studentId=${this.$route.params.id}`,
          {
            headers: {
              'x-token': token
            }
          }
        );
        this.appointments = response.data.appointments;
      } catch (error) {
        console.error('Error al cargar las citas:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las citas'
        });
      }
    },

    /**
     * Muestra el formulario para agregar una nueva nota clínica
     */
    addNote() {
      this.editingNote = null;
      this.editingNoteId = null;
      this.noteContent = '';
      this.showAddNoteModal = true;
    },
    /**
     * Prepara el formulario para editar una nota existente
     * @param {Object} note - Nota a editar
     */
    editNote(note) {
      this.editingNote = note;
      this.editingNoteId = note._id;
      this.noteContent = note.note;
      this.showAddNoteModal = true;
    },
    /**
     * Obtiene el nombre completo del psicólogo
     * @param {Object} psychologist - Datos del psicólogo
     * @returns {string} Nombre completo del psicólogo
     */
    getPsychologistName(psychologist) {
      if (!psychologist) return 'No asignado';
      return `${psychologist.firstName} ${psychologist.lastName}`;
    },
    /**
     * Obtiene la información detallada de un psicólogo
     * @param {string} psychologistId - ID del psicólogo
     * @async
     */
    async fetchPsychologistInfo(psychologistId) {
      if (!this.psychologists[psychologistId]) {
        try {
          const token = localStorage.getItem('x-token');
          const response = await axios.get(`http://localhost:3000/api/psychologists/${psychologistId}`, {
            headers: {
              'x-token': token
            }
          });
          this.psychologists[psychologistId] = response.data;
        } catch (error) {
          console.error('Error al obtener información del psicólogo:', error);
          this.psychologists[psychologistId] = { firstName: 'No', lastName: 'encontrado' };
        }
      }
    },
    /**
     * Formatea una fecha para su visualización
     * @param {string} date - Fecha en formato ISO
     * @returns {string} Fecha formateada
     */
    formatDate(date) {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    /**
     * Obtiene los detalles completos del estudiante
     * @async
     */
    async fetchStudentDetails() {
      try {
        const token = localStorage.getItem('x-token');
        const studentId = this.$route.params.id;
        const response = await axios.get(`http://localhost:3000/api/students/${studentId}`, {
          headers: {
            'x-token': token
          }
        });
        this.student = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error al obtener detalles del estudiante:', error);
        this.loading = false;
      }
    },
    /**
     * Guarda o actualiza una nota clínica
     * @async
     */
    async saveNote() {
      try {
        const token = localStorage.getItem('x-token');
        const studentId = this.$route.params.id;

        let response;
        if (this.editingNote) {
          response = await axios.put(
            `http://localhost:3000/api/students/${studentId}/clinical-notes/${this.editingNoteId}`,
            { note: this.noteContent },
            {
              headers: {
                'x-token': token
              }
            }
          );
        } else {
          response = await axios.post(
            `http://localhost:3000/api/students/${studentId}/clinical-notes`,
            { note: this.noteContent },
            {
              headers: {
                'x-token': token
              }
            }
          );
        }

        await Swal.fire({
          icon: 'success',
          title: this.editingNote ? 'Nota actualizada' : 'Nota agregada',
          text: response.data.msg || 'La nota ha sido guardada exitosamente'
        });

        this.noteContent = '';
        this.editingNote = null;
        this.editingNoteId = null;
        this.showAddNoteModal = false;
        await this.fetchStudentDetails();
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al guardar la nota'
        });
      }
    },
    /**
     * Elimina una nota clínica
     * @param {string} noteId - ID de la nota a eliminar
     * @async
     */
    async deleteNote(noteId) {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
          const token = localStorage.getItem('x-token')
          const studentId = this.$route.params.id

          const response = await axios.delete(
            `http://localhost:3000/api/students/${studentId}/clinical-notes/${noteId}`,
            {
              headers: {
                'x-token': token
              }
            }
          )

          await Swal.fire({
            icon: 'success',
            title: 'Nota eliminada',
            text: response.data.msg || 'La nota ha sido eliminada exitosamente'
          })
          this.$router.push('/psychologist/dashboard/patients')

          await this.fetchStudentDetails()
        }
      } catch (error) {
        console.error('Error:', error)
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al eliminar la nota'
        })
      }
    },
    /**
     * Navega a la vista de edición del estudiante
     */
    editStudent() {
      this.$router.push(`/psychologist/dashboard/patients/${this.$route.params.id}/edit`);
    },
    /**
     * Muestra un diálogo de confirmación para eliminar al estudiante
     * @async
     */
    async confirmDelete() {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        await this.deleteStudent()
      }
      
    },
    /**
     * Elimina al estudiante del sistema
     * @async
     */
    async deleteStudent() {
      try {
        const token = localStorage.getItem('x-token');
        await axios.delete(
          `http://localhost:3000/api/students/${this.$route.params.id}`,
          {
            headers: {
              'x-token': token
            }
          }
        );

        await Swal.fire({
          icon: 'success',
          title: 'Estudiante Eliminado',
          text: 'El estudiante ha sido eliminado exitosamente'
        });

        this.$router.push('/psychologist/dashboard/patients');
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al eliminar el estudiante'
        });
      }
    },

    /**
     * Maneja la creación exitosa de una cita
     * @param {Object} appointment - Datos de la nueva cita
     */
    onAppointmentCreated(appointment) {
      this.appointments.push(appointment);
      this.appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
      this.showAppointmentForm = false;
      Swal.fire({
        icon: 'success',
        title: '¡Cita Agendada!',
        text: 'La cita ha sido agendada exitosamente'
      });
    },

    /**
     * Prepara el formulario para editar una cita
     * @param {Object} appointment - Cita a editar
     */
    async editAppointment(appointment) {
      this.editingAppointment = appointment;
      this.showAppointmentForm = true;
    },

    /**
     * Actualiza el estado de una cita
     * @param {string} appointmentId - ID de la cita
     * @param {string} newStatus - Nuevo estado de la cita
     * @async
     */
    async updateAppointmentStatus(appointmentId, newStatus) {
      try {
        const token = localStorage.getItem('x-token');
        await axios.put(
          `http://localhost:3000/api/appointments/${appointmentId}`,
          { status: newStatus },
          {
            headers: {
              'x-token': token
            }
          }
        );

        await Swal.fire({
          icon: 'success',
          title: 'Estado Actualizado',
          text: 'El estado de la cita ha sido actualizado exitosamente'
        });

        await this.fetchAppointments();
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Error al actualizar el estado de la cita'
        });
        await this.fetchAppointments(); // Recargar para restaurar el estado anterior
      }
    },

    /**
     * Cancela una cita programada
     * @param {string} appointmentId - ID de la cita a cancelar
     * @async
     */
    async cancelAppointment(appointmentId) {
      const result = await Swal.fire({
        title: '¿ Estás seguro?',
        text: 'La cita será cancelada',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No'
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('x-token');
          await axios.delete(
            `http://localhost:3000/api/appointments/${appointmentId}`,
            {
              headers: {
                'x-token': token
              }
            }
          );

          await Swal.fire({
            icon: 'success',
            title: 'Cita Cancelada',
            text: 'La cita ha sido cancelada exitosamente'
          });

          await this.fetchAppointments();
        } catch (error) {
          console.error('Error:', error);
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.msg || 'Error al cancelar la cita'
          });
        }
      }
    },
    /**
     * Muestra el formulario para programar una nueva cita
     */
    scheduleAppointment() {
      this.$router.push(`/psychologist/appointments/new?studentId=${this.$route.params.id}`)
    },
    /**
     * Obtiene las evaluaciones de riesgo suicida del estudiante
     * @async
     */
    async fetchSuicideAssessments() {
      try {
        const token = localStorage.getItem('x-token');
        const response = await axios.get(
          `http://localhost:3000/api/suicide-assessments?studentId=${this.$route.params.id}`,
          {
            headers: {
              'x-token': token
            }
          }
        );
        this.suicideAssessments = response.data.assessments;
      } catch (error) {
        console.error('Error al cargar las evaluaciones:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las evaluaciones'
        });
      }
    },
    /**
     * Maneja la creación exitosa de una evaluación
     * @param {Object} assessment - Datos de la nueva evaluación
     */
    onAssessmentCreated(assessment) {
      this.suicideAssessments.unshift(assessment);
      Swal.fire({
        icon: 'success',
        title: 'Evaluación Registrada',
        text: `Nivel de riesgo detectado: ${assessment.riskLevel}`
      });
    },
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista de detalles del estudiante */
.student-details-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  color: #333;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar i {
  font-size: 2.5rem;
  color: #6c757d;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn i {
  font-size: 1.1rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-warning {
  background-color: #ffc107;
  color: #000;
}

.btn-warning:hover {
  background-color: #e0a800;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-info:hover {
  background-color: #138496;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.info-sections {
  display: grid;
  gap: 2rem;
}

.info-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info-section h2 {
  color: #343a40;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin-bottom: 0;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.clinical-note {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #dee2e6;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.note-metadata {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.note-date, .note-author {
  color: #6c757d;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.note-content {
  color: #212529;
  line-height: 1.5;
  white-space: pre-wrap;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.empty-state i {
  font-size: 2.5rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #dee2e6;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.appointment-metadata {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.appointment-date {
  color: #495057;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.appointment-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pendiente {
  background-color: #fff3cd;
  color: #856404;
}

.status-completada {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelada {
  background-color: #f8d7da;
  color: #721c24;
}

.appointment-actions {
  display: flex;
  gap: 0.5rem;
}

.appointment-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.appointment-reason,
.appointment-notes {
  color: #212529;
  line-height: 1.5;
}

.appointment-reason strong,
.appointment-notes strong {
  color: #495057;
  margin-right: 0.5rem;
}

.appointment-psychologist {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  font-size: 0.875rem;
}

.status-select {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: white;
  font-size: 0.875rem;
  color: #495057;
  cursor: pointer;
  margin-right: 0.5rem;
}

.status-select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
}

.status-select option {
  padding: 0.5rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #343a40;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.25rem;
  cursor: pointer;
  color: #6c757d;
}

.btn-close:hover {
  color: #343a40;
}

.section-actions {
  display: flex;
  gap: 1rem;
}

.assessment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.assessment-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
}

.assessment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.assessment-date {
  color: #6c757d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.risk-level {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.risk-bajo {
  background-color: #d1e7dd;
  color: #0f5132;
}

.risk-moderado {
  background-color: #fff3cd;
  color: #856404;
}

.risk-alto {
  background-color: #f8d7da;
  color: #842029;
}

.risk-muy_alto {
  background-color: #dc3545;
  color: white;
}

.assessment-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assessment-item {
  font-size: 0.9rem;
  color: #495057;
}

.assessment-item strong {
  color: #2c3e50;
  margin-right: 0.5rem;
}

.info-section h2 i {
  color: #6c757d;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item label {
  color: #6c757d;
  font-size: 0.9rem;
}

.info-item span {
  color: #333;
  font-size: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.clinical-note {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.note-metadata {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.note-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.note-author {
  color: #495057;
  font-size: 0.9rem;
}

.note-content {
  color: #212529;
  white-space: pre-wrap;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-window {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 1rem;
}

.note-input {
  width: 100%;
  min-height: 150px;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.evaluations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.evaluation-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.evaluation-metadata {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.evaluation-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.evaluation-author {
  color: #495057;
  font-size: 0.9rem;
}

.evaluation-risk {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: bold;
}

.risk-low {
  background-color: #28a745;
  color: white;
}

.risk-moderate {
  background-color: #ffc107;
  color: black;
}

.risk-high {
  background-color: #fd7e14;
  color: white;
}

.risk-very-high {
  background-color: #dc3545;
  color: white;
}

.evaluation-details {
  background: white;
  padding: 1rem;
  border-radius: 4px;
}

.eval-section {
  margin-bottom: 1rem;
}

.eval-section h4 {
  color: #495057;
  margin-bottom: 0.5rem;
}

.eval-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.eval-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.eval-item label {
  color: #6c757d;
  font-size: 0.9rem;
}

.eval-item .positive {
  color: #dc3545;
  font-weight: bold;
}

.eval-item .negative {
  color: #28a745;
}

.attention-required {
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.attention-required i {
  font-size: 1.2rem;
}
</style>
