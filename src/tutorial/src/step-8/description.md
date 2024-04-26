# 計算屬性 {#computed-property}

讓我們在上一步的 todo 列表基礎上繼續。現在，我們已經給每一個 todo 添加了切換功能。這是通過給每一個 todo 對象添加 `done` 屬性來實現的，並且使用了 `v-model` 將其綁定到複選框上：

```vue-html{2}
<li v-for="todo in todos">
  <input type="checkbox" v-model="todo.done">
  ...
</li>
```

下一個可以添加的改進是隱藏已經完成的 todo。我們已經有了一個能夠切換 `hideCompleted` 狀態的按鈕。但是應該如何基於狀態渲染不同的列表項呢？

<div class="options-api">

介紹一個新概念：<a target="_blank" href="/guide/essentials/computed.html">計算屬性</a>。我們可以使用 `computed` 選項聲明一個響應式的屬性，它的值由其他屬性計算而來：

<div class="sfc">

```js
export default {
  // ...
  computed: {
    filteredTodos() {
      // 根據 `this.hideCompleted` 返回過濾後的 todo 項目
    }
  }
}
```

</div>
<div class="html">

```js
createApp({
  // ...
  computed: {
    filteredTodos() {
      // 根據 `this.hideCompleted` 返回過濾後的 todo 項目
    }
  }
})
```

</div>

</div>
<div class="composition-api">

介紹一個新 API：<a target="_blank" href="/guide/essentials/computed.html">`computed()`</a>。它可以讓我們創建一個計算屬性 ref，這個 ref 會動態地根據其他響應式數據源來計算其 `.value`：

<div class="sfc">

```js{8-11}
import { ref, computed } from 'vue'

const hideCompleted = ref(false)
const todos = ref([
  /* ... */
])

const filteredTodos = computed(() => {
  // 根據 `todos.value` & `hideCompleted.value`
  // 返回過濾後的 todo 項目
})
```

</div>
<div class="html">

```js{10-13}
import { createApp, ref, computed } from 'vue'

createApp({
  setup() {
    const hideCompleted = ref(false)
    const todos = ref([
      /* ... */
    ])

    const filteredTodos = computed(() => {
      // 根據 `todos.value` & `hideCompleted.value`
      // 返回過濾後的 todo 項目
    })

    return {
      // ...
    }
  }
})
```

</div>

</div>

```diff
- <li v-for="todo in todos">
+ <li v-for="todo in filteredTodos">
```

計算屬性會自動跟蹤其計算中所使用的到的其他響應式狀態，並將它們收集為自己的依賴。計算結果會被緩存，並只有在其依賴發生改變時才會被自動更新。

現在，試著添加 `filteredTodos` 計算屬性並實現計算邏輯！如果實現正確，在隱藏已完成項目的狀態下勾選一個 todo，它也應當被立即隱藏。
