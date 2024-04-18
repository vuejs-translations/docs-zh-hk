# 響應性語法糖 {#reactivity-transform}

:::danger 已移除的實驗性功能
響應性語法糖曾經是一個實驗性功能，且已在最新的 3.4 版本中被移除，請閱讀[廢棄原因](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028)。

如果仍然打算使用它，你現在可以使用 [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) 插件。
:::

:::tip 組合式 API 特有
響應性語法糖是組合式 API 特有的功能，且必須通過構建步驟使用。
:::

## ref vs. 響應式變量 {#refs-vs-reactive-variables}

自從引入組合式 API 的概念以來，一個主要的未解決的問題就是 ref 和響應式對象到底用哪個。響應式對象存在解構丟失響應性的問題，而 ref 需要到處使用 `.value` 則感覺很繁瑣，並且在沒有類型系統的幫助時很容易漏掉 `.value`。

[Vue 的響應性語法糖](https://github.com/vuejs/core/tree/main/packages/reactivity-transform)是一個編譯時的轉換步驟，讓我們可以像這樣書寫代碼：

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

這裡的這個 `$ref()` 方法是一個**編譯時的宏命令**：它不是一個真實的、在運行時會調用的方法。而是用作 Vue 編譯器的標記，表明最終的 `count` 變量需要是一個**響應式變量**。

響應式的變量可以像普通變量那樣被訪問和重新賦值，但這些操作在編譯後都會變為帶 `.value` 的 ref。例如上面例子中 `<script>` 部分的代碼就被編譯成了下面這樣：

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

每一個會返回 ref 的響應式 API 都有一個相對應的、以 `$` 為前綴的宏函數。包括以下這些 API：

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

當啟用響應性語法糖時，這些宏函數都是全局可用的、無需手動導入。但如果你想讓它更明顯，你也可以選擇從 `vue/macros` 中引入它們：

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## 通過 `$()` 解構 {#destructuring-with}

我們常常會讓一個組合函數返回一個含數個 ref 的對象，然後解構得到這些 ref。對於這種場景，響應性語法糖提供了一個 **`$()`** 宏：

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

編譯輸出為：

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

請注意如果 `x` 已經是一個 ref，`toRef(__temp, 'x')` 則會簡單地返回它本身，而不會再創建新的 ref。如果一個被解構的值不是 ref (例如是一個函數)，也仍然可以使用，這個值會被包裝進一個 ref，因此其他代碼都會正常工作。

對 `$()` 的解構在響應式對象**和**包含數個 ref 的對象都可用。

## 用 `$()` 將現存的 ref 轉換為響應式對象 {#convert-existing-refs-to-reactive-variables-with}

在某些場景中我們可能已經有了會返回 ref 的函數。然而，Vue 編譯器並不能夠提前知道該函數會返回一個 ref。那麼此時可以使用 `$()` 宏來將現存的 ref 轉換為響應式變量。

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## 響應式 props 解構 {#reactive-props-destructure}

現在的 `<script setup>` 中對 `defineProps` 宏的使用有兩個痛點：

1. 和 `.value` 類似，為了保持響應性，你始終需要以 `props.x` 的方式訪問這些 prop。這意味著你不能夠解構 `defineProps` 的返回值，因為得到的變量將不是響應式的、也不會更新。

2. 當使用[基於類型的 props 的聲明](https://v3.vuejs.org/api/sfc-script-setup#type-only-props-emit-declarations)時，無法很方便地聲明這些 prop 的默認值。為此我們提供了 `withDefaults()` 這個 API，但使用起來仍然很笨拙。

當 `defineProps` 與解構一起使用時，我們可以通過應用編譯時轉換來解決這些問題，類似於我們之前看到的 `$()`：

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // 默認值正常可用
    count = 1,
    // 解構時命別名也可用
    // 這裡我們就將 `props.foo` 命別名為 `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // 會在 props 變化時打印
    console.log(msg, count, bar)
  })
</script>
```

上面的代碼將被編譯成下面這樣的運行時聲明：

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## 保持在函數間傳遞時的響應性 {#retaining-reactivity-across-function-boundaries}

雖然響應式變量使我們可以不再受 `.value` 的困擾，但它也使得我們在函數間傳遞響應式變量時可能造成“響應性丟失”的問題。這可能在以下兩種場景中出現：

### 以參數形式傳入函數 {#passing-into-function-as-argument}

假設有一個期望接收一個 ref 對象為參數的函數：

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x 改變了！')
  })
}

let count = $ref(0)
trackChange(count) // 無效！
```

上面的例子不會正常工作，因為代碼被編譯成了這樣：

```ts
let count = ref(0)
trackChange(count.value)
```

這裡的 `count.value` 是以一個 number 類型值的形式傳入，然而 `trackChange` 期望接收的是一個真正的 ref。要解決這個問題，可以在將 `count` 作為參數傳入之前，用 `$$()` 包裝：

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

上面的代碼將被編譯成：

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

我們可以看到，`$$()` 的效果就像是一個**轉義標識**：`$$()` 中的響應式變量不會追加上 `.value`。

### 作為函數返回值 {#returning-inside-function-scope}

如果將響應式變量直接放在返回值表達式中會丟失掉響應性：

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // 監聽 mousemove 事件

  // 不起效！
  return {
    x,
    y
  }
}
```

上面的語句將被翻譯為：

```ts
return {
  x: x.value,
  y: y.value
}
```

為了保持響應性，我們需要返回的是真正的 ref，而不是返回時 ref 內的值。

我們仍然可以使用 `$$()` 來解決這個問題。在這個例子中，`$$()` 可以直接用在要返回的對象上，`$$()` 調用時任何對響應式變量的引用都會保留為對相應 ref 的引用：

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // 監聽 mousemove 事件

  // 修改後起效
  return $$({
    x,
    y
  })
}
```

### 在已解構的 props 上使用 `$$()` {#using-on-destructured-props}

`$$()` 也適用於已解構的 props，因為它們也是響應式的變量。編譯器會高效地通過 `toRef` 來做轉換：

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

編譯結果為：

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## TypeScript 集成 <sup class="vt-badge ts" /> {#typescript-integration}

Vue 為這些宏函數都提供了類型聲明 (全局可用)，因此類型推導都會符合預期。它與標準的 TypeScript 語義沒有不兼容之處，因此它的語法可以與所有現有的工具兼容。

這也意味著這些宏函數在任何 JS / TS 文件中都是合法的，不是僅能在 Vue SFC 中使用。

因為這些宏函數都是全局可用的，它們的類型需要被顯式地引用 (例如，在 `env.d.ts` 文件中)：

```ts
/// <reference types="vue/macros-global" />
```

若你是從 `vue/macros` 中顯式引入宏函數時，則不需要像這樣全局聲明。

## 顯式啟用 {#explicit-opt-in}

:::danger Core 不再支持
以下內容僅適用於 Vue 3.3 及以下版本。Vue core 3.4 及以上版本和 `@vitejs/plugin-vue` 5.0 及以上版本已經將其移除。如需繼續使用，請遷移至 [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html)。
:::

### Vite {#vite}

- 需要 `@vitejs/plugin-vue@>=2.0.0`
- 應用於 SFC 和 js(x)/ts(x) 文件。在執行轉換之前，會對文件進行快速的使用檢查，因此不使用宏的文件不會有性能損失。
- 注意 `reactivityTransform` 現在是一個插件的頂層選項，而不再是位於 `script.refSugar` 之中了，因為它不僅僅只對 SFC 起效。

```js
// vite.config.js
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- 目前僅對 SFC 起效
- 需要 `vue-loader@>=17.0.0`

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### 僅用 `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- 目前僅對 SFC 起效
- 需要 `vue-loader@>=17.0.0`

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```
