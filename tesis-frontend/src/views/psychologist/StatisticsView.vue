<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center">
      <p class="text-xl">Cargando estadísticas...</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 class="text-xl font-semibold mb-4">Estadísticas de Evaluaciones</h2>
      <p class="text-4xl font-bold mb-2">{{ statistics.total }}</p>
      <p class="text-gray-600 mb-4">Evaluaciones Totales</p>

      <div class="charts-container">
        <div class="chart-wrapper">
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
        <div class="chart-wrapper">
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
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'StatisticsView',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    const loading = ref(true);
    const statistics = ref({
      total: 0,
      riskLevels: [],
      genderStats: []
    });

    const riskChartOptions = {
      chart: {
        type: 'donut'
      },
      labels: ['Bajo', 'Moderado', 'Alto', 'Muy Alto'],
      colors: ['#4CAF50', '#FFC107', '#F44336', '#831010'],
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
                formatter: () => {
                  return statistics.value.total || 0;
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
      console.log('Datos de estadísticas:', statistics.value);
      const riskLevels = statistics.value.riskLevels || [];
      console.log('Niveles de riesgo:', riskLevels);
      
      const seriesData = [0, 0, 0, 0]; // [Bajo, Moderado, Alto, Muy Alto]
      
      riskLevels.forEach(level => {
        console.log('Procesando nivel:', level);
        // El _id es el nivel de riesgo
        if (level._id === 'BAJO') {
          seriesData[0] = level.count;
        } else if (level._id === 'MODERADO') {
          seriesData[1] = level.count;
        } else if (level._id === 'ALTO') {
          seriesData[2] = level.count;
        } else if (level._id === 'MUY_ALTO') {
          seriesData[3] = level.count;
        }
      });
      
      console.log('Serie de datos final:', seriesData);
      return seriesData;
    });

    const loadStatistics = async () => {
      try {
        const token = localStorage.getItem('x-token');
        if (!token) {
          console.error('No se encontró el token de autenticación');
          return;
        }

        console.log('Intentando cargar estadísticas...');
        const response = await fetch('http://localhost:3000/api/suicide-assessments/statistics', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token
          }
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.ok) {
          statistics.value = data.statistics;
          console.log('Estadísticas actualizadas:', statistics.value);
        } else {
          throw new Error(data.msg || 'Error al obtener estadísticas');
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        statistics.value = {
          total: 0,
          riskLevels: []
        };
      } finally {
        loading.value = false;
      }
    };

    loadStatistics();

    // Opciones para el gráfico de género
    const genderChartOptions = {
      chart: {
        type: 'donut'
      },
      labels: ['Masculino', 'Femenino'],
      colors: ['#3F51B5', '#E91E63'],
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
                formatter: () => {
                  return statistics.value.total || 0;
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

    // Series para el gráfico de género
    const genderChartSeries = computed(() => {
      const genderStats = statistics.value.genderStats || [];
      const seriesData = [0, 0]; // [Masculino, Femenino]

      genderStats.forEach(stat => {
        if (stat._id === 'M') {
          seriesData[0] = stat.count;
        } else if (stat._id === 'F') {
          seriesData[1] = stat.count;
        }
      });

      return seriesData;
    });

    return {
      loading,
      statistics,
      riskChartOptions,
      riskChartSeries,
      genderChartOptions,
      genderChartSeries
    };
  }
};
</script>

<style scoped>
.statistics-view {
  padding: 1.5rem;
}

.charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
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
