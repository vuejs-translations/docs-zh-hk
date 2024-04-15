# 狀態管理 {#state-management}

## 什麼是狀態管理？ {#what-is-state-management}

理論上來說，每一個 Vue 組件實例都已經在“管理”它自己的響應式狀態了。我們以一個簡單的計數器組件為例：

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

// 狀態
const count = ref(0)

// 動作
function increment() {
  count.value++
}
</script>

<!-- 視圖 -->
<template>{{ count }}</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  // 狀態
  data() {
    return {
      count: 0
    }
  },
  // 動作
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- 視圖 -->
<template>{{ count }}</template>
```

</div>

它是一個獨立的單元，由以下幾個部分組成：

- **狀態**：驅動整個應用的數據源；
- **視圖**：對**狀態**的一種聲明式映射；
- **交互**：狀態根據用戶在**視圖**中的輸入而作出相應變更的可能方式。

下面是“單向數據流”這一概念的簡單圖示：

<p style="text-align: center">
  <img alt="state flow diagram" src="./images/state-flow.png" width="252px" style="margin: 40px auto">
</p>

然而，當我們有**多個組件共享一個共同的狀態**時，就沒有這麼簡單了：

1. 多個視圖可能都依賴於同一份狀態。
2. 來自不同視圖的交互也可能需要更改同一份狀態。

對於情景 1，一個可行的辦法是將共享狀態“提升”到共同的父級組件上去，再通過 props 傳遞下來。然而在深層次的組件樹結構中這麼做的話，很快就會使得代碼變得繁瑣冗長。這會導致另一個問題：[Prop 逐級透傳問題](/guide/components/provide-inject#prop-drilling)。

對於情景 2，我們經常發現自己會直接通過模板引用獲取父/子實例，或者通過觸發的事件嘗試改變和同步多個狀態的副本。但這些模式的健壯性都不甚理想，很容易就會導致代碼難以維護。

一個更簡單直接的解決方案是抽取出組件間的共享狀態，放在一個全局單例中來管理。這樣我們的組件樹就變成了一個大的“視圖”，而任何位置上的組件都可以訪問其中的狀態或觸發動作。

## 用響應式 API 做簡單狀態管理 {#simple-state-management-with-reactivity-api}

<div class="options-api">

在選項式 API 中，響應式數據是用 `data()` 選項聲明的。在內部，`data()` 的返回值對象會通過 [`reactive()`](/api/reactivity-core#reactive) 這個公開的 API 函數轉為響應式。

</div>

如果你有一部分狀態需要在多個組件實例間共享，你可以使用 [`reactive()`](/api/reactivity-core#reactive) 來創建一個響應式對象，並將它導入到多個組件中：

```js
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```

<div class="composition-api">

```vue
<!-- ComponentA.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```

</div>
<div class="options-api">

```vue
<!-- ComponentA.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From A: {{ store.count }}</template>
```

```vue
<!-- ComponentB.vue -->
<script>
import { store } from './store.js'

export default {
  data() {
    return {
      store
    }
  }
}
</script>

<template>From B: {{ store.count }}</template>
```

</div>

現在每當 `store` 對象被更改時，`<ComponentA>` 與 `<ComponentB>` 都會自動更新它們的視圖。現在我們有了單一的數據源。

然而，這也意味著任意一個導入了 `store` 的組件都可以隨意修改它的狀態：

```vue-html{2}
<template>
  <button @click="store.count++">
    From B: {{ store.count }}
  </button>
</template>
```

雖然這在簡單的情況下是可行的，但從長遠來看，可以被任何組件任意改變的全局狀態是不太容易維護的。為了確保改變狀態的邏輯像狀態本身一樣集中，建議在 store 上定義方法，方法的名稱應該要能表達出行動的意圖：

```js{6-8}
// store.js
import { reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
```

```vue-html{2}
<template>
  <button @click="store.increment()">
    From B: {{ store.count }}
  </button>
</template>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNrNkk1uwyAQha8yYpNEiUzXllPVrtRTeJNSqtLGgGBsVbK4ewdwnT9FWWSTFczwmPc+xMhqa4uhl6xklRdOWQQvsbfPrVadNQ7h1dCqpcYaPp3pYFHwQyteXVxKm0tpM0krnm3IgAqUnd3vUFIFUB1Z8bNOkzoVny+wDTuNcZ1gBI/GSQhzqlQX3/5Gng81pA1t33tEo+FF7JX42bYsT1BaONlRguWqZZMU4C261CWMk3EhTK8RQphm8Twse/BscoUsvdqDkTX3kP3nI6aZwcmdQDUcMPJPabX8TQphtCf0RLqd1csxuqQAJTxtYnEUGtIpAH4pn1Ou17FDScOKhT+QNAVM)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNrdU8FqhDAU/JVHLruyi+lZ3FIt9Cu82JilaTWR5CkF8d8bE5O1u1so9FYQzAyTvJnRTKTo+3QcOMlIbpgWPT5WUnS90gjPyr4ll1jAWasOdim9UMum3a20vJWWqxSgkvzTyRt+rocWYVpYFoQm8wRsJh+viHLBcyXtk9No2ALkXd/WyC0CyDfW6RVTOiancQM5ku+x7nUxgUGlOcwxn8Ppu7HJ7udqaqz3SYikOQ5aBgT+OA9slt9kasToFnb5OiAqCU+sFezjVBHvRUimeWdT7JOKrFKAl8VvYatdI6RMDRJhdlPtWdQf5mdQP+SHdtyX/IftlH9pJyS1vcQ2NK8ZivFSiL8BsQmmpMG1s1NU79frYA1k8OD+/I3pUA6+CeNdHg6hmoTMX9pPSnk=)

</div>

:::tip
請注意這裡點擊的處理函數使用了 `store.increment()`，帶上了圓括號作為內聯表達式調用，因為它並不是組件的方法，並且必須要以正確的 `this` 上下文來調用。
:::

除了我們這裡用到的單個響應式對象作為一個 store 之外，你還可以使用其他[響應式 API](/api/reactivity-core) 例如 `ref()` 或是 `computed()`，或是甚至通過一個[組合式函數](/guide/reusability/composables)來返回一個全局狀態：

```js
import { ref } from 'vue'

// 全局狀態，創建在模塊作用域下
const globalCount = ref(1)

export function useCount() {
  // 局部狀態，每個組件都會創建
  const localCount = ref(1)

  return {
    globalCount,
    localCount
  }
}
```

事實上，Vue 的響應性系統與組件層是解耦的，這讓它變得非常靈活。

## SSR 相關細節 {#ssr-considerations}

如果你正在構建一個需要利用[服務端渲染 (SSR)](./ssr) 的應用，由於 store 是跨多個請求共享的單例，上述模式可能會導致問題。這在 SSR 指引那一章節會討論[更多細節](./ssr#cross-request-state-pollution)。

## Pinia {#pinia}

雖然我們的手動狀態管理解決方案在簡單的場景中已經足夠了，但是在大規模的生產應用中還有很多其他事項需要考慮：

- 更強的團隊協作約定
- 與 Vue DevTools 集成，包括時間軸、組件內部審查和時間旅行調試
- 模塊熱更新 (HMR)
- 服務端渲染支持

[Pinia](https://pinia.vuejs.org/zh/) 就是一個實現了上述需求的狀態管理庫，由 Vue 核心團隊維護，對 Vue 2 和 Vue 3 都可用。

現有用戶可能對 [Vuex](https://vuex.vuejs.org/zh/) 更熟悉，它是 Vue 之前的官方狀態管理庫。由於 Pinia 在生態系統中能夠承擔相同的職責且能做得更好，因此 Vuex 現在處於維護模式。它仍然可以工作，但不再接受新的功能。對於新的應用，建議使用 Pinia。

事實上，Pinia 最初正是為了探索 Vuex 的下一個版本而開發的，因此整合了核心團隊關於 Vuex 5 的許多想法。最終，我們意識到 Pinia 已經實現了我們想要在 Vuex 5 中提供的大部分內容，因此決定將其作為新的官方推薦。

相比於 Vuex，Pinia 提供了更簡潔直接的 API，並提供了組合式風格的 API，最重要的是，在使用 TypeScript 時它提供了更完善的類型推導。
