# 路由 {#routing}

## 客戶端 vs. 服務端路由 {#client-side-vs-server-side-routing}

服務端路由指的是服務器根據用戶訪問的 URL 路徑返回不同的響應結果。當我們在一個傳統的服務端渲染的 web 應用中點擊一個鏈接時，瀏覽器會從服務端獲得全新的 HTML，然後重新加載整個頁面。

然而，在[單頁面應用](https://developer.mozilla.org/en-US/docs/Glossary/SPA)中，客戶端的 JavaScript 可以攔截頁面的跳轉請求，動態獲取新的數據，然後在無需重新加載的情況下更新當前頁面。這樣通常可以帶來更流暢的用戶體驗，尤其是在更偏向“應用”的場景下，因為這類場景下用戶通常會在很長的一段時間中做出多次交互。

在這類單頁應用中，“路由”是在客戶端執行的。一個客戶端路由器的職責就是利用諸如 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 或是 [`hashchange` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)這樣的瀏覽器 API 來管理應用當前應該渲染的視圖。

## 官方路由 {#official-router}

<!-- TODO update links -->
<div>
  <VueSchoolLink href="https://vueschool.io/courses/vue-router-4-for-everyone" title="免費的 Vue Router 課程">
    在 Vue School 上觀看免費的視頻課程
  </VueSchoolLink>
</div>

Vue 很適合用來構建單頁面應用。對於大多數此類應用，都推薦使用官方支持的[路由庫](https://github.com/vuejs/router)。要了解更多細節，請查看 [Vue Router 的文檔](https://router.vuejs.org/zh/)。

## 從頭開始實現一個簡單的路由 {#simple-routing-from-scratch}

如果你只需要一個簡單的頁面路由，而不想為此引入一整個路由庫，你可以通過[動態組件](/guide/essentials/component-basics#dynamic-components)的方式，監聽瀏覽器 [`hashchange` 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event)或使用 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 來更新當前組件。

下面是一個簡單的例子：

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'
const routes = {
  '/': Home,
  '/about': About
}
const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>
<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNptUk1vgkAQ/SsTegAThZp4MmhikzY9mKanXkoPWxjLRpgly6JN1P/eWb5Eywlm572ZN2/m5GyKwj9U6CydsIy1LAyUaKpiHZHMC6UNnEDjbgqxyovKYAIX2GmVg8sktwe9qhzbdz+wga15TW++VWX6fB3dAt6UeVEVJT2me2hhEcWKSgOamVjCCk4RAbiBu6xbT5tI2ML8VDeI6HLlxZXWSOZdmJTJPJB3lJSoo5+pWBipyE9FmU4soU2IJHk+MGUrS4OE2nMtIk4F/aA7BW8Cq3WjYlDbP4isQu4wVp0F1Q1uFH1IPDK+c9cb1NW8B03tyJ//uvhlJmP05hM4n60TX/bb2db0CoNmpbxMDgzmRSYMcgQQCkjZhlXkPASRs7YmhoFYw/k+WXvKiNrTcQgpmuFv7ZOZFSyQ4U9a7ZFgK2lvSTXFDqmIQbCUJTMHFkQOBAwKg16kM3W6O7K3eSs+nbeK+eee1V/XKK0dY4Q3vLhR6uJxMUK8/AFKaB6k)

</div>

<div class="options-api">

```vue
<script>
import Home from './Home.vue'
import About from './About.vue'
import NotFound from './NotFound.vue'
const routes = {
  '/': Home,
  '/about': About
}
export default {
  data() {
    return {
      currentPath: window.location.hash
    }
  },
  computed: {
    currentView() {
      return routes[this.currentPath.slice(1) || '/'] || NotFound
    }
  },
  mounted() {
    window.addEventListener('hashchange', () => {
		  this.currentPath = window.location.hash
		})
  }
}
</script>
<template>
  <a href="#/">Home</a> |
  <a href="#/about">About</a> |
  <a href="#/non-existent-path">Broken Link</a>
  <component :is="currentView" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNptUstO6zAQ/ZVR7iKtVJKLxCpKK3Gli1ggxIoNZmGSKbFoxpEzoUi0/87YeVBKNonHPmfOmcdndN00yXuHURblbeFMwxtFpm6sY7i1NcLW2RriJPWBB8bT8/WL7Xh6D9FPwL3lG9tROWHGiwGmqLDUMjhhYgtr+FQEEKdxFqRXfaR9YrkKAoqOnocfQaDEre523PNKzXqx7M8ADrlzNEYAReccEj9orjLYGyrtPtnZQrOxlFS6rXqgZJdPUC5s3YivMhuTDCkeDe6/dSalvognrkybnIgl7c4UuLhcwuHgS3v2/7EPvzRruRXJ7/SDU12W/98l451pGQndIvaWi0rTK8YrEPx64ymKFQOce5DOzlfs4cdlkA+NzdNpBSRgrJudZpQIINdQOdyuVfQnVdHGzydP9QYO549hXIII45qHkKUL/Ail8EUjBgX+z9k3JLgz9OZJgeInYElAkJlWmCcDUBGkAsrTyWS0isYV9bv803x1OTiWwzlrWtxZ2lDGDO90mWepV3+vZojHL3QQKQE=)

</div>
