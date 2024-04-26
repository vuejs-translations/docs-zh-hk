# 生命週期和模板引用 {#lifecycle-and-template-refs}

目前為止，Vue 為我們處理了所有的 DOM 更新，這要歸功於響應性和聲明式渲染。然而，有時我們也會不可避免地需要手動操作 DOM。

這時我們需要使用**模板引用**——也就是指向模板中一個 DOM 元素的 ref。我們需要通過<a target="_blank" href="/api/built-in-special-attributes.html#ref">這個特殊的 `ref` 屬性</a>來實現模板引用：

```vue-html
<p ref="pElementRef">hello</p>
```

<div class="composition-api">

要訪問該引用，我們需要聲明<span class="html">並暴露</span>一個同名的 ref：

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

注意這個 ref 使用 `null` 值來初始化。這是因為當 <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> 執行時，DOM 元素還不存在。模板引用 ref 只能在組件**掛載**後訪問。

要在掛載之後執行代碼，我們可以使用 `onMounted()` 函數：

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // 此時組件已經掛載。
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // 此時組件已經掛載。
    })
  }
})
```

</div>
</div>

<div class="options-api">

此元素將作為 `this.$refs.pElementRef` 暴露在 `this.$refs` 上。然而，你只能在組件**掛載**之後訪問它。

要在掛載之後執行代碼，我們可以使用 `mounted` 選項：

<div class="sfc">

```js
export default {
  mounted() {
    // 此時組件已經掛載。
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // 此時組件已經掛載。
  }
})
```

</div>
</div>

這被稱為**生命週期鉤子**——它允許我們註冊一個在組件的特定生命週期調用的回調函數。還有一些其他的鉤子如 <span class="options-api">`created` 和 `updated`</span><span class="composition-api">`onUpdated` 和 `onUnmounted`</span>。更多細節請查閱<a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">生命週期圖示</a>。

現在，嘗試添加一個 <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> 鉤子，然後通過 <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span> 訪問 `<p>`，並直接對其執行一些 DOM 操作。(例如修改它的 `textContent`)。
