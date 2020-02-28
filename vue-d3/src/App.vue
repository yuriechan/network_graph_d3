<template>
  <div id="app">
    <D3TreeGraph />
  </div>
</template>

<script>
import D3TreeGraph from './components/D3TreeGraph'

export default {
  name: 'App',
  components: {
    D3TreeGraph
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
