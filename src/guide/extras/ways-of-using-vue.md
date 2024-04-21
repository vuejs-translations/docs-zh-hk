# 使用 Vue 的多種方式 {#ways-of-using-vue}

我們相信在 Web 的世界裡沒有一種方案可以解決所有問題。正因如此，Vue 被設計成一個靈活的、可以漸進式集成的框架。根據使用場景的不同需要，相應地有多種不同的方式來使用 Vue，以此在技術棧複雜度、開發體驗和性能表現間取得最佳平衡。

## 獨立腳本 {#standalone-script}

Vue 可以以一個單獨 JS 文件的形式使用，無需構建步驟！如果你的後端框架已經渲染了大部分的 HTML，或者你的前端邏輯並不複雜，不需要構建步驟，這是最簡單的使用 Vue 的方式。在這些場景中你可以將 Vue 看作一個更加聲明式的 jQuery 替代品。

Vue 也提供了另一個更適用於此類無構建步驟場景的版本 [petite-vue](https://github.com/vuejs/petite-vue)。它為漸進式增強已有的 HTML 作了特別的優化，功能更加精簡，十分輕量。

## 作為 Web Component 嵌入 {#embedded-web-components}

你可以用 Vue 來[構建標準的 Web Component](/guide/extras/web-components)，這些 Web Component 可以嵌入到任何 HTML 頁面中，無論它們是如何被渲染的。這個方式讓你能夠在不需要顧慮最終使用場景的情況下使用 Vue：因為生成的 Web Component 可以嵌入到舊應用、靜態 HTML，甚至用其他框架構建的應用中。

## 單頁面應用 (SPA) {#single-page-application-spa}

一些應用在前端需要具有豐富的交互性、較深的會話和複雜的狀態邏輯。構建這類應用的最佳方法是使用這樣一種架構：Vue 不僅控制整個頁面，還負責處理抓取新數據，並在無需重新加載的前提下處理頁面切換。這種類型的應用通常稱為單頁應用 (Single-Page application，縮寫為 SPA)。

Vue 提供了核心功能庫和[全面的工具鏈支持](/guide/scaling-up/tooling)，為現代 SPA 提供了極佳的開發體驗，覆蓋以下方面：

- 客戶端路由
- 極其快速的構建工具
- IDE 支持
- 瀏覽器開發工具
- TypeScript 支持
- 測試工具

SPA 一般要求後端提供 API 數據接口，但你也可以將 Vue 和如 [Inertia.js](https://inertiajs.com) 之類的解決方案搭配使用，在保留側重服務端的開發模型的同時獲得 SPA 的益處。

## 全棧 / SSR {#fullstack-ssr}

純客戶端的 SPA 在首屏加載和 SEO 方面有顯著的問題，因為瀏覽器會收到一個巨大的 HTML 空頁面，只有等到 JavaScript 加載完畢才會渲染出內容。

Vue 提供了一系列 API，支持將一個 Vue 應用在服務端渲染成 HTML 字符串。這能讓服務器直接返回渲染好的 HTML，讓用戶在 JavaScript 下載完畢前就看到頁面內容。Vue 之後會在客戶端對應用進行“激活 (hydrate)”使其重獲可交互性。這被稱為[服務端渲染 (SSR)](/guide/scaling-up/ssr)，它能夠極大地改善應用在 Web 核心指標上的性能表現，如[最大內容繪製 (LCP)](https://web.dev/lcp/)。

Vue 生態中有一些針對此類場景的、基於 Vue 的上層框架，例如 [NuxtJS](https://nuxt.com/)，能讓你用 Vue 和 JavaScript 開發一個全棧應用。

## JAMStack / SSG {#jamstack-ssg}

如果所需的數據是靜態的，那麼服務端渲染可以提前完成。這意味著我們可以將整個應用預渲染為 HTML，並將其作為靜態文件部署。這增強了站點的性能表現，也使部署變得更容易，因為我們無需根據請求動態地渲染頁面。Vue 仍可通過激活在客戶端提供交互。這一技術通常被稱為靜態站點生成 (SSG)，也被稱為 [JAMStack](https://jamstack.org/what-is-jamstack/)。

SSG 有兩種風格：單頁和多頁。這兩種風格都能將站點預渲染為靜態 HTML，區別在於：

- 單頁 SSG 在初始頁面加載後將其“激活”為 SPA。這需要更多的前期 JS 加載和激活成本，但後續的導航將更快，因為它只需要部分地更新頁面內容，而無需重新加載整個頁面。

- 多頁 SSG 每次導航都會加載一個新頁面。好處是它可以僅需最少的 JS——或者如果頁面無需交互則根本不需要 JS！一些多頁面 SSG 框架，如 [Astro](https://astro.build/) 也支持“部分激活”——它允許你通過 Vue 組件在靜態 HTML 中創建交互式的“孤島”。

單頁 SSG 更適合於重交互、深會話的場景，或需要在導航之間持久化元素或狀態。否則，多頁 SSG 將是更好的選擇。

Vue 團隊也維護了一個名為 [VitePress](https://vitepress.dev/) 的靜態站點生成器，你正在閱讀的文檔就是基於它構建的！VitePress 支持兩種形式的 SSG。另外，[NuxtJS](https://nuxt.com/) 也支持 SSG。你甚至可以在同一個 Nuxt 應用中通過不同的路由提供 SSR 和 SSG。

## Web 之外... {#beyond-the-web}

儘管 Vue 主要是為構建 Web 應用而設計的，但它絕不僅僅侷限於瀏覽器。你還可以：

- 配合 [Electron](https://www.electronjs.org/) 構建桌面應用
- 配合 [Ionic Vue](https://ionicframework.com/docs/vue/overview) 構建移動端應用
- 使用 [Quasar](https://quasar.dev/) 或 [Tauri](https://tauri.app) 用同一套代碼同時開發桌面端和移動端應用
- 使用 [TresJS](https://tresjs.org/) 構建 3D WebGL 體驗
- 使用 Vue 的[自定義渲染 API](/api/custom-renderer) 來構建自定義渲染器，例如針對[終端命令行](https://github.com/vue-terminal/vue-termui)的！
