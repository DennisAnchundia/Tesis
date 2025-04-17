<template>
  <div class="psychologist-home">
    <div class="welcome-card">
      <div class="header">
        <div class="avatar" :style="{ backgroundColor: avatarColor }">
          <span>{{ userInitials }}</span>
        </div>
        <h1>Bienvenido, {{ userName }}</h1>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <label>Nombre:</label>
          <p>{{ userData?.user?.firstName }} {{ userData?.user?.lastName }}</p>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <p>{{ userData?.user?.email }}</p>
        </div>
        <div class="info-item">
          <label>Rol:</label>
          <p>{{ userRole }}</p>
        </div>
        <div class="info-item">
          <label>Pacientes asignados:</label>
          <p>{{ studentCount }} estudiantes</p>
        </div>
        <div class="info-item">
          <label>Sesiones realizadas:</label>
          <p>{{ userData?.user?.sessionCount || 0 }} sesiones</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PsychologistHomeView',
  data() {
    return {
      studentCount: 0
    }
  },
  computed: {
    ...mapState(['userData']),
    userName() {
      if (this.userData?.user?.firstName && this.userData?.user?.lastName) {
        return `${this.userData.user.firstName} ${this.userData.user.lastName}`
      }
      return this.userData?.user?.name || ''
    },
    userRole() {
      return 'Psicólogo'
    },
    userInitials() {
      if (!this.userName) return ''
      return this.userName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },
    avatarColor() {
      const colors = [
        '#1976D2', // primary-color
        '#26A69A', // secondary-color
        '#FF8A65'  // accent-color
      ]
      const hash = this.userName.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc)
      }, 0)
      return colors[Math.abs(hash) % colors.length]
    }
  },
  async created() {
    try {
      const token = localStorage.getItem('x-token')
      const response = await fetch('http://localhost:3000/api/students/', {
        headers: {
          'x-token': token
        }
      })
      if (response.ok) {
        const data = await response.json()
        this.studentCount = data.students.length
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }
}
</script>

<style scoped>
.psychologist-home {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 2rem;
}

h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 500;
}

.info-section {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: grid;
  gap: 0.5rem;
}

.info-item label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.info-item p {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .psychologist-home {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    text-align: center;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
