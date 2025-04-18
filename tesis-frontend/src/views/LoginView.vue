<!--
Componente LoginView

Este componente implementa la vista de inicio de sesión.
Características:
- Formulario de autenticación con validación
- Animaciones y efectos visuales
- Manejo de errores y estados de carga
- Redirección basada en roles
- Almacenamiento de token JWT
-->

<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-card" :class="{ 'loading': loading }">
        <div class="card-header">
          <div class="logo-container">
            <div class="logo-circle">
              <i class="fas fa-brain"></i>
            </div>
          </div>
          <h1>Bienvenido</h1>
          <p class="subtitle">Ingresa a tu cuenta</p>
        </div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i>
              Correo Electrónico
            </label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              required
              placeholder="correo@ejemplo.com"
              :disabled="loading"
            >
          </div>
          
          <div class="form-group">
            <label for="password">
              <i class="fas fa-lock"></i>
              Contraseña
            </label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password" 
              required
              placeholder="Tu contraseña"
              :disabled="loading"
            >
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span class="btn-text">{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </form>
      </div>

      <!-- Animated background elements -->
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Importación de dependencias
 * @requires axios - Cliente HTTP para realizar peticiones
 * @requires sweetalert2 - Biblioteca para mostrar alertas personalizadas
 */
import axios from 'axios'
import Swal from 'sweetalert2'

/**
 * Componente de vista de inicio de sesión
 * @component
 */
export default {
  /**
   * Nombre del componente para su identificación
   */
  name: 'LoginView',
  /**
   * Estado local del componente
   * @returns {Object} Estado inicial del formulario
   */
  data() {
    return {
      formData: {
        email: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },
  /**
   * Métodos del componente
   */
  methods: {
    /**
     * Maneja el envío del formulario de inicio de sesión
     * @async
     * @returns {Promise<void>}
     */
    async handleSubmit() {
      if (this.loading) return
      
      this.error = null
      this.loading = true

      try {
        // Añadir clase de animación al botón
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn?.classList.add('loading')

        const response = await axios.post('http://localhost:3000/api/auth/login', this.formData)
        const { token, ...userData } = response.data

        localStorage.setItem('x-token', token)
        this.$store.dispatch('login', userData)
        
        await Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente',
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'animated-alert'
          }
        })
        
        // Redirigir según el rol
        if (userData.user.role === 'ADMIN') {
          this.$router.push('/home')
        } else {
          this.$router.push('/psychologist')
        }
      } catch (error) {
        console.error('Error de inicio de sesión:', error)
        
        const errorMessage = error.response?.data?.msg || 'Error al iniciar sesión'
        
        this.error = errorMessage
        
        await Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: errorMessage,
          customClass: {
            popup: 'animated-alert'
          }
        })

        // Añadir clase de error al formulario
        const loginCard = document.querySelector('.login-card')
        loginCard?.classList.add('error')
        setTimeout(() => {
          loginCard?.classList.remove('error')
        }, 820)
      } finally {
        this.loading = false
        // Remover clase de animación del botón
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn?.classList.remove('loading')
      }
    },
    // Método para validar el formulario
    /**
     * Valida los campos del formulario
     * @returns {boolean} Resultado de la validación
     */
    validateForm() {
      if (!this.formData.email || !this.formData.password) {
        this.error = 'Por favor, complete todos los campos'
        return false
      }
      return true
    }
  },
  /**
   * Ciclo de vida: Se ejecuta al crear el componente
   * Verifica si existe un token y redirecciona si es necesario
   */
  created() {
    if (localStorage.getItem('x-token')) {
      this.$router.push('/home')
    }
  }
}
</script>

<style scoped>
/* Estilos específicos para la vista de inicio de sesión */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Vista principal con fondo y centrado */
.login-view {
  min-height: 100vh;
  min-height: -webkit-fill-available;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family);
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
  z-index: 1;
  padding: 1rem;
}

.login-container {
  position: relative;
  width: 100%;
  max-width: 440px;
  z-index: 2;
  pointer-events: auto;
  margin: auto;

  @media (max-width: 480px) {
    max-width: 100%;
  }
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;

  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: var(--border-radius-md);
  }
}

.login-card.loading {
  transform: translateY(-5px);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }

  label {
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }

  input {
    @media (max-width: 480px) {
      font-size: 1rem;
      padding: 0.5rem 0.75rem;
    }
  }
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;

    i {
      font-size: 1.5rem;
    }
  }
}

.logo-circle i {
  font-size: 2.5rem;
  color: white;
}

.card-header h1 {
  color: var(--neutral-dark);
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--neutral-medium);
  margin-top: 0.5rem;
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  color: var(--neutral-medium);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group label i {
  margin-right: 0.5rem;
  color: var(--primary-color);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  color: var(--neutral-dark);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(127, 83, 172, 0.1);
}

.form-group input:disabled {
  background: var(--bg-disabled);
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 0.8rem;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  @media (max-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
  }

  &:active {
    transform: scale(0.98);
  }
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn.loading {
  transform: scale(0.98);
  opacity: 0.8;
}

.submit-btn.loading .btn-text {
  opacity: 0.8;
}

.submit-btn.loading i {
  animation: spin 1s infinite linear;
}

.login-card.error {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animated-alert {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.submit-btn i {
  transition: transform 0.3s ease;
}

.submit-btn:hover i {
  transform: translateX(4px);
}

/* Animated background */
.background-shapes {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;

  @media (max-width: 480px) {
    opacity: 0.5;
  }
}

.shape {
  position: absolute;
  background: var(--primary-gradient);
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite;
  pointer-events: none;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 15%;
  animation-delay: 10s;
}

.shape-4 {
  width: 250px;
  height: 250px;
  top: 20%;
  right: 25%;
  animation-delay: 15s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  20% {
    transform: translate(50px, 20px) rotate(90deg);
  }
  40% {
    transform: translate(20px, -30px) rotate(180deg);
  }
  60% {
    transform: translate(-30px, 40px) rotate(270deg);
  }
  80% {
    transform: translate(40px, -20px) rotate(360deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(127, 83, 172, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(127, 83, 172, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(127, 83, 172, 0);
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
  }

  .card-header h1 {
    font-size: 1.8rem;
  }

  .logo-circle {
    width: 70px;
    height: 70px;
  }

  .logo-circle i {
    font-size: 2rem;
  }
}
</style>
