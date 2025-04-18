<!--
Componente DashboardView

Este componente implementa el layout principal del dashboard del psicólogo.
Características:
- Barra lateral de navegación (AppSidebar)
- Área principal de contenido con router-view
- Diseño responsivo que se adapta a diferentes tamaños de pantalla
- Manejo de sesión y cierre de sesión
-->

<template>
  <div class="dashboard-layout">
    <AppSidebar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue'

export default {
  /**
   * Nombre del componente para su identificación en Vue DevTools
   */
  name: 'PsychologistDashboard',
  /**
   * Componentes utilizados en este layout
   */
  components: {
    AppSidebar
  },
  /**
   * Métodos del componente
   */
  methods: {
    /**
     * Cierra la sesión del usuario
     * - Elimina el token y datos del usuario del localStorage
     * - Actualiza el estado global de autenticación
     * - Redirige al usuario a la página de login
     */
    logout() {
      localStorage.removeItem('x-token')
      localStorage.removeItem('user-data')
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para el layout del dashboard */
/* Contenedor principal con diseño flexible */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.main-content {
  flex-grow: 1;
  margin-left: 280px;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

/* Ajustes responsivos para pantallas pequeñas */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: var(--spacing-md);
  }
}
</style>
