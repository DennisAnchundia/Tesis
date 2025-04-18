<!--
Componente PsychologistHomeView

Este componente representa el panel principal para los psicólogos del sistema.
Muestra un resumen de sus estadísticas, acciones rápidas y actividad reciente.
Permite acceder a las principales funcionalidades relacionadas con la gestión de estudiantes y evaluaciones.
-->

<template>
  <div class="psychologist-home">
    <!-- Encabezado de la página con título y subtítulo -->
    <PageHeader
      title="Panel del Psicólogo"
      subtitle="Bienvenido a tu espacio de trabajo"
    />

    <!-- Panel de estadísticas rápidas que muestra información clave para el psicólogo -->
    <div class="stats-overview">
      <div class="stat-card">
        <i class="fas fa-user-graduate stat-icon"></i>
        <div class="stat-info">
          <h3>Estudiantes Asignados</h3>
          <p class="stat-value">32</p>
        </div>
      </div>

      <div class="stat-card">
        <i class="fas fa-calendar-check stat-icon"></i>
        <div class="stat-info">
          <h3>Sesiones este mes</h3>
          <p class="stat-value">12</p>
        </div>
      </div>

      <div class="stat-card">
        <i class="fas fa-clipboard-list stat-icon"></i>
        <div class="stat-info">
          <h3>Evaluaciones Pendientes</h3>
          <p class="stat-value">8</p>
        </div>
      </div>
    </div>

    <div class="section-title">
      <h2>Acciones Rápidas</h2>
      <div class="title-line"></div>
    </div>

    <!-- Cuadrícula de acciones rápidas con tarjetas clickeables -->
    <div class="quick-actions">
      <ActionCard
        icon="fas fa-user-graduate"
        title="Lista de Estudiantes"
        description="Ver y gestionar tus estudiantes asignados"
        @click="$router.push('/psychologist/students')"
      />

      <ActionCard
        icon="fas fa-clipboard-check"
        title="Evaluaciones"
        description="Gestionar evaluaciones y seguimientos"
        @click="$router.push('/psychologist/evaluations')"
      />

      <ActionCard
        icon="fas fa-user-circle"
        title="Mi Perfil"
        description="Actualizar información personal"
        @click="$router.push('/psychologist/profile')"
      />

      <ActionCard
        icon="fas fa-calendar-alt"
        title="Calendario"
        description="Ver y programar sesiones"
        @click="$router.push('/psychologist/calendar')"
      />
    </div>

    <div class="section-title">
      <h2>Actividad Reciente</h2>
      <div class="title-line"></div>
    </div>

    <!-- Lista de actividades recientes mostradas como tarjetas -->
    <div class="recent-activity">
      <div class="card activity-card">
        <div class="activity-header">
          <i class="fas fa-bell activity-icon"></i>
          <span class="activity-time">Hace 2 horas</span>
        </div>
        <p class="activity-text">Nueva evaluación asignada para el estudiante Juan Pérez</p>
      </div>

      <div class="card activity-card">
        <div class="activity-header">
          <i class="fas fa-calendar-check activity-icon"></i>
          <span class="activity-time">Ayer</span>
        </div>
        <p class="activity-text">Sesión completada con María González</p>
      </div>

      <div class="card activity-card">
        <div class="activity-header">
          <i class="fas fa-user-plus activity-icon"></i>
          <span class="activity-time">Hace 2 días</span>
        </div>
        <p class="activity-text">Nuevo estudiante asignado: Carlos Rodríguez</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.psychologist-home {
  animation: fadeIn var(--transition-normal);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  background: var(--bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.stat-info h3 {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 600;
}

.section-title {
  margin: var(--spacing-xl) 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.section-title h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  white-space: nowrap;
}

.title-line {
  height: 2px;
  background: var(--bg-secondary);
  flex-grow: 1;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.recent-activity {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.activity-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.activity-icon {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.activity-time {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.activity-text {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<script>
import PageHeader from '@/components/PageHeader.vue'
import ActionCard from '@/components/ActionCard.vue'

export default {
  name: 'PsychologistHomeView',
  components: {
    PageHeader,
    ActionCard
  }
}
</script>

<style scoped>
.psychologist-home {
  animation: fadeIn var(--transition-normal);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-xl) 0;
}

.stat-card {
  background: var(--bg-primary);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  transition: transform var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  background: var(--primary-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.stat-info h3 {
  color: var(--neutral-medium);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.stat-value {
  color: var(--neutral-dark);
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0;
}

.section-title {
  margin: var(--spacing-xl) 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.section-title h2 {
  color: var(--neutral-dark);
  margin: 0;
  white-space: nowrap;
}

.title-line {
  height: 2px;
  background: linear-gradient(
    to right,
    var(--primary-light),
    var(--bg-secondary)
  );
  flex-grow: 1;
  border-radius: var(--border-radius-sm);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.recent-activity {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.activity-card {
  padding: var(--spacing-md);
}

.activity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.activity-icon {
  color: var(--primary-color);
  font-size: var(--font-size-lg);
}

.activity-time {
  color: var(--neutral-medium);
  font-size: var(--font-size-sm);
}

.activity-text {
  color: var(--neutral-dark);
  margin: 0;
  font-size: var(--font-size-md);
}

@media (max-width: 768px) {
  .stats-overview,
  .quick-actions,
  .recent-activity {
    grid-template-columns: 1fr;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
