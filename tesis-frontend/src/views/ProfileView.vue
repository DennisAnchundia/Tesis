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
export default {
  name: 'ProfileView',
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
  computed: {
    getInitials() {
      return `${this.adminData.firstName.charAt(0)}${this.adminData.lastName.charAt(0)}`.toUpperCase()
    }
  },
  async created() {
    await this.fetchAdminData()
    await this.fetchStats()
    await this.fetchRecentActivities()
  },
  methods: {
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.profile-view {
  font-family: var(--font-family);
  background-color: var(--bg-secondary);
  min-height: 100vh;
}

.profile-header {
  position: relative;
  margin-bottom: 2rem;
}

.cover-photo {
  height: 200px;
  background: var(--primary-gradient);
  border-radius: 0 0 20px 20px;
}

.profile-info-container {
  position: relative;
  margin-top: -60px;
  padding: 0 2rem;
  z-index: 1;
}

.profile-avatar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  border: 4px solid white;
  transition: transform var(--transition-normal);
}

.avatar-circle:hover {
  transform: scale(1.05);
}

.initials {
  font-size: 2.5rem;
  font-weight: 600;
  background: var(--primary-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.profile-details {
  text-align: center;
}

.profile-details h1 {
  margin: 0;
  color: var(--neutral-dark);
  font-size: 1.8rem;
  font-weight: 600;
}

.role-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(127, 83, 172, 0.1);
  color: var(--primary-color);
  border-radius: var(--border-radius-full);
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.5rem;
  backdrop-filter: blur(4px);
}

.profile-content {
  padding: 2rem;
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-header i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.card-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--neutral-dark);
  font-weight: 600;
}

.card-content {
  padding: 1.5rem;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-group:last-child {
  margin-bottom: 0;
}

.info-group label {
  display: block;
  color: var(--neutral-medium);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.info-group p {
  margin: 0;
  color: var(--neutral-dark);
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-sm);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 600;
  background: var(--primary-gradient);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--neutral-medium);
  font-size: 0.9rem;
  font-weight: 500;
}

.activity-list {
  padding: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-normal);
}

.activity-item:hover {
  background-color: var(--bg-secondary);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item i {
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-right: 1rem;
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
