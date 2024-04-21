---
outline: deep
---

# 服務端渲染 (SSR) {#server-side-rendering-ssr}

## 總覽 {#overview}

### 什麼是 SSR？ {#what-is-ssr}

Vue.js 是一個用於構建客戶端應用的框架。默認情況下，Vue 組件的職責是在瀏覽器中生成和操作 DOM。然而，Vue 也支持將組件在服務端直接渲染成 HTML 字符串，作為服務端響應返回給瀏覽器，最後在瀏覽器端將靜態的 HTML“激活”(hydrate) 為能夠交互的客戶端應用。

一個由服務端渲染的 Vue.js 應用也可以被認為是“同構的”(Isomorphic) 或“通用的”(Universal)，因為應用的大部分代碼同時運行在服務端**和**客戶端。

### 為什麼要用 SSR？ {#why-ssr}

與客戶端的單頁應用 (SPA) 相比，SSR 的優勢主要在於：

- **更快的首屏加載**：這一點在慢網速或者運行緩慢的設備上尤為重要。服務端渲染的 HTML 無需等到所有的 JavaScript 都下載並執行完成之後才顯示，所以你的用戶將會更快地看到完整渲染的頁面。除此之外，數據獲取過程在首次訪問時在服務端完成，相比於從客戶端獲取，可能有更快的數據庫連接。這通常可以帶來更高的[核心 Web 指標](https://web.dev/vitals/)評分、更好的用戶體驗，而對於那些“首屏加載速度與轉化率直接相關”的應用來說，這點可能至關重要。

- **統一的心智模型**：你可以使用相同的語言以及相同的聲明式、面向組件的心智模型來開發整個應用，而不需要在後端模板系統和前端框架之間來回切換。

- **更好的 SEO**：搜索引擎爬蟲可以直接看到完全渲染的頁面。

  :::tip
  截至目前，Google 和 Bing 可以很好地對同步 JavaScript 應用進行索引。這裡的“同步”是關鍵詞。如果你的應用以一個 loading 動畫開始，然後通過 Ajax 獲取內容，爬蟲並不會等到內容加載完成再抓取。也就是說，如果 SEO 對你的頁面至關重要，而你的內容又是異步獲取的，那麼 SSR 可能是必需的。
  :::

使用 SSR 時還有一些權衡之處需要考量：

- 開發中的限制。瀏覽器端特定的代碼只能在某些生命週期鉤子中使用；一些外部庫可能需要特殊處理才能在服務端渲染的應用中運行。

- 更多的與構建配置和部署相關的要求。服務端渲染的應用需要一個能讓 Node.js 服務器運行的環境，不像完全靜態的 SPA 那樣可以部署在任意的靜態文件服務器上。

- 更高的服務端負載。在 Node.js 中渲染一個完整的應用要比僅僅託管靜態文件更加佔用 CPU 資源，因此如果你預期有高流量，請為相應的服務器負載做好準備，並採用合理的緩存策略。

在為你的應用使用 SSR 之前，你首先應該問自己是否真的需要它。這主要取決於首屏加載速度對應用的重要程度。例如，如果你正在開發一個內部的管理面板，初始加載時的那額外幾百毫秒對你來說並不重要，這種情況下使用 SSR 就沒有太多必要了。然而，在內容展示速度極其重要的場景下，SSR 可以儘可能地幫你實現最優的初始加載性能。

### SSR vs. SSG {#ssr-vs-ssg}

**靜態站點生成** (Static-Site Generation，縮寫為 SSG)，也被稱為預渲染，是另一種流行的構建快速網站的技術。如果用服務端渲染一個頁面所需的數據對每個用戶來說都是相同的，那麼我們可以只渲染一次，提前在構建過程中完成，而不是每次請求進來都重新渲染頁面。預渲染的頁面生成後作為靜態 HTML 文件被服務器託管。

SSG 保留了和 SSR 應用相同的性能表現：它帶來了優秀的首屏加載性能。同時，它比 SSR 應用的花銷更小，也更容易部署，因為它輸出的是靜態 HTML 和資源文件。這裡的關鍵詞是**靜態**：SSG 僅可以用於消費靜態數據的頁面，即數據在構建期間就是已知的，並且在多次部署期間不會改變。每當數據變化時，都需要重新部署。

如果你調研 SSR 只是為了優化為數不多的營銷頁面的 SEO (例如 `/`、`/about` 和 `/contact` 等)，那麼你可能需要 SSG 而不是 SSR。SSG 也非常適合構建基於內容的網站，例如文檔站點或者博客。事實上，你現在正在閱讀的這個網站就是使用 [VitePress](https://vitepress.dev/) 靜態生成的，它是一個由 Vue 驅動的靜態站點生成器。

## 基礎教程 {#basic-tutorial}

### 渲染一個應用 {#rendering-an-app}

讓我們來看一個 Vue SSR 最基礎的實戰示例。

1. 創建一個新的文件夾，`cd` 進入
2. 執行 `npm init -y`
3. 在 `package.json` 中添加 `"type": "module"` 使 Node.js 以 [ES modules mode](https://nodejs.org/api/esm.html#modules-ecmascript-modules) 運行
4. 執行 `npm install vue`
5. 創建一個 `example.js` 文件：

```js
// 此文件運行在 Node.js 服務器上
import { createSSRApp } from 'vue'
// Vue 的服務端渲染 API 位於 `vue/server-renderer` 路徑下
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

接著運行：

```sh
> node example.js
```

它應該會在命令行中打印出如下內容：

```
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) 接收一個 Vue 應用實例作為參數，返回一個 Promise，當 Promise resolve 時得到應用渲染的 HTML。當然你也可以使用 [Node.js Stream API](https://nodejs.org/api/stream.html) 或者 [Web Streams API](https://developer.mozilla.org/zh-CN/docs/Web/API/Streams_API) 來執行流式渲染。查看 [SSR API 參考](/api/ssr)獲取完整的相關細節。

然後我們可以把 Vue SSR 的代碼移動到一個服務器請求處理函數里，它將應用的 HTML 片段包裝為完整的頁面 HTML。接下來的幾步我們將會使用 [`express`](https://expressjs.com/)：

- 執行 `npm install express`
- 創建下面的 `server.js` 文件：

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

最後，執行 `node server.js`，訪問 `http://localhost:3000`。你應該可以看到頁面中的按鈕了。

[在 StackBlitz 上試試](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### 客戶端激活 {#client-hydration}

如果你點擊該按鈕，你會發現數字並沒有改變。這段 HTML 在客戶端是完全靜態的，因為我們沒有在瀏覽器中加載 Vue。

為了使客戶端的應用可交互，Vue 需要執行一個**激活**步驟。在激活過程中，Vue 會創建一個與服務端完全相同的應用實例，然後將每個組件與它應該控制的 DOM 節點相匹配，並添加 DOM 事件監聽器。

為了在激活模式下掛載應用，我們應該使用 [`createSSRApp()`](/api/application#createssrapp) 而不是 `createApp()`：

```js{2}
// 該文件運行在瀏覽器中
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...和服務端完全一致的應用實例
})

// 在客戶端掛載一個 SSR 應用時會假定
// HTML 是預渲染的，然後執行激活過程，
// 而不是掛載新的 DOM 節點
app.mount('#app')
```

### 代碼結構 {#code-structure}

想想我們該如何在客戶端複用服務端的應用實現。這時我們就需要開始考慮 SSR 應用中的代碼結構了——我們如何在服務器和客戶端之間共享相同的應用代碼呢？

這裡我們將演示最基礎的設置。首先，讓我們將應用的創建邏輯拆分到一個單獨的文件 `app.js` 中：

```js
// app.js (在服務器和客戶端之間共享)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

該文件及其依賴項在服務器和客戶端之間共享——我們稱它們為**通用代碼**。編寫通用代碼時有一些注意事項，我們將[在下面討論](#writing-ssr-friendly-code)。

我們在客戶端入口導入通用代碼，創建應用並執行掛載：

```js
// client.js
import { createApp } from './app.js'

createApp().mount('#app')
```

服務器在請求處理函數中使用相同的應用創建邏輯：

```js{2,5}
// server.js (不相關的代碼省略)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

此外，為了在瀏覽器中加載客戶端文件，我們還需要：

1. 在 `server.js` 中添加 `server.use(express.static('.'))` 來託管客戶端文件。
2. 將 `<script type="module" src="/client.js"></script>` 添加到 HTML 外殼以加載客戶端入口文件。
3. 通過在 HTML 外殼中添加 [Import Map](https://github.com/WICG/import-maps) 以支持在瀏覽器中使用 `import * from 'vue'`。

[在 StackBlitz 上嘗試完整的示例](https://stackblitz.com/fork/vue-ssr-example?file=index.js)。按鈕現在可以交互了！

## 更通用的解決方案 {#higher-level-solutions}

從上面的例子到一個生產就緒的 SSR 應用還需要很多工作。我們將需要：

- 支持 Vue SFC 且滿足其他構建步驟要求。事實上，我們需要為同一個應用執行兩次構建過程：一次用於客戶端，一次用於服務器。

  :::tip
  Vue 組件用在 SSR 時的編譯產物不同——模板被編譯為字符串拼接而不是 render 函數，以此提高渲染性能。
  :::

- 在服務器請求處理函數中，確保返回的 HTML 包含正確的客戶端資源鏈接和最優的資源加載提示 (如 prefetch 和 preload)。我們可能還需要在 SSR 和 SSG 模式之間切換，甚至在同一個應用中混合使用這兩種模式。

- 以一種通用的方式管理路由、數據獲取和狀態存儲。

完整的實現會非常複雜，並且取決於你選擇使用的構建工具鏈。因此，我們強烈建議你使用一種更通用的、更集成化的解決方案，幫你抽象掉那些複雜的東西。下面推薦幾個 Vue 生態中的 SSR 解決方案。

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) 是一個構建於 Vue 生態系統之上的全棧框架，它為編寫 Vue SSR 應用提供了流暢的開發體驗。更好的是，你還可以把它當作一個靜態站點生成器來用！我們強烈建議你試一試。

### Quasar {#quasar}

[Quasar](https://quasar.dev) 是一個基於 Vue 的完整解決方案，它可以讓你用同一套代碼庫構建不同目標的應用，如 SPA、SSR、PWA、移動端應用、桌面端應用以及瀏覽器插件。除此之外，它還提供了一整套 Material Design 風格的組件庫。

### Vite SSR {#vite-ssr}

Vite 提供了內置的 [Vue 服務端渲染支持](https://cn.vitejs.dev/guide/ssr.html)，但它在設計上是偏底層的。如果你想要直接使用 Vite，可以看看 [vite-plugin-ssr](https://vite-plugin-ssr.com/)，一個幫你抽象掉許多複雜細節的社區插件。

你也可以在[這裡](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue)查看一個使用手動配置的 Vue + Vite SSR 的示例項目，以它作為基礎來構建。請注意，這種方式只有在你有豐富的 SSR 和構建工具經驗，並希望對應用的架構做深入的定製時才推薦使用。

## 書寫 SSR 友好的代碼 {#writing-ssr-friendly-code}

無論你的構建配置或頂層框架的選擇如何，下面的原則在所有 Vue SSR 應用中都適用。

### 服務端的響應性 {#reactivity-on-the-server}

在 SSR 期間，每一個請求 URL 都會映射到我們應用中的一個期望狀態。因為沒有用戶交互和 DOM 更新，所以響應性在服務端是不必要的。為了更好的性能，默認情況下響應性在 SSR 期間是禁用的。

### 組件生命週期鉤子 {#component-lifecycle-hooks}

因為沒有任何動態更新，所以像 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 或者 <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> 這樣的生命週期鉤子**不會**在 SSR 期間被調用，而只會在客戶端運行。<span class="options-api">只有 `beforeCreate` 和 `created` 這兩個鉤子會在 SSR 期間被調用。</span>

你應該避免在 <span class="options-api">`beforeCreate` 和 `created` </span><span class="composition-api">`setup()` 或者 `<script setup>` 的根作用域</span>中使用會產生副作用且需要被清理的代碼。這類副作用的常見例子是使用 `setInterval` 設置定時器。我們可能會在客戶端特有的代碼中設置定時器，然後在 <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> 或 <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span> 中清除。然而，由於 unmount 鉤子不會在 SSR 期間被調用，所以定時器會永遠存在。為了避免這種情況，請將含有副作用的代碼放到 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 中。

### 訪問平台特有 API {#access-to-platform-specific-apis}

通用代碼不能訪問平台特有的 API，如果你的代碼直接使用了瀏覽器特有的全局變量，例如 `window` 或 `document`，他們會在 Node.js 運行時報錯，反過來也相同。

對於在服務器和客戶端之間共享，但使用了不同的平台 API 的任務，建議將平台特定的實現封裝在一個通用的 API 中，或者使用能為你做這件事的庫。例如你可以使用 [`node-fetch`](https://github.com/node-fetch/node-fetch) 在服務端和客戶端使用相同的 fetch API。

對於瀏覽器特有的 API，通常的方法是在僅客戶端特有的生命週期鉤子中惰性地訪問它們，例如 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>。

請注意，如果一個第三方庫編寫時沒有考慮到通用性，那麼要將它集成到一個 SSR 應用中可能會很棘手。你*或許*可以通過模擬一些全局變量來讓它工作，但這只是一種 hack 手段並且可能會影響到其他庫的環境檢測代碼。

### 跨請求狀態污染 {#cross-request-state-pollution}

在狀態管理一章中，我們介紹了一種[使用響應式 API 的簡單狀態管理模式](state-management#simple-state-management-with-reactivity-api)。而在 SSR 環境中，這種模式需要一些額外的調整。

上述模式在一個 JavaScript 模塊的根作用域中聲明共享的狀態。這是一種**單例模式**——即在應用的整個生命週期中只有一個響應式對象的實例。這在僅限於客戶端的 Vue 應用中是可以的，因為對於瀏覽器的每一個頁面訪問，應用模塊都會重新初始化。

然而，在 SSR 環境下，應用模塊通常只在服務器啟動時初始化一次。同一個應用模塊會在多個服務器請求之間被複用，而我們的單例狀態對象也一樣。如果我們用單個用戶特定的數據對共享的單例狀態進行修改，那麼這個狀態可能會意外地洩露給另一個用戶的請求。我們把這種情況稱為**跨請求狀態污染**。

從技術上講，我們可以在每個請求上重新初始化所有 JavaScript 模塊，就像我們在瀏覽器中所做的那樣。但是，初始化 JavaScript 模塊的成本可能很高，因此這會顯著影響服務器性能。

推薦的解決方案是在每個請求中為整個應用創建一個全新的實例，包括 router 和全局 store。然後，我們使用[應用層級的 provide 方法](/guide/components/provide-inject#app-level-provide)來提供共享狀態，並將其注入到需要它的組件中，而不是直接在組件中將其導入：

```js
// app.js （在服務端和客戶端間共享）
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// 每次請求時調用
export function createApp() {
  const app = createSSRApp(/* ... */)
  // 對每個請求都創建新的 store 實例
  const store = createStore(/* ... */)
  // 提供應用級別的 store
  app.provide('store', store)
  // 也為激活過程暴露出 store
  return { app, store }
}
```

像 Pinia 這樣的狀態管理庫在設計時就考慮到了這一點。請參考 [Pinia 的 SSR 指南](https://pinia.vuejs.org/zh/ssr/)以了解更多細節。

### 激活不匹配 {#hydration-mismatch}

如果預渲染的 HTML 的 DOM 結構不符合客戶端應用的期望，就會出現激活不匹配。最常見的激活不匹配是以下幾種原因導致的：

1. 組件模板中存在不符合規範的 HTML 結構，渲染後的 HTML 被瀏覽器原生的 HTML 解析行為糾正導致不匹配。舉例來說，一個常見的錯誤是 [`<div>` 不能被放在 `<p>` 中](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it)：

   ```html
   <p><div>hi</div></p>
   ```

   如果我們在服務器渲染的 HTML 中出現這樣的代碼，當遇到 `<div>` 時，瀏覽器會結束第一個 `<p>`，並解析為以下 DOM 結構：

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. 渲染所用的數據中包含隨機生成的值。由於同一個應用會在服務端和客戶端執行兩次，每次執行生成的隨機數都不能保證相同。避免隨機數不匹配有兩種選擇：

   1. 利用 `v-if` + `onMounted` 讓需要用到隨機數的模板只在客戶端渲染。你所用的上層框架可能也會提供簡化這個用例的內置 API，例如 VitePress 的 `<ClientOnly>` 組件。

   2. 使用一個能夠接受隨機種子的隨機數生成庫，並確保服務端和客戶端使用同樣的隨機數種子 (例如把種子包含在序列化的狀態中，然後在客戶端取回)。

3. 服務端和客戶端的時區不一致。有時候我們可能會想要把一個時間轉換為用戶的當地時間，但在服務端的時區跟用戶的時區可能並不一致，我們也並不能可靠的在服務端預先知道用戶的時區。這種情況下，當地時間的轉換也應該作為純客戶端邏輯去執行。

當 Vue 遇到激活不匹配時，它將嘗試自動恢復並調整預渲染的 DOM 以匹配客戶端的狀態。這將導致一些渲染性能的損失，因為需要丟棄不匹配的節點並渲染新的節點，但大多數情況下，應用應該會如預期一樣繼續工作。儘管如此，最好還是在開發過程中發現並避免激活不匹配。

### 自定義指令 {#custom-directives}

因為大多數的自定義指令都包含了對 DOM 的直接操作，所以它們會在 SSR 時被忽略。但如果你想要自己控制一個自定義指令在 SSR 時應該如何被渲染 (即應該在渲染的元素上添加哪些 attribute)，你可以使用 `getSSRProps` 指令鉤子：

```js
const myDirective = {
  mounted(el, binding) {
    // 客戶端實現：
    // 直接更新 DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // 服務端實現：
    // 返回需要渲染的 prop
    // getSSRProps 只接收一個 binding 參數
    return {
      id: binding.value
    }
  }
}
```

### Teleports {#teleports}

在 SSR 的過程中 Teleport 需要特殊處理。如果渲染的應用包含 Teleport，那麼其傳送的內容將不會包含在主應用渲染出的字符串中。在大多數情況下，更推薦的方案是在客戶端掛載時條件式地渲染 Teleport。

如果你需要激活 Teleport 內容，它們會暴露在服務端渲染上下文對象的 `teleports` 屬性下：

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

跟主應用的 HTML 一樣，你需要自己將 Teleport 對應的 HTML 嵌入到最終頁面上的正確位置。

:::tip
請避免在 SSR 的同時把 Teleport 的目標設為 `body`——通常 `<body>` 會包含其他服務端渲染出來的內容，這會使得 Teleport 無法確定激活的正確起始位置。

推薦用一個獨立的只包含 teleport 的內容的容器，例如 `<div id="teleported"></div>`。
:::
