<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Reporte de Evaluación del Estudiante</h1>

    <div v-if="loading" class="text-gray-500">Cargando información...</div>

    <div v-else>
      <h2 class="text-xl font-semibold mb-2">
        Estudiante: {{ student.firstName }} {{ student.lastName }}
      </h2>

      <h3 class="text-lg font-semibold mt-4">Evaluaciones:</h3>
      <ul v-if="suicideAssessments.length">
        <li v-for="(evalItem, index) in suicideAssessments" :key="evalItem._id" class="mb-3 p-4 border rounded shadow">
          <p><strong>Fecha:</strong> {{ new Date(evalItem.date).toLocaleString() }}</p>
          <p><strong>Observaciones:</strong> {{ evalItem.observations }}</p>
          <p><strong>Riesgo:</strong> {{ evalItem.riskLevel }}</p>
          <p><strong>Psicólogo:</strong> {{ evalItem.psychologist.name }}</p>
        </li>
      </ul>
      <div v-else>
        <p>No hay evaluaciones disponibles para este estudiante.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReportPDF',
  data() {
    return {
      student: {},
      suicideAssessments: [],
      loading: true
    };
  },
  async created() {
    await this.fetchStudentDetails();
    await this.fetchSuicideAssessments();
  },
  methods: {
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
        console.log('Detalles del estudiante:', this.student);
      } catch (error) {
        console.error('Error al obtener detalles del estudiante:', error);
      }
    },
    async fetchSuicideAssessments() {
      try {
        const token = localStorage.getItem('x-token');
        const studentId = this.$route.params.id;
        const response = await axios.get(
          `http://localhost:3000/api/suicide-assessments?studentId=${studentId}`,
          {
            headers: {
              'x-token': token
            }
          }
        );
        this.suicideAssessments = response.data.assessments;
        console.log('Evaluaciones:', this.suicideAssessments);
      } catch (error) {
        console.error('Error al cargar las evaluaciones:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Estilo opcional para embellecer */
</style>
