# 條件渲染 {#conditional-rendering}

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

`v-if` 指令用於條件性地渲染一塊內容。這塊內容只會在指令的表達式返回真值時才被渲染。

```vue-html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else` {#v-else}

你也可以使用 `v-else` 為 `v-if` 添加一個“else 區塊”。

```vue-html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Toggle</button>
  <h1 v-if="awesome">Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</div>

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

一個 `v-else` 元素必須跟在一個 `v-if` 或者 `v-else-if` 元素後面，否則它將不會被識別。

## `v-else-if` {#v-else-if}

顧名思義，`v-else-if` 提供的是相應於 `v-if` 的“else if 區塊”。它可以連續多次重複使用：

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

和 `v-else` 類似，一個使用 `v-else-if` 的元素必須緊跟在一個 `v-if` 或一個 `v-else-if` 元素後面。

## `<template>` 上的 `v-if` {#v-if-on-template}

因為 `v-if` 是一個指令，他必須依附於某個元素。但如果我們想要切換不止一個元素呢？在這種情況下我們可以在一個 `<template>` 元素上使用 `v-if`，這只是一個不可見的包裝器元素，最後渲染的結果並不會包含這個 `<template>` 元素。

```vue-html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

`v-else` 和 `v-else-if` 也可以在 `<template>` 上使用。

## `v-show` {#v-show}

另一個可以用來按條件顯示一個元素的指令是 `v-show`。其用法基本一樣：

```vue-html
<h1 v-show="ok">Hello!</h1>
```

不同之處在於 `v-show` 會在 DOM 渲染中保留該元素；`v-show` 僅切換了該元素上名為 `display` 的 CSS 屬性。

`v-show` 不支持在 `<template>` 元素上使用，也不能和 `v-else` 搭配使用。

## `v-if` vs. `v-show` {#v-if-vs-v-show}

`v-if` 是“真實的”按條件渲染，因為它確保了在切換時，條件區塊內的事件監聽器和子組件都會被銷毀與重建。

`v-if` 也是**惰性**的：如果在初次渲染時條件值為 false，則不會做任何事。條件區塊只有當條件首次變為 true 時才被渲染。

相比之下，`v-show` 簡單許多，元素無論初始條件如何，始終會被渲染，只有 CSS `display` 屬性會被切換。

總的來說，`v-if` 有更高的切換開銷，而 `v-show` 有更高的初始渲染開銷。因此，如果需要頻繁切換，則使用 `v-show` 較好；如果在運行時綁定條件很少改變，則 `v-if` 會更合適。

## `v-if` 和 `v-for` {#v-if-with-v-for}

::: warning 警告
同時使用 `v-if` 和 `v-for` 是**不推薦的**，因為這樣二者的優先級不明顯。請查看[風格指南](/style-guide/rules-essential#avoid-v-if-with-v-for)獲得更多信息。
:::

當 `v-if` 和 `v-for` 同時存在於一個元素上的時候，`v-if` 會首先被執行。請查看[列表渲染指南](list#v-for-with-v-if)獲取更多細節。
