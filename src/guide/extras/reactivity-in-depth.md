---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# 深入響應式系統 {#reactivity-in-depth}

Vue 最標誌性的功能就是其低侵入性的響應式系統。組件狀態都是由響應式的 JavaScript 對象組成的。當更改它們時，視圖會隨即自動更新。這讓狀態管理更加簡單直觀，但理解它是如何工作的也是很重要的，這可以幫助我們避免一些常見的陷阱。在本節中，我們將深入研究 Vue 響應性系統的一些底層細節。

## 什麼是響應性 {#what-is-reactivity}

這個術語在今天的各種編程討論中經常出現，但人們說它的時候究竟是想表達什麼意思呢？本質上，響應性是一種可以使我們聲明式地處理變化的編程範式。一個經常被拿來當作典型例子的用例即是 Excel 表格：

<SpreadSheet />

這裡單元格 A2 中的值是通過公式 `= A0 + A1` 來定義的 (你可以在 A2 上點擊來查看或編輯該公式)，因此最終得到的值為 3，正如所料。但如果你試著更改 A0 或 A1，你會注意到 A2 也隨即自動更新了。

而 JavaScript 默認並不是這樣的。如果我們用 JavaScript 寫類似的邏輯：

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // 仍然是 3
```

當我們更改 `A0` 後，`A2` 不會自動更新。

那麼我們如何在 JavaScript 中做到這一點呢？首先，為了能重新運行計算的代碼來更新 `A2`，我們需要將其包裝為一個函數：

```js
let A2

function update() {
  A2 = A0 + A1
}
```

然後，我們需要定義幾個術語：

- 這個 `update()` 函數會產生一個**副作用**，或者就簡稱為**作用** (effect)，因為它會更改程序裡的狀態。

- `A0` 和 `A1` 被視為這個作用的**依賴** (dependency)，因為它們的值被用來執行這個作用。因此這次作用也可以被稱作它的依賴的一個**訂閱者** (subscriber)。

我們需要一個魔法函數，能夠在 `A0` 或 `A1` (這兩個**依賴**) 變化時調用 `update()` (產生**作用**)。

```js
whenDepsChange(update)
```

這個 `whenDepsChange()` 函數有如下的任務：

1. 當一個變量被讀取時進行追蹤。例如我們執行了表達式 `A0 + A1` 的計算，則 `A0` 和 `A1` 都被讀取到了。

2. 如果一個變量在當前運行的副作用中被讀取了，就將該副作用設為此變量的一個訂閱者。例如由於 `A0` 和 `A1` 在 `update()` 執行時被訪問到了，則 `update()` 需要在第一次調用之後成為 `A0` 和 `A1` 的訂閱者。

3. 探測一個變量的變化。例如當我們給 `A0` 賦了一個新的值後，應該通知其所有訂閱了的副作用重新執行。

## Vue 中的響應性是如何工作的 {#how-reactivity-works-in-vue}

我們無法直接追蹤對上述示例中局部變量的讀寫，原生 JavaScript 沒有提供任何機制能做到這一點。**但是**，我們是可以追蹤**對象屬性**的讀寫的。

在 JavaScript 中有兩種劫持 property 訪問的方式：[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) 和 [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。Vue 2 使用 getter / setters 完全是出於支持舊版本瀏覽器的限制。而在 Vue 3 中則使用了 Proxy 來創建響應式對象，僅將 getter / setter 用於 ref。下面的偽代碼將會說明它們是如何工作的：

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
這裡和下面的代碼片段皆旨在以最簡單的形式解釋核心概念，因此省略了許多細節和邊界情況。
:::

以上代碼解釋了我們在基礎章節部分討論過的一些 [`reactive()` 的侷限性](/guide/essentials/reactivity-fundamentals#limitations-of-reactive)：

- 當你將一個響應式對象的屬性賦值或解構到一個本地變量時，訪問或賦值該變量是非響應式的，因為它將不再觸發源對象上的 get / set 代理。注意這種“斷開”只影響變量綁定——如果變量指向一個對象之類的非原始值，那麼對該對象的修改仍然是響應式的。

- 從 `reactive()` 返回的代理儘管行為上表現得像原始對象，但我們通過使用 `===` 運算符還是能夠比較出它們的不同。

在 `track()` 內部，我們會檢查當前是否有正在運行的副作用。如果有，我們會查找到一個存儲了所有追蹤了該屬性的訂閱者的 Set，然後將當前這個副作用作為新訂閱者添加到該 Set 中。

```js
// 這會在一個副作用就要運行之前被設置
// 我們會在後面處理它
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

副作用訂閱將被存儲在一個全局的 `WeakMap<target, Map<key, Set<effect>>>` 數據結構中。如果在第一次追蹤時沒有找到對相應屬性訂閱的副作用集合，它將會在這裡新建。這就是 `getSubscribersForProperty()` 函數所做的事。為了簡化描述，我們跳過了它其中的細節。

在 `trigger()` 之中，我們會再查找到該屬性的所有訂閱副作用。但這一次我們需要執行它們：

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

現在讓我們回到 `whenDepsChange()` 函數中：

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

它將原本的 `update` 函數包裝在了一個副作用函數中。在運行實際的更新之前，這個外部函數會將自己設為當前活躍的副作用。這使得在更新期間的 `track()` 調用都能定位到這個當前活躍的副作用。

此時，我們已經創建了一個能自動跟蹤其依賴的副作用，它會在任意依賴被改動時重新運行。我們稱其為**響應式副作用**。

Vue 提供了一個 API 來讓你創建響應式副作用 [`watchEffect()`](/api/reactivity-core#watcheffect)。事實上，你會發現它的使用方式和我們上面示例中說的魔法函數 `whenDepsChange()` 非常相似。我們可以用真正的 Vue API 改寫上面的例子：

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // 追蹤 A0 和 A1
  A2.value = A0.value + A1.value
})

// 將觸發副作用
A0.value = 2
```

使用一個響應式副作用來更改一個 ref 並不是最優解，事實上使用計算屬性會更直觀簡潔：

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

在內部，`computed` 會使用響應式副作用來管理失效與重新計算的過程。

那麼，常見的響應式副作用的用例是什麼呢？自然是更新 DOM！我們可以像下面這樣實現一個簡單的“響應式渲染”：

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Count is: ${count.value}`
})

// 更新 DOM
count.value++
```

實際上，這與 Vue 組件保持狀態和 DOM 同步的方式非常接近——每個組件實例創建一個響應式副作用來渲染和更新 DOM。當然，Vue 組件使用了比 `innerHTML` 更高效的方式來更新 DOM。這會在[渲染機制](./rendering-mechanism)一章中詳細介紹。

<div class="options-api">

`ref()`、`computed()` 和 `watchEffect()` 這些 API 都是組合式 API 的一部分，如果你至今只使用過選項式 API，那麼你需要知道的是組合式 API 更貼近 Vue 底層的響應式系統。事實上，Vue 3 中的選項式 API 正是基於組合式 API 建立的。對該組件實例 (`this`) 所有的屬性訪問都會觸發 getter / setter 的響應式追蹤，而像 `watch` 和 `computed` 這樣的選項也是在內部調用相應等價的組合式 API。

</div>

## 運行時 vs. 編譯時響應性 {#runtime-vs-compile-time-reactivity}

Vue 的響應式系統基本是基於運行時的。追蹤和觸發都是在瀏覽器中運行時進行的。運行時響應性的優點是，它可以在沒有構建步驟的情況下工作，而且邊界情況較少。另一方面，這使得它受到了 JavaScript 語法的制約，導致需要使用一些例如 Vue ref 這樣的值的容器。

一些框架，如 [Svelte](https://svelte.dev/)，選擇通過編譯時實現響應性來克服這種限制。它對代碼進行分析和轉換，以模擬響應性。該編譯步驟允許框架改變 JavaScript 本身的語義——例如，隱式地注入執行依賴性分析的代碼，以及圍繞對本地定義的變量的訪問進行作用觸發。這樣做的缺點是，該轉換需要一個構建步驟，而改變 JavaScript 的語義實質上是在創造一種新語言，看起來像 JavaScript 但編譯出來的東西是另外一回事。

Vue 團隊確實曾通過一個名為[響應性語法糖](/guide/extras/reactivity-transform)的實驗性功能來探索這個方向，但最後由於[這個原因](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028)，我們認為它不適合這個項目。

## 響應性調試 {#reactivity-debugging}

Vue 的響應性系統可以自動跟蹤依賴關係，但在某些情況下，我們可能希望確切地知道正在跟蹤什麼，或者是什麼導致了組件重新渲染。

### 組件調試鉤子 {#component-debugging-hooks}

我們可以在一個組件渲染時使用 <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> 生命週期鉤子來調試查看哪些依賴正在被使用，或是用 <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span> 來確定哪個依賴正在觸發更新。這些鉤子都會收到一個調試事件，其中包含了觸發相關事件的依賴的信息。推薦在回調中放置一個 `debugger` 語句，使你可以在開發者工具中交互式地查看依賴：

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
組件調試鉤子僅會在開發模式下工作
:::

調試事件對象有如下的類型定義：

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### 計算屬性調試 {#computed-debugging}

<!-- TODO options API equivalent -->

我們可以向 `computed()` 傳入第二個參數，是一個包含了 `onTrack` 和 `onTrigger` 兩個回調函數的對象：

- `onTrack` 將在響應屬性或引用作為依賴項被跟蹤時被調用。
- `onTrigger` 將在偵聽器回調被依賴項的變更觸發時被調用。

這兩個回調都會作為組件調試的鉤子，接受[相同格式](#debugger-event)的調試事件：

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // 當 count.value 被追蹤為依賴時觸發
    debugger
  },
  onTrigger(e) {
    // 當 count.value 被更改時觸發
    debugger
  }
})

// 訪問 plusOne，會觸發 onTrack
console.log(plusOne.value)

// 更改 count.value，應該會觸發 onTrigger
count.value++
```

:::tip
計算屬性的 `onTrack` 和 `onTrigger` 選項僅會在開發模式下工作。
:::

### 偵聽器調試 {#watcher-debugging}

<!-- TODO options API equivalent -->

和 `computed()` 類似，偵聽器也支持 `onTrack` 和 `onTrigger` 選項：

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
偵聽器的 `onTrack` 和 `onTrigger` 選項僅會在開發模式下工作。
:::

## 與外部狀態系統集成 {#integration-with-external-state-systems}

Vue 的響應性系統是通過深度轉換普通 JavaScript 對象為響應式代理來實現的。這種深度轉換在一些情況下是不必要的，在和一些外部狀態管理系統集成時，甚至是需要避免的 (例如，當一個外部的解決方案也用了 Proxy 時)。

將 Vue 的響應性系統與外部狀態管理方案集成的大致思路是：將外部狀態放在一個 [`shallowRef`](/api/reactivity-advanced#shallowref) 中。一個淺層的 ref 中只有它的 `.value` 屬性本身被訪問時才是有響應性的，而不關心它內部的值。當外部狀態改變時，替換此 ref 的 `.value` 才會觸發更新。

### 不可變數據 {#immutable-data}

如果你正在實現一個撤銷/重做的功能，你可能想要對用戶編輯時應用的狀態進行快照記錄。然而，如果狀態樹很大的話，Vue 的可變響應性系統沒法很好地處理這種情況，因為在每次更新時都序列化整個狀態對象對 CPU 和內存開銷來說都是非常昂貴的。

[不可變數據結構](https://en.wikipedia.org/wiki/Persistent_data_structure)通過永不更改狀態對象來解決這個問題。與 Vue 不同的是，它會創建一個新對象，保留舊的對象未發生改變的一部分。在 JavaScript 中有多種不同的方式來使用不可變數據，但我們推薦使用 [Immer](https://immerjs.github.io/immer/) 搭配 Vue，因為它使你可以在保持原有直觀、可變的語法的同時，使用不可變數據。

我們可以通過一個簡單的組合式函數來集成 Immer：

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### 狀態機 {#state-machines}

[狀態機](https://en.wikipedia.org/wiki/Finite-state_machine)是一種數據模型，用於描述應用可能處於的所有可能狀態，以及從一種狀態轉換到另一種狀態的所有可能方式。雖然對於簡單的組件來說，這可能有些小題大做了，但它的確可以使得複雜的狀態流更加健壯和易於管理。

[XState](https://xstate.js.org/) 是 JavaScript 中一個比較常用的狀態機實現方案。這裡是集成它的一個例子：

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) 是一個用於處理異步事件流的庫。[VueUse](https://vueuse.org/) 庫提供了 [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) 擴展來支持連接 RxJS 流與 Vue 的響應性系統。

## 與信號 (signal) 的聯繫 {#connection-to-signals}

很多其他框架已經引入了與 Vue 組合式 API 中的 ref 類似的響應性基礎類型，並稱之為“信號”：

- [Solid 信號](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular 信號](https://angular.io/guide/signals)
- [Preact 信號](https://preactjs.com/guide/v10/signals/)
- [Qwik 信號](https://qwik.builder.io/docs/components/state/#usesignal)

Fundamentally, signals are the same kind of reactivity primitive as Vue refs. It's a value container that provides dependency tracking on access, and side-effect triggering on mutation. This reactivity-primitive-based paradigm isn't a particularly new concept in the frontend world: it dates back to implementations like [Knockout observables](https://knockoutjs.com/documentation/observables.html) and [Meteor Tracker](https://docs.meteor.com/api/tracker.html) from more than a decade ago. Vue Options API and the React state management library [MobX](https://mobx.js.org/) are also based on the same principles, but hide the primitives behind object properties.

Although not a necessary trait for something to qualify as signals, today the concept is often discussed alongside the rendering model where updates are performed through fine-grained subscriptions. Due to the use of Virtual DOM, Vue currently [relies on compilers to achieve similar optimizations](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). However, we are also exploring a new Solid-inspired compilation strategy, called [Vapor Mode](https://github.com/vuejs/core-vapor), that does not rely on Virtual DOM and takes more advantage of Vue's built-in reactivity system.

### API 設計權衡 {#api-design-trade-offs}

Preact 和 Qwik 的信號設計與 Vue 的 [shallowRef](/api/reactivity-advanced#shallowref) 非常相似：三者都通過 `.value` 屬性提供了一個更改接口。我們將重點討論 Solid 和 Angular 的信號。

#### Solid Signals {#solid-signals}

Solid 的 `createSignal()` API 設計強調了讀/寫隔離。信號通過一個只讀的 getter 和另一個單獨的 setter 暴露：

```js
const [count, setCount] = createSignal(0)

count() // 訪問值
setCount(1) // 更新值
```

注意到 `count` 信號在沒有 setter 的情況也能傳遞。這就保證了除非 setter 也被明確暴露，否則狀態永遠不會被改變。這種更冗長的語法帶來的安全保證的合理性取決於項目的要求和個人品味——但如果你喜歡這種 API 風格，可以輕易地在 Vue 中複製它：

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Angular 信號 {#angular-signals}

Angular 正在經歷一些底層的變化，它放棄了髒檢查，並引入了自己的響應性基礎類型實現。Angular 的信號 API 看起來像這樣：

```js
const count = signal(0)

count() // 訪問值
count.set(1) // 設置值
count.update((v) => v + 1) // 通過前值更新
```

同樣，我們可以輕易地在 Vue 中複製這個 API：

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc9DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

與 Vue 的 ref 相比，Solid 和 Angular 基於 getter 的 API 風格在 Vue 組件中使用時提供了一些有趣的權衡：

- `()` 比 `.value` 略微省事，但更新值卻更冗長；
- 沒有 ref 解包：總是需要通過 `()` 來訪問值。這使得值的訪問在任何地方都是一致的。這也意味著你可以將原始信號作為組件的參數傳遞下去。

這些 API 風格是否適合你，在某種程度上是主觀的。我們在這裡的目標是展示這些不同的 API 設計之間的基本相似性和取捨。我們還想說明 Vue 是靈活的：你並沒有真正被限定在現有的 API 中。如有必要，你可以創建你自己的響應性基礎 API，以滿足更多的具體需求。
