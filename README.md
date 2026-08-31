# site-status (Vue)

一个基于 UptimeRobot API 的在线状态面板，Vue 3 版本。

## 事先准备

到 [UptimeRobot](https://uptimerobot.com/dashboard) 添加站点监控，在 `My Settings` 页面获取类型为 `Read-Only API Key` 的 `API Key`。

## 部署

所有命令都在 `/` 根目录下执行。

```bash
# 若没有 pnpm
npm install pnpm -g

# 安装依赖
pnpm install
```

### 开发

```bash
pnpm dev
```

默认端口 `6599`。

### 打包

```bash
pnpm build
```

输出到 `dist`。

## 配置

改 `.env`：

| 变量 | 说明 |
| --- | --- |
| `VITE_GLOBAL_API` | UptimeRobot 接口地址。官网接口有 CORS 限制，需自行搭建反代 |
| `VITE_API_KEY` | UptimeRobot 的 Read-Only API Key |
| `VITE_SITE_NAME` | 站点名称，同时用于 PWA manifest 和页面标题 |
| `VITE_SITE_KEYWORDS` | 页面 keywords |
| `VITE_SITE_DES` | 页面 description |
| `VITE_SITE_ICP` | ICP 备案号，不需要可留空 |
| `VITE_COUNT_DAYS` | 展示的日志天数 |
| `VITE_SHOW_LINKS` | 是否在站点名后显示外链图标 |
| `VITE_GITHUB_NAME` | 页脚 GitHub 用户名 |
| `VITE_HOME_URL` | 页脚主页链接 |
| `VITE_EMAIL_URL` | 页脚邮箱地址 |

## 目录结构

```
SITE-STATUS/
├── .env                    配置文件
├── index.html
├── vite.config.js
├── public/                 静态资源
└── src/
    ├── App.vue             根组件，负责拉取数据
    ├── main.js             入口，按需注册 ant-design-vue 组件
    ├── components/
    │   ├── AppHeader.vue   顶部状态总览
    │   ├── AppFooter.vue   页脚
    │   ├── SiteStatus.vue  站点列表与时间线
    │   ├── SiteCharts.vue  详情弹窗内的可用率折线图
    │   ├── CustomLink.vue  外链
    │   └── CountUp.vue     数字滚动
    ├── stores/             Pinia store
    │   ├── status.js       站点状态与总览
    │   └── cache.js        接口数据缓存，持久化到 localStorage
    ├── style/index.scss
    └── utils/
        ├── getSiteData.js  调用接口并处理数据
        └── timeTools.js    格式化工具
```

## 鸣谢

- [uptime-status](https://github.com/yb/uptime-status) 基于此项目进行修改