<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // The docs for v-model used to be part of this page. Attempt to redirect outdated links.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# 組件事件 {#component-events}

> 此章節假設你已經看過了[組件基礎](/guide/essentials/component-basics)。若你還不了解組件是什麼，請先閱讀該章節。

## 觸發與監聽事件 {#emitting-and-listening-to-events}

在組件的模板表達式中，可以直接使用 `$emit` 方法觸發自定義事件 (例如：在 `v-on` 的處理函數中)：

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">Click Me</button>
```

<div class="options-api">

`$emit()` 方法在組件實例上也同樣以 `this.$emit()` 的形式可用：

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

父組件可以通過 `v-on` (縮寫為 `@`) 來監聽事件：

```vue-html
<MyComponent @some-event="callback" />
```

同樣，組件的事件監聽器也支持 `.once` 修飾符：

```vue-html
<MyComponent @some-event.once="callback" />
```

像組件與 prop 一樣，事件的名字也提供了自動的格式轉換。注意這裡我們觸發了一個以 camelCase 形式命名的事件，但在父組件中可以使用 kebab-case 形式來監聽。與 [prop 大小寫格式](/guide/components/props#prop-name-casing)一樣，在模板中我們也推薦使用 kebab-case 形式來編寫監聽器。

:::tip
和原生 DOM 事件不一樣，組件觸發的事件**沒有冒泡機制**。你只能監聽直接子組件觸發的事件。平級組件或是跨越多層嵌套的組件間通信，應使用一個外部的事件總線，或是使用一個[全局狀態管理方案](/guide/scaling-up/state-management)。
:::

## 事件參數 {#event-arguments}

有時候我們會需要在觸發事件時附帶一個特定的值。舉例來說，我們想要 `<BlogPost>` 組件來管理文本會縮放得多大。在這個場景下，我們可以給 `$emit` 提供一個額外的參數：

```vue-html
<button @click="$emit('increaseBy', 1)">
  Increase by 1
</button>
```

然後我們在父組件中監聽事件，我們可以先簡單寫一個內聯的箭頭函數作為監聽器，此函數會接收到事件附帶的參數：

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

或者，也可以用一個組件方法來作為事件處理函數：

```vue-html
<MyButton @increase-by="increaseCount" />
```

該方法也會接收到事件所傳遞的參數：

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
所有傳入 `$emit()` 的額外參數都會被直接傳向監聽器。舉例來說，`$emit('foo', 1, 2, 3)` 觸發後，監聽器函數將會收到這三個參數值。
:::

## 聲明觸發的事件 {#declaring-emitted-events}

組件可以顯式地通過 <span class="composition-api">[`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits) 宏</span><span class="options-api">[`emits`](/api/options-state#emits) 選項</span>來聲明它要觸發的事件：

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

我們在 `<template>` 中使用的 `$emit` 方法不能在組件的 `<script setup>` 部分中使用，但 `defineEmits()` 會返回一個相同作用的函數供我們使用：

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

`defineEmits()` 宏**不能**在子函數中使用。如上所示，它必須直接放置在 `<script setup>` 的頂級作用域下。

如果你顯式地使用了 `setup` 函數而不是 `<script setup>`，則事件需要通過 [`emits`](/api/options-state#emits) 選項來定義，`emit` 函數也被暴露在 `setup()` 的上下文對象上：

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

與 `setup()` 上下文對象中的其他屬性一樣，`emit` 可以安全地被解構：

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

這個 `emits` 選項和 `defineEmits()` 宏還支持對象語法。通過 TypeScript 為參數指定類型，它允許我們對觸發事件的參數進行驗證：

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string; password: string }) {
    // 通過返回值為 `true` 還是為 `false` 來判斷
    // 驗證是否通過
  }
})
</script>
```

如果你正在搭配 TypeScript 使用 `<script setup>`，也可以使用純類型標註來聲明觸發的事件：

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

TypeScript 用戶請參考：[如何為組件所拋出事件標註類型](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // 通過返回值為 `true` 還是為 `false` 來判斷
      // 驗證是否通過
    }
  }
}
```

TypeScript 用戶請參考：[如何為組件所拋出的事件標註類型](/guide/typescript/options-api#typing-component-emits)。<sup class="vt-badge ts" />

</div>

儘管事件聲明是可選的，我們還是推薦你完整地聲明所有要觸發的事件，以此在代碼中作為文檔記錄組件的用法。同時，事件聲明能讓 Vue 更好地將事件和[透傳 attribute](/guide/components/attrs#v-on-listener-inheritance) 作出區分，從而避免一些由第三方代碼觸發的自定義 DOM 事件所導致的邊界情況。

:::tip
如果一個原生事件的名字 (例如 `click`) 被定義在 `emits` 選項中，則監聽器只會監聽組件觸發的 `click` 事件而不會再響應原生的 `click` 事件。
:::

## 事件校驗 {#events-validation}

和對 props 添加類型校驗的方式類似，所有觸發的事件也可以使用對象形式來描述。

要為事件添加校驗，那麼事件可以被賦值為一個函數，接受的參數就是拋出事件時傳入 <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> 的內容，返回一個布爾值來表明事件是否合法。

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // 沒有校驗
  click: null,

  // 校驗 submit 事件
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // 沒有校驗
    click: null,

    // 校驗 submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>
