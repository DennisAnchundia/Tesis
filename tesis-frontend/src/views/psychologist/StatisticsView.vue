<template>
  <div class="statistics-container">
    <h1 class="text-center mb-4">Estadísticas</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="charts-container">
      <div class="row">
        <div class="col-md-4">
          <h3>Niveles de Riesgo</h3>
          <apexchart
            v-if="statistics.riskLevels.length > 0"
            type="donut"
            height="350"
            :options="riskChartOptions"
            :series="riskChartSeries"
          />
          <p v-else class="text-center text-gray-500">No hay datos disponibles</p>
        </div>
        <div class="col-md-4">
          <h3>Evaluaciones por Género</h3>
          <apexchart
            v-if="statistics.genderStats.length > 0"
            type="donut"
            height="350"
            :options="genderChartOptions"
            :series="genderChartSeries"
          />
          <p v-else class="text-center text-gray-500">No hay datos disponibles</p>
        </div>
        <div class="col-md-4">
          <h3>Evaluaciones por Carrera</h3>
          <apexchart
            v-if="statistics.careerStats.length > 0"
            type="donut"
            height="350"
            :options="careerChartOptions"
            :series="careerChartSeries"
          />
          <p v-else class="text-center text-gray-500">No hay datos disponibles</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineExpose, nextTick } from 'vue';
import axios from 'axios';

const loading = ref(true);
const statistics = ref({
  total: 0,
  riskLevels: [],
  genderStats: [],
  careerStats: []
});

const riskChartOptions = {
  chart: {
    type: 'donut'
  },
  labels: ['Bajo', 'Medio', 'Alto'],
  colors: ['#4CAF50', '#FFC107', '#F44336'],
  legend: {
    position: 'bottom'
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            }
          }
        }
      }
    }
  },
  noData: {
    text: 'No hay datos disponibles',
    align: 'center',
    verticalAlign: 'middle',
    offsetY: 0,
    style: {
      fontSize: '16px'
    }
  }
};

const riskChartSeries = computed(() => {
  const riskLevels = statistics.value.riskLevels || [];
  const seriesData = [0, 0, 0]; // [Bajo, Medio, Alto]

  riskLevels.forEach(level => {
    if (level._id === 'BAJO') {
      seriesData[0] = level.count;
    } else if (level._id === 'MODERADO') {
      seriesData[1] = level.count;
    } else if (level._id === 'ALTO') {
      seriesData[2] = level.count;
    }
  });

  return seriesData;
});

const loadStatistics = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('x-token');
    const response = await axios.get('http://localhost:3000/api/suicide-assessments/statistics', {
      headers: {
        'x-token': token
      }
    });

    if (response.data.ok) {
      statistics.value = response.data.statistics;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    loading.value = false;
  }
};

loadStatistics();

// Opciones para el gráfico de género
const genderChartOptions = {
  labels: ['Masculino', 'Femenino'],
  legend: {
    position: 'bottom'
  },
  colors: ['#4CAF50', '#E91E63'],
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total'
          }
        }
      }
    }
  }
};

// Opciones para el gráfico de carrera
const careerChartOptions = ref({
  legend: {
    position: 'bottom'
  },
  colors: ['#FF9800', '#2196F3', '#9C27B0', '#F44336', '#009688', '#795548'],
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total'
          }
        }
      }
    }
  },
  labels: []
});

// Series para el gráfico de género
const genderChartSeries = computed(() => {
  const genderStats = statistics.value.genderStats || [];
  const seriesData = [0, 0]; // [Masculino, Femenino]

  genderStats.forEach(stat => {
    if (stat._id === 'MASCULINO') {
      seriesData[0] = stat.count;
    } else if (stat._id === 'FEMENINO') {
      seriesData[1] = stat.count;
    }
  });

  return seriesData;
});

// Series para el gráfico de carrera
const careerChartSeries = computed(() => {
  const careerStats = statistics.value.careerStats || [];
  
  // Preparar datos y etiquetas
  const seriesData = [];
  const labels = [];
  
  careerStats.forEach(stat => {
    if (stat._id) {
      seriesData.push(stat.count);
      labels.push(stat._id);
    }
  });

    // Actualizar las etiquetas del gráfico en el siguiente tick para evitar efectos secundarios
  nextTick(() => {
    careerChartOptions.value.labels = labels;
  });

  return seriesData;
});

// Exportar las variables necesarias para el template
defineExpose({
  loading,
  statistics,
  riskChartOptions,
  riskChartSeries,
  genderChartOptions,
  genderChartSeries,
  careerChartOptions,
  careerChartSeries
});
</script>

<style scoped>
.statistics-container {
  padding: 2rem;
}

.charts-container {
  margin-top: 2rem;
}

.chart-title {
  text-align: center;
  margin-bottom: 1rem;
}

.chart-wrapper {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-wrapper h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.25rem;
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
</style>
