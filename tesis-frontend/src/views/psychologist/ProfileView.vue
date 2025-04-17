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
          <h1>{{ userData.user.firstName }} {{ userData.user.lastName }}</h1>
          <span class="role-badge">Psicólogo</span>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div class="info-card personal-info">
        <div class="card-header">
          <i class="fas fa-user-circle"></i>
          <h2>Información Personal</h2>
        </div>
        <div class="card-content">
          <div class="info-group">
            <label>Nombre Completo</label>
            <p>{{ userData.user.firstName }} {{ userData.user.lastName }}</p>
          </div>
          <div class="info-group">
            <label>Correo Electrónico</label>
            <p>{{ userData.user.email }}</p>
          </div>
          <div class="info-group">
            <label>Especialidad</label>
            <p>Psicología Clínica</p>
          </div>
        </div>
      </div>

      <div class="info-card stats">
        <div class="card-header">
          <i class="fas fa-chart-line"></i>
          <h2>Estadísticas</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">24</span>
            <span class="stat-label">Pacientes Activos</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">128</span>
            <span class="stat-label">Sesiones Realizadas</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">4.9</span>
            <span class="stat-label">Calificación</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">2</span>
            <span class="stat-label">Años de Experiencia</span>
          </div>
        </div>
      </div>

      <div class="info-card schedule">
        <div class="card-header">
          <i class="fas fa-calendar-alt"></i>
          <h2>Horario de Atención</h2>
        </div>
        <div class="schedule-grid">
          <div class="schedule-item">
            <span class="day">Lunes - Viernes</span>
            <span class="hours">9:00 AM - 5:00 PM</span>
          </div>
          <div class="schedule-item">
            <span class="day">Sábado</span>
            <span class="hours">9:00 AM - 1:00 PM</span>
          </div>
          <div class="schedule-item">
            <span class="day">Domingo</span>
            <span class="hours">Cerrado</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PsychologistProfile',
  computed: {
    ...mapState(['userData']),
    getInitials() {
      if (this.userData && this.userData.user) {
        console.log(this.userData)

        return `${this.userData.user.firstName.charAt(0)}${this.userData.user.lastName.charAt(0)}`.toUpperCase()
      }
      return ''
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

.schedule-grid {
  padding: 1.5rem;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-normal);
}

.schedule-item:hover {
  background-color: var(--bg-secondary);
}

.schedule-item:last-child {
  border-bottom: none;
}

.day {
  color: var(--neutral-dark);
  font-weight: 500;
}

.hours {
  color: var(--neutral-medium);
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-full);
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
