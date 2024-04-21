# Class 與 Style 綁定 {#class-and-style-bindings}

數據綁定的一個常見需求場景是操縱元素的 CSS class 列表和內聯樣式。因為 `class` 和 `style` 都是元素属性，我們可以和其他属性一樣使用 `v-bind` 將它們和動態的字符串綁定。但是，在處理比較複雜的綁定時，通過拼接生成字符串是麻煩且易出錯的。因此，Vue 專門為 `class` 和 `style` 的 `v-bind` 用法提供了特殊的功能增強。除了字符串外，表達式的值也可以是對象或數組。

## 綁定 HTML class {#binding-html-classes}

### 綁定對象 {#binding-to-objects}

我們可以向 `:class` (`v-bind:class` 的縮寫) 傳遞一個對象來動態切換 class：

```vue-html
<div :class="{ active: isActive }"></div>
```

上面的語法表示 `active` 是否存在取決於數據屬性 `isActive` 的[真假值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)。

你可以在對象中寫多個字段來操作多個 class。此外，`:class` 指令也可以和一般的 `class` 屬性共存。例如下面這樣的狀態：

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

配合以下模板：

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

渲染的結果會是：

```vue-html
<div class="static active"></div>
```

當 `isActive` 或者 `hasError` 改變時，class 列表會隨之更新。舉例來說，如果 `hasError` 變為 `true`，class 列表也會變成 `"static active text-danger"`。

綁定的對象並不一定需要寫成內聯字面量的形式，也可以直接綁定一個對象：

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

這將渲染出：

```vue-html
<div class="active"></div>
```

我們也可以綁定一個返回對象的[計算屬性](./computed)。這是一個常見且很有用的技巧：

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### 綁定數組 {#binding-to-arrays}

我們可以給 `:class` 綁定一個數組來渲染多個 CSS class：

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

渲染的結果是：

```vue-html
<div class="active text-danger"></div>
```

如果你還想在數組中有條件地渲染某個 class，你可以使用三元表達式：

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

`errorClass` 會一直存在，但 `activeClass` 只會在 `isActive` 為真時才存在。

然而，這可能在有多個依賴條件的 class 時會有些冗長。因此你也可以在數組中嵌套對象：

```vue-html
<div :class="[{ active: isActive }, errorClass]"></div>
```

### 在組件上使用 {#with-components}

> 本節假設你已經有 [Vue 組件](/guide/essentials/component-basics)的知識基礎。如果沒有，你也可以暫時跳過，以後再閱讀。

對於只有一個根元素的組件，當你使用了 `class` 屬性時，這些 class 會被添加到根元素上並與該元素上已有的 class 合併。

舉例來說，如果你聲明了一個組件名叫 `MyComponent`，模板如下：

```vue-html
<!-- 子組件模板 -->
<p class="foo bar">Hi!</p>
```

在使用時添加一些 class：

```vue-html
<!-- 在使用組件時 -->
<MyComponent class="baz boo" />
```

渲染出的 HTML 為：

```vue-html
<p class="foo bar baz boo">Hi!</p>
```

Class 的綁定也是同樣的：

```vue-html
<MyComponent :class="{ active: isActive }" />
```

當 `isActive` 為真時，被渲染的 HTML 會是：

```vue-html
<p class="foo bar active">Hi!</p>
```

如果你的組件有多個根元素，你將需要指定哪個根元素來接收這個 class。你可以通過組件的 `$attrs` 屬性來指定接收的元素：

```vue-html
<!-- MyComponent 模板使用 $attrs 時 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

```vue-html
<MyComponent class="baz" />
```

這將被渲染為：

```html
<p class="baz">Hi!</p>
<span>This is a child component</span>
```

你可以在[透傳 Attribute](/guide/components/attrs) 一章中了解更多組件的 attribute 繼承的細節。

## 綁定內聯樣式 {#binding-inline-styles}

### 綁定對象 {#binding-to-objects-1}

`:style` 支持綁定 JavaScript 對象值，對應的是 [HTML 元素的 `style` 屬性](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)：

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

儘管推薦使用 camelCase，但 `:style` 也支持 kebab-cased 形式的 CSS 屬性 key (對應其 CSS 中的實際名稱)，例如：

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

直接綁定一個樣式對象通常是一個好主意，這樣可以使模板更加簡潔：

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

同樣的，如果樣式對象需要更復雜的邏輯，也可以使用返回樣式對象的計算屬性。

### 綁定數組 {#binding-to-arrays-1}

我們還可以給 `:style` 綁定一個包含多個樣式對象的數組。這些對象會被合併後渲染到同一元素上：

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 自動前綴 {#auto-prefixing}

當你在 `:style` 中使用了需要[瀏覽器特殊前綴](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)的 CSS 屬性時，Vue 會自動為他們加上相應的前綴。Vue 是在運行時檢查該屬性是否支持在當前瀏覽器中使用。如果瀏覽器不支持某個屬性，那麼將嘗試加上各個瀏覽器特殊前綴，以找到哪一個是被支持的。

### 樣式多值 {#multiple-values}

你可以對一個樣式屬性提供多個 (不同前綴的) 值，舉例來說：

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

數組僅會渲染瀏覽器支持的最後一個值。在這個示例中，在支持不需要特別前綴的瀏覽器中都會渲染為 `display: flex`。
