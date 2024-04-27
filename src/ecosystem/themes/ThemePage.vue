<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>主題</template>
      <template #lead>查看主題、UI Kits 和插件。你可以看到我們的合作伙伴是如何用 Vue 構建一個真實世界的應用。</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      想在這裡介紹你的主題嗎？ <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">聯繫我們!</a>
    </ThemeContact>
  </div>
</template>
