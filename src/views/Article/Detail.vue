<template>
	<ArticleDetail :path="path" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { toCamelCase } from "@/util/index";

const route = useRoute();
const path = ref(toCamelCase(route.path.split("/")[1]));
</script>
