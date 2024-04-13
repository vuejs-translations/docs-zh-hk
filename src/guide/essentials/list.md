# 列表渲染 {#list-rendering}

## `v-for` {#v-for}

我們可以使用 `v-for` 指令基於一個數組來渲染一個列表。`v-for` 指令的值需要使用 `item in items` 形式的特殊語法，其中 `items` 是源數據的數組，而 `item` 是迭代項的**別名**：

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

在 `v-for` 塊中可以完整地訪問父作用域內的屬性和變量。`v-for` 也支持使用可選的第二個參數表示當前項的位置索引。

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

`v-for` 變量的作用域和下面的 JavaScript 代碼很類似：

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // 可以訪問外層的 `parentMessage`
  // 而 `item` 和 `index` 只在這個作用域可用
  console.log(parentMessage, item.message, index)
})
```

注意 `v-for` 是如何對應 `forEach` 回調的函數簽名的。實際上，你也可以在定義 `v-for` 的變量別名時使用解構，和解構函數參數類似：

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- 有 index 索引時 -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

對於多層嵌套的 `v-for`，作用域的工作方式和函數的作用域很類似。每個 `v-for` 作用域都可以訪問到父級作用域：

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

你也可以使用 `of` 作為分隔符來替代 `in`，這更接近 JavaScript 的迭代器語法：

```vue-html
<div v-for="item of items"></div>
```

## `v-for` 與對象 {#v-for-with-an-object}

你也可以使用 `v-for` 來遍歷一個對象的所有屬性。遍歷的順序會基於對該對象調用 `Object.keys()` 的返回值來決定。

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

可以通過提供第二個參數表示屬性名 (例如 key)：

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

第三個參數表示位置索引：

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## 在 `v-for` 裡使用範圍值 {#v-for-with-a-range}

`v-for` 可以直接接受一個整數值。在這種用例中，會將該模板基於 `1...n` 的取值範圍重複多次。

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

注意此處 `n` 的初值是從 `1` 開始而非 `0`。

## `<template>` 上的 `v-for` {#v-for-on-template}

與模板上的 `v-if` 類似，你也可以在 `<template>` 標籤上使用 `v-for` 來渲染一個包含多個元素的塊。例如：

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` 與 `v-if` {#v-for-with-v-if}

:::warning 注意
同時使用 `v-if` 和 `v-for` 是**不推薦的**，因為這樣二者的優先級不明顯。請轉閱[風格指南](/style-guide/rules-essential#avoid-v-if-with-v-for)查看更多細節。
:::

當它們同時存在於一個節點上時，`v-if` 比 `v-for` 的優先級更高。這意味著 `v-if` 的條件將無法訪問到 `v-for` 作用域內定義的變量別名：

```vue-html
<!--
 這會拋出一個錯誤，因為屬性 todo 此時
 沒有在該實例上定義
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

在外先封装一層 `<template>` 再在其上使用 `v-for` 可以解決這個問題 (這也更加明顯易讀)：

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

## 通過 key 管理狀態 {#maintaining-state-with-key}

Vue 默認按照“就地更新”的策略來更新通過 `v-for` 渲染的元素列表。當數據項的順序改變時，Vue 不會隨之移動 DOM 元素的順序，而是就地更新每個元素，確保它們在原本指定的索引位置上渲染。

默認模式是高效的，但**只適用於列表渲染輸出的結果不依賴子組件狀態或者臨時 DOM 狀態 (例如表單輸入值) 的情況**。

為了給 Vue 一個提示，以便它可以跟蹤每個節點的標識，從而重用和重新排序現有的元素，你需要為每個元素對應的塊提供一個唯一的 `key` attribute：

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- 內容 -->
</div>
```

當你使用 `<template v-for>` 時，`key` 應該被放置在這個 `<template>` 容器上：

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip 注意
`key` 在這裡是一個通過 `v-bind` 綁定的特殊 attribute。請不要和[在 `v-for` 中使用對象](#v-for-with-an-object)裡所提到的對象屬性名相混淆。
:::

[推薦](/style-guide/rules-essential#use-keyed-v-for)在任何可行的時候為 `v-for` 提供一個 `key` attribute，除非所迭代的 DOM 內容非常簡單 (例如：不包含組件或有狀態的 DOM 元素)，或者你想有意採用默認行為來提高性能。

`key` 綁定的值期望是一個基礎類型的值，例如字符串或 number 類型。不要用對象作為 `v-for` 的 key。關於 `key` attribute 的更多用途細節，請參閱 [`key` API 文檔](/api/built-in-special-attributes#key)。

## 組件上使用 `v-for` {#v-for-with-a-component}

> 這一小節假設你已瞭解[組件](/guide/essentials/component-basics)的相關知識，或者你也可以先跳過這裡，之後再回來看。

我們可以直接在組件上使用 `v-for`，和在一般的元素上使用沒有區別 (別忘記提供一個 `key`)：

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

但是，這不會自動將任何數據傳遞給組件，因為組件有自己獨立的作用域。為了將迭代後的數據傳遞到組件中，我們還需要傳遞 props：

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

不自動將 `item` 注入組件的原因是，這會使組件與 `v-for` 的工作方式緊密耦合。明確其數據的來源可以使組件在其他情況下重用。

<div class="composition-api">

這裡是一個簡單的 [Todo List 的例子](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=)，展示瞭如何通過 `v-for` 來渲染一個組件列表，並向每個實例中傳入不同的數據。

</div>
<div class="options-api">

這裡是一個簡單的 [Todo List 的例子](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=)，展示瞭如何通過 `v-for` 來渲染一個組件列表，並向每個實例中傳入不同的數據。

</div>

## 數組變化偵測 {#array-change-detection}

### 變更方法 {#mutation-methods}

Vue 能夠偵聽響應式數組的變更方法，並在它們被調用時觸發相關的更新。這些變更方法包括：

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### 替換一個數組 {#replacing-an-array}

變更方法，顧名思義，就是會對調用它們的原數組進行變更。相對地，也有一些不可變 (immutable) 方法，例如 `filter()`，`concat()` 和 `slice()`，這些都不會更改原數組，而總是**返回一個新數組**。當遇到的是非變更方法時，我們需要將舊的數組替換為新的：

<div class="composition-api">

```js
// `items` 是一個數組的 ref
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

你可能認為這將導致 Vue 丟棄現有的 DOM 並重新渲染整個列表——幸運的是，情況並非如此。Vue 實現了一些巧妙的方法來最大化對 DOM 元素的重用，因此用另一個包含部分重疊對象的數組來做替換，仍會是一種非常高效的操作。

## 展示過濾或排序後的結果 {#displaying-filtered-sorted-results}

有時，我們希望顯示數組經過過濾或排序後的內容，而不實際變更或重置原始數據。在這種情況下，你可以創建返回已過濾或已排序數組的計算屬性。

舉例來說：

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

在計算屬性不可行的情況下 (例如在多層嵌套的 `v-for` 循環中)，你可以使用以下方法：

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

在計算屬性中使用 `reverse()` 和 `sort()` 的時候務必小心！這兩個方法將變更原始數組，計算函數中不應該這麼做。請在調用這些方法之前創建一個原數組的副本：

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
