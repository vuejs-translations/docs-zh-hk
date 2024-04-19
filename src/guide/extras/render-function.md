---
outline: deep
---

# 渲染函數 & JSX {#render-functions-jsx}

在絕大多數情況下，Vue 推薦使用模板語法來創建應用。然而在某些使用場景下，我們真的需要用到 JavaScript 完全的編程能力。這時**渲染函數**就派上用場了。

> 如果你還不熟悉虛擬 DOM 和渲染函數的概念的話，請確保先閱讀[渲染機制](/guide/extras/rendering-mechanism)章節。

## 基本用法 {#basic-usage}

### 創建 Vnodes {#creating-vnodes}

Vue 提供了一個 `h()` 函數用於創建 vnodes：

```js
import { h } from 'vue'

const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```

`h()` 是 **hyperscript** 的簡稱——意思是“能生成 HTML (超文本標記語言) 的 JavaScript”。這個名字來源於許多虛擬 DOM 實現默認形成的約定。一個更準確的名稱應該是 `createVnode()`，但當你需要多次使用渲染函數時，一個簡短的名字會更省力。

`h()` 函數的使用方式非常的靈活：

```js
// 除了類型必填以外，其他的參數都是可選的
h('div')
h('div', { id: 'foo' })

// attribute 和 property 都能在 prop 中書寫
// Vue 會自動將它們分配到正確的位置
h('div', { class: 'bar', innerHTML: 'hello' })

// 像 `.prop` 和 `.attr` 這樣的的屬性修飾符
// 可以分別通過 `.` 和 `^` 前綴來添加
h('div', { '.name': 'some-name', '^width': '100' })

// 類與樣式可以像在模板中一樣
// 用數組或對象的形式書寫
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// 事件監聽器應以 onXxx 的形式書寫
h('div', { onClick: () => {} })

// children 可以是一個字符串
h('div', { id: 'foo' }, 'hello')

// 沒有 props 時可以省略不寫
h('div', 'hello')
h('div', [h('span', 'hello')])

// children 數組可以同時包含 vnodes 與字符串
h('div', ['hello', h('span', 'hello')])
```

得到的 vnode 為如下形式：

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

::: warning 注意事項
完整的 `VNode` 接口包含其他內部屬性，但是強烈建議避免使用這些沒有在這裡列舉出的屬性。這樣能夠避免因內部屬性變更而導致的不兼容性問題。
:::

### 聲明渲染函數 {#declaring-render-function}

<div class="composition-api">

當組合式 API 與模板一起使用時，`setup()` 鉤子的返回值是用於暴露數據給模板。然而當我們使用渲染函數時，可以直接把渲染函數返回：

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // 返回渲染函數
    return () => h('div', props.msg + count.value)
  }
}
```

在 `setup()` 內部聲明的渲染函數天生能夠訪問在同一範圍內聲明的 props 和許多響應式狀態。

除了返回一個 vnode，你還可以返回字符串或數組：

```js
export default {
  setup() {
    return () => 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // 使用數組返回多個根節點
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

::: tip
請確保返回的是一個函數而不是一個值！`setup()` 函數在每個組件中只會被調用一次，而返回的渲染函數將會被調用多次。
:::

</div>
<div class="options-api">

我們可以使用 `render` 選項來聲明渲染函數：

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'hello'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

`render()` 函數可以訪問同一個 `this` 組件實例。

除了返回一個單獨的 vnode 之外，你還可以返回字符串或是數組：

```js
export default {
  render() {
    return 'hello world!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // 用數組來返回多個根節點
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

如果一個渲染函數組件不需要任何實例狀態，為了簡潔起見，它們也可以直接被聲明為一個函數：

```js
function Hello() {
  return 'hello world!'
}
```

沒錯，這就是一個合法的 Vue 組件！參閱[函數式組件](#functional-components)來了解更多語法細節。

### Vnodes 必須唯一 {#vnodes-must-be-unique}

組件樹中的 vnodes 必須是唯一的。下面是錯誤示範：

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // 重複的 vnodes 是無效的
    p,
    p
  ])
}
```

如果你真的非常想在頁面上渲染多個重複的元素或者組件，你可以使用一個工廠函數來做這件事。例如下面的這個渲染函數就可以完美渲染出 20 個相同的段落：

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hi')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) 是 JavaScript 的一個類似 XML 的擴展，有了它，我們可以用以下的方式來書寫代碼：

```jsx
const vnode = <div>hello</div>
```

在 JSX 表達式中，使用大括號來嵌入動態值：

```jsx
const vnode = <div id={dynamicId}>hello, {userName}</div>
```

`create-vue` 和 Vue CLI 都有預置的 JSX 語法支持。如果你想手動配置 JSX，請參閱 [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next) 文檔獲取更多細節。

雖然最早是由 React 引入，但實際上 JSX 語法並沒有定義運行時語義，並且能被編譯成各種不同的輸出形式。如果你之前使用過 JSX 語法，那麼請注意 **Vue 的 JSX 轉換方式與 React 中 JSX 的轉換方式不同**，因此你不能在 Vue 應用中使用 React 的 JSX 轉換。與 React JSX 語法的一些明顯區別包括：

- 可以使用 HTML attributes 例如 `class` 和 `for` 作為 props - 不需要使用 `className` 或 `htmlFor`。
- 傳遞子元素給組件 (例如 slots) 的[方式不同](#passing-slots)。

Vue 的類型定義也提供了 TSX 語法的類型推導支持。當使用 TSX 語法時，確保在 `tsconfig.json` 中配置了 `"jsx": "preserve"`，這樣的 TypeScript 就能保證 Vue JSX 語法轉換過程中的完整性。

### JSX 類型推斷 {#jsx-type-inference}

與轉換類似，Vue 的 JSX 也需要不同的類型定義。

從 Vue 3.4 開始，Vue 不再隱式註冊全局 `JSX` 命名空間。要指示 TypeScript 使用 Vue 的 JSX 類型定義，請確保在你的 `tsconfig.json` 中包含以下內容：

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

你也可以通過在文件的頂部加入 `/* @jsxImportSource vue */` 註釋來選擇性地開啟。

如果仍有代碼依賴於全局存在的 `JSX` 命名空間，你可以在項目中通過顯式導入或引用 `vue/jsx` 來保留 3.4 之前的全局行為，它註冊了全局 `JSX` 命名空間。

## 渲染函數案例 {#render-function-recipes}

下面我們提供了幾個常見的用等價的渲染函數 / JSX 語法，實現模板功能的案例：

### `v-if` {#v-if}

模板：

```vue-html
<div>
  <div v-if="ok">yes</div>
  <span v-else>no</span>
</div>
```

等價於使用如下渲染函數 / JSX 語法：

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{ok.value ? <div>yes</div> : <span>no</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'yes') : h('span', 'no')])
```

```jsx
<div>{this.ok ? <div>yes</div> : <span>no</span>}</div>
```

</div>

### `v-for` {#v-for}

模板：

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

等價於使用如下渲染函數 / JSX 語法：

<div class="composition-api">

```js
h(
  'ul',
  // assuming `items` is a ref with array value
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

以 `on` 開頭，並跟著大寫字母的 props 會被當作事件監聽器。例如，`onClick` 與模板中的 `@click` 等價。

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'click me'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  click me
</button>
```

### 事件修飾符 {#event-modifiers}

對於 `.passive`、`.capture` 和 `.once` 事件修飾符，可以使用駝峰命名法將他們拼接在事件名後面：

實例：

```js
h('input', {
  onClickCapture() {
    /* 捕捉模式中的監聽器 */
  },
  onKeyupOnce() {
    /* 只觸發一次 */
  },
  onMouseoverOnceCapture() {
    /* 單次 + 捕捉 */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

對於事件和按鍵修飾符，可以使用 [`withModifiers`](/api/render-function#withmodifiers) 函數：

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### 組件 {#components}

在給組件創建 vnode 時，傳遞給 `h()` 函數的第一個參數應是組件的定義。這意味著使用渲染函數時不再需要註冊組件了 —— 可以直接使用導入的組件：

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

不管是什麼類型的文件，只要從中導入的是有效的 Vue 組件，`h` 就能正常運作。

動態組件在渲染函數中也可直接使用：

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
    return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

如果一個組件是用名字註冊的，不能直接導入 (例如，由一個庫全局註冊)，可以使用 [`resolveComponent()`](/api/render-function#resolvecomponent) 來解決這個問題。

### 渲染插槽 {#rendering-slots}

<div class="composition-api">

在渲染函數中，插槽可以通過 `setup()` 的上下文來訪問。每個 `slots` 對象中的插槽都是一個**返回 vnodes 數組的函數**：

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // 默認插槽：
      // <div><slot /></div>
      h('div', slots.default()),

      // 具名插槽：
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

等價 JSX 語法：

```jsx
// 默認插槽
<div>{slots.default()}</div>

// 具名插槽
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

在渲染函數中，可以通過 [this.$slots](/api/component-instance#slots) 來訪問插槽：

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

等價 JSX 語法：

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### 傳遞插槽 {#passing-slots}

向組件傳遞子元素的方式與向元素傳遞子元素的方式有些許不同。我們需要傳遞一個插槽函數或者是一個包含插槽函數的對象而非是數組，插槽函數的返回值同一個正常的渲染函數的返回值一樣——並且在子組件中被訪問時總是會被轉化為一個 vnodes 數組。

```js
// 單個默認插槽
h(MyComponent, () => 'hello')

// 具名插槽
// 注意 `null` 是必需的
// 以避免 slot 對象被當成 prop 處理
h(MyComponent, null, {
    default: () => 'default slot',
    foo: () => h('div', 'foo'),
    bar: () => [h('span', 'one'), h('span', 'two')]
})
```

等價 JSX 語法：

```jsx
// 默認插槽
<MyComponent>{() => 'hello'}</MyComponent>

// 具名插槽
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

插槽以函數的形式傳遞使得它們可以被子組件懶調用。這能確保它被註冊為子組件的依賴關係，而不是父組件。這使得更新更加準確及有效。

### 作用域插槽 {#scoped-slots}

為了在父組件中渲染作用域插槽，需要給子組件傳遞一個插槽。注意該插槽現在擁有一個 `text` 參數。該插槽將在子組件中被調用，同時子組件中的數據將向上傳遞給父組件。

```js
// 父組件
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

記得傳遞 `null` 以避免插槽被誤認為 prop：

```js
// 子組件
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

等同於 JSX：

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```

### 內置組件 {#built-in-components}

諸如 `<KeepAlive>`、`<Transition>`、`<TransitionGroup>`、`<Teleport>` 和 `<Suspense>` 等[內置組件](/api/built-in-components)在渲染函數中必須導入才能使用：

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

`v-model` 指令擴展為 `modelValue` 和 `onUpdate:modelValue` 在模板編譯過程中，我們必須自己提供這些 props：

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### 自定義指令 {#custom-directives}

可以使用 [`withDirectives`](/api/render-function#withdirectives) 將自定義指令應用於 vnode：

```js
import { h, withDirectives } from 'vue'

// 自定義指令
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

當一個指令是以名稱註冊並且不能被直接導入時，可以使用 [`resolveDirective`](/api/render-function#resolvedirective) 函數來解決這個問題。

### 模板引用 {#template-refs}

<div class="composition-api">

在組合式 API 中，模板引用通過將 `ref()` 本身作為一個屬性傳遞給 vnode 來創建：

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```

</div>
<div class="options-api">

在選項式 API 中，模板引用通過在 vnode 參數中傳遞字符串類型的引用名稱來創建：

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## 函數式組件 {#functional-components}

函數式組件是一種定義自身沒有任何狀態的組件的方式。它們很像純函數：接收 props，返回 vnodes。函數式組件在渲染過程中不會創建組件實例 (也就是說，沒有 `this`)，也不會觸發常規的組件生命週期鉤子。

我們用一個普通的函數而不是一個選項對象來創建函數式組件。該函數實際上就是該組件的渲染函數。

<div class="composition-api">

函數式組件的簽名與 `setup()` 鉤子相同：

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

而因為函數式組件裡沒有 `this` 引用，Vue 會把 `props` 當作第一個參數傳入：

```js
function MyComponent(props, context) {
  // ...
}
```

第二個參數 `context` 包含三個屬性：`attrs`、`emit` 和 `slots`。它們分別相當於組件實例的 [`$attrs`](/api/component-instance#attrs)、[`$emit`](/api/component-instance#emit) 和 [`$slots`](/api/component-instance#slots) 這幾個屬性。

</div>

大多數常規組件的配置選項在函數式組件中都不可用，除了 [`props`](/api/options-state#props) 和 [`emits`](/api/options-state#emits)。我們可以給函數式組件添加對應的屬性來聲明它們：

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

如果這個 `props` 選項沒有被定義，那麼被傳入函數的 `props` 對象就會像 `attrs` 一樣會包含所有屬性。除非指定了 `props` 選項，否則每個 prop 的名字將不會基於駝峰命名法被一般化處理。

對於有明確 `props` 的函數式組件，[屬性透傳](/guide/components/attrs)的原理與普通組件基本相同。然而，對於沒有明確指定 `props` 的函數式組件，只有 `class`、`style` 和 `onXxx` 事件監聽器將默認從 `attrs` 中繼承。在這兩種情況下，可以將 `inheritAttrs` 設置為 `false` 來禁用屬性繼承：

```js
MyComponent.inheritAttrs = false
```

函數式組件可以像普通組件一樣被註冊和使用。如果你將一個函數作為第一個參數傳入 `h`，它將會被當作一個函數式組件來對待。

### 為函數式組件標註類型<sup class="vt-badge ts" /> {#typing-functional-components}

函數式組件可以根據它們是否有命名來標註類型。在單文件組件模板中，[Vue - Official 擴展](https://github.com/vuejs/language-tools)還支持對正確類型化的函數式組件進行類型檢查。

**具名函數式組件**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**匿名函數式組件**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```
