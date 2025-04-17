<template>
  <div class="auth-home">
    <header class="welcome-header">
      <h1>Bienvenido a tu Panel</h1>
      <p class="subtitle">¿Qué te gustaría hacer hoy?</p>
    </header>

    <div class="quick-actions">
      <div class="action-card" @click="$router.push('/dashboard/users')">
        <i class="fas fa-users"></i>
        <h3>Gestión de Usuarios</h3>
        <p>Administra los perfiles de psicólogos</p>
      </div>

      <div class="action-card" @click="$router.push('/dashboard/profile')">
        <i class="fas fa-user-circle"></i>
        <h3>Mi Perfil</h3>
        <p>Visualiza y edita tu información</p>
      </div>

      <div class="action-card">
        <i class="fas fa-chart-bar"></i>
        <h3>Estadísticas</h3>
        <p>Revisa las métricas del sistema</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthenticatedHome'
}
</script>

<style scoped>
.auth-home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-header {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.action-card i {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #666;
  font-size: 0.9rem;
}
</style>
