<template>
  <div class="app">
    <Navbar/>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import Navbar from '/src/components/common/Navbar.vue'
</script>

<style lang="scss" scoped>
.app {
  //@apply bg-black;
}
</style>
