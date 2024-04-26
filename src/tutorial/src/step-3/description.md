# 屬性綁定 {#attribute-bindings}

在 Vue 中，mustache 語法 (即雙大括號) 只能用於文本插值。為了給屬性綁定一個動態值，需要使用 `v-bind` 指令：

```vue-html
<div v-bind:id="dynamicId"></div>
```

**指令**是由 `v-` 開頭的一種特殊屬性。它們是 Vue 模板語法的一部分。和文本插值類似，指令的值是可以訪問組件狀態的 JavaScript 表達式。關於 `v-bind` 和指令語法的完整細節請詳閱<a target="_blank" href="/guide/essentials/template-syntax.html">指南 - 模板語法</a>。

冒號後面的部分 (`:id`) 是指令的“參數”。此處，元素的 `id` attribute 將與組件狀態裡的 `dynamicId` 屬性保持同步。

由於 `v-bind` 使用地非常頻繁，它有一個專門的簡寫語法：

```vue-html
<div :id="dynamicId"></div>
```

現在，試著把一個動態的 `class` 綁定添加到這個 `<h1>` 上，並使用 `titleClass` 的<span class="options-api">數據屬性</span><span class="composition-api"> ref </span>作為它的值。如果綁定正確，文字將會變為紅色。
