# 條件渲染 {#conditional-rendering}

我們可以使用 `v-if` 指令來有條件地渲染元素：

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

這個 `<h1>` 標籤只會在 `awesome` 的值為[真值 (Truthy)](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy) 時渲染。若 `awesome` 更改為[假值 (Falsy)](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)，它將被從 DOM 中移除。

我們也可以使用 `v-else` 和 `v-else-if` 來表示其他的條件分支：

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

現在，示例程序同時展示了兩個 `<h1>` 標籤，並且按鈕不執行任何操作。嘗試給它們添加 `v-if` 和 `v-else` 指令，並實現 `toggle()` 方法，讓我們可以使用按鈕在它們之間切換。

更多細節請查閱 `v-if`：<a target="_blank" href="/guide/essentials/conditional.html">指南 - 條件渲染</a>
