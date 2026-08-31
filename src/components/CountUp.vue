<!-- 数字滚动组件，对应 react-countup -->
<template>
  <span class="num">{{ display }}</span>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  end: { type: Number, default: 0 },
  duration: { type: Number, default: 1 },
});

const display = ref(0);
let frame = null;

// 缓动到目标值
const animateTo = (target) => {
  if (frame) cancelAnimationFrame(frame);

  const from = display.value;
  const total = props.duration * 1000;
  if (total <= 0 || from === target) {
    display.value = target;
    return;
  }

  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / total, 1);
    // easeOutQuad，观感接近 react-countup 默认曲线
    const eased = 1 - (1 - progress) * (1 - progress);
    display.value = Math.round(from + (target - from) * eased);
    if (progress < 1) {
      frame = requestAnimationFrame(step);
    } else {
      frame = null;
    }
  };
  frame = requestAnimationFrame(step);
};

watch(() => props.end, animateTo, { immediate: true });

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame);
});
</script>
