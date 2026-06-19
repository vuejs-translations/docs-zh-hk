# 自定義指令 {#custom-directives}

<script setup>
const vHighlight = {
  mounted: el => {
    el.classList.add('is-highlight')
  }
}
</script>

<style>
.vt-doc p.is-highlight {
  margin-bottom: 0;
}

.is-highlight {
  background-color: yellow;
  color: black;
}
</style>

## Introduction {#introduction}

除了 Vue 內置的一系列指令 (例如 `v-model` 或 `v-show`) 之外，Vue 還允許你註冊自定義的指令 (Custom Directives)。

我們已經介紹了兩種在 Vue 中重用代碼的方式：[組件](/guide/essentials/component-basics)和[組合式函數](./composables)。組件是主要的構建模塊，而組合式函數則側重於有狀態的邏輯。另一方面，自定義指令主要是為了重用涉及普通元素的底層 DOM 訪問的邏輯。

一個自定義指令由一個包含類似組件生命週期鉤子的對象來定義。鉤子函數會接收到指令所綁定元素作為其參數。下面是一個自定義指令的例子，當一個 input 元素被 Vue 插入到 DOM 中後，該指令會將 class 添加到元素中：

<div class="composition-api">

```vue
<script setup>
// enables v-highlight in templates
const vHighlight = {
  mounted: (el) => {
    el.classList.add('is-highlight')
  }
}
</script>

<template>
  <p v-highlight>This sentence is important!</p>
</template>
```

</div>

<div class="options-api">

```js
const highlight = {
  mounted: (el) => el.classList.add('is-highlight')
}

export default {
  directives: {
    // enables v-highlight in template
    highlight
  }
}
```

```vue-html
<p v-highlight>This sentence is important!</p>
```

</div>

<div class="demo">
  <p v-highlight>This sentence is important!</p>
</div>

<div class="composition-api">

In `<script setup>`, any camelCase variable that starts with the `v` prefix can be used as a custom directive. In the example above, `vHighlight` can be used in the template as `v-highlight`.

If you are not using `<script setup>`, custom directives can be registered using the `directives` option:

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // enables v-highlight in template
    highlight: {
      /* ... */
    }
  }
}
```

</div>

<div class="options-api">

Similar to components, custom directives must be registered so that they can be used in templates. In the example above, we are using local registration via the `directives` option.

</div>

It is also common to globally register custom directives at the app level:

```js
const app = createApp({})

// make v-highlight usable in all components
app.directive('highlight', {
  /* ... */
})
```

It is possible to type global custom directives by extending the `GlobalDirectives` interface from `vue`

More Details: [Typing Custom Global Directives](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />

## When to use custom directives {#when-to-use}

Custom directives should only be used when the desired functionality can only be achieved via direct DOM manipulation.

A common example of this is a `v-focus` custom directive that brings an element into focus.

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

This directive is more useful than the `autofocus` attribute because it works not just on page load - it also works when the element is dynamically inserted by Vue!

Declarative templating with built-in directives such as `v-bind` is recommended when possible because they are more efficient and server-rendering friendly.

## 指令鉤子 {#directive-hooks}

一個指令的定義對象可以提供幾種鉤子函數 (都是可選的)：

```js
const myDirective = {
  // 在綁定元素的 attribute 前
  // 或事件監聽器應用前調用
  created(el, binding, vnode) {
    // 下面會介紹各個參數的細節
  },
  // 在元素被插入到 DOM 前調用
  beforeMount(el, binding, vnode) {},
  // 在綁定元素的父組件
  // 及他自己的所有子節點都掛載完成後調用
  mounted(el, binding, vnode) {},
  // 綁定元素的父組件更新前調用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在綁定元素的父組件
  // 及他自己的所有子節點都更新後調用
  updated(el, binding, vnode, prevVnode) {},
  // 綁定元素的父組件卸載前調用
  beforeUnmount(el, binding, vnode) {},
  // 綁定元素的父組件卸載後調用
  unmounted(el, binding, vnode) {}
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
除了 `el` 外，其他參數都是隻讀的，不要修改它們。如你需要在不同的鉤子間共享信息，建議通過元素的 [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) 屬性實現。
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

:::warning Not recommended
Using custom directives on components is not recommended. Unexpected behaviour may occur when a component has multiple root nodes.
:::

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

Note that components can potentially have more than one root node. When applied to a multi-root component, a directive will be ignored and a warning will be thrown. Unlike attributes, directives can't be passed to a different element with `v-bind="$attrs"`.
