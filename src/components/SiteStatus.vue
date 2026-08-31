<template>
  <Transition name="fade" mode="out-in">
    <a-result
      v-if="status.siteState === 'wrong'"
      key="wrong"
      status="error"
      title="调用超限或请求错误，请刷新后重试"
    >
      <template #extra>
        <a-button type="primary" danger @click="reload">重试</a-button>
      </template>
    </a-result>
    <div v-else-if="status.siteState !== 'loading' && siteData" class="sites" key="sites">
      <div
        v-for="site in sites"
        :key="site.id"
        :class="`site ${site.status !== 'ok' ? 'error' : 'normal'}`"
      >
        <div class="meta">
          <div class="name">{{ site.name }}</div>
          <CustomLink v-if="isShowLinks" :to="site.url">
            <LinkTwo />
          </CustomLink>
          <div :class="`status ${statusClass(site.status)}`">
            <div class="icon" />
            <span class="tip">{{ statusText(site.status) }}</span>
          </div>
        </div>
        <div class="timeline" @click="showSiteDetails(site)">
          <a-tooltip
            v-for="(data, index) in site.daily"
            :key="index"
            destroy-tooltip-on-hide
          >
            <template #title>
              <div class="status-tooltip">
                <div class="time">{{ data.date.format("YYYY-MM-DD") }}</div>
                <div class="text">{{ dailyTip(data) }}</div>
              </div>
            </template>
            <div :class="`line ${dailyStatus(data)}`" />
          </a-tooltip>
        </div>
        <div class="summary">
          <div class="day">{{ site.daily[0].date.format("YYYY-MM-DD") }}</div>
          <div class="note">{{ summaryText(site) }}</div>
          <div class="now">今天</div>
        </div>
      </div>
      <!-- 站点详情 -->
      <a-modal
        :title="siteDetailsData?.name"
        :open="siteDetailsShow"
        :footer="null"
        :body-style="{ marginTop: '20px' }"
        @ok="closeSiteDetails"
        @cancel="closeSiteDetails"
      >
        <OverlayScrollbarsComponent
          class="modal-scroll"
          :options="{ scrollbars: { autoHide: 'leave', autoHideDelay: 300 } }"
          defer
        >
          <SiteCharts v-if="siteDetailsData" :site-details="siteDetailsData" />
        </OverlayScrollbarsComponent>
      </a-modal>
    </div>
    <div v-else class="loading" key="loading" />
  </Transition>
</template>

<script setup>
import { computed, ref, shallowRef } from "vue";
import { LinkTwo } from "@icon-park/vue-next";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";
import { formatNumber, formatDuration } from "@/utils/timeTools";
import { useStatusStore } from "@/stores/status";
import CustomLink from "@/components/CustomLink.vue";
import SiteCharts from "@/components/SiteCharts.vue";

const props = defineProps({
  siteData: { type: Array, default: null },
  days: { type: [String, Number], default: 60 },
});

const status = useStatusStore();

// 弹窗数据
const siteDetailsShow = ref(false);
const siteDetailsData = ref(null);

// 是否显示链接
const isShowLinks = import.meta.env.VITE_SHOW_LINKS === "true";

// 保留原有的倒序展示，复制后再反转避免改动源数据
const sites = computed(() =>
  props.siteData ? [...props.siteData].reverse() : []
);

const statusClass = (state) =>
  state === "ok" ? "normal" : state === "unknown" ? "unknown" : "error";

const statusText = (state) =>
  state === "ok" ? "正常访问" : state === "unknown" ? "状态未知" : "无法访问";

const dailyStatus = ({ uptime, down }) => {
  if (uptime >= 100) return "normal";
  if (uptime <= 0 && down.times === 0) return "none";
  return "error";
};

const dailyTip = ({ uptime, down }) => {
  if (uptime >= 100) return `可用率 ${formatNumber(uptime)}%`;
  if (uptime <= 0 && down.times === 0) return "无数据";
  return `故障 ${down.times} 次，累计 ${formatDuration(
    down.duration
  )}，可用率 ${formatNumber(uptime)}%`;
};

const summaryText = (site) =>
  site.total.times
    ? `最近 ${props.days} 天内故障 ${site.total.times} 次，累计 ${formatDuration(
        site.total.duration
      )}，平均可用率 ${site.average}%`
    : `最近 ${props.days} 天内可用率 ${site.average}%`;

// 开启弹窗
const showSiteDetails = (data) => {
  siteDetailsShow.value = true;
  siteDetailsData.value = data;
};

// 关闭弹窗
const closeSiteDetails = () => {
  siteDetailsShow.value = false;
  siteDetailsData.value = null;
};

const reload = () => {
  location.reload();
};
</script>
