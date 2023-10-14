<template>
  <div class="app">
    <Navbar/>
    <router-view/>
    <Footer/>
  </div>
</template>

<script setup lang="ts">
import Navbar from '/src/components/common/Navbar.vue'
import Footer from '/src/components/common/Footer.vue'
</script>

<style lang="scss" scoped>
.app {
  //@apply bg-black;
}
</style>
