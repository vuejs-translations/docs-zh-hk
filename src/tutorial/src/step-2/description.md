# 聲明式渲染 {#declarative-rendering}

<div class="sfc">

你在編輯器中看到的是一個 Vue 單文件組件 (Single-File Component，縮寫為 SFC)。SFC 是一種可複用的代碼組織形式，它將從屬於同一個組件的 HTML、CSS 和 JavaScript 封裝在使用 `.vue` 後綴的文件中。

</div>

Vue 的核心功能是**聲明式渲染**：通過擴展於標準 HTML 的模板語法，我們可以根據 JavaScript 的狀態來描述 HTML 應該是什麼樣子的。當狀態改變時，HTML 會自動更新。

<div class="composition-api">

能在改變時觸發更新的狀態被稱作是**響應式**的。我們可以使用 Vue 的 `reactive()` API 來聲明響應式狀態。由 `reactive()` 創建的對象都是 JavaScript [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，其行為與普通對象一樣：

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` 只適用於對象 (包括數組和內置類型，如 `Map` 和 `Set`)。而另一個 API `ref()` 則可以接受任何值類型。`ref` 會返回一個包裹對象，並在 `.value` 屬性下暴露內部值。

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

`reactive()` 和 `ref()` 的細節在<a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">指南 - 響應式基礎</a>一節中有進一步討論。

<div class="sfc">

在組件的 `<script setup>` 塊中聲明的響應式狀態，可以直接在模板中使用。下面展示了我們如何使用雙花括號語法，根據 `counter` 對象和 `message` ref 的值渲染動態文本：

</div>

<div class="html">

傳入 `createApp()` 的對象是一個 Vue 組件。組件的狀態應該在 `setup()` 函數中聲明，並使用一個對象返回。

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

返回對象中的屬性可以在模板中使用。下面展示了我們如何使用雙花括號語法，根據 `message` 的值來渲染動態文本：

</div>

```vue-html
<h1>{{ message }}</h1>
<p>Count is: {{ counter.count }}</p>
```

注意我們在模板中訪問的 `message` ref 時不需要使用 `.value`：它會被自動解包，讓使用更簡單。

</div>

<div class="options-api">

能在改變時觸發更新的狀態被認為是**響應式**的。在 Vue 中，響應式狀態被保存在組件中。<span class="html">在示例代碼中，傳遞給 `createApp()` 的對象是一個組件。</span>

我們可以使用 `data` 組件選項來聲明響應式狀態，該選項應該是一個返回對象的函數：

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

`message` 屬性可以在模板中使用。下面展示了我們如何使用雙花括號法，根據 `message` 的值來渲染動態文本：

```vue-html
<h1>{{ message }}</h1>
```

</div>

在雙花括號中的內容並不只限於標識符或路徑——我們可以使用任何有效的 JavaScript 表達式。

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

現在，試著自己創建一些響應式狀態，用它來為模板中的 `<h1>` 渲染動態的文本內容。

</div>

<div class="options-api">

現在，試著自己創建一個數據屬性，用它來為模板中的 `<h1>` 渲染動態的文本內容。

</div>
