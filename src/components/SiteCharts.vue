<template>
  <div class="site-details">
    <a-alert v-if="siteDetails.status === 'ok'" type="success" show-icon
      message="当前站点状态正常，请继续保持哦" />
    <a-alert v-else-if="siteDetails.average >= 70" type="warning" show-icon
      message="当前站点出现异常，请检查站点状态" />
    <a-alert v-else type="error" show-icon
      message="当前站点持续异常，请立即检查站点状态或从监控项目中删除" />
    <div class="all">
      <div ref="chartRef" class="chart" />
      <a-collapse style="margin-top: 20px">
        <a-collapse-panel key="all-data" header="站点详情初始数据">
          <p>{{ rawData }}</p>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Line } from "@antv/g2plot";

const props = defineProps({
  siteDetails: { type: Object, required: true },
});

const chartRef = ref(null);
let chart = null;

// 处理传入数据为图表
const chartData = computed(() =>
  props.siteDetails.daily.map(({ uptime, date }) => ({
    time: date.format("YYYY-MM-DD"),
    value: Number(uptime),
  }))
);

const rawData = computed(() => JSON.stringify(props.siteDetails));

// 图表配置
const chartConfig = () => ({
  data: chartData.value,
  padding: "auto",
  xField: "time",
  yField: "value",
  meta: {
    value: {
      alias: "当日可用率",
      formatter: (v) => `${v}%`,
    },
  },
  xAxis: {
    tickCount: chartData.value.length,
  },
  smooth: true,
});

onMounted(() => {
  chart = new Line(chartRef.value, chartConfig());
  chart.render();
});

watch(chartData, () => {
  chart?.changeData(chartData.value);
});

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>
