# 開始 {#getting-started}

歡迎來到 Vue 互動教程！

本教程的目標是讓你在瀏覽器中快速體驗使用 Vue 是什麼感受，因此它不會太過深入解釋所有細節，如果有些東西你一時無法完全理解，也不必擔心。但是，在完成本教程之後，請務必閱讀<a target="_blank" href="/guide/introduction.html">深入指南</a>，以確保你對涉及的話題有更深入、完整的理解。

## 前置要求 {#prerequisites}

本教程假定你基本熟悉 HTML、CSS 和 JavaScript。對於前端開發來說，一個完全的新手也許並不適合上手就學習框架——最好是掌握了基礎知識再回來。其他框架的經驗會有所幫助，但並不是必需的。

## 如何使用本教程 {#how-to-use-this-tutorial}

你可以編輯<span class="wide">右側</span><span class="narrow">上方</span>的代碼，並立即看到結果更新。教程每一步都會介紹一個 Vue 的核心功能，並期望你能夠補全代碼，讓 demo 運行起來。如果你卡住了，會有一個“看答案！”按鈕，點擊它，會為你揭曉能夠運行的代碼。試著不要太依賴該按鈕——自己解決會學得更快。

如果你是一名來自 Vue 2 或其他框架的資深開發者，你可以調整一些設置來充分使用本教程。如果你是一名初學者，推薦使用默認設置進行學習。

<details>
<summary>教程設置詳情</summary>

- Vue 提供了兩種 API 風格：選項式 API 和組合式 API。本教程兩者都支持——你可以使用頂部的 **API 風格偏好**來選擇你喜歡的風格。<a target="_blank" href="/guide/introduction.html#api-styles">了解更多有關 API 風格的信息</a>。

- 你也可以在 SFC 模式和 HTML 模式之間切換。前者會以<a target="_blank" href="/guide/introduction.html#single-file-components">單文件組件</a> (SFC) 的格式展示示例代碼，這是大多數開發者配合構建步驟使用 Vue 的模式。HTML 模式則在無需構建步驟時使用。

<div class="html">

:::tip
如果你想在應用中採用 HTML 模式而不進行構建，那麼請確保要麼在腳本中按如下方式導入：

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

要麼通過配置構建工具來正確解析 `vue`。以下是 [Vite](https://vitejs.dev/) 配置的示例：

```js
// vite.config.js
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

更多相關信息，請參閱[工具鏈指南中的相關部分](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation)。
:::

</div>

</details>

準備好了嗎？點擊“下一步”按鈕開始吧。
