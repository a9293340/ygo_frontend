<template>
	<div class="app">
		<Navbar />
		<router-view />
		<Footer />
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.app {
	@apply bg-black;
}
</style>
