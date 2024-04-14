---
outline: deep
---

# 響應式基礎 {#reactivity-fundamentals}

:::tip API 參考
本頁和後面很多頁面中都分別包含了選項式 API 和組合式 API 的示例代碼。現在你選擇的是 <span class="options-api">選項式 API</span><span class="composition-api">組合式 API</span>。你可以使用左側側邊欄頂部的“API 風格偏好”開關在 API 風格之間切換。
:::

<div class="options-api">

## 聲明響應式狀態 \* {#declaring-reactive-state}

選用選項式 API 時，會用 `data` 選項來聲明組件的響應式狀態。此選項的值應為返回一個對象的函數。Vue 將在創建新組件實例的時候調用此函數，並將函數返回的對象用響應式系統進行包裝。此對象的所有頂層屬性都會被代理到組件實例 (即方法和生命週期鉤子中的 `this`) 上。

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` 是生命週期鉤子，之後我們會講到
  mounted() {
    // `this` 指向當前組件實例
    console.log(this.count) // => 1

    // 數據屬性也可以被更改
    this.count = 2
  }
}
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

這些實例上的屬性僅在實例首次創建時被添加，因此你需要確保它們都出現在 `data` 函數返回的對象上。若所需的值還未準備好，在必要時也可以使用 `null`、`undefined` 或者其他一些值佔位。

雖然也可以不在 `data` 上定義，直接向組件實例添加新屬性，但這個屬性將無法觸發響應式更新。

Vue 在組件實例上暴露的內置 API 使用 `$` 作為前綴。它同時也為內部屬性保留 `_` 前綴。因此，你應該避免在頂層 `data` 上使用任何以這些字符作前綴的屬性。

### 響應式代理 vs. 原始值 \* {#reactive-proxy-vs-original}

在 Vue 3 中，數據是基於 [JavaScript Proxy (代理)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 實現響應式的。使用過 Vue 2 的用戶可能需要注意下面這樣的邊界情況：

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

當你在賦值後再訪問 `this.someObject`，此值已經是原來的 `newObject` 的一個響應式代理。**與 Vue 2 不同的是，這裡原始的 `newObject` 不會變為響應式：請確保始終通過 `this` 來訪問響應式狀態。**

</div>

<div class="composition-api">

## 聲明響應式狀態 \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

在組合式 API 中，推薦使用 [`ref()`](/api/reactivity-core#ref) 函數來聲明響應式狀態：

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` 接收參數，並將其包裹在一個帶有 `.value` 屬性的 ref 對象中返回：

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> 參考：[為 refs 標註類型](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

要在組件模板中訪問 ref，請從組件的 `setup()` 函數中聲明並返回它們：

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` 是一個特殊的鉤子，專門用於組合式 API。
  setup() {
    const count = ref(0)

    // 將 ref 暴露給模板
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

注意，在模板中使用 ref 時，我們**不**需要附加 `.value`。為了方便起見，當在模板中使用時，ref 會自動解包 (有一些[注意事項](#caveat-when-unwrapping-in-templates))。

你也可以直接在事件監聽器中改變一個 ref：

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

對於更復雜的邏輯，我們可以在同一作用域內聲明更改 ref 的函數，並將它們作為方法與狀態一起公開：

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // 在 JavaScript 中需要 .value
      count.value++
    }

    // 不要忘記同時暴露 increment 函數
    return {
      count,
      increment
    }
  }
}
```

然後，暴露的方法可以被用作事件監聽器：

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

這裡是 [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo) 上的例子，沒有使用任何構建工具。

### `<script setup>` \*\* {#script-setup}

在 `setup()` 函數中手動暴露大量的狀態和方法非常繁瑣。幸運的是，我們可以通過使用[單文件組件 (SFC)](/guide/scaling-up/sfc) 來避免這種情況。我們可以使用 `<script setup>` 來大幅度地簡化代碼：

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

`<script setup>` 中的頂層的導入、聲明的變量和函數可在同一組件的模板中直接使用。你可以理解為模板是在同一作用域內聲明的一個 JavaScript 函數——它自然可以訪問與它一起聲明的所有內容。

:::tip
在指南的後續章節中，我們基本上都會在組合式 API 示例中使用單文件組件 + `<script setup>` 的語法，因為大多數 Vue 開發者都會這樣使用。

如果你沒有使用單文件組件，你仍然可以在 [`setup()`](/api/composition-api-setup) 選項中使用組合式 API。
:::

### 為什麼要使用 ref？ \*\* {#why-refs}

你可能會好奇：為什麼我們需要使用帶有 `.value` 的 ref，而不是普通的變量？為了解釋這一點，我們需要簡單地討論一下 Vue 的響應式系統是如何工作的。

當你在模板中使用了一個 ref，然後改變了這個 ref 的值時，Vue 會自動檢測到這個變化，並且相應地更新 DOM。這是通過一個基於依賴追蹤的響應式系統實現的。當一個組件首次渲染時，Vue 會**追蹤**在渲染過程中使用的每一個 ref。然後，當一個 ref 被修改時，它會**觸發**追蹤它的組件的一次重新渲染。

在標準的 JavaScript 中，檢測普通變量的訪問或修改是行不通的。然而，我們可以通過 getter 和 setter 方法來攔截對象屬性的 get 和 set 操作。

該 `.value` 屬性給予了 Vue 一個機會來檢測 ref 何時被訪問或修改。在其內部，Vue 在它的 getter 中執行追蹤，在它的 setter 中執行觸發。從概念上講，你可以將 ref 看作是一個像這樣的對象：

```js
// 偽代碼，並非真正的實現
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

另一個 ref 的好處是，與普通變量不同，你可以將 ref 傳遞給函數，同時保留對最新值和響應式連接的訪問。當將複雜的邏輯重構為可重用的代碼時，這將非常有用。

該響應性系統在[深入響應式原理](/guide/extras/reactivity-in-depth)章節中有更詳細的討論。
</div>

<div class="options-api">

## 聲明方法 \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="免費的 Vue.js Methods 課程"/>

要為組件添加方法，我們需要用到 `methods` 選項。它應該是一個包含所有方法的對象：

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // 在其他方法或是生命週期中也可以調用方法
    this.increment()
  }
}
```

Vue 自動為 `methods` 中的方法綁定了永遠指向組件實例的 `this`。這確保了方法在作為事件監聽器或回調函數時始終保持正確的 `this`。你不應該在定義 `methods` 時使用箭頭函數，因為箭頭函數沒有自己的 `this` 上下文。

```js
export default {
  methods: {
    increment: () => {
      // 反例：無法訪問此處的 `this`!
    }
  }
}
```

和組件實例上的其他屬性一樣，方法也可以在模板上被訪問。在模板中它們常常被用作事件監聽器：

```vue-html
<button @click="increment">{{ count }}</button>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

在上面的例子中，`increment` 方法會在 `<button>` 被點擊時調用。

</div>

### 深層響應性 {#deep-reactivity}

<div class="options-api">

在 Vue 中，默認情況下，狀態是深度響應的。這意味著當改變嵌套對象或數組時，這些變化也會被檢測到：

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // 以下都會按照期望工作
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

Ref 可以持有任何類型的值，包括深層嵌套的對象、數組或者 JavaScript 內置的數據結構，例如 `Map`。

Ref 會使它的值具有深層響應性。這意味著即使改變嵌套對象或數組時，變化也會被檢測到：

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 以下都會按照期望工作
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

非原始值將通過 [`reactive()`](#reactive) 轉換為響應式代理，該函數將在後面討論。

也可以通過 [shallow ref](/api/reactivity-advanced#shallowref) 來放棄深層響應性。對於淺層 ref，只有 `.value` 的訪問會被追蹤。淺層 ref 可以用於避免對大型數據的響應性開銷來優化性能、或者有外部庫管理其內部狀態的情況。

閱讀更多：

- [減少大型不可變數據的響應性開銷](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [與外部狀態系統集成](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### DOM 更新時機 {#dom-update-timing}

當你修改了響應式狀態時，DOM 會被自動更新。但是需要注意的是，DOM 更新不是同步的。Vue 會在“next tick”更新週期中緩衝所有狀態的修改，以確保不管你進行了多少次狀態修改，每個組件都只會被更新一次。

要等待 DOM 更新完成後再執行額外的代碼，可以使用 [nextTick()](/api/general#nexttick) 全局 API：

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // 現在 DOM 已經更新了
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // 現在 DOM 已經更新了
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

還有另一種聲明響應式狀態的方式，即使用 `reactive()` API。與將內部值包裝在特殊對象中的 ref 不同，`reactive()` 將使對象本身具有響應性：

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> 參考：[為 `reactive()` 標註類型](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

在模板中使用：

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

響應式對象是 [JavaScript 代理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，其行為就和普通對象一樣。不同的是，Vue 能夠攔截對響應式對象所有屬性的訪問和修改，以便進行依賴追蹤和觸發更新。

`reactive()` 將深層地轉換對象：當訪問嵌套對象時，它們也會被 `reactive()` 包裝。當 ref 的值是一個對象時，`ref()` 也會在內部調用它。與淺層 ref 類似，這裡也有一個 [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) API 可以選擇退出深層響應性。

### Reactive Proxy vs. Original \*\* {#reactive-proxy-vs-original-1}

值得注意的是，`reactive()` 返回的是一個原始對象的 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，它和原始對象是不相等的：

```js
const raw = {}
const proxy = reactive(raw)

// 代理對象和原始對象不是全等的
console.log(proxy === raw) // false
```

只有代理對象是響應式的，更改原始對象不會觸發更新。因此，使用 Vue 的響應式系統的最佳實踐是**僅使用你聲明對象的代理版本**。

為保證訪問代理的一致性，對同一個原始對象調用 `reactive()` 會總是返回同樣的代理對象，而對一個已存在的代理對象調用 `reactive()` 會返回其本身：

```js
// 在同一個對象上調用 reactive() 會返回相同的代理
console.log(reactive(raw) === proxy) // true

// 在一個代理上調用 reactive() 會返回它自己
console.log(reactive(proxy) === proxy) // true
```

這個規則對嵌套對象也適用。依靠深層響應性，響應式對象內的嵌套對象依然是代理：

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### `reactive()` 的局限性 \*\* {#limitations-of-reactive}

`reactive()` API 有一些局限性：

1. **有限的值類型**：它只能用於對象類型 (對象、數組和如 `Map`、`Set` 這樣的[集合類型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections))。它不能持有如 `string`、`number` 或 `boolean` 這樣的[原始類型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)。

2. **不能替換整個對象**：由於 Vue 的響應式跟蹤是通過屬性訪問實現的，因此我們必須始終保持對響應式對象的相同引用。這意味著我們不能輕易地“替換”響應式對象，因為這樣的話與第一個引用的響應性連接將丟失：

   ```js
   let state = reactive({ count: 0 })

   // 上面的 ({ count: 0 }) 引用將不再被追蹤
   // (響應性連接已丟失！)
   state = reactive({ count: 1 })
   ```

3. **對解構操作不友好**：當我們將響應式對象的原始類型屬性解構為本地變量時，或者將該屬性傳遞給函數時，我們將丟失響應性連接：

   ```js
   const state = reactive({ count: 0 })

   // 當解構時，count 已經與 state.count 斷開連接
   let { count } = state
   // 不會影響原始的 state
   count++

   // 該函數接收到的是一個普通的數字
   // 並且無法追蹤 state.count 的變化
   // 我們必須傳入整個對象以保持響應性
   callSomeFunction(state.count)
   ```

由於這些限制，我們建議使用 `ref()` 作為聲明響應式狀態的主要 API。

## 額外的 ref 解包細節 \*\* {#additional-ref-unwrapping-details}

### 作為 reactive 對象的屬性 \*\* {#ref-unwrapping-as-reactive-object-property}

一個 ref 會在作為響應式對象的屬性被訪問或修改時自動解包。換句話說，它的行為就像一個普通的屬性：

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果將一個新的 ref 賦值給一個關聯了已有 ref 的屬性，那麼它會替換掉舊的 ref：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// 原始 ref 現在已經和 state.count 失去聯繫
console.log(count.value) // 1
```

只有當嵌套在一個深層響應式對象內時，才會發生 ref 解包。當其作為[淺層響應式對象](/api/reactivity-advanced#shallowreactive)的屬性被訪問時不會解包。

### 數組和集合的注意事項 \*\* {#caveat-in-arrays-and-collections}

與 reactive 對象不同的是，當 ref 作為響應式數組或原生集合類型 (如 `Map`) 中的元素被訪問時，它**不會**被解包：

```js
const books = reactive([ref('Vue 3 Guide')])
// 這裡需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 這裡需要 .value
console.log(map.get('count').value)
```

### 在模板中解包的注意事項 \*\* {#caveat-when-unwrapping-in-templates}

在模板渲染上下文中，只有頂級的 ref 屬性才會被解包。

在下面的例子中，`count` 和 `object` 是頂級屬性，但 `object.id` 不是：

```js
const count = ref(0)
const object = { id: ref(1) }
```

因此，這個表達式按預期工作：

```vue-html
{{ count + 1 }}
```

...但這個**不會**：

```vue-html
{{ object.id + 1 }}
```

渲染的結果將是 `[object Object]1`，因為在計算表達式時 `object.id` 沒有被解包，仍然是一個 ref 對象。為了解決這個問題，我們可以將 `id` 解構為一個頂級屬性：

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

現在渲染的結果將是 `2`。

另一個需要注意的點是，如果 ref 是文本插值的最終計算值 (即 <code v-pre>{{ }}</code> 標籤)，那麼它將被解包，因此以下內容將渲染為 `1`：

```vue-html
{{ object.id }}
```

該特性僅僅是文本插值的一個便利特性，等價於 <code v-pre>{{ object.id.value }}</code>。

</div>

<div class="options-api">

### 有狀態方法 \* {#stateful-methods}

在某些情況下，我們可能需要動態地創建一個方法函數，例如創建一個預置防抖的事件處理器：

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // 使用 Lodash 的防抖函數
    click: debounce(function () {
      // ... 對點擊的響應 ...
    }, 500)
  }
}
```

不過這種方法對於被重用的組件來說是有問題的，因為這個預置防抖的函數是**有狀態的**：它在運行時維護著一個內部狀態。如果多個組件實例都共享這同一個預置防抖的函數，那麼它們之間將會互相影響。

要保持每個組件實例的防抖函數都彼此獨立，我們可以改為在 `created` 生命週期鉤子中創建這個預置防抖的函數：

```js
export default {
  created() {
    // 每個實例都有了自己的預置防抖的處理函數
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // 最好是在組件卸載時
    // 清除掉防抖計時器
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... 對點擊的響應 ...
    }
  }
}
```

</div>
