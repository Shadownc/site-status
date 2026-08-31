<template>
  <AppHeader @refresh="getSiteStatusData" />
  <main id="main">
    <div class="container">
      <div class="all-site">
        <SiteStatus :site-data="siteData" :days="countDays" />
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<script setup>
import { onMounted, shallowRef } from "vue";
import { useOverlayScrollbars } from "overlayscrollbars-vue";
import { getSiteData } from "@/utils/getSiteData";
import { useStatusStore } from "@/stores/status";
import { useCacheStore } from "@/stores/cache";
import AppHeader from "@/components/AppHeader.vue";
import SiteStatus from "@/components/SiteStatus.vue";
import AppFooter from "@/components/AppFooter.vue";

const status = useStatusStore();
const cache = useCacheStore();

// 全局滚动条，对应原 React 版的 GlobalScrollbar
const [initGlobalScrollbars] = useOverlayScrollbars({
  defer: true,
  options: {
    scrollbars: { autoHide: "leave", autoHideDelay: 300 },
  },
});
// shallowRef：daily 里是 dayjs 实例，避免被深度代理后调用 format 出错
const siteData = shallowRef(null);

// 加载配置
const apiKey = import.meta.env.VITE_API_KEY;
const countDays = import.meta.env.VITE_COUNT_DAYS;

// 获取站点数据
const getSiteStatusData = async () => {
  siteData.value = null;
  const res = await getSiteData(apiKey, countDays, cache, status);
  if (!res) return;

  // 对每个站点的 daily 数组按 date 值升序排序
  siteData.value = res.map((site) => ({
    ...site,
    daily: site.daily.slice().sort((a, b) => new Date(a.date) - new Date(b.date)),
  }));
};

onMounted(() => {
  // 接管 body 滚动，使全局滚动条走插件渲染
  initGlobalScrollbars({
    target: document.body,
    cancel: { nativeScrollbarsOverlaid: true },
  });
  getSiteStatusData();
});
</script>
