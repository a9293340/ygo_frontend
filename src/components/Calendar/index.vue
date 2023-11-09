<script setup lang="ts">
import type { CalendarList } from "module-types";
import type { CalendarListType } from "request-data-types";
import type { HasTotalRes } from "response-data-types";
import type { PageList, Todo } from "component-types";

import { callApi } from "@/util/api";
import { decode } from "@/util";
const emits = defineEmits(["get:data"]);
const props = defineProps({
	isDark: {
		type: Boolean,
		default: true,
	},
	expanded: {
		type: Boolean,
		default: true,
	},
});

const todo = ref<Todo[]>([]);

const originData = ref<CalendarList | []>([]);

const attributes = computed(() => [
	// Attributes for todo
	...todo.value.map((todo) => ({
		dates: todo.dates,
		dot: {
			color: todo.color,
			...(todo.isComplete && { class: "opacity-50" }),
		},
		popover: {
			label: todo.description,
		},
	})),
]);

const getDateInfo = async (date: string) => {
	const pickTypes = ["blue", "red", "green"];
	originData.value = decode<HasTotalRes<CalendarList>>(
		(
			await callApi<CalendarListType>(
				{
					filter: {
						date,
					},
				},
				"calendar",
				"list",
				false
			)
		).data
	).list;

	todo.value = originData.value.map((el) => ({
		description: `${el.title} ${el.content && ":"} ${el.content}`,
		isComplete: new Date(el.date) < new Date(),
		dates: [new Date(el.date)],
		color: pickTypes[el.type],
	}));

	emits("get:data", originData.value);
};

const changeCalendar = async (move: PageList) => {
	const pick = new Date(move[0].year, move[0].month - 1);
	await getDateInfo(pick.toISOString());
};

onMounted(async () => {
	await getDateInfo(new Date().toISOString());
});
</script>

<template>
	<VCalendar
		:attributes="attributes"
		:is-dark="props.isDark"
		:expanded="props.expanded"
		@did-move="changeCalendar"
	/>
</template>

<style scoped></style>
