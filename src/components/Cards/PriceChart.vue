<script setup lang="ts">
import { Line } from 'vue-chartjs';
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
} from 'chart.js';
import type { ChartOptions, ChartData, ChartDataset } from 'chart.js';
import type { GridTickSet, Legends, ToolTip } from 'component-types';
import 'chartjs-adapter-date-fns';

interface PriceChartProps {
  rarity: string[];
  price: CardsPriceType[];
  colors: string[];
  yAxisSetSize: number;
  xAxisSetSize: number;
  width: string;
  height: string;
  yGrid: boolean;
  xGrid: boolean;
  xGridColor: string;
  yGridColor: string;
  xTickSet: GridTickSet;
  yTickSet: GridTickSet;
  legend: Legends;
  toolTip: ToolTip;
  type: string;
}

const props = withDefaults(defineProps<PriceChartProps>(), {
  type: 'avg',
  price: () => [{ time: '', price_avg: 0, price_lowest: 0, rarity: '' }],
  rarity: () => [],
  colors: () => [
    'rgba(255, 0, 0, 1)', // 紅色
    'rgba(0, 255, 0, 1)', // 綠色
    'rgba(0, 0, 255, 1)', // 藍色
    'rgba(255, 255, 0, 1)', // 黃色
    'rgba(255, 0, 255, 1)', // 洋紅
    'rgba(0, 255, 255, 1)', // 青色
    'rgba(128, 0, 0, 1)', // 深紅色
    'rgba(0, 128, 0, 1)', // 深綠色
    'rgba(0, 0, 128, 1)', // 深藍色
    'rgba(128, 128, 128, 1)', // 灰色
  ],
  xAxisSetSize: 3,
  yAxisSetSize: 5,
  width: '100%',
  height: '400px',
  yGrid: true,
  xGrid: true,
  xGridColor: 'rgba(255,255,255,0.3)',
  yGridColor: 'rgba(255,255,255,0.3)',
  xTickSet: () => ({
    color: 'white',
    size: 14,
    weight: '700',
  }),
  yTickSet: () => ({
    color: 'white',
    size: 14,
    weight: '700',
  }),
  legend: () => ({
    color: 'white',
    size: 14,
    position: 'right',
  }),
  toolTip: () => ({
    color: 'rgb(0,0,0)',
    titleSize: 14,
    contentSize: 14,
    bgc: 'rgba(255,255,255,0.7)',
  }),
});

const priceX = ref<string[]>([]);
const priceY = ref<ChartDataset<'line'>[]>([]);
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
    }) as ChartData<'line'>
);

const chartOptions = computed(
  () =>
    ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'week',
            displayFormats: {
              week: 'yyyy-MM-dd',
            },
          },
          ticks: {
            font: {
              size: props.xTickSet.size,
              weight: props.xTickSet.weight,
            },
            color: props.xTickSet.color,
            stepSize: props.xAxisSetSize,
          },
          grid: {
            display: props.xGrid, // 顯示網格線
            color: props.xGridColor,
          },
          barPercentage: 1, // 每個長條的寬度為 X 軸間隔寬度的 100%
        },
        y: {
          position: 'left', // 顯示在左方的 y 軸
          ticks: {
            font: {
              size: props.yTickSet.size,
              weight: props.yTickSet.weight,
            },
            color: props.yTickSet.color,
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
          position: props.legend.position, // 设置图例位置为右侧
          labels: {
            font: {
              size: props.legend.size, // 调整字体大小
              weight: 'bold', // 字体粗细
            },
            color: props.legend.color, // 设置字体颜色
          },
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: externalTooltipHandler,
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      elements: {
        point: {
          radius: 1, // 设置数据点的半径大小
        },
      },
      hover: {
        mode: 'y',
        intersect: true,
      },
    }) as ChartOptions<'line'>
);
const priceType = computed(() => props.type);

watch(priceType, newVal => {
  makePriceChart();
});

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector('div');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-50%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    const table = document.createElement('table');
    table.style.margin = '0px';

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

    const tableHead = document.createElement('thead');

    titleLines.forEach((title: any) => {
      const tr = document.createElement('tr');
      tr.style.borderWidth = '0';

      const th = document.createElement('th');
      th.style.borderWidth = '0';
      th.style.color = props.toolTip.color;
      th.style.fontSize = `${props.toolTip.titleSize}px`;
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body: any, i: number) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.marginRight = '10px';
      span.style.height = '10px';
      span.style.width = '10px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = '0';

      const td = document.createElement('td');
      td.style.borderWidth = '0';
      td.style.color = props.toolTip.color;
      td.style.fontSize = `${props.toolTip.contentSize}px`;

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const {
    offsetLeft: positionX,
    offsetTop: positionY,
    width: cWidth,
  } = chart.canvas;
  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + cWidth / 5 + 'px';
  tooltipEl.style.top = positionY + 'px';
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  tooltipEl.style.backgroundColor = props.toolTip.bgc;
  tooltipEl.style.borderRadius = '10px';
};

const makePriceChart = () => {
  priceX.value = [];
  priceY.value = [];
  const rarity = [...new Set(props.price.map(el => el.rarity))].filter(x =>
    props.rarity.includes(x)
  );
  for (let i = 0; i < rarity.length; i++) {
    const rar = rarity[i];
    const date = props.price.filter(el => el.rarity === rar);
    priceX.value = date.map(el => el.time.split(' ')[0]);
    priceY.value.push({
      label: `${rar} 露天${priceType.value === 'avg' ? '均價' : '最低價'}`,
      data:
        priceType.value === 'avg'
          ? date.map(el => el.price_avg)
          : date.map(el => el.price_lowest),
      backgroundColor: props.colors[i % 7],
      borderColor: props.colors[i % 7], // 设置线的颜色
      tension: 0.1,
      borderWidth: 1,
    });
    max.value =
      Math.max(...date.map(el => el.price_avg)) > max.value
        ? Math.max(...date.map(el => el.price_avg))
        : max.value;
    min.value =
      Math.min(...date.map(el => el.price_avg)) < min.value
        ? Math.min(...date.map(el => el.price_avg))
        : min.value;
  }
};

onMounted(() => {
  if (props.price.length) {
    makePriceChart();
  }

  const dom = <HTMLDivElement>document.querySelector('.price-chart');
  if (dom) {
    dom.style.width = props.width;
    dom.style.height = props.height;
  }
});
</script>

<template>
  <div class="price-chart">
    <Line :options="chartOptions" :data="chartData" />
  </div>
</template>

<style scoped>
.price-chart {
  padding: 10px 20px;
  background-color: #3e476b;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
