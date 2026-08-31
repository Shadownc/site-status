<template>
  <footer id="footer">
    <div class="social">
      <CustomLink :to="`https://github.com/${githubName}/`">
        <GithubOne />
      </CustomLink>
      <CustomLink :to="homeUrl">
        <Home />
      </CustomLink>
      <CustomLink :to="`mailto:${emailUrl}`">
        <Mail />
      </CustomLink>
    </div>
    <div class="text">
      <p>
        基于&nbsp;
        <CustomLink to="https://uptimerobot.com/" text="UptimeRobot" />
        &nbsp;接口&nbsp;|&nbsp;检测频率 5 分钟
      </p>
      <p>
        Copyright&nbsp;&copy;&nbsp;2021&nbsp;-&nbsp;{{ currentYear }}&nbsp;
        <CustomLink to="https://blog.lmyself.top" text="IMyself" />
      </p>
    </div>
  </footer>
</template>

<script setup>
import { GithubOne, Home, Mail } from "@icon-park/vue-next";
import CustomLink from "@/components/CustomLink.vue";

// 加载配置
const githubName = import.meta.env.VITE_GITHUB_NAME;
const homeUrl = import.meta.env.VITE_HOME_URL;
const emailUrl = import.meta.env.VITE_EMAIL_URL;

const currentYear = new Date().getFullYear();
</script>
