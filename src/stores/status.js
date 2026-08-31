import { ref } from "vue";
import { defineStore } from "pinia";

export const useStatusStore = defineStore("status", () => {
  const siteState = ref("loading");
  const siteOverview = ref(null);

  const changeSiteState = (val) => {
    siteState.value = val;
  };

  const changeSiteOverview = (val) => {
    siteOverview.value = val;
  };

  return { siteState, siteOverview, changeSiteState, changeSiteOverview };
});
