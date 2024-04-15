# 單文件組件 {#single-file-components}

## 介紹 {#introduction}

Vue 的單文件組件 (即 `*.vue` 文件，英文 Single-File Component，簡稱 **SFC**) 是一種特殊的文件格式，使我們能夠將一個 Vue 組件的模板、邏輯與樣式封裝在單個文件中。下面是一個單文件組件的示例：

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

</div>

如你所見，Vue 的單文件組件是網頁開發中 HTML、CSS 和 JavaScript 三種語言經典組合的自然延伸。`<template>`、`<script>` 和 `<style>` 三個塊在同一個文件中封裝、組合了組件的視圖、邏輯和樣式。完整的語法定義可以查閱 [SFC 語法說明](/api/sfc-spec)。

## 為什麼要使用 SFC {#why-sfc}

使用 SFC 必須使用構建工具，但作為回報帶來了以下優點：

- 使用熟悉的 HTML、CSS 和 JavaScript 語法編寫模塊化的組件
- [讓本來就強相關的關注點自然內聚](#what-about-separation-of-concerns)
- 預編譯模板，避免運行時的編譯開銷
- [組件作用域的 CSS](/api/sfc-css-features)
- [在使用組合式 API 時語法更簡單](/api/sfc-script-setup)
- 通過交叉分析模板和邏輯代碼能進行更多編譯時優化
- [更好的 IDE 支持](/guide/scaling-up/tooling#ide-support)，提供自動補全和對模板中表達式的類型檢查
- 開箱即用的模塊熱更新 (HMR) 支持

SFC 是 Vue 框架提供的一個功能，並且在下列場景中都是官方推薦的項目組織方式：

- 單頁面應用 (SPA)
- 靜態站點生成 (SSG)
- 任何值得引入構建步驟以獲得更好的開發體驗 (DX) 的項目

當然，在一些輕量級場景下使用 SFC 會顯得有些殺雞用牛刀。因此 Vue 同樣也可以在無構建步驟的情況下以純 JavaScript 方式使用。如果你的用例只需要給靜態 HTML 添加一些簡單的交互，你可以看看 [petite-vue](https://github.com/vuejs/petite-vue)，它是一個 6 kB 左右、預優化過的 Vue 子集，更適合漸進式增強的需求。

## SFC 是如何工作的 {#how-it-works}

Vue SFC 是一個框架指定的文件格式，因此必須交由 [@vue/compiler-sfc](https://github.com/vuejs/core/tree/main/packages/compiler-sfc) 編譯為標準的 JavaScript 和 CSS，一個編譯後的 SFC 是一個標準的 JavaScript(ES) 模塊，這也意味著在構建配置正確的前提下，你可以像導入其他 ES 模塊一樣導入 SFC：

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

SFC 中的 `<style>` 標籤一般會在開發時注入成原生的 `<style>` 標籤以支持熱更新，而生產環境下它們會被抽取、合併成單獨的 CSS 文件。

你可以在 [Vue SFC 演練場](https://play.vuejs.org/)中實際使用一下單文件組件，同時可以看到它們最終被編譯後的樣子。

在實際項目中，我們一般會使用集成了 SFC 編譯器的構建工具，例如 [Vite](https://cn.vitejs.dev/) 或者 [Vue CLI](https://cli.vuejs.org/zh/) (基於 [webpack](https://webpack.js.org/))，Vue 官方也提供了腳手架工具來幫助你盡可能快速地上手開發 SFC。更多細節請查看 [SFC 工具鏈](/guide/scaling-up/tooling)章節。

## 如何看待關注點分離？ {#what-about-separation-of-concerns}

一些有著傳統 Web 開發背景的用戶可能會因為 SFC 將不同的關注點集合在一處而有所顧慮，覺得 HTML/CSS/JS 應當是分離開的！

要回答這個問題，我們必須對這一點達成共識：**前端開發的關注點不是完全基於文件類型分離的**。前端工程化的最終目的都是為了能夠更好地維護代碼。關注點分離不應該是教條式地將其視為文件類型的區別和分離，僅僅如此並不足以幫助我們在日益複雜的前端應用的背景下提高開發效率。

在現代的 UI 開發中，我們發現與其將代碼庫劃分為三個巨大的層，相互交織在一起，不如將它們劃分為鬆散耦合的組件，再按需組合起來。在一個組件中，其模板、邏輯和樣式本就是有內在聯繫的、是耦合的，將它們放在一起，實際上使組件更有內聚性和可維護性。

即使你不喜歡單文件組件這樣的形式而仍然選擇拆分單獨的 JavaScript 和 CSS 文件，也沒關係，你還是可以通過[資源導入](/api/sfc-spec#src-imports)功能獲得熱更新和預編譯等功能的支持。
