# 偵聽器 {#watchers}

有時我們需要響應性地執行一些“副作用”——例如，當一個數字改變時將其輸出到控制台。我們可以通過偵聽器來實現它：

<div class="composition-api">

```js
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newCount) => {
  // 沒錯，console.log() 是一個副作用
  console.log(`new count is: ${newCount}`)
})
```

`watch()` 可以直接偵聽一個 ref，並且只要 `count` 的值改變就會觸發回調。`watch()` 也可以偵聽其他類型的數據源——更多詳情請參閱<a target="_blank" href="/guide/essentials/watchers.html">指南 - 偵聽器</a>。

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  watch: {
    count(newCount) {
      // 沒錯，console.log() 是一個副作用
      console.log(`new count is: ${newCount}`)
    }
  }
}
```

這裡，我們使用 `watch` 選項來偵聽 `count` 屬性的變化。當 `count` 改變時，偵聽回調將被調用，並且接收新值作為參數。更多詳情請參閱<a target="_blank" href="/guide/essentials/watchers.html">指南 - 偵聽器</a>。

</div>

一個比在控制台輸出更加實際的例子是當 ID 改變時抓取新的數據。在右邊的例子中就是這樣一個組件。該組件被掛載時，會從模擬 API 中抓取 todo 數據，同時還有一個按鈕可以改變要抓取的 todo 的 ID。現在，嘗試實現一個偵聽器，使得組件能夠在按鈕被點擊時抓取新的 todo 項目。
