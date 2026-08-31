<!-- 超链接组件 -->
<template>
  <a class="link" :title="text" :href="url" target="_blank" rel="noreferrer">
    <slot />
    {{ text }}
  </a>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  text: { type: String, default: "" },
  to: { type: String, required: true },
});

// 检查链接
const url = computed(() => {
  const to = props.to;
  return to.startsWith("http://") ||
    to.startsWith("https://") ||
    to.startsWith("mailto")
    ? to
    : `//${to}`;
});
</script>
