# 模板語法 {#template-syntax}

Vue 使用一種基於 HTML 的模板語法，使我們能夠聲明式地將其組件實例的數據綁定到呈現的 DOM 上。所有的 Vue 模板都是語法層面合法的 HTML，可以被符合規範的瀏覽器和 HTML 解析器解析。

在底層機制中，Vue 會將模板編譯成高度優化的 JavaScript 代碼。結合響應式系統，當應用狀態變更時，Vue 能夠智能地推導出需要重新渲染的組件的最少數量，並應用最少的 DOM 操作。

如果你對虛擬 DOM 的概念比較熟悉，並且偏好直接使用 JavaScript，你也可以結合可選的 JSX 支持[直接手寫渲染函數](/guide/extras/render-function)而不採用模板。但請注意，這將不會享受到和模板同等級別的編譯時優化。

## 文本插值 {#text-interpolation}

最基本的數據綁定形式是文本插值，它使用的是“Mustache”語法 (即雙大括號)：

```vue-html
<span>Message: {{ msg }}</span>
```

雙大括號標籤會被替換為[相應組件實例中](/guide/essentials/reactivity-fundamentals#declaring-reactive-state) `msg` 屬性的值。同時每次 `msg` 屬性更改時它也會同步更新。

## 原始 HTML {#raw-html}

雙大括號會將數據解釋為純文本，而不是 HTML。若想插入 HTML，你需要使用 [`v-html` 指令](/api/built-in-directives#v-html)：

```vue-html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

<script setup>
  const rawHtml = '<span style="color: red">This should be red.</span>'
</script>

<p class="demo">
  <p>Using text interpolation: {{ rawHtml }}</p>
  <p>Using v-html directive: <span v-html="rawHtml"></span></p>
</p>

這裡我們遇到了一個新的概念。這裡看到的 `v-html` 屬性被稱為一個**指令**。指令由 `v-` 作為前綴，表明它們是一些由 Vue 提供的特殊屬性，你可能已經猜到了，它們將為渲染的 DOM 應用特殊的響應式行為。這裡我們做的事情簡單來說就是：在當前組件實例上，將此元素的 innerHTML 與 `rawHtml` 屬性保持同步。

`span` 的內容將會被替換為 `rawHtml` 屬性的值，插值為純 HTML——數據綁定將會被忽略。注意，你不能使用 `v-html` 來拼接組合模板，因為 Vue 不是一個基於字符串的模板引擎。在使用 Vue 時，應當使用組件作為 UI 重用和組合的基本單元。

:::warning 安全警告
在網站上動態渲染任意 HTML 是非常危險的，因為這非常容易造成 [XSS 漏洞](https://zh.wikipedia.org/wiki/%E8%B7%A8%E7%B6%B2%E7%AB%99%E6%8C%87%E4%BB%A4%E7%A2%BC)。請僅在內容安全可信時再使用 `v-html`，並且**永遠不要**使用用戶提供的 HTML 內容。
:::

## 屬性綁定 {#屬性-bindings}

雙大括號不能在 HTML 屬性中使用。想要響應式地綁定一個屬性，應該使用 [`v-bind` 指令](/api/built-in-directives#v-bind)：

```vue-html
<div v-bind:id="dynamicId"></div>
```

`v-bind` 指令指示 Vue 將元素的 `id` 屬性與組件的 `dynamicId` 屬性保持一致。如果綁定的值是 `null` 或者 `undefined`，那麼該屬性將會從渲染的元素上移除。

### 簡寫 {#shorthand}

因為 `v-bind` 非常常用，我們提供了特定的簡寫語法：

```vue-html
<div :id="dynamicId"></div>
```

開頭為 `:` 的屬性可能和一般的 HTML 屬性看起來不太一樣，但它的確是合法的屬性名稱字符，並且所有支持 Vue 的瀏覽器都能正確解析它。此外，他們不會出現在最終渲染的 DOM 中。簡寫語法是可選的，但相信在你瞭解了它更多的用處後，你應該會更喜歡它。

> 接下來的指引中，我們都將在示例中使用簡寫語法，因為這是在實際開發中更常見的用法。

### 同名簡寫 <sup class="vt-badge" data-text="3.4+" /> {#same-name-shorthand}

如果屬性名稱與綁定的 JavaScript 值的名稱相同，那麼可以進一步簡化語法，省略屬性值：

```vue-html
<!-- 與 :id="id" 相同 -->
<div :id></div>

<!-- 這也同樣有效 -->
<div v-bind:id></div>
```

這與在 JavaScript 中聲明對象時使用的屬性簡寫語法類似。請注意，這是一個只在 Vue 3.4 及以上版本中可用的特性。

### 布爾型屬性 {#boolean-attributes}

[布爾型屬性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/attributes#%E5%B8%83%E5%B0%94%E5%80%BC%E5%B1%9E%E6%80%A7) 依據 true / false 值來決定屬性是否應該存在於該元素上。[`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/屬性s/disabled) 就是最常見的例子之一。

`v-bind` 在這種場景下的行為略有不同：

```vue-html
<button :disabled="isButtonDisabled">Button</button>
```

當 `isButtonDisabled` 為[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)或一個空字符串 (即 `<button disabled="">`) 時，元素會包含這個 `disabled` 屬性。而當其為其他[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)時屬性將被忽略。

### 動態綁定多個值 {#dynamically-binding-multiple-attributes}

如果你有像這樣的一個包含多個屬性的 JavaScript 對象：

<div class="composition-api">

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    objectOfAttrs: {
      id: 'container',
      class: 'wrapper'
    }
  }
}
```

</div>

通過不帶參數的 `v-bind`，你可以將它們綁定到單個元素上：

```vue-html
<div v-bind="objectOfAttrs"></div>
```

## 使用 JavaScript 表達式 {#using-javascript-expressions}

至此，我們僅在模板中綁定了一些簡單的屬性名。但是 Vue 實際上在所有的數據綁定中都支持完整的 JavaScript 表達式：

```vue-html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

這些表達式都會被作為 JavaScript ，以當前組件實例為作用域解析執行。

在 Vue 模板內，JavaScript 表達式可以被使用在如下場景上：

- 在文本插值中 (雙大括號)
- 在任何 Vue 指令 (以 `v-` 開頭的特殊屬性) 屬性的值中

### 僅支持表達式 {#expressions-only}

每個綁定僅支持**單一表達式**，也就是一段能夠被求值的 JavaScript 代碼。一個簡單的判斷方法是是否可以合法地寫在 `return` 後面。

因此，下面的例子都是**無效**的：

```vue-html
<!-- 這是一個語句，而非表達式 -->
{{ var a = 1 }}

<!-- 條件控制也不支持，請使用三元表達式 -->
{{ if (ok) { return message } }}
```

### 調用函數 {#calling-functions}

可以在綁定的表達式中使用一個組件暴露的方法：

```vue-html
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```

:::tip
綁定在表達式中的方法在組件每次更新時都會被重新調用，因此**不**應該產生任何副作用，例如改變數據或觸發異步操作。
:::

### 受限的全局訪問 {#restricted-globals-access}

模板中的表達式將被沙盒化，僅能夠訪問到[有限的全局對象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3)。該列表中會暴露常用的內置全局對象，例如 `Math` 和 `Date`。

沒有顯式包含在列表中的全局對象將不能在模板內表達式中訪問，例如用戶附加在 `window` 上的屬性。然而，你也可以自行在 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 上顯式地添加它們，供所有的 Vue 表達式使用。

## 指令 Directives {#directives}

指令是帶有 `v-` 前綴的特殊屬性。Vue 提供了許多[內置指令](/api/built-in-directives)，包括上面我們所介紹的 `v-bind` 和 `v-html`。

指令屬性的期望值為一個 JavaScript 表達式 (除了少數幾個例外，即之後要討論到的 `v-for`、`v-on` 和 `v-slot`)。一個指令的任務是在其表達式的值變化時響應式地更新 DOM。以 [`v-if`](/api/built-in-directives#v-if) 為例：

```vue-html
<p v-if="seen">Now you see me</p>
```

這裡，`v-if` 指令會基於表達式 `seen` 的值的真假來移除/插入該 `<p>` 元素。

### 參數 Arguments {#arguments}

某些指令會需要一個“參數”，在指令名後通過一個冒號隔開做標識。例如用 `v-bind` 指令來響應式地更新一個 HTML 屬性：

```vue-html
<a v-bind:href="url"> ... </a>

<!-- 簡寫 -->
<a :href="url"> ... </a>
```

這裡 `href` 就是一個參數，它告訴 `v-bind` 指令將表達式 `url` 的值綁定到元素的 `href` 屬性上。在簡寫中，參數前的一切 (例如 `v-bind:`) 都會被縮略為一個 `:` 字符。

另一個例子是 `v-on` 指令，它將監聽 DOM 事件：

```vue-html
<a v-on:click="doSomething"> ... </a>

<!-- 簡寫 -->
<a @click="doSomething"> ... </a>
```

這裡的參數是要監聽的事件名稱：`click`。`v-on` 有一個相應的縮寫，即 `@` 字符。我們之後也會討論關於事件處理的更多細節。

### 動態參數 {#dynamic-arguments}

同樣在指令參數上也可以使用一個 JavaScript 表達式，需要包含在一對方括號內：

```vue-html
<!--
注意，參數表達式有一些約束，
參見下面“動態參數值的限制”與“動態參數語法的限制”章節的解釋
-->
<a v-bind:[attributeName]="url"> ... </a>

<!-- 簡寫 -->
<a :[attributeName]="url"> ... </a>
```

這裡的 `attributeName` 會作為一個 JavaScript 表達式被動態執行，計算得到的值會被用作最終的參數。舉例來說，如果你的組件實例有一個數據屬性 `attributeName`，其值為 `"href"`，那麼這個綁定就等同於 `v-bind:href`。

相似地，你還可以將一個函數綁定到動態的事件名稱上：

```vue-html
<a v-on:[eventName]="doSomething"> ... </a>

<!-- 簡寫 -->
<a @[eventName]="doSomething"> ... </a>
```

在此示例中，當 `eventName` 的值是 `"focus"` 時，`v-on:[eventName]` 就等價於 `v-on:focus`。

#### 動態參數值的限制 {#dynamic-argument-value-constraints}

動態參數中表達式的值應當是一個字符串，或者是 `null`。特殊值 `null` 意為顯式移除該綁定。其他非字符串的值會觸發警告。

#### 動態參數語法的限制 {#dynamic-argument-syntax-constraints}

動態參數表達式因為某些字符的緣故有一些語法限制，例如空格和引號，在 HTML 屬性名稱中都是不合法的。例如下面的示例：

```vue-html
<!-- 這會觸發一個編譯器警告 -->
<a :['foo' + bar]="value"> ... </a>
```

如果你需要傳入一個複雜的動態參數，我們推薦使用[計算屬性](computed)替換複雜的表達式，也是 Vue 最基礎的概念之一，我們很快就會講到。

當使用 DOM 內嵌模板 (直接寫在 HTML 文件裡的模板) 時，我們需要避免在名稱中使用大寫字母，因為瀏覽器會強制將其轉換為小寫：

```vue-html
<a :[someAttr]="value"> ... </a>
```

上面的例子將會在 DOM 內嵌模板中被轉換為 `:[someattr]`。如果你的組件擁有 “someAttr” 屬性而非 “someattr”，這段代碼將不會工作。單文件組件內的模板**不**受此限制。

### 修飾符 Modifiers {#modifiers}

修飾符是以點開頭的特殊後綴，表明指令需要以一些特殊的方式被綁定。例如 `.prevent` 修飾符會告知 `v-on` 指令對觸發的事件調用 `event.preventDefault()`：

```vue-html
<form @submit.prevent="onSubmit">...</form>
```

之後在講到 [`v-on`](./event-handling#event-modifiers) 和 [`v-model`](./forms#modifiers) 的功能時，你將會看到其他修飾符的例子。

最後，在這裡你可以直觀地看到完整的指令語法：

![指令語法圖](./images/directive.png)

<!-- https://www.figma.com/file/BGWUknIrtY9HOmbmad0vFr/Directive -->

<!-- zhlint disabled -->
