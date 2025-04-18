<!--
Componente ProfileView

Este componente implementa la vista de perfil del administrador.
Características:
- Información personal del administrador
- Estadísticas del sistema
- Actividad reciente
- Avatar dinámico con iniciales
- Diseño responsivo y moderno
-->

<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="cover-photo"></div>
      <div class="profile-info-container">
        <div class="profile-avatar">
          <div class="avatar-circle">
            <span class="initials">{{ getInitials }}</span>
          </div>
        </div>
        <div class="profile-details">
          <h1>{{ adminData.firstName }} {{ adminData.lastName }}</h1>
          <span class="role-badge">Administrador</span>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="info-card personal-info">
        <div class="card-header">
          <i class="fas fa-user-shield"></i>
          <h2>Información Personal</h2>
        </div>
        <div class="card-content">
          <div class="info-group">
            <label>Nombre Completo</label>
            <p>{{ adminData.firstName }} {{ adminData.lastName }}</p>
          </div>
          <div class="info-group">
            <label>Correo Electrónico</label>
            <p>{{ adminData.email }}</p>
          </div>
          <div class="info-group">
            <label>Rol del Sistema</label>
            <p>{{ adminData.role }}</p>
          </div>
        </div>
      </div>

      <div class="info-card stats">
        <div class="card-header">
          <i class="fas fa-chart-pie"></i>
          <h2>Estadísticas del Sistema</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{{ psychologistsCount }}</span>
            <span class="stat-label">Psicólogos Activos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ studentsCount }}</span>
            <span class="stat-label">Estudiantes Registrados</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">98%</span>
            <span class="stat-label">Uptime del Sistema</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Soporte Disponible</span>
          </div>
        </div>
      </div>

      <div class="info-card activity">
        <div class="card-header">
          <i class="fas fa-clock"></i>
          <h2>Actividad Reciente</h2>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivities" :key="activity._id" class="activity-item">
            <i :class="getActivityIcon(activity.type)"></i>
            <div class="activity-details">
              <p class="activity-text">{{ activity.description }}</p>
              <span class="activity-time">{{ formatTimestamp(activity.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Componente de vista de perfil del administrador
 * @component
 */
export default {
  name: 'ProfileView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial del perfil
   */
  data() {
    return {
      adminData: {
        firstName: '',
        lastName: '',
        email: '',
        role: ''
      },
      psychologistsCount: 0,
      studentsCount: 0,
      loading: true,
      error: null,
      recentActivities: []
    }
  },
  /**
   * Propiedades computadas del componente
   */
  computed: {
    /**
     * Calcula las iniciales del nombre del administrador
     * @returns {string} Iniciales en mayúsculas
     */
    getInitials() {
      return `${this.adminData.firstName.charAt(0)}${this.adminData.lastName.charAt(0)}`.toUpperCase()
    }
  },
  /**
   * Ciclo de vida: Se ejecuta al crear el componente
   * Carga los datos iniciales del perfil
   */
  async created() {
    await this.fetchAdminData()
    await this.fetchStats()
    await this.fetchRecentActivities()
  },
  /**
   * Métodos del componente
   */
  methods: {
    /**
     * Obtiene los datos del administrador desde el servidor
     * @async
     */
    async fetchAdminData() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch('http://localhost:3000/api/users/admin', {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        this.adminData = data
      } catch (err) {
        this.error = 'Error al cargar datos del administrador'
        console.error('Error:', err)
      }
    },
    /**
     * Obtiene las estadísticas del sistema
     * @async
     */
    async fetchStats() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch('http://localhost:3000/api/users', {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        this.psychologistsCount = data.psychologists.length
        this.studentsCount = data.students?.length || 0
      } catch (err) {
        console.error('Error fetching stats:', err)
      }
    },
    /**
     * Obtiene el historial de actividades recientes
     * @async
     */
    async fetchRecentActivities() {
      try {
        const token = localStorage.getItem('x-token')
        const response = await fetch('http://localhost:3000/api/activities', {
          headers: {
            'x-token': token
          }
        })
        const data = await response.json()
        this.recentActivities = data
      } catch (err) {
        console.error('Error fetching recent activities:', err)
      }
    },
    /**
     * Determina el icono a mostrar según el tipo de actividad
     * @param {string} type - Tipo de actividad
     * @returns {string} Clase CSS del icono
     */
    getActivityIcon(type) {
      switch (type) {
        case 'new-psychologist':
          return 'fas fa-user-plus'
        case 'system-update':
          return 'fas fa-sync'
        case 'security-review':
          return 'fas fa-shield-alt'
        default:
          return 'fas fa-question-circle'
      }
    },
    /**
     * Formatea una marca de tiempo a formato legible
     * @param {string} timestamp - Marca de tiempo ISO
     * @returns {string} Hora formateada
     */
    formatTimestamp(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista de perfil */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Contenedor principal del perfil */
.profile-view {
  padding: 2rem;
  font-family: var(--font-family);
  background-color: var(--bg-secondary);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

/* Encabezado del perfil con foto de portada */
.profile-header {
  position: relative;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
}

.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 700;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.profile-card {
  background: white;
  padding: 2rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: var(--border-radius-md);
  }
}

.info-card {
  background: white;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
    color: var(--text-primary);

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius-md);
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-details {
  flex: 1;
}
.activity-text {
  margin: 0;
  color: var(--neutral-dark);
  font-weight: 500;
}

.activity-time {
  display: block;
  font-size: 0.8rem;
  color: var(--neutral-medium);
  margin-top: 0.25rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .profile-info-container {
    padding: 0 1rem;
  }

  .profile-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item {
    padding: 1rem;
  }
}
</style>
