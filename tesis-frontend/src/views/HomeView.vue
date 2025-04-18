<!--
Componente HomeView

Este componente implementa la página de inicio principal de la aplicación.
Características:
- Hero section con mensaje de bienvenida
- Sección de características principales
- Call to Action (CTA) para acceder al dashboard
- Diseño responsivo y animaciones
-->

<template>
  <div class="home">
    <header class="hero">
      <h1>Bienvenido a PsicoGest</h1>
      <p class="subtitle">Sistema de Gestión para Profesionales de la Salud Mental</p>
    </header>

    <section class="features">
      <div class="feature-card">
        <i class="fas fa-users"></i>
        <h3>Gestión de Usuarios</h3>
        <p>Administra fácilmente los perfiles de psicólogos y pacientes.</p>
      </div>

      <div class="feature-card">
        <i class="fas fa-calendar-alt"></i>
        <h3>Agenda</h3>
        <p>Organiza las citas y horarios de manera eficiente.</p>
      </div>

      <div class="feature-card">
        <i class="fas fa-chart-line"></i>
        <h3>Reportes</h3>
        <p>Genera informes detallados y estadísticas.</p>
      </div>
    </section>

    <section class="cta">
      <h2>¿Listo para comenzar?</h2>
      <router-link to="/dashboard" class="cta-button">Ir al Dashboard</router-link>
    </section>
  </div>
</template>

<script>
/**
 * Componente de la página de inicio
 * @component
 */
export default {
  name: 'HomeView'
}
</script>

<style scoped>
/* Estilos específicos para la página de inicio */
/* Contenedor principal con padding */
.home {
  padding: 20px;
}

/* Sección hero con gradiente y estilo llamativo */
.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #42b983 0%, #3aa876 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 40px;
}

.hero h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.2em;
  opacity: 0.9;
}

/* Grid responsivo para las características */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin: 40px 0;
}

/* Tarjetas de características con efectos hover */
.feature-card {
  background: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2em;
  color: #42b983;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Sección Call to Action */
.cta {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 40px;
}

.cta h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

/* Botón de llamada a la acción */
.cta-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #3aa876;
}
</style>
