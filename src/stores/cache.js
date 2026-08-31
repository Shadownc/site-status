import { ref, watch } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "siteDataCache";

// 读取本地缓存，解析失败时回退为空
const loadCache = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("读取站点缓存失败：", error);
    return null;
  }
};

export const useCacheStore = defineStore("cache", () => {
  // 站点数据
  const siteData = ref(loadCache());

  // 持久化，对应原 mobx-persist-store
  watch(
    siteData,
    (val) => {
      try {
        if (val === null) {
          window.localStorage.removeItem(STORAGE_KEY);
        } else {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
        }
      } catch (error) {
        console.error("写入站点缓存失败：", error);
      }
    },
    { deep: true }
  );

  const changeSiteData = (val) => {
    siteData.value = val;
  };

  const removeSiteData = () => {
    siteData.value = null;
  };

  return { siteData, changeSiteData, removeSiteData };
});
