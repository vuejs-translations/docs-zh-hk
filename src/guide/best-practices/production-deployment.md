# 生產部署 {#production-deployment}

## 開發環境 vs. 生產環境 {#development-vs-production}

在開發過程中，Vue 提供了許多功能來提升開發體驗：

- 對常見錯誤和隱患的警告
- 對組件 props / 自定義事件的校驗
- [響應性調試鉤子](/guide/extras/reactivity-in-depth#reactivity-debugging)
- 開發工具集成

然而，這些功能在生產環境中並不會被使用，一些警告檢查也會產生少量的性能開銷。當部署到生產環境中時，我們應該移除所有未使用的、僅用於開發環境的代碼分支，來獲得更小的包體積和更好的性能。

## 不使用構建工具 {#without-build-tools}

如果你沒有使用任何構建工具，而是從 CDN 或其他源來加載 Vue，請確保在部署時使用的是生產環境版本（以 `.prod.js` 結尾的構建文件）。生產環境版本會被最小化，並移除了所有僅用於開發環境的代碼分支。

- 如果需要使用全局變量版本（通過 `Vue` 全局變量訪問）：請使用 `vue.global.prod.js`。
- 如果需要 ESM 版本（通過原生 ESM 導入訪問）：請使用 `vue.esm-browser.prod.js`。

更多細節請參考[構建文件指南](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use)。

## 使用構建工具 {#with-build-tools}

通過 `create-vue`（基於 Vite）或是 Vue CLI（基於 webpack）搭建的項目都已經預先做好了針對生產環境的配置。

如果使用了自定義的構建，請確保：

1. `vue` 被解析為 `vue.runtime.esm-bundler.js`。
2. [編譯時功能標記](/api/compile-time-flags)已被正確配置。
3. <code>process.env<wbr>.NODE_ENV</code> 會在構建時被替換為 `"production"`。

其他參考：

- [Vite 生產環境指南](https://cn.vitejs.dev/guide/build.html)
- [Vite 部署指南](https://cn.vitejs.dev/guide/static-deploy.html)
- [Vue CLI 部署指南](https://cli.vuejs.org/zh/guide/deployment.html)

## 追蹤運行時錯誤 {#tracking-runtime-errors}

[應用級錯誤處理](/api/application#app-config-errorhandler) 可以用來向追蹤服務報告錯誤：

```js
import { createApp } from 'vue'
const app = createApp(...)
app.config.errorHandler = (err, instance, info) => {
  // 向追蹤服務報告錯誤
}
```

諸如 [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) 和 [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) 等服務也為 Vue 提供了官方集成。

<!-- zhlint disabled -->
