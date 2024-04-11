---
footer: false
---

# 簡介 {#introduction}

:::info 你正在閱讀 Vue 3 的文檔！

- Vue 2 已於 **2023 年 12 月 31 日**停止維護。詳見 [Vue 2 終止支持 (EOL)](https://v2.cn.vuejs.org/eol/)。
- 想從 Vue 2 升級？請參考[遷移指南](https://v3-migration.vuejs.org/)。
:::

<style src="@theme/styles/vue-mastery.css"></style>
<div class="vue-mastery-link">
  <a href="https://www.vuemastery.com/courses/" target="_blank">
    <div class="banner-wrapper">
      <img class="banner" alt="Vue Mastery banner" width="96px" height="56px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vuemastery-graphical-link-96x56.png" />
    </div>
    <p class="description">在 <span>VueMastery</span> 上觀看視頻課程學習 Vue</p>
    <div class="logo-wrapper">
        <img alt="Vue Mastery Logo" width="25px" src="https://storage.googleapis.com/vue-mastery.appspot.com/flamelink/media/vue-mastery-logo.png" />
    </div>
  </a>
</div>

## 什麼是 Vue？ {#what-is-vue}

Vue (發音為 /vjuː/，類似 **view**) 是一款用於構建用戶界面的 JavaScript 框架。它基於標準 HTML、CSS 和 JavaScript 構建，並提供了一套聲明式的、組件化的編程模型，幫助你高效地開發用戶界面。無論是簡單還是複雜的界面，Vue 都可以勝任。

下面是一個最基本的示例：

<div class="options-api">

```js
import { createApp } from 'vue'

createApp({
  data() {
    return {
      count: 0
    }
  }
}).mount('#app')
```

</div>
<div class="composition-api">

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

</div>

```vue-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
```

**結果展示**

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<div class="demo">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>

上面的例子展示了 Vue 的兩個核心功能：

- **聲明式渲染**：Vue 基於標準 HTML 拓展了一套模板語法，使得我們可以聲明式地描述最終輸出的 HTML 和 JavaScript 狀態之間的關係。

- **響應性**：Vue 會自動跟蹤 JavaScript 狀態並在其發生變化時響應式地更新 DOM。

你可能已經有了些疑問——先別急，在後續的文檔中我們會詳細介紹每一個細節。現在，請繼續看下去，以確保你對 Vue 作為一個框架到底提供了什麼有一個宏觀的瞭解。

:::tip 預備知識
文檔接下來的內容會假設你對 HTML、CSS 和 JavaScript 已經基本熟悉。如果你對前端開發完全陌生，最好不要直接從一個框架開始進行入門學習——建議掌握了基礎知識再回到這裡。如有需要，你可以通過這些 [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript)、[HTML](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Introduction_to_HTML) 和 [CSS](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/First_steps) 概述來檢驗你的知識水平。如果之前有其他框架的經驗會很有幫助，但並不是必須的。
:::

## 漸進式框架 {#the-progressive-framework}

Vue 是一個框架，也是一個生態。其功能覆蓋了大部分前端開發常見的需求。但 Web 世界是十分多樣化的，不同的開發者在 Web 上構建的東西可能在形式和規模上會有很大的不同。考慮到這一點，Vue 的設計非常注重靈活性和“可以被逐步集成”這個特點。根據你的需求場景，你可以用不同的方式使用 Vue：

- 無需構建步驟，漸進式增強靜態的 HTML
- 在任何頁面中作為 Web Components 嵌入
- 單頁應用 (SPA)
- 全棧 / 服務端渲染 (SSR)
- Jamstack / 靜態站點生成 (SSG)
- 開發桌面端、移動端、WebGL，甚至是命令行終端中的界面

如果你是初學者，可能會覺得這些概念有些複雜。別擔心！理解教程和指南的內容只需要具備基礎的 HTML 和 JavaScript 知識。即使你不是這些方面的專家，也能夠跟得上。

如果你是有經驗的開發者，希望瞭解如何以最合適的方式在項目中引入 Vue，或者是對上述的這些概念感到好奇，我們在[使用 Vue 的多種方式](/guide/extras/ways-of-using-vue)中討論了有關它們的更多細節。

無論再怎樣靈活，Vue 的核心知識在所有這些用例中都是通用的。即使你現在只是一個初學者，隨著你的不斷成長，到未來有能力實現更復雜的項目時，這一路上獲得的知識依然會適用。如果你已經是一個老手，你可以根據實際場景來選擇使用 Vue 的最佳方式，在各種場景下都可以保持同樣的開發效率。這就是為什麼我們將 Vue 稱為“漸進式框架”：它是一個可以與你共同成長、適應你不同需求的框架。

## 單文件組件 {#single-file-components}

在大多數啟用了構建工具的 Vue 項目中，我們可以使用一種類似 HTML 格式的文件來書寫 Vue 組件，它被稱為**單文件組件** (也被稱為 `*.vue` 文件，英文 Single-File Components，縮寫為 **SFC**)。顧名思義，Vue 的單文件組件會將一個組件的邏輯 (JavaScript)，模板 (HTML) 和樣式 (CSS) 封裝在同一個文件裡。下面我們將用單文件組件的格式重寫上面的計數器示例：

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">Count is: {{ count }}</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

</div>

單文件組件是 Vue 的標誌性功能。如果你的用例需要進行構建，我們推薦用它來編寫 Vue 組件。你可以在後續相關章節裡瞭解更多關於[單文件組件的用法及用途](/guide/scaling-up/sfc)。但你暫時只需要知道 Vue 會幫忙處理所有這些構建工具的配置就好。

## API 風格 {#api-styles}

Vue 的組件可以按兩種不同的風格書寫：**選項式 API** 和**組合式 API**。

### 選項式 API (Options API) {#options-api}

使用選項式 API，我們可以用包含多個選項的對象來描述組件的邏輯，例如 `data`、`methods` 和 `mounted`。選項所定義的屬性都會暴露在函數內部的 `this` 上，它會指向當前的組件實例。

```vue
<script>
export default {
  // data() 返回的屬性將會成為響應式的狀態
  // 並且暴露在 `this` 上
  data() {
    return {
      count: 0
    }
  },

  // methods 是一些用來更改狀態與觸發更新的函數
  // 它們可以在模板中作為事件處理器綁定
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命週期鉤子會在組件生命週期的各個不同階段被調用
  // 例如這個函數就會在組件掛載完成後被調用
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNptkMFqxCAQhl9lkB522ZL0HNKlpa/Qo4e1ZpLIGhUdl5bgu9es2eSyIMio833zO7NP56pbRNawNkivHJ25wV9nPUGHvYiaYOYGoK7Bo5CkbgiBBOFy2AkSh2N5APmeojePCkDaaKiBt1KnZUuv3Ky0PppMsyYAjYJgigu0oEGYDsirYUAP0WULhqVrQhptF5qHQhnpcUJD+wyQaSpUd/Xp9NysVY/yT2qE0dprIS/vsds5Mg9mNVbaDofL94jZpUgJXUKBCvAy76ZUXY53CTd5tfX2k7kgnJzOCXIF0P5EImvgQ2olr++cbRE4O3+t6JxvXj0ptXVpye1tvbFY+ge/NJZt)

### 組合式 API (Composition API) {#composition-api}


通過組合式 API，我們可以使用導入的 API 函數來描述組件邏輯。在單文件組件中，組合式 API 通常會與 [`<script setup>`](/api/sfc-script-setup) 搭配使用。這個 `setup` 屬性是一個標識，告訴 Vue 需要在編譯時進行一些處理，讓我們可以更簡潔地使用組合式 API。比如，`<script setup>` 中的導入和頂層變量/函數都能夠在模板中直接使用。

下面是使用了組合式 API 與 `<script setup>` 改造後和上面的模板完全一樣的組件：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 響應式狀態
const count = ref(0)

// 用來修改狀態、觸發更新的函數
function increment() {
  count.value++
}

// 生命週期鉤子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNpNkMFqwzAQRH9lMYU4pNg9Bye09NxbjzrEVda2iLwS0spQjP69a+yYHnRYad7MaOfiw/tqSliciybqYDxDRE7+qsiM3gWGGQJ2r+DoyyVivEOGLrgRDkIdFCmqa1G0ms2EELllVKQdRQa9AHBZ+PLtuEm7RCKVd+ChZRjTQqwctHQHDqbvMUDyd7mKip4AGNIBRyQujzArgtW/mlqb8HRSlLcEazrUv9oiDM49xGGvXgp5uT5his5iZV1f3r4HFHvDprVbaxPhZf4XkKub/CDLaep1T7IhGRhHb6WoTADNT2KWpu/aGv24qGKvrIrr5+Z7hnneQnJu6hURvKl3ryL/ARrVkuI=)

### 該選哪一個？{#which-to-choose}

兩種 API 風格都可以覆蓋大部分的應用場景。它們只是同一個底層系統所提供的兩套不同的接口。實際上，選項式 API 是在組合式 API 的基礎上實現的！關於 Vue 的基礎概念和知識在它們之間都是通用的。

選項式 API 以“組件實例”的概念為中心 (即上述例子中的 `this`)，對於有面向對象語言背景的用戶來說，這通常與基於類的心智模型更為一致。同時，它將響應性相關的細節抽象出來，並強制按照選項來組織代碼，從而對初學者而言更為友好。

組合式 API 的核心思想是直接在函數作用域內定義響應式狀態變量，並將從多個函數中得到的狀態組合起來處理複雜問題。這種形式更加自由，也需要你對 Vue 的響應式系統有更深的理解才能高效使用。相應的，它的靈活性也使得組織和重用邏輯的模式變得更加強大。

在[組合式 API FAQ](/guide/extras/composition-api-faq) 章節中，你可以瞭解更多關於這兩種 API 風格的對比以及組合式 API 所帶來的潛在收益。

如果你是使用 Vue 的新手，這裡是我們的大致建議：

- 在學習的過程中，推薦採用更易於自己理解的風格。再強調一下，大部分的核心概念在這兩種風格之間都是通用的。熟悉了一種風格以後，你也能夠很快地理解另一種風格。

- 在生產項目中：

  - 當你不需要使用構建工具，或者打算主要在低複雜度的場景中使用 Vue，例如漸進增強的應用場景，推薦採用選項式 API。

  - 當你打算用 Vue 構建完整的單頁應用，推薦採用組合式 API + 單文件組件。

在學習階段，你不必只固守一種風格。在接下來的文檔中我們會為你提供一系列兩種風格的代碼供你參考，你可以隨時通過左上角的 **API 風格偏好**來做切換。

## 還有其他問題？ {#still-got-questions}

請查看我們的 [FAQ](/about/faq)。

## 選擇你的學習路徑 {#pick-your-learning-path}

不同的開發者有不同的學習方式。儘管在可能的情況下，我們推薦你通讀所有內容，但你仍然可以自由地選擇一種自己喜歡的學習路徑！

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">嘗試互動教程</p>
    <p class="next-steps-caption">適合喜歡邊動手邊學的讀者。</p>
  </a>
  <a class="vt-box" href="/guide/quick-start.html">
    <p class="next-steps-link">繼續閱讀該指南</p>
    <p class="next-steps-caption">該指南會帶你深入瞭解框架所有方面的細節。</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">查看示例</p>
    <p class="next-steps-caption">瀏覽核心功能和常見用戶界面的示例。</p>
  </a>
</div>
