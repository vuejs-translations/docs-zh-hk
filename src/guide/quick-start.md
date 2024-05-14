---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# 快速上手 {#quick-start}

## 線上嘗試 Vue {#try-vue-online}

- 想要快速體驗 Vue，你可以直接試試我們的[演練場](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==)。

- 如果你更喜歡不用任何構建的原始 HTML，可以使用 [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) 入門。

- 如果你已經比較熟悉 Node.js 和構建工具等概念，還可以直接在瀏覽器中打開 [StackBlitz](https://vite.new/vue) 來嘗試完整的構建設置。

## 創建一個 Vue 應用 {#creating-a-vue-application}

:::tip 前提條件

- 熟悉命令行
- 已安裝 18.3 或更高版本的 [Node.js](https://nodejs.org/)
  :::

在本節中，我們將介紹如何在本地搭建 Vue [單頁應用](/guide/extras/ways-of-using-vue#single-page-application-spa)。創建的項目將使用基於 [Vite](https://vitejs.dev) 的構建設置，並允許我們使用 Vue 的[單文件組件](/guide/scaling-up/sfc) (SFC)。

確保你安裝了最新版本的 [Node.js](https://nodejs.org/)，並且你的當前工作目錄正是打算創建項目的目錄。在命令行中運行以下命令 (不要輸入 `$` 符號)：

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh
  $ pnpm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh
  $ yarn create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh
  $ bun create vue@latest
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

這一指令將會安裝並執行 [create-vue](https://github.com/vuejs/create-vue)，它是 Vue 官方的項目腳手架工具。你將會看到一些諸如 TypeScript 和測試支持之類的可選功能提示：

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Nightwatch / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… No / <span style="color:#89DDFF;text-decoration:underline">Yes</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue DevTools 7 extension for debugging? (experimental) <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

如果不確定是否要開啟某個功能，你可以直接按下回車鍵選擇 `No`。在項目被創建後，通過以下步驟安裝依賴並啟動開發伺服器：

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ npm install
  $ npm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ pnpm install
  $ pnpm run dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ yarn
  $ yarn dev
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh-vue
  $ cd {{'<your-project-name>'}}
  $ bun install
  $ bun run dev
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

你現在應該已經運行起來了你的第一個 Vue 項目！請注意，生成的項目中的示例組件使用的是[組合式 API](/guide/introduction#composition-api) 和 `<script setup>`，而非[選項式 API](/guide/introduction#options-api)。下面是一些補充提示：

- 推薦的 IDE 配置是 [Visual Studio Code](https://code.visualstudio.com/) + [Vue - Official 擴展](https://marketplace.visualstudio.com/items?itemName=Vue.volar)。如果使用其他編輯器，參考 [IDE 支持章節](/guide/scaling-up/tooling#ide-support)。
- 更多工具細節，包括與後端框架的整合，我們會在[工具鏈指南](/guide/scaling-up/tooling)進行討論。
- 要了解構建工具 Vite 更多背後的細節，請查看 [Vite 文檔](https://cn.vitejs.dev)。
- 如果你選擇使用 TypeScript，請閱讀 [TypeScript 使用指南](typescript/overview)。

當你準備將應用發佈到生產環境時，請運行：

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">

  ```sh
  $ pnpm run build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">

  ```sh
  $ yarn build
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">

  ```sh
  $ bun run build
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

此命令會在 `./dist` 文件夾中為你的應用創建一個生產環境的構建版本。關於將應用上線生產環境的更多內容，請閱讀[生產環境部署指南](/guide/best-practices/production-deployment)。

[下一步>](#next-steps)

## 通過 CDN 使用 Vue {#using-vue-from-cdn}

你可以藉助 script 標籤直接通過 CDN 來使用 Vue：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

這裡我們使用了 [unpkg](https://unpkg.com/)，但你也可以使用任何提供 npm 包服務的 CDN，例如 [jsdelivr](https://www.jsdelivr.com/package/npm/vue) 或 [cdnjs](https://cdnjs.com/libraries/vue)。當然，你也可以下載此文件並自行提供服務。

通過 CDN 使用 Vue 時，不涉及“構建步驟”。這使得設置更加簡單，並且可以用於增強靜態的 HTML 或與後端框架集成。但是，你將無法使用單文件組件 (SFC) 語法。

### 使用全局構建版本 {#using-the-global-build}

上面的鏈接使用了*全局構建版本*的 Vue，該版本的所有頂層 API 都以屬性的形式暴露在了全局的 `Vue` 對象上。這裡有一個使用全局構建版本的例子：

<div class="options-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue
  
  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen 示例](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen 示例](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip
本指南中許多關於組合式 API 的例子將使用 `<script setup>` 語法，這需要構建工具。如果你打算在沒有構建步驟的情況下使用組合式 API，請參考 [`setup()` 選項](/api/composition-api-setup)的用法。
:::

</div>

### 使用 ES 模塊構建版本 {#using-the-es-module-build}

在本文檔的其餘部分我們使用的主要是 [ES 模塊](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)語法。現代瀏覽器大多都已原生支持 ES 模塊。因此我們可以像這樣通過 CDN 以及原生 ES 模塊使用 Vue：

<div class="options-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
  
  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

注意我們使用了 `<script type="module">`，且導入的 CDN URL 指向的是 Vue 的 **ES 模塊構建版本**。

<div class="options-api">

[Codepen 示例](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Codepen 示例](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### 啟用 Import maps {#enabling-import-maps}

在上面的示例中，我們使用了完整的 CDN URL 來導入，但在文檔的其餘部分中，你將看到如下代碼：

```js
import { createApp } from 'vue'
```

我們可以使用[導入映射表 (Import Maps)](https://caniuse.com/import-maps) 來告訴瀏覽器如何定位到導入的 `vue`：

<div class="options-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Codepen 示例](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('Hello Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Codepen demo](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

你也可以在映射表中添加其他的依賴——但請務必確保你使用的是該庫的 ES 模塊版本。

:::tip 導入映射表的瀏覽器支持情況
導入映射表是一個相對較新的瀏覽器功能。請確保使用其[支持範圍](https://caniuse.com/import-maps)內的瀏覽器。請注意，只有 Safari 16.4 以上版本支持。
:::

:::warning 生產環境中的注意事項
到目前為止示例中使用的都是 Vue 的開發構建版本——如果你打算在生產中通過 CDN 使用 Vue，請務必查看[生產環境部署指南](/guide/best-practices/production-deployment#without-build-tools)。

雖然 Vue 可以不依賴構建系統使用，但也可以考慮使用 [`vuejs/petite-vue`](https://github.com/vuejs/petite-vue) 這個替代方案，以更好地適配可能在 [`jquery/jquery`](https://github.com/jquery/jquery) (過去) 或 [`alpinejs/alpine`](https://github.com/alpinejs/alpine) (現在) 的上下文中使用的情況。
:::

### 拆分模塊 {#splitting-up-the-modules}

隨著對這份指南的逐步深入，我們可能需要將代碼分割成單獨的 JavaScript 文件，以便更容易管理。例如：

```html
<!-- index.html -->
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>Count is: {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js
// my-component.js
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>Count is: {{ count }}</div>`
}
```

</div>

如果直接在瀏覽器中打開了上面的 `index.html`，你會發現它拋出了一個錯誤，因為 ES 模塊不能通過 `file://` 協議工作，也即是當你打開一個本地文件時瀏覽器使用的協議。

由於安全原因，ES 模塊只能通過 `http://` 協議工作，也即是瀏覽器在打開網頁時使用的協議。為了使 ES 模塊在我們的本地機器上工作，我們需要使用本地的 HTTP 伺服器，通過 `http://` 協議來提供 `index.html`。

要啟動一個本地的 HTTP 伺服器，請先安裝 [Node.js](https://nodejs.org/zh/)，然後通過命令行在 HTML 文件所在文件夾下運行 `npx serve`。你也可以使用其他任何可以基於正確的 MIME 類型服務靜態文件的 HTTP 伺服器。

可能你也注意到了，這裡導入的組件模板是內聯的 JavaScript 字符串。如果你正在使用 VS Code，你可以安裝 [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) 擴展，然後在字符串前加上一個前綴註釋 `/*html*/` 以高亮語法。

## 下一步 {#next-steps}

如果你尚未閱讀[簡介](/guide/introduction)，我們強烈推薦你在移步到後續文檔之前返回去閱讀一下。

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">繼續閱讀該指南</p>
    <p class="next-steps-caption">該指南會帶你深入了解框架所有方面的細節。</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">嘗試互動教程</p>
    <p class="next-steps-caption">適合喜歡邊動手邊學的讀者。</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">查看示例</p>
    <p class="next-steps-caption">瀏覽核心功能和常見用戶界面的示例。</p>
  </a>
</div>
