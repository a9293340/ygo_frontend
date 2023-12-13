<template>
	<ArticleDetail :path="path" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { toCamelCase } from "@/util/index.ts";

const route = useRoute();
const path = ref(toCamelCase(route.path.split("/")[1]));
</script>
