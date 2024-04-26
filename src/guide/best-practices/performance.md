---
outline: deep
---

# 性能優化 {#performance}

## 概述 {#overview}

Vue 在大多數常見場景下性能都是很優秀的，通常不需要手動優化。然而，總會有一些具有挑戰性的場景需要進行針對性的微調。在本節中，我們將討論用 Vue 開發的應用在性能方面該注意些什麼。

首先，讓我們區分一下 web 應用性能的兩個主要方面：

- **頁面加載性能**：首次訪問時，應用展示出內容與達到可交互狀態的速度。這通常會用 Google 所定義的一系列 [Web 指標](https://web.dev/vitals/#core-web-vitals) (Web Vitals) 來進行衡量，如[最大內容繪製](https://web.dev/lcp/) (Largest Contentful Paint，縮寫為 LCP) 和[首次輸入延遲](https://web.dev/fid/) (First Input Delay，縮寫為 FID)。

- **更新性能**：應用響應用戶輸入更新的速度。比如當用戶在搜索框中輸入時結果列表的更新速度，或者用戶在一個單頁面應用 (SPA) 中點擊鏈接跳轉頁面時的切換速度。

雖然最理想的情況是將兩者都最大化，但是不同的前端架構往往會影響到在這些方面是否能達到更理想的性能。此外，你所構建的應用的類型極大地影響了你在性能方面應該優先考慮的問題。因此，優化性能的第一步是為你的應用類型確定合適的架構：

- 查看[使用 Vue 的多種方式](/guide/extras/ways-of-using-vue)這一章看看如何用不同的方式圍繞 Vue 組織架構。

- Jason Miller 在 [Application Holotypes](https://jasonformat.com/application-holotypes/) 一文中討論了 Web 應用的類型以及它們各自的理想實現/交付方式。

## 分析選項 {#profiling-options}

為了提高性能，我們首先需要知道如何衡量它。在這方面，有一些很棒的工具可以提供幫助：

用於生產部署的負載性能分析：

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

用於本地開發期間的性能分析：

- [Chrome 開發者工具“性能”面板](https://developer.chrome.com/docs/devtools/evaluate-performance/)
  - [`app.config.performance`](/api/application#app-config-performance) 將會開啟 Vue 特有的性能標記，標記在 Chrome 開發者工具的性能時間線上。
- [Vue 開發者擴展](/guide/scaling-up/tooling#browser-devtools)也提供了性能分析的功能。

## 頁面加載優化 {#page-load-optimizations}

頁面加載優化有許多跟框架無關的方面 - 這份 [web.dev 指南](https://web.dev/fast/)提供了一個全面的總結。這裡，我們將主要關注和 Vue 相關的技巧。

### 選用正確的架構 {#choosing-the-right-architecture}

如果你的用例對頁面加載性能很敏感，請避免將其部署為純客戶端的 SPA，而是讓服務器直接發送包含用戶想要查看的內容的 HTML 代碼。純客戶端渲染存在首屏加載緩慢的問題，這可以通過[服務器端渲染 (SSR)](/guide/extras/ways-of-using-vue#fullstack-ssr) 或[靜態站點生成 (SSG)](/guide/extras/ways-of-using-vue#jamstack-ssg) 來緩解。查看 [SSR 指南](/guide/scaling-up/ssr)以了解如何使用 Vue 實現 SSR。如果應用對交互性要求不高，你還可以使用傳統的後端服務器來渲染 HTML，並在客戶端使用 Vue 對其進行增強。

如果你的主應用必須是 SPA，但還有其他的營銷相關頁面 (落地頁、關於頁、博客等)，請單獨部署這些頁面！理想情況下，營銷頁面應該是包含儘可能少 JS 的靜態 HTML，並用 SSG 方式部署。

### 包體積與 Tree-shaking 優化 {#bundle-size-and-tree-shaking}

一個最有效的提升頁面加載速度的方法就是壓縮 JavaScript 打包產物的體積。當使用 Vue 時有下面一些辦法來減小打包產物體積：

- 盡量使用構建步驟

  - 如果使用的是相對現代的打包工具，許多 Vue 的 API 都是可以被 [tree-shake](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) 的。舉例來說，如果你根本沒有使用到內置的 `<Transition>` 組件，它將不會被打包進入最終的產物裡。Tree-shaking 也可以移除你源代碼中其他未使用到的模塊。

  - 當使用了構建步驟時，模板會被預編譯，因此我們無須在瀏覽器中載入 Vue 編譯器。這在同樣最小化加上 gzip 優化下會相對縮小 **14kb** 並避免運行時的編譯開銷。

- 在引入新的依賴項時要小心包體積膨脹！在現實的應用中，包體積膨脹通常因為無意識地引入了過重的依賴導致的。

  - 如果使用了構建步驟，應當盡量選擇提供 ES 模塊格式的依賴，它們對 tree-shaking 更友好。舉例來說，選擇 `lodash-es` 比 `lodash` 更好。

  - 查看依賴的體積，並評估與其所提供的功能之間的性價比。如果依賴對 tree-shaking 友好，實際增加的體積大小將取決於你從它之中導入的 API。像 [bundlejs.com](https://bundlejs.com/) 這樣的工具可以用來做快速的檢查，但是根據實際的構建設置來評估總是最準確的。

- 如果你只在漸進式增強的場景下使用 Vue，並想要避免使用構建步驟，請考慮使用 [petite-vue](https://github.com/vuejs/petite-vue) (只有 **6kb**) 來代替。

### 代碼分割 {#code-splitting}

代碼分割是指構建工具將構建後的 JavaScript 包拆分為多個較小的，可以按需或並行加載的文件。通過適當的代碼分割，頁面加載時需要的功能可以立即下載，而額外的塊只在需要時才加載，從而提高性能。

像 Rollup (Vite 就是基於它之上開發的) 或者 webpack 這樣的打包工具可以通過分析 ESM 動態導入的語法來自動進行代碼分割：

```js
// lazy.js 及其依賴會被拆分到一個單獨的文件中
// 並只在 `loadLazy()` 調用時才加載
function loadLazy() {
  return import('./lazy.js')
}
```

懶加載對於頁面初次加載時的優化幫助極大，它幫助應用暫時略過了那些不是立即需要的功能。在 Vue 應用中，這可以與 Vue 的[異步組件](/guide/components/async)搭配使用，為組件樹創建分離的代碼塊：

```js
import { defineAsyncComponent } from 'vue'

// 會為 Foo.vue 及其依賴創建單獨的一個塊
// 它只會按需加載
//（即該異步組件在頁面中被渲染時）
const Foo = defineAsyncComponent(() => import('./Foo.vue'))
```

對於使用了 Vue Router 的應用，強烈建議使用異步組件作為路由組件。Vue Router 已經顯性地支持了獨立於 `defineAsyncComponent` 的懶加載。查看[懶加載路由](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)了解更多細節。

## 更新優化 {#update-optimizations}

### Props 穩定性 {#props-stability}

在 Vue 之中，一個子組件只會在其至少一個 props 改變時才會更新。思考以下示例：

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active-id="activeId" />
```

在 `<ListItem>` 組件中，它使用了 `id` 和 `activeId` 兩個 props 來確定它是否是當前活躍的那一項。雖然這是可行的，但問題是每當 `activeId` 更新時，列表中的**每一個** `<ListItem>` 都會跟著更新！

理想情況下，只有活躍狀態發生改變的項才應該更新。我們可以將活躍狀態比對的邏輯移入父組件來實現這一點，然後讓 `<ListItem>` 改為接收一個 `active` prop：

```vue-html
<ListItem
  v-for="item in list"
  :id="item.id"
  :active="item.id === activeId" />
```

現在，對於大多數的組件來說，`activeId` 改變時，它們的 `active` prop 都會保持不變，因此它們無需再更新。總括而言，這個技巧的核心思想就是讓傳給子組件的 props 盡量保持穩定。

### `v-once` {#v-once}

`v-once` 是一個內置的指令，可以用來渲染依賴運行時數據但無需再更新的內容。它的整個子樹都會在未來的更新中被跳過。查看它的 [API 參考手冊](/api/built-in-directives#v-once)可以了解更多細節。

### `v-memo` {#v-memo}

`v-memo` 是一個內置指令，可以用來有條件地跳過某些大型子樹或者 `v-for` 列表的更新。查看它的 [API 參考手冊](/api/built-in-directives#v-memo)可以了解更多細節。

### 計算屬性穩定性 <sup class="vt-badge" data-text="3.4+" /> {#computed-stability}

從 3.4 開始，計算屬性僅在其計算值較前一個值發生更改時才會觸發副作用。例如，以下 `isEven` 計算屬性僅在返回值從 `true` 更改為 `false` 時才會觸發副作用，反之亦然：

```js
const count = ref(0)
const isEven = computed(() => count.value % 2 === 0)

watchEffect(() => console.log(isEven.value)) // true

// will not trigger new logs because the computed value stays `true`
count.value = 2
count.value = 4
```

這減少了非必要副作用的觸發。但不幸的是，如果計算屬性在每次計算時都創建一個新對象，則不起作用：

```js
const computedObj = computed(() => {
  return {
    isEven: count.value % 2 === 0
  }
})
```

由於每次都會創建一個新對象，因此從技術上講，新舊值始終不同。即使 `isEven` 屬性保持不變，Vue 也無法知道，除非它對舊值和新值進行深度比較。這種比較可能代價高昂，並不值得。

相反，我們可以通過手動比較新舊值來優化。如果我們知道沒有變化，則有條件地返回舊值：

```js
const computedObj = computed((oldValue) => {
  const newValue = {
    isEven: count.value % 2 === 0
  }
  if (oldValue && oldValue.isEven === newValue.isEven) {
    return oldValue
  }
  return newValue
})
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqVVMtu2zAQ/JUFgSZK4UpuczMkow/40AJ9IC3aQ9mDIlG2EokUyKVt1PC/d0lKtoEminMQQC1nZ4c7S+7Yu66L11awGUtNoesOwQi03ZzLuu2URtiBFtUECtV2FkU5gU2OxWpRVaJA2EOlVQuXxHDJJZeFkgYJayVC5hKj6dUxLnzSjZXmV40rZfFrh3Vb/82xVrLH//5DCQNNKPkweNiNVFP+zBsrIJvDjksgGrRahjVAbRZrIWdBVLz2yBfwBrIsg6mD7LncPyryfIVnywupUmz68HOEEqqCI+XFBQzrOKR79MDdx66GCn1jhpQDZx8f0oZ+nBgdRVcH/aMuBt1xZ80qGvGvh/X6nlXwnGpPl6qsLLxTtitzFFTNl0oSN/79AKOCHHQuS5pw4XorbXsr9ImHZN7nHFdx1SilI78MeOJ7Ca+nbvgd+GgomQOv6CNjSQqXaRJuHd03+kHRdg3JoT+A3a7XsfcmpbcWkQS/LZq6uM84C8o5m4fFuOg0CemeOXXX2w2E6ylsgj2gTgeYio/f1l5UEqj+Z3yC7lGuNDlpApswNNTrql7Gd0ZJeqW8TZw5t+tGaMdDXnA2G4acs7xp1OaTj6G2YjLEi5Uo7h+I35mti3H2TQsj9Jp6etjDXC8Fhu3F9y9iS+vDZqtK2xB6ZPNGGNVYpzHA3ltZkuwTnFf70b+1tVz+MIstCmmGQzmh/p56PGf00H4YOfpR7nV8PTxubP8P2GAP9Q==)

值得注意的是，你應該始終在比較和返回舊值之前執行完整計算，以便在每次運行時都可以收集到相同的依賴項。

## 通用優化 {#general-optimizations}

> 以下技巧能同時改善頁面加載和更新性能。

### 大型虛擬列表 {#virtualize-large-lists}

所有的前端應用中最常見的性能問題就是渲染大型列表。無論一個框架性能有多好，渲染成千上萬個列表項**都會**變得很慢，因為瀏覽器需要處理大量的 DOM 節點。

但是，我們並不需要立刻渲染出全部的列表。在大多數場景中，用戶的屏幕尺寸只會展示這個巨大列表中的一小部分。我們可以通過**列表虛擬化**來提升性能，這項技術使我們只需要渲染用戶視口中能看到的部分。

要實現列表虛擬化並不簡單，幸運的是，你可以直接使用現有的社區庫：

- [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- [vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)
- [vueuc/VVirtualList](https://github.com/07akioni/vueuc)

### 減少大型不可變數據的響應性開銷 {#reduce-reactivity-overhead-for-large-immutable-structures}

Vue 的響應性系統默認是深度的。雖然這讓狀態管理變得更直觀，但在數據量巨大時，深度響應性也會導致不小的性能負擔，因為每個屬性訪問都將觸發代理的依賴追蹤。好在這種性能負擔通常只有在處理超大型數組或層級很深的對象時，例如一次渲染需要訪問 100,000+ 個屬性時，才會變得比較明顯。因此，它只會影響少數特定的場景。

Vue 確實也為此提供了一種解決方案，通過使用 [`shallowRef()`](/api/reactivity-advanced#shallowref) 和 [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) 來繞開深度響應。淺層式 API 創建的狀態只在其頂層是響應式的，對所有深層的對象不會做任何處理。這使得對深層級屬性的訪問變得更快，但代價是，我們現在必須將所有深層級對象視為不可變的，並且只能通過替換整個根狀態來觸發更新：

```js
const shallowArray = shallowRef([
  /* 巨大的列表，裡面包含深層的對象 */
])

// 這不會觸發更新...
shallowArray.value.push(newObject)
// 這才會觸發更新
shallowArray.value = [...shallowArray.value, newObject]

// 這不會觸發更新...
shallowArray.value[0].foo = 1
// 這才會觸發更新
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1
  },
  ...shallowArray.value.slice(1)
]
```

### 避免不必要的組件抽象 {#avoid-unnecessary-component-abstractions}

有些時候我們會去創建[無渲染組件](/guide/components/slots#renderless-components)或高階組件 (用來渲染具有額外 props 的其他組件) 來實現更好的抽象或代碼組織。雖然這並沒有什麼問題，但請記住，組件實例比普通 DOM 節點要昂貴得多，而且為了邏輯抽象創建太多組件實例將會導致性能損失。

需要提醒的是，只減少幾個組件實例對於性能不會有明顯的改善，所以如果一個用於抽象的組件在應用中只會渲染幾次，就不用操心去優化它了。考慮這種優化的最佳場景還是在大型列表中。想象一下一個有 100 項的列表，每項的組件都包含許多子組件。在這裡去掉一個不必要的組件抽象，可能會減少數百個組件實例的無謂性能消耗。
