---
outline: deep
---

# 組合式 API 常見問答 {#composition-api-faq}

:::tip
這個 FAQ 假定你已經有一些使用 Vue 的經驗，特別是在 Vue 2 使用選項式 API 的經驗。
:::

## 什麼是組合式 API？ {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="免費的組合式 API 課程"/>

組合式 API (Composition API) 是一系列 API 的集合，使我們可以使用函數而不是聲明選項的方式書寫 Vue 組件。它是一個概括性的術語，涵蓋了以下方面的 API：

- [響應式 API](/api/reactivity-core)：例如 `ref()` 和 `reactive()`，使我們可以直接創建響應式狀態、計算屬性和偵聽器。

- [生命週期鉤子](/api/composition-api-lifecycle)：例如 `onMounted()` 和 `onUnmounted()`，使我們可以在組件各個生命週期階段添加邏輯。

- [依賴注入](/api/composition-api-dependency-injection)：例如 `provide()` 和 `inject()`，使我們可以在使用響應式 API 時，利用 Vue 的依賴注入系統。

組合式 API 是 Vue 3 及 [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html) 的內置功能。對於更老的 Vue 2 版本，可以使用官方維護的插件 [`@vue/composition-api`](https://github.com/vuejs/composition-api)。在 Vue 3 中，組合式 API 基本上都會配合 [`<script setup>`](/api/sfc-script-setup.html) 語法在單文件組件中使用。下面是一個使用組合式 API 的組件示例：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 響應式狀態
const count = ref(0)

// 更改狀態、觸發更新的函數
function increment() {
  count.value++
}

// 生命週期鉤子
onMounted(() => {
  console.log(`計數器初始值為 ${count.value}。`)
})
</script>

<template>
  <button @click="increment">點擊了：{{ count }} 次</button>
</template>
```

雖然這套 API 的風格是基於函數的組合，但**組合式 API 並不是函數式編程**。組合式 API 是以 Vue 中數據可變的、細粒度的響應性系統為基礎的，而函數式編程通常強調數據不可變。

如果你對如何通過組合式 API 使用 Vue 感興趣，可以通過頁面左側邊欄上方的開關將 API 偏好切換到組合式 API，然後重新從頭閱讀指引。

## 為什麼要有組合式 API？ {#why-composition-api}

### 更好的邏輯複用 {#better-logic-reuse}

組合式 API 最基本的優勢是它使我們能夠通過[組合函數](/guide/reusability/composables)來實現更加簡潔高效的邏輯複用。在選項式 API 中我們主要的邏輯複用機制是 mixins，而組合式 API 解決了 [mixins 的所有缺陷](/guide/reusability/composables#vs-mixins)。

組合式 API 提供的邏輯複用能力衍生了一些非常棒的社區項目，例如 [VueUse](https://vueuse.org/)，一個不斷成長的工具型組合式函數集合。組合式 API 還為其他第三方狀態管理庫與 Vue 的響應式系統之間的集成提供了一套簡潔清晰的機制，例如[不可變數據](/guide/extras/reactivity-in-depth#immutable-data)、[狀態機](/guide/extras/reactivity-in-depth#state-machines)與 [RxJS](/guide/extras/reactivity-in-depth#rxjs)。

### 更靈活的代碼組織 {#more-flexible-code-organization}

許多用戶喜歡選項式 API 的原因是它在默認情況下就能夠讓人寫出有組織的代碼：大部分代碼都自然地被放進了對應的選項裡。然而，選項式 API 在單個組件的邏輯複雜到一定程度時，會面臨一些無法忽視的限制。這些限制主要體現在需要處理多個**邏輯關注點**的組件中，這是我們在許多 Vue 2 的實際案例中所觀察到的。

我們以 Vue CLI GUI 中的文件瀏覽器組件為例：這個組件承擔了以下幾個邏輯關注點：

- 追蹤當前文件夾的狀態，展示其內容
- 處理文件夾的相關操作 (打開、關閉和刷新)
- 支持創建新文件夾
- 可以切換到只展示收藏的文件夾
- 可以開啟對隱藏文件夾的展示
- 處理當前工作目錄中的變更

這個組件[最原始的版本](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404)是由選項式 API 寫成的。如果我們為相同的邏輯關注點標上一種顏色，那將會是這樣：

<img alt="folder component before" src="https://user-images.githubusercontent.com/499550/62783021-7ce24400-ba89-11e9-9dd3-36f4f6b1fae2.png" width="129" height="500" style="margin: 1.2em auto">

你可以看到，處理相同邏輯關注點的代碼被強制拆分在了不同的選項中，位於文件的不同部分。在一個幾百行的大組件中，要讀懂代碼中的一個邏輯關注點，需要在文件中反覆上下滾動，這並不理想。另外，如果我們想要將一個邏輯關注點抽取重構到一個可複用的工具函數中，需要從文件的多個不同部分找到所需的正確片段。

而如果[用組合式 API 重構](https://github.com/vuejs-translations/docs-zh-hk/blob/main/assets/FileExplorer.vue)這個組件，將會變成下面右邊這樣：

![重構後的文件夾組件](https://user-images.githubusercontent.com/499550/62783026-810e6180-ba89-11e9-8774-e7771c8095d6.png)

現在與同一個邏輯關注點相關的代碼被歸為了一組：我們無需再為了一個邏輯關注點在不同的選項塊間來回滾動切換。此外，我們現在可以很輕鬆地將這一組代碼移動到一個外部文件中，不再需要為了抽象而重新組織代碼，大大降低了重構成本，這在長期維護的大型項目中非常關鍵。

### 更好的類型推導 {#better-type-inference}

近幾年來，越來越多的開發者開始使用 [TypeScript](https://www.typescriptlang.org/) 書寫更健壯可靠的代碼，TypeScript 還提供了非常好的 IDE 開發支持。然而選項式 API 是在 2013 年被設計出來的，那時並沒有把類型推導考慮進去，因此我們不得不做了一些[複雜到誇張的類型體操](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165)才實現了對選項式 API 的類型推導。但儘管做了這麼多的努力，選項式 API 的類型推導在處理 mixins 和依賴注入類型時依然不甚理想。

因此，很多想要搭配 TS 使用 Vue 的開發者採用了由 `vue-class-component` 提供的 Class API。然而，基於 Class 的 API 非常依賴 ES 裝飾器，在 2019 年我們開始開發 Vue 3 時，它仍是一個僅處於 stage 2 的語言功能。我們認為基於一個不穩定的語言提案去設計框架的核心 API 風險實在太大了，因此沒有繼續向 Class API 的方向發展。在那之後裝飾器提案果然又發生了很大的變動，在 2022 年才終於到達 stage 3。另一個問題是，基於 Class 的 API 和選項式 API 在邏輯複用和代碼組織方面存在相同的限制。

相比之下，組合式 API 主要利用基本的變量和函數，它們本身就是類型友好的。用組合式 API 重寫的代碼可以享受到完整的類型推導，不需要書寫太多類型標註。大多數時候，用 TypeScript 書寫的組合式 API 代碼和用 JavaScript 寫都差不太多！這也讓許多純 JavaScript 用戶也能從 IDE 中享受到部分類型推導功能。

### 更小的生產包體積 {#smaller-production-bundle-and-less-overhead}

搭配 `<script setup>` 使用組合式 API 比等價情況下的選項式 API 更高效，對代碼壓縮也更友好。這是由於 `<script setup>` 形式書寫的組件模板被編譯為了一個內聯函數，和 `<script setup>` 中的代碼位於同一作用域。不像選項式 API 需要依賴 `this` 上下文對象訪問屬性，被編譯的模板可以直接訪問 `<script setup>` 中定義的變量，無需從實例中代理。這對代碼壓縮更友好，因為本地變量的名字可以被壓縮，但對象的屬性名則不能。

## 與選項式 API 的關係 {#relationship-with-options-api}

### 取捨 {#trade-offs}

一些從選項式 API 遷移來的用戶發現，他們的組合式 API 代碼缺乏組織性，並得出了組合式 API 在代碼組織方面“更糟糕”的結論。我們建議持有這類觀點的用戶換個角度思考這個問題。

組合式 API 不像選項式 API 那樣會手把手教你該把代碼放在哪裡。但反過來，它卻讓你可以像編寫普通的 JavaScript 那樣來編寫組件代碼。這意味著**你能夠，並且應該在寫組合式 API 的代碼時也運用上所有普通 JavaScript 代碼組織的最佳實踐**。如果你可以編寫組織良好的 JavaScript，你也應該有能力編寫組織良好的組合式 API 代碼。

選項式 API 確實允許你在編寫組件代碼時“少思考”，這是許多用戶喜歡它的原因。然而，在減少費神思考的同時，它也將你鎖定在規定的代碼組織模式中，沒有擺脫的餘地，這會導致在更大規模的項目中難以進行重構或提高代碼質量。在這方面，組合式 API 提供了更好的長期可維護性。

### 組合式 API 是否覆蓋了所有場景？ {#does-composition-api-cover-all-use-cases}

組合式 API 能夠覆蓋所有狀態邏輯方面的需求。除此之外，只需要用到一小部分選項：`props`，`emits`，`name` 和 `inheritAttrs`。

:::tip

從 3.3 開始你可以直接通過 `<script setup>` 中的 `defineOptions` 來設置組件名或 `inheritAttrs` 屬性。

:::

如果你在代碼中只使用了組合式 API (以及上述必需的選項)，那麼你可以通過配置[編譯時標記](/api/compile-time-flags)來去掉 Vue 運行時中針對選項式 API 支持的代碼，從而減小生產包大概幾 kb 左右的體積。注意這個配置也會影響你依賴中的 Vue 組件。

### 可以在同一個組件中使用兩種 API 嗎？ {#can-i-use-both-apis-in-the-same-component}

可以。你可以在一個選項式 API 的組件中通過 [`setup()`](/api/composition-api-setup) 選項來使用組合式 API。

然而，我們只推薦你在一個已經基於選項式 API 開發了很久、但又需要和基於組合式 API 的新代碼或是第三方庫整合的項目中這樣做。

### 選項式 API 會被廢棄嗎？ {#will-options-api-be-deprecated}

不會，我們沒有任何計劃這樣做。選項式 API 也是 Vue 不可分割的一部分，也有很多開發者喜歡它。我們也意識到組合式 API 更適用於大型的項目，而對於中小型項目來說選項式 API 仍然是一個不錯的選擇。

## 與 Class API 的關係 {#relationship-with-class-api}

我們不再推薦在 Vue 3 中使用 Class API，因為組合式 API 提供了很好的 TypeScript 集成，並具有額外的邏輯重用和代碼組織優勢。

## 和 React Hooks 的對比 {#comparison-with-react-hooks}

組合式 API 提供了和 React Hooks 相同級別的邏輯組織能力，但它們之間有著一些重要的區別。

React Hooks 在組件每次更新時都會重新調用。這就產生了一些即使是經驗豐富的 React 開發者也會感到困惑的問題。這也帶來了一些性能問題，並且相當影響開發體驗。例如：

- Hooks 有嚴格的調用順序，並不可以寫在條件分支中。

- React 組件中定義的變量會被一個鉤子函數閉包捕獲，若開發者傳遞了錯誤的依賴數組，它會變得“過期”。這導致了 React 開發者非常依賴 ESLint 規則以確保傳遞了正確的依賴，然而，這些規則往往不夠智能，保持正確的代價過高，在一些邊緣情況時會遇到令人頭疼的、不必要的報錯信息。

- 昂貴的計算需要使用 `useMemo`，這也需要傳入正確的依賴數組。

- 在默認情況下，傳遞給子組件的事件處理函數會導致子組件進行不必要的更新。子組件默認更新，並需要顯式的調用 `useCallback` 作優化。這個優化同樣需要正確的依賴數組，並且幾乎在任何時候都需要。忽視這一點會導致默認情況下對應用進行過度渲染，並可能在不知不覺中導致性能問題。

- 要解決變量閉包導致的問題，再結合併發功能，使得很難推理出一段鉤子代碼是什麼時候運行的，並且很不好處理需要在多次渲染間保持引用 (通過 `useRef`) 的可變狀態。

相比起來，Vue 的組合式 API：

- 僅調用 `setup()` 或 `<script setup>` 的代碼一次。這使得代碼更符合日常 JavaScript 的直覺，不需要擔心閉包變量的問題。組合式 API 也並不限制調用順序，還可以有條件地進行調用。

- Vue 的響應性系統運行時會自動收集計算屬性和偵聽器的依賴，因此無需手動聲明依賴。

- 無需手動緩存回調函數來避免不必要的組件更新。Vue 細粒度的響應性系統能夠確保在絕大部分情況下組件僅執行必要的更新。對 Vue 開發者來說幾乎不怎麼需要對子組件更新進行手動優化。

我們承認 React Hooks 的創造性，它是組合式 API 的一個主要靈感來源。然而，它的設計也確實存在上面提到的問題，而 Vue 的響應性模型正好提供了一種解決這些問題的方法。
