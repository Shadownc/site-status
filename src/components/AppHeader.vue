<template>
  <header id="header" :class="status.siteState">
    <Transition name="fade" mode="out-in">
      <div :key="status.siteState" :class="`cover ${status.siteState}`" />
    </Transition>
    <div class="container">
      <div class="menu">
        <span class="logo">{{ siteName }}</span>
      </div>
      <div class="status">
        <div :class="`icon ${status.siteState}`" />
        <div class="r-text">
          <Transition name="fade" mode="out-in">
            <div class="text" :key="status.siteState">
              {{ statusNames[status.siteState] }}
            </div>
          </Transition>
          <div class="tip">
            <Transition name="fade" mode="out-in">
              <span v-if="status.siteState === 'loading'" key="loading">
                数据加载中...
              </span>
              <span v-else-if="status.siteState === 'wrong'" key="wrong">
                这可能是临时性问题，请刷新后重试
              </span>
              <div v-else class="time" key="time">
                <span class="last-update">
                  {{ `上次更新于 ${lastUpdate}` }}
                </span>
                <div class="update">
                  <span>更新频率 5 分钟</span>
                  <Refresh class="refresh" @click="refreshStatus" />
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <Transition name="fade" mode="out-in">
          <div class="overview" v-if="status.siteOverview" key="overview">
            <div class="count">
              <span class="name">站点总数</span>
              <CountUp :end="status.siteOverview.count" :duration="1" />
            </div>
            <div class="status-num">
              <div class="ok-count">
                <span class="name">正常</span>
                <CountUp :end="status.siteOverview.okCount" :duration="1" />
              </div>
              <div class="down-count">
                <span class="name">异常</span>
                <span class="num">
                  <CountUp :end="status.siteOverview.downCount" :duration="1" />
                </span>
              </div>
              <div
                class="unknownCount-count"
                v-if="status.siteOverview.unknownCount"
              >
                <span class="name">未知</span>
                <span class="num">
                  <CountUp
                    :end="status.siteOverview.unknownCount"
                    :duration="1"
                  />
                </span>
              </div>
            </div>
          </div>
          <div class="overview" v-else key="empty" />
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { message } from "ant-design-vue";
import { Refresh } from "@icon-park/vue-next";
import { formatTimestamp } from "@/utils/timeTools";
import { useStatusStore } from "@/stores/status";
import { useCacheStore } from "@/stores/cache";
import CountUp from "@/components/CountUp.vue";

const emit = defineEmits(["refresh"]);

const status = useStatusStore();
const cache = useCacheStore();
const lastClickTime = ref(0);

// 加载配置
const siteName = import.meta.env.VITE_SITE_NAME;

// 状态文本
const statusNames = {
  loading: "站点状态加载中",
  error: "部分站点出现异常",
  allError: "全部站点出现异常",
  normal: "所有站点运行正常",
  wrong: "数据请求失败",
};

const lastUpdate = computed(
  () => formatTimestamp(cache.siteData?.timestamp).justTime
);

// 刷新状态
const refreshStatus = () => {
  const currentTime = Date.now();
  if (currentTime - lastClickTime.value < 60000) {
    message.warning({ key: "updata", content: "请稍后再尝试刷新" });
    return false;
  }
  cache.changeSiteData(null);
  emit("refresh");
  lastClickTime.value = currentTime;
};
</script>
