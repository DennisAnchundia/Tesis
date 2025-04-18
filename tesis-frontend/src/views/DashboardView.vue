<!--
Componente DashboardView

Este componente implementa el layout principal del dashboard.
Características:
- Barra lateral de navegación (AppSidebar)
- Área principal de contenido dinámico
- Diseño responsivo
- Manejo de rutas anidadas
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
/**
 * Importación de componentes
 * @requires AppSidebar - Componente de barra lateral de navegación
 */
import AppSidebar from '@/components/AppSidebar.vue'

/**
 * Componente que implementa el layout principal del dashboard
 * @component
 */
export default {
  /**
   * Nombre del componente para su identificación
   */
  name: 'DashboardView',
  /**
   * Componentes utilizados en el layout
   */
  components: {
    AppSidebar
  }
}
</script>

<style scoped>
/* Estilos específicos para el layout del dashboard */
/* Layout principal con diseño flexible */
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

/* Ajustes responsivos para pantallas móviles */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: var(--spacing-md);
  }
}
</style>
