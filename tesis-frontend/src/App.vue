<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

:root {
  --primary-gradient: linear-gradient(180deg, #7f53ac 0%, #647dee 100%);
  --primary-color: #7f53ac;
  --secondary-color: #647dee;
  --text-light: rgba(255, 255, 255, 0.8);
  --text-white: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-view {
  flex: 1;
}

/* Estilos generales para enlaces */
a {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

/* Estilos generales para botones */
button {
  font-family: 'Poppins', sans-serif;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(127, 83, 172, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(127, 83, 172, 0.7);
}
</style>
