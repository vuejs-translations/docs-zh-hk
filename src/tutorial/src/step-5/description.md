# 表單綁定 {#form-bindings}

我們可以同時使用 `v-bind` 和 `v-on` 來在表單的輸入元素上創建雙向綁定：

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // v-on 處理函數會接收原生 DOM 事件
    // 作為其參數。
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // v-on 處理函數會接收原生 DOM 事件
  // 作為其參數。
  text.value = e.target.value
}
```

</div>

試著在文本框裡輸入——你會看到 `<p>` 裡的文本也隨著你的輸入更新了。

為了簡化雙向綁定，Vue 提供了一個 `v-model` 指令，它實際上是上述操作的語法糖：

```vue-html
<input v-model="text">
```

`v-model` 會將被綁定的值與 `<input>` 的值自動同步，這樣我們就不必再使用事件處理函數了。

`v-model` 不僅支持文本輸入框，也支持諸如多選框、單選框、下拉框之類的輸入類型。我們在<a target="_blank" href="/guide/essentials/forms.html">指南 - 表單綁定</a>中討論了更多的細節。

現在，試著用 `v-model` 把代碼重構一下吧。
