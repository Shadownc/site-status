import { createApp } from "vue";
import { createPinia } from "pinia";
import {
  Alert,
  Button,
  Collapse,
  Modal,
  Result,
  Tooltip,
} from "ant-design-vue";
import App from "@/App.vue";

import "@/style/index.scss";
import "@icon-park/vue-next/styles/index.css";

// 插件样式
import "overlayscrollbars/overlayscrollbars.css";

const app = createApp(App);

app.use(createPinia());

// 按需注册用到的 ant-design-vue 组件
[Alert, Button, Collapse, Modal, Result, Tooltip].forEach((component) => {
  app.use(component);
});

app.mount("#root");
