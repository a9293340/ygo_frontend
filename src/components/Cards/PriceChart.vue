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
import type { ChartOptions, ChartData, ChartDataset } from "chart.js";
import "chartjs-adapter-date-fns";

const props = defineProps({
	price: {
		type: Array,
		default: () =>
			[
				{ time: "", price_avg: 0, price_lowest: 0, rarity: "" },
			] as CardsPriceType[],
	},
	colors: {
		type: Array,
		default: () => [
			"rgba(255, 99, 132, 1)",
			"rgba(54, 162, 235, 1)",
			"rgba(255, 206, 86, 1)",
			"rgba(75, 192, 192, 1)",
			"rgba(153, 102, 255, 1)",
			"rgba(255, 159, 64, 1)",
			"rgba(245, 74, 85, 1)",
		],
	},
	yAxisSetSize: {
		type: Number,
		default: 5,
	},
	xAxisSetSize: {
		type: Number,
		default: 3,
	},
	width: {
		type: String,
		default: "80%",
	},
	height: {
		type: String,
		default: "500px",
	},
	yGrid: {
		type: Boolean,
		default: true,
	},
	xGrid: {
		type: Boolean,
		default: true,
	},
	xGridColor: {
		type: String,
		default: "rgba(255,255,255,0.3)",
	},
	yGridColor: {
		type: String,
		default: "rgba(255,255,255,0.3)",
	},
	xTickSet: {
		type: Object,
		default: {
			color: "white",
			size: 14,
			weight: "700",
		},
	},
	yTickSet: {
		type: Object,
		default: {
			color: "white",
			size: 14,
			weight: "700",
		},
	},
	legend: {
		type: Object,
		default: {
			color: "white",
			size: 14,
			position: "right",
		},
	},
	toolTip: {
		type: Object,
		default: {
			color: "rgb(0,0,0)",
			titleSize: 14,
			contentSize: 14,
			bgc: "rgba(255,255,255,0.7)",
		},
	},
});
const price = computed(() => props.price as CardsPriceType[]);
const colors = computed(() => props.colors as string[]);
const xTickSet = computed(
	() => props.xTickSet as { color: string; size: number; weight: string }
);
const yTickSet = computed(
	() => props.yTickSet as { color: string; size: number; weight: string }
);
const legend = computed(
	() => props.legend as { color: string; size: number; position: string }
);
const toolTip = computed(
	() =>
		props.legend as {
			color: string;
			titleSize: number;
			contentSize: number;
			bgc: string;
		}
);
const priceX = ref<string[]>([]);
const priceY = ref<ChartDataset<"line">[]>([]);
const max = ref(0);
const min = ref(0);

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
						unit: "week",
						displayFormats: {
							week: "yyyy-MM-dd",
						},
					},
					ticks: {
						font: {
							size: xTickSet.value.size,
							weight: xTickSet.value.weight,
						},
						color: xTickSet.value.color,
						stepSize: props.xAxisSetSize,
					},
					grid: {
						display: props.xGrid, // 顯示網格線
						color: props.xGridColor,
					},
					barPercentage: 1, // 每個長條的寬度為 X 軸間隔寬度的 100%
				},
				y: {
					position: "left", // 顯示在左方的 y 軸
					ticks: {
						font: {
							size: yTickSet.value.size,
							weight: yTickSet.value.weight,
						},
						color: yTickSet.value.color,
						stepSize: Math.floor(
							(max.value +
								Math.floor(max.value * 0.1) -
								(min.value - Math.round(min.value - 0.1))) /
								props.yAxisSetSize
						),
					},
					grid: {
						display: props.yGrid,
						color: props.yGridColor,
					},
					suggestedMin: min.value - Math.round(min.value - 0.1),
					suggestedMax: max.value + Math.floor(max.value * 0.1),
				},
			},
			plugins: {
				legend: {
					position: legend.value.position, // 设置图例位置为右侧
					labels: {
						font: {
							size: legend.value.size, // 调整字体大小
							weight: "bold", // 字体粗细
						},
						color: legend.value.color, // 设置字体颜色
					},
				},
				tooltip: {
					enabled: false,
					position: "nearest",
					external: externalTooltipHandler,
				},
			},
			interaction: {
				mode: "index",
				intersect: false,
			},
			elements: {
				point: {
					radius: 1, // 设置数据点的半径大小
				},
			},
			hover: {
				mode: "y",
				intersect: true,
			},
		} as ChartOptions<"line">)
);

const getOrCreateTooltip = (chart: any) => {
	let tooltipEl = chart.canvas.parentNode.querySelector("div");

	if (!tooltipEl) {
		tooltipEl = document.createElement("div");
		tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
		tooltipEl.style.borderRadius = "3px";
		tooltipEl.style.color = "white";
		tooltipEl.style.opacity = 1;
		tooltipEl.style.pointerEvents = "none";
		tooltipEl.style.position = "absolute";
		tooltipEl.style.transform = "translate(-50%, 0)";
		tooltipEl.style.transition = "all .1s ease";

		const table = document.createElement("table");
		table.style.margin = "0px";

		tooltipEl.appendChild(table);
		chart.canvas.parentNode.appendChild(tooltipEl);
	}

	return tooltipEl;
};

const externalTooltipHandler = (context: any) => {
	// Tooltip Element
	const { chart, tooltip } = context;
	const tooltipEl = getOrCreateTooltip(chart);

	// Hide if no tooltip
	if (tooltip.opacity === 0) {
		tooltipEl.style.opacity = 0;
		return;
	}

	// Set Text
	if (tooltip.body) {
		const titleLines = tooltip.title || [];
		const bodyLines = tooltip.body.map((b: any) => b.lines);

		const tableHead = document.createElement("thead");

		titleLines.forEach((title: any) => {
			const tr = document.createElement("tr");
			tr.style.borderWidth = "0";

			const th = document.createElement("th");
			th.style.borderWidth = "0";
			th.style.color = toolTip.value.color;
			th.style.fontSize = `${toolTip.value.titleSize}px`;
			const text = document.createTextNode(title);

			th.appendChild(text);
			tr.appendChild(th);
			tableHead.appendChild(tr);
		});

		const tableBody = document.createElement("tbody");
		bodyLines.forEach((body: any, i: number) => {
			const colors = tooltip.labelColors[i];

			const span = document.createElement("span");
			span.style.background = colors.backgroundColor;
			span.style.borderColor = colors.borderColor;
			span.style.borderWidth = "2px";
			span.style.marginRight = "10px";
			span.style.height = "10px";
			span.style.width = "10px";
			span.style.display = "inline-block";

			const tr = document.createElement("tr");
			tr.style.backgroundColor = "inherit";
			tr.style.borderWidth = "0";

			const td = document.createElement("td");
			td.style.borderWidth = "0";
			td.style.color = toolTip.value.color;
			td.style.fontSize = `${toolTip.value.contentSize}px`;

			const text = document.createTextNode(body);

			td.appendChild(span);
			td.appendChild(text);
			tr.appendChild(td);
			tableBody.appendChild(tr);
		});

		const tableRoot = tooltipEl.querySelector("table");

		// Remove old children
		while (tableRoot.firstChild) {
			tableRoot.firstChild.remove();
		}

		// Add new children
		tableRoot.appendChild(tableHead);
		tableRoot.appendChild(tableBody);
	}

	const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

	// Display, position, and set styles for font
	tooltipEl.style.opacity = 1;
	tooltipEl.style.left = positionX + tooltip.caretX + "px";
	tooltipEl.style.top = positionY + tooltip.caretY + "px";
	tooltipEl.style.font = tooltip.options.bodyFont.string;
	tooltipEl.style.padding =
		tooltip.options.padding + "px " + tooltip.options.padding + "px";
	tooltipEl.style.backgroundColor = toolTip.value.bgc;
	tooltipEl.style.borderRadius = "10px";
};

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
				backgroundColor: colors.value[i % 7],
				borderColor: colors.value[i % 7], // 设置线的颜色
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

	const dom = <HTMLDivElement>document.querySelector(".price-chart");
	if (dom) {
		dom.style.width = props.width;
		dom.style.height = props.height;
	}
});
</script>

<template>
	<div>
		<div class="price-chart">
			<Line :options="chartOptions" :data="chartData" />
		</div>
	</div>
</template>

<style scoped>
.price-chart {
	@apply w-8/12;
	height: 400px;
}
</style>
