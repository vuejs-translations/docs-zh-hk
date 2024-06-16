# 計算屬性 {#computed-properties}

## 基礎示例 {#basic-example}

模板中的表達式雖然方便，但也只能用來做簡單的操作。如果在模板中書寫太多邏輯，會讓模板變得臃腫，難以維護。例如說，我們有這樣一個包含嵌套數組的對象：

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
```

</div>

我們想根據 `author` 是否已有一些書籍來展示不同的信息：

```vue-html
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
```

這裡的模板看起來有些複雜。我們必須認真看好一會兒才能明白它的計算依賴於 `author.books`。更重要的是，如果在模板中需要不止一次這樣的計算，我們可不想將這樣的代碼在模板裡重複好多遍。

因此我們推薦使用**計算屬性**來描述依賴響應式狀態的複雜邏輯。這是重構後的示例：

<div class="options-api">

```js
export default {
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // 一個計算屬性的 getter
    publishedBooksMessage() {
      // `this` 指向當前組件實例
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}
```

```vue-html
<p>Has published books:</p>
<span>{{ publishedBooksMessage }}</span>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFkN1KxDAQhV/l0JsqaFfUq1IquwiKsF6JINaLbDNui20S8rO4lL676c82eCFCIDOZMzkzXxetlUoOjqI0ykypa2XzQtC3ktqC0ydzjUVXCIAzy87OpxjQZJ0WpwxgzlZSp+EBEKylFPGTrATuJcUXobST8sukeA8vQPzqCNe4xJofmCiJ48HV/FfbLLrxog0zdfmn4tYrXirC9mgs6WMcBB+nsJ+C8erHH0rZKmeJL0sot2tqUxHfDONuyRi2p4BggWCr2iQTgGTcLGlI7G2FHFe4Q/xGJoYn8SznQSbTQviTrRboPrHUqoZZ8hmQqfyRmTDFTC1bqalsFBN5183o/3NG33uvoWUwXYyi/gdTEpwK)

我們在這裡定義了一個計算屬性 `publishedBooksMessage`。

更改此應用的 `data` 中 `books` 數組的值後，可以看到 `publishedBooksMessage` 也會隨之改變。

在模板中使用計算屬性的方式和一般的屬性並無二致。Vue 會檢測到 `this.publishedBooksMessage` 依賴於 `this.author.books`，所以當 `this.author.books` 改變時，任何依賴於 `this.publishedBooksMessage` 的綁定都將同時更新。

也可參考：[為計算屬性標記類型](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一個計算屬性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNp1kE9Lw0AQxb/KI5dtoTainkoaaREUoZ5EEONhm0ybYLO77J9CCfnuzta0vdjbzr6Zeb95XbIwZroPlMySzJW2MR6OfDB5oZrWaOvRwZIsfbOnCUrdmuCpQo+N1S0ET4pCFarUynnI4GttMT9PjLpCAUq2NIN41bXCkyYxiZ9rrX/cDF/xDYiPQLjDDRbVXqqSHZ5DUw2tg3zP8lK6pvxHe2DtvSasDs6TPTAT8F2ofhzh0hTygm5pc+I1Yb1rXE3VMsKsyDm5JcY/9Y5GY8xzHI+wnIpVw4nTI/10R2rra+S4xSPEJzkBvvNNs310ztK/RDlLLjy1Zic9cQVkJn+R7gIwxJGlMXiWnZEq77orhH3Pq2NH9DjvTfpfSBSbmA==)


我们在這裡声明了一个计算属性 `publishedBooksMessage`。`computed()` 函数預期传递一个 [getter 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)，返回值是一个**计算的 ref**。与普通 ref 类似，您可以以 `publishedBooksMessage.value` 的形式访问计算结果。在模板中，计算 ref 也会自动解包，因此您可以在模板表达式中引用它们，而无需使用 `.value`。

Vue 的計算屬性會自動追蹤響應式依賴。它會檢測到 `publishedBooksMessage` 依賴於 `author.books`，所以當 `author.books` 改變時，任何依賴於 `publishedBooksMessage` 的綁定都會同時更新。

也可參考：[為計算屬性標註類型](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />

</div>

## 計算屬性緩存 vs 方法 {#computed-caching-vs-methods}

你可能注意到我們在表達式中像這樣調用一個函數也會獲得和計算屬性相同的結果：

```vue-html
<p>{{ calculateBooksMessage() }}</p>
```

<div class="options-api">

```js
// 組件中
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

</div>

<div class="composition-api">

```js
// 組件中
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

</div>

若我們將同樣的函數定義為一個方法而不是計算屬性，兩種方式在結果上確實是完全相同的，然而，不同之處在於**計算屬性值會基於其響應式依賴被緩存**。一個計算屬性僅會在其響應式依賴更新時才重新計算。這意味著只要 `author.books` 不改變，無論多少次訪問 `publishedBooksMessage` 都會立即返回先前的計算結果，而不用重複執行 getter 函數。

這也解釋了為什麼下面的計算屬性永遠不會更新，因為 `Date.now()` 並不是一個響應式依賴：

<div class="options-api">

```js
computed: {
  now() {
    return Date.now()
  }
}
```

</div>

<div class="composition-api">

```js
const now = computed(() => Date.now())
```

</div>

相比之下，方法調用**總是**會在重渲染髮生時再次執行函數。

為什麼需要緩存呢？想象一下我們有一個非常消耗性能的計算屬性 `list`，需要循環一個巨大的數組並做許多計算邏輯，並且可能也有其他計算屬性依賴於 `list`。沒有緩存的話，我們會重複執行非常多次 `list` 的 getter，然而這實際上沒有必要！如果你確定不需要緩存，那麼也可以使用方法調用。

## 可寫計算屬性 {#writable-computed}

計算屬性默認是只讀的。當你嘗試修改一個計算屬性時，你會收到一個運行時警告。只在某些特殊場景中你可能才需要用到“可寫”的屬性，你可以通過同時提供 getter 和 setter 來創建：

<div class="options-api">

```js
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  computed: {
    fullName: {
      // getter
      get() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set(newValue) {
        // 注意：我們這裡使用的是解構賦值語法
        [this.firstName, this.lastName] = newValue.split(' ')
      }
    }
  }
}
```

現在當你再運行 `this.fullName = 'John Doe'` 時，setter 會被調用而 `this.firstName` 和 `this.lastName` 會隨之更新。

</div>

<div class="composition-api">

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我們這裡使用的是解構賦值語法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

現在當你再運行 `fullName.value = 'John Doe'` 時，setter 會被調用而 `firstName` 和 `lastName` 會隨之更新。

</div>

## 最佳實踐 {#best-practices}

### Getter 不應有副作用 {#getters-should-be-side-effect-free}

計算屬性的 getter 應只做計算而沒有任何其他的副作用，這一點非常重要，請務必牢記。舉例來說，**不要改變其他狀態、在 getter 中做異步請求或者更改 DOM**！一個計算屬性的聲明中描述的是如何根據其他值派生一個值。因此 getter 的職責應該僅為計算和返回該值。在之後的指引中我們會討論如何使用[偵聽器](./watchers)根據其他響應式狀態的變更來創建副作用。

### 避免直接修改計算屬性值 {#avoid-mutating-computed-value}

從計算屬性返回的值是派生狀態。可以把它看作是一個“臨時快照”，每當源狀態發生變化時，就會創建一個新的快照。更改快照是沒有意義的，因此計算屬性的返回值應該被視為只讀的，並且永遠不應該被更改——應該更新它所依賴的源狀態以觸發新的計算。
