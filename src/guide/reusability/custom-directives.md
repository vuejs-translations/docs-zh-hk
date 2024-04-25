# 自定義指令 {#custom-directives}

<script setup>
const vFocus = {
  mounted: el => {
    el.focus()
  }
}
</script>

## 介紹 {#introduction}

除了 Vue 內置的一系列指令 (例如 `v-model` 或 `v-show`) 之外，Vue 還允許你註冊自定義的指令 (Custom Directives)。

我們已經介紹了兩種在 Vue 中重用代碼的方式：[組件](/guide/essentials/component-basics)和[組合式函數](./composables)。組件是主要的構建模塊，而組合式函數則側重於有狀態的邏輯。另一方面，自定義指令主要是為了重用涉及普通元素的底層 DOM 訪問的邏輯。

一個自定義指令由一個包含類似組件生命週期鉤子的對象來定義。鉤子函數會接收到指令所綁定元素作為其參數。下面是一個自定義指令的例子，當一個 input 元素被 Vue 插入到 DOM 中後，它會被自動聚焦：

<div class="composition-api">

```vue
<script setup>
// 在模板中啟用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

</div>

<div class="options-api">

```js
const focus = {
  mounted: (el) => el.focus()
}

export default {
  directives: {
    // 在模板中啟用 v-focus
    focus
  }
}
```

```vue-html
<input v-focus />
```

</div>

<div class="demo">
  <input v-focus placeholder="This should be focused" />
</div>

假設你還未點擊頁面中的其他地方，那麼上面這個 input 元素應該會被自動聚焦。該指令比 `autofocus` 屬性更有用，因為它不僅可以在頁面加載完成後生效，還可以在 Vue 動態插入元素後生效。

<div class="composition-api">

在 `<script setup>` 中，任何以 `v` 開頭的駝峰式命名的變量都可以被用作一個自定義指令。在上面的例子中，`vFocus` 即可以在模板中以 `v-focus` 的形式使用。

在沒有使用 `<script setup>` 的情況下，自定義指令需要通過 `directives` 選項註冊：

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中啟用 v-focus
    focus: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

和組件類似，自定義指令在模板中使用前必須先註冊。在上面的例子中，我們使用 `directives` 選項完成了指令的局部註冊。

</div>

將一個自定義指令全局註冊到應用層級也是一種常見的做法：

```js
const app = createApp({})

// 使 v-focus 在所有組件中都可用
app.directive('focus', {
  /* ... */
})
```

:::tip
只有當所需功能只能通過直接的 DOM 操作來實現時，才應該使用自定義指令。其他情況下應該儘可能地使用 `v-bind` 這樣的內置指令來聲明式地使用模板，這樣更高效，也對服務端渲染更友好。
:::

## 指令鉤子 {#directive-hooks}

一個指令的定義對象可以提供幾種鉤子函數 (都是可選的)：

```js
const myDirective = {
  // 在綁定元素的 attribute 前
  // 或事件監聽器應用前調用
  created(el, binding, vnode, prevVnode) {
    // 下面會介紹各個參數的細節
  },
  // 在元素被插入到 DOM 前調用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在綁定元素的父組件
  // 及他自己的所有子節點都掛載完成後調用
  mounted(el, binding, vnode, prevVnode) {},
  // 綁定元素的父組件更新前調用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在綁定元素的父組件
  // 及他自己的所有子節點都更新後調用
  updated(el, binding, vnode, prevVnode) {},
  // 綁定元素的父組件卸載前調用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 綁定元素的父組件卸載後調用
  unmounted(el, binding, vnode, prevVnode) {}
}
```

### 鉤子參數 {#hook-arguments}

指令的鉤子會傳遞以下幾種參數：

- `el`：指令綁定到的元素。這可以用於直接操作 DOM。

- `binding`：一個對象，包含以下屬性。

  - `value`：傳遞給指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。
  - `oldValue`：之前的值，僅在 `beforeUpdate` 和 `updated` 中可用。無論值是否更改，它都可用。
  - `arg`：傳遞給指令的參數 (如果有的話)。例如在 `v-my-directive:foo` 中，參數是 `"foo"`。
  - `modifiers`：一個包含修飾符的對象 (如果有的話)。例如在 `v-my-directive.foo.bar` 中，修飾符對象是 `{ foo: true, bar: true }`。
  - `instance`：使用該指令的組件實例。
  - `dir`：指令的定義對象。

- `vnode`：代表綁定元素的底層 VNode。
- `prevVnode`：代表之前的渲染中指令所綁定元素的 VNode。僅在 `beforeUpdate` 和 `updated` 鉤子中可用。

舉例來說，像下面這樣使用指令：

```vue-html
<div v-example:foo.bar="baz">
```

`binding` 參數會是一個這樣的對象：

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新時 `baz` 的值 */
}
```

和內置指令類似，自定義指令的參數也可以是動態的。舉例來說：

```vue-html
<div v-example:[arg]="value"></div>
```

這裡指令的參數會基於組件的 `arg` 數據屬性響應式地更新。

:::tip Note
除了 `el` 外，其他參數都是只讀的，不要修改它們。如你需要在不同的鉤子間共享信息，建議通過元素的 [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) 屬性實現。
:::

## 簡化形式 {#function-shorthand}

對於自定義指令來說，一個很常見的情況是僅需要在 `mounted` 和 `updated` 上實現相同的行為，除此之外並不需要其他鉤子。這種情況下我們可以直接用一個函數來定義指令，如下所示：

```vue-html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // 這會在 `mounted` 和 `updated` 時都調用
  el.style.color = binding.value
})
```

## 對象字面量 {#object-literals}

如果你的指令需要多個值，你可以向它傳遞一個 JavaScript 對象字面量。別忘了，指令也可以接收任何合法的 JavaScript 表達式。

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## 在組件上使用 {#usage-on-components}

當在組件上使用自定義指令時，它會始終應用於組件的根節點，和[透傳屬性](/guide/components/attrs)類似。

```vue-html
<MyComponent v-demo="test" />
```

```vue-html
<!-- MyComponent 的模板 -->

<div> <!-- v-demo 指令會被應用在此處 -->
  <span>My component content</span>
</div>
```

需要注意的是組件可能含有多個根節點。當應用到一個多根組件時，指令將會被忽略且拋出一個警告。和原生屬性不同，指令不能通過 `v-bind="$attrs"` 來傳遞給一個不同的元素。總的來說，**不**建議在組件上使用自定義指令。
