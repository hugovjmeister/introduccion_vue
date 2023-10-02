<script setup>
const name = 'Hermos';
const estilo = "color: Red";
const arrayColores = ["blue","red","cyan"]
const activo = null;
</script>

<template>
  <h1>Holaa {{ name.toUpperCase() }}</h1><br>
  <h3>{{ arrayColores }}</h3><br>
  <h2 :style="`color: ${arrayColores[2]}`">Adios xd</h2><br>
  <p v-if="activo">Estoy activo</p>
  <p v-else-if="!activo">Estoy inactivo</p>
  <p v-else>Estoy nose</p>
</template>



<style>
h1{
  color: rgb(0, 100, 163);
}
</style>