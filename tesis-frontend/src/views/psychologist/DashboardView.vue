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
  name: 'PsychologistDashboard',
  components: {
    AppSidebar
  },
  methods: {
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

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: var(--spacing-md);
  }
}
</style>
