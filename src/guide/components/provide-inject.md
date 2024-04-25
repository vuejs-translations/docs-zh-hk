# 依賴注入 {#provide-inject}

> 此章節假設你已經看過了[組件基礎](/guide/essentials/component-basics)。若你還不了解組件是什麼，請先閱讀該章節。

## Prop 逐級透傳問題 {#prop-drilling}

通常情況下，當我們需要從父組件向子組件傳遞數據時，會使用 [props](/guide/components/props)。想象一下這樣的結構：有一些多層級嵌套的組件，形成了一顆巨大的組件樹，而某個深層的子組件需要一個較遠的祖先組件中的部分數據。在這種情況下，如果僅使用 props 則必須將其沿著組件鏈逐級傳遞下去，這會非常麻煩：

![Prop 逐級透傳的過程圖示](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

注意，雖然這裡的 `<Footer>` 組件可能根本不關心這些 props，但為了使 `<DeepChild>` 能訪問到它們，仍然需要定義並向下傳遞。如果組件鏈路非常長，可能會影響到更多這條路上的組件。這一問題被稱為“prop 逐級透傳”，顯然是我們希望盡量避免的情況。

`provide` 和 `inject` 可以幫助我們解決這一問題 <sup>[[1]](#footnote-1)</sup>。一個父組件相對於其所有的後代組件，會作為**依賴提供者**。任何後代的組件樹，無論層級有多深，都可以**注入**由父組件提供給整條鏈路的依賴。

![Provide/inject 模式](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide (提供) {#provide}

<div class="composition-api">

要為組件後代提供數據，需要使用到 [`provide()`](/api/composition-api-dependency-injection#provide) 函數：

```vue
<script setup>
import { provide } from 'vue'

provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
</script>
```

如果不使用 `<script setup>`，請確保 `provide()` 是在 `setup()` 同步調用的：

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
  }
}
```

`provide()` 函數接收兩個參數。第一個參數被稱為**注入名**，可以是一個字符串或是一個 `Symbol`。後代組件會用注入名來查找期望注入的值。一個組件可以多次調用 `provide()`，使用不同的注入名，注入不同的依賴值。

第二個參數是提供的值，值可以是任意類型，包括響應式的狀態，比如一個 ref：

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

提供的響應式狀態使後代組件可以由此和提供者建立響應式的聯繫。

</div>

<div class="options-api">

要為組件後代提供數據，需要使用到 [`provide`](/api/options-composition#provide) 選項：

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

對於 `provide` 對象上的每一個屬性，後代組件會用其 key 為注入名查找期望注入的值，屬性的值就是要提供的數據。

如果我們需要提供依賴當前組件實例的狀態 (比如那些由 `data()` 定義的數據屬性)，那麼可以以函數形式使用 `provide`：

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // 使用函數的形式，可以訪問到 `this`
    return {
      message: this.message
    }
  }
}
```

然而，請注意這**不會**使注入保持響應性。我們會在後續小節中討論如何[讓注入轉變為響應式](#working-with-reactivity)。

</div>

## 應用層 Provide {#app-level-provide}

除了在一個組件中提供依賴，我們還可以在整個應用層面提供依賴：

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

在應用級別提供的數據在該應用內的所有組件中都可以注入。這在你編寫[插件](/guide/reusability/plugins)時會特別有用，因為插件一般都不會使用組件形式來提供值。

## Inject (注入) {#inject}

<div class="composition-api">

要注入上層組件提供的數據，需使用 [`inject()`](/api/composition-api-dependency-injection#inject) 函數：

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

如果提供的值是一個 ref，注入進來的會是該 ref 對象，而**不會**自動解包為其內部的值。這使得注入方組件能夠通過 ref 對象保持了和供給方的響應性鏈接。

[帶有響應性的 provide + inject 完整示例](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

同樣，如果沒有使用 `<script setup>`，`inject()` 需要在 `setup()` 內同步調用：

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

要注入上層組件提供的數據，需使用 [`inject`](/api/options-composition#inject) 選項來聲明：

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // injected value
  }
}
```

注入會在組件自身的狀態**之前**被解析，因此你可以在 `data()` 中訪問到注入的屬性：

```js
export default {
  inject: ['message'],
  data() {
    return {
      // 基於注入值的初始數據
      fullMessage: this.message
    }
  }
}
```

[完整的 provide + inject 示例](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### 注入別名 \* {#injection-aliasing}

當以數組形式使用 `inject`，注入的屬性會以同名的 key 暴露到組件實例上。在上面的例子中，提供的屬性名為 `"message"`，注入後以 `this.message` 的形式暴露。訪問的本地屬性名和注入名是相同的。

如果我們想要用一個不同的本地屬性名注入該屬性，我們需要在 `inject` 選項的屬性上使用對象的形式：

```js
export default {
  inject: {
    /* 本地屬性名 */ localMessage: {
      from: /* 注入來源名 */ 'message'
    }
  }
}
```

這裡，組件本地化了原注入名 `"message"` 所提供的屬性，並將其暴露為 `this.localMessage`。

</div>

### 注入默認值 {#injection-default-values}

默認情況下，`inject` 假設傳入的注入名會被某個祖先鏈上的組件提供。如果該注入名的確沒有任何組件提供，則會拋出一個運行時警告。

如果在注入一個值時不要求必須有提供者，那麼我們應該聲明一個默認值，和 props 類似：

<div class="composition-api">

```js
// 如果沒有祖先組件提供 "message"
// `value` 會是 "這是默認值"
const value = inject('message', '這是默認值')
```

在一些場景中，默認值可能需要通過調用一個函數或初始化一個類來取得。為了避免在用不到默認值的情況下進行不必要的計算或產生副作用，我們可以使用工廠函數來創建默認值：

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

第三個參數表示默認值應該被當作一個工廠函數。

</div>

<div class="options-api">

```js
export default {
  // 當聲明注入的默認值時
  // 必須使用對象形式
  inject: {
    message: {
      from: 'message', // 當與原注入名同名時，這個屬性是可選的
      default: 'default value'
    },
    user: {
      // 對於非基礎類型數據，如果創建開銷比較大，或是需要確保每個組件實例
      // 需要獨立數據的，請使用工廠函數
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## 和響應式數據配合使用 {#working-with-reactivity}

<div class="composition-api">

當提供 / 注入響應式的數據時，**建議盡可能將任何對響應式狀態的變更都保持在提供方組件中**。這樣可以確保所提供狀態的聲明和變更操作都內聚在同一個組件內，使其更容易維護。

有的時候，我們可能需要在注入方組件中更改數據。在這種情況下，我們推薦在提供方組件內聲明並提供一個更改數據的方法函數：

```vue{7-9,13}
<!-- 在供給方組件內 -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- 在注入方組件 -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

最後，如果你想確保提供的數據不能被注入方的組件更改，你可以使用 [`readonly()`](/api/reactivity-core#readonly) 來包裝提供的值。

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

為保證注入方和提供方之間的響應性鏈接，我們需要使用 [computed()](/api/reactivity-core#computed) 函數提供一個計算屬性：

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // 顯式提供一個計算屬性
      message: computed(() => this.message)
    }
  }
}
```

[帶有響應性的 provide + inject 完整示例](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

`computed()` 函數常用於組合式 API 風格的組件中，但它同樣還可以用於補充選項式 API 風格的某些用例。你可以通過閱讀[響應式系統基礎](/guide/essentials/reactivity-fundamentals)和[計算屬性](/guide/essentials/computed)兩個章節了解更多組合式的 API 風格。

</div>

## 使用 Symbol 作注入名 {#working-with-symbol-keys}

至此，我們已經了解瞭如何使用字符串作為注入名。但如果你正在構建大型的應用，包含非常多的依賴提供，或者你正在編寫提供給其他開發者使用的組件庫，建議最好使用 Symbol 來作為注入名以避免潛在的衝突。

我們通常推薦在一個單獨的文件中導出這些注入名 Symbol：

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// 在供給方組件中
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, { /*
  要提供的數據
*/ });
```

```js
// 注入方組件
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

TypeScript 用戶請參考：[為 Provide / Inject 標註類型](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// 在供給方組件中
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* 要提供的數據 */
      }
    }
  }
}
```

```js
// 注入方組件
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>

<small>

__譯者注__

<a id="footnote-1"></a>[1] 在本章及後續章節中，“**提供**”將成為對應 Provide 的一個專有概念

</small>
