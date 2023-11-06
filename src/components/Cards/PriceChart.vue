<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	LineController,
	PointElement,
	TimeScale,
} from "chart.js";
import type { ChartOptions, ChartData, Point, ChartDataset } from "chart.js";
import "chartjs-adapter-date-fns";

const props = defineProps({
	price: {
		type: Array,
		default: () =>
			[
				{ time: "", price_avg: 0, price_lowest: 0, rarity: "" },
			] as CardsPriceType[],
	},
});
const price = computed(() => props.price as CardsPriceType[]);
const priceX = ref<string[]>([]);
const priceY = ref<ChartDataset<"line">[]>([]);
const max = ref(0);
const min = ref(0);

const colors = [
	"rgba(255, 99, 132, 1)",
	"rgba(54, 162, 235, 1)",
	"rgba(255, 206, 86, 1)",
	"rgba(75, 192, 192, 1)",
	"rgba(153, 102, 255, 1)",
	"rgba(255, 159, 64, 1)",
	"rgba(245, 74, 85, 1)", // Add more colors if needed
];

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	LineController,
	PointElement,
	TimeScale
);
const chartData = computed(
	() =>
		({
			labels: priceX.value,
			datasets: [...priceY.value],
		} as ChartData<"line">)
);

const chartOptions = computed(
	() =>
		({
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: {
					type: "time",
					time: {
						unit: "month",
					},
					ticks: {
						font: {
							size: 14,
							weight: "700",
						},
						color: "white",
					},
					grid: {
						display: false, // 顯示網格線
						color: "white",
					},
					barPercentage: 1, // 每個長條的寬度為 X 軸間隔寬度的 100%
					stepSize: 15,
				},
				y: {
					position: "left", // 顯示在左方的 y 軸
					ticks: {
						font: {
							size: 14,
							weight: "700",
						},
						color: "white",
					},
					grid: {
						color: "rgba(255,255,255,0.3)",
					},
					min: min.value,
					max: max.value,
					stepSize: (max.value - min.value) / 8,
				},
			},
			plugins: {
				legend: {
					position: "right", // 设置图例位置为右侧
					labels: {
						font: {
							size: 16, // 调整字体大小
							weight: "bold", // 字体粗细
						},
						color: "white", // 设置字体颜色
					},
				},
			},
			elements: {
				point: {
					radius: 1, // 设置数据点的半径大小
				},
			},
			hover: {
				mode: "nearest",
				intersect: true,
			},
		} as ChartOptions<"line">)
);

onMounted(() => {
	if (price.value.length) {
		const rarity = [...new Set(price.value.map((el) => el.rarity))];
		for (let i = 0; i < rarity.length; i++) {
			const rar = rarity[i];
			const date = price.value.filter((el) => el.rarity === rar);
			priceX.value = date.map((el) => el.time.split(" ")[0]);
			priceY.value.push({
				label: `${rar} 露天均價`,
				data: date.map((el) => el.price_avg),
				backgroundColor: colors[i % 7],
				borderColor: colors[i % 7], // 设置线的颜色
				tension: 0.1,
				borderWidth: 1,
			});
			max.value =
				Math.max(...date.map((el) => el.price_avg)) > max.value
					? Math.max(...date.map((el) => el.price_avg))
					: max.value;
			min.value =
				Math.min(...date.map((el) => el.price_avg)) < min.value
					? Math.min(...date.map((el) => el.price_avg))
					: min.value;
		}
		console.log(priceY.value);
	}
});
</script>

<template>
	<div>
		<div class="chart-test">
			<Line :options="chartOptions" :data="chartData" />
		</div>
	</div>
</template>

<style scoped>
.chart-test {
	@apply w-8/12;
	height: 400px;
}
</style>
