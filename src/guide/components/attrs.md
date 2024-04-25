---
outline: deep
---

# 透傳屬性 {#fallthrough-attributes}

> 此章節假設你已經看過了[組件基礎](/guide/essentials/component-basics)。若你還不了解組件是什麼，請先閱讀該章節。

## 屬性繼承 {#attribute-inheritance}

“透傳屬性 [props](./props) 或 [emits](./events#defining-custom-events) 的屬性或者 `v-on` 事件監聽器。最常見的例子就是 `class`、`style` 和 `id`。

當一個組件以單個元素為根作渲染時，透傳的屬性會自動被添加到根元素上。舉例來說，假如我們有一個 `<MyButton>` 組件，它的模板是這樣的：

```vue-html
<!-- <MyButton> 的模板 -->
<button>click me</button>
```

一個父組件使用了這個組件，並且傳入了 `class`：

```vue-html
<MyButton class="large" />
```

最後渲染出的 DOM 結果是：

```html
<button class="large">click me</button>
```

這裡，`<MyButton>` 並沒有將 `class` 聲明為一個它所接受的 prop，所以 `class` 被視作透傳屬性 `<MyButton>` 的根元素上。

### 對 `class` 和 `style` 的合併 {#class-and-style-merging}

如果一個子組件的根元素已經有了 `class` 或 `style` 屬性，它會和從父組件上繼承的值合併。如果我們將之前的 `<MyButton>` 組件的模板改成這樣：

```vue-html
<!-- <MyButton> 的模板 -->
<button class="btn">click me</button>
```

則最後渲染出的 DOM 結果會變成：

```html
<button class="btn large">click me</button>
```

### `v-on` 監聽器繼承 {#v-on-listener-inheritance}

同樣的規則也適用於 `v-on` 事件監聽器：

```vue-html
<MyButton @click="onClick" />
```

`click` 監聽器會被添加到 `<MyButton>` 的根元素，即原生的 `<button>` 元素之上。當原生的 `<button>` 被點擊，會觸發父組件的 `onClick` 方法。同樣的，如果原生 `button` 元素自身也通過 `v-on` 綁定了一個事件監聽器，則這個監聽器和從父組件繼承的監聽器都會被觸發。

### 深層組件繼承 {#nested-component-inheritance}

有些情況下一個組件會在根節點上渲染另一個組件。例如，我們重構一下 `<MyButton>`，讓它在根節點上渲染 `<BaseButton>`：

```vue-html
<!-- <MyButton/> 的模板，只是渲染另一個組件 -->
<BaseButton />
```

此時 `<MyButton>` 接收的透傳屬性會直接繼續傳給 `<BaseButton>`。

請注意：

1. 透傳的屬性不會包含 `<MyButton>` 上聲明過的 props 或是針對 `emits` 聲明事件的 `v-on` 偵聽函數，換句話說，聲明過的 props 和偵聽函數被 `<MyButton>`“消費”了。

2. 透傳的属性如符合聲明，也可以作為 props 傳入 `<BaseButton>`。

## 禁用屬性繼承 {#disabling-attribute-inheritance}

如果你**不想要**一個組件自動地繼承屬性，你可以在組件選項中設置 `inheritAttrs: false`。

<div class="composition-api">

 從 3.3 開始你也可以直接在 `<script setup>` 中使用 [`defineOptions`](/api/sfc-script-setup#defineoptions)：

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup 邏輯
</script>
```

</div>

最常見的需要禁用屬性繼承的場景便是屬性需要應用在根節點以外的其他元素上。通過設置 `inheritAttrs` 選項為 `false`，你可以完全控制透傳進來的屬性被如何使用。

這些透傳進來的屬性可以在模板的表達式中直接用 `$attrs` 訪問到。

```vue-html
<span>Fallthrough attribute: {{ $attrs }}</span>
```

這個 `$attrs` 對象包含了除組件所聲明的 `props` 和 `emits` 之外的所有其他屬性，例如 `class`，`style`，`v-on` 監聽器等等。

有幾點需要注意：

- 和 props 有所不同，透傳屬性在 JavaScript 中保留了它們原始的大小寫，所以像 `foo-bar` 這樣的一個屬性需要通過 `$attrs['foo-bar']` 來訪問。

- 像 `@click` 這樣的一個 `v-on` 事件監聽器將在此對象下被暴露為一個函數 `$attrs.onClick`。

現在我們要再次使用一下[之前小節](#attribute-inheritance)中的 `<MyButton>` 組件例子。有時候我們可能為了樣式，需要在 `<button>` 元素外包裝一層 `<div>`：

```vue-html
<div class="btn-wrapper">
  <button class="btn">click me</button>
</div>
```

我們想要所有像 `class` 和 `v-on` 監聽器這樣的透傳屬性都應用在內部的 `<button>` 上而不是外層的 `<div>` 上。我們可以通過設定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 來實現：

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">click me</button>
</div>
```

小提示：[沒有參數的 `v-bind`](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) 會將一個對象的所有屬性都作為屬性應用到目標元素上。

## 多根節點的屬性繼承 {#attribute-inheritance-on-multiple-root-nodes}

和單根節點組件有所不同，有著多個根節點的組件沒有自動的屬性透傳行為。如果 `$attrs` 沒有被顯式綁定，將會拋出一個運行時警告。

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

如果 `<CustomLayout>` 有下面這樣的多根節點模板，由於 Vue 不知道要將屬性透傳到哪裡，所以會拋出一個警告。

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

如果 `$attrs` 被顯式綁定，則不會有警告：

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## 在 JavaScript 中訪問透傳屬性 {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

如果需要，你可以在 `<script setup>` 中使用 `useAttrs()` API 來訪問一個組件的所有透傳屬性：

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

如果沒有使用 `<script setup>`，`attrs` 會作為 `setup()` 上下文對象的一個屬性暴露：

```js
export default {
  setup(props, ctx) {
    // 透傳屬性被暴露為 ctx.attrs
    console.log(ctx.attrs)
  }
}
```

需要注意的是，雖然這裡的 `attrs` 對象總是反映為最新的透傳屬性，但它並不是響應式的 (考慮到性能因素)。你不能通過偵聽器去監聽它的變化。如果你需要響應性，可以使用 prop。或者你也可以使用 `onUpdated()` 使得在每次更新時結合最新的 `attrs` 執行副作用。

</div>

<div class="options-api">

如果需要，你可以通過 `$attrs` 這個實例屬性來訪問組件的所有透傳屬性：

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>
