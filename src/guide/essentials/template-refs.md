# 模板引用 {#template-refs}

雖然 Vue 的聲明性渲染模型為你抽象了大部分對 DOM 的直接操作，但在某些情況下，我們仍然需要直接訪問底層 DOM 元素。要實現這一點，我們可以使用特殊的 `ref` attribute：

```vue-html
<input ref="input">
```

`ref` 是一個特殊的 attribute，和 `v-for` 章節中提到的 `key` 類似。它允許我們在一個特定的 DOM 元素或子組件實例被掛載後，獲得對它的直接引用。這可能很有用，例如說在組件掛載時將焦點設置到一個 input 元素上，或在一個元素上初始化一個第三方庫。

## 訪問模板引用 {#accessing-the-refs}

<div class="composition-api">

為了通過組合式 API 獲得該模板引用，我們需要聲明一個匹配模板 ref attribute 值的 ref：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 聲明一個 ref 來存放該元素的引用
// 必須和模板裡的 ref 同名
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

如果不使用 `<script setup>`，需確保從 `setup()` 返回 ref：

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</div>
<div class="options-api">

掛載結束後引用都會被暴露在 `this.$refs` 之上：

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

注意，你只可以**在組件掛載後**才能訪問模板引用。如果你想在模板中的表達式上訪問 <span class="options-api">`$refs.input`</span><span class="composition-api">`input`</span>，在初次渲染時會是 <span class="options-api">`undefined`</span><span class="composition-api">`null`</span>，因為在初次渲染前這個元素還不存在！

<div class="composition-api">

如果你需要偵聽一個模板引用 ref 的變化，確保考慮到其值為 `null` 的情況：

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // 此時還未掛載，或此元素已經被卸載（例如通過 v-if 控制）
  }
})
```

也可參考：[為模板引用標註類型](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## `v-for` 中的模板引用 {#refs-inside-v-for}

> 需要 v3.2.25 及以上版本

<div class="composition-api">

當在 `v-for` 中使用模板引用時，對應的 ref 中包含的值是一個數組，它將在元素被掛載後包含對應整個列表的所有元素：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNpFjs1qwzAQhF9l0CU2uDZtb8UOlJ576bXqwaQyCGRJyCsTEHr3rGwnOehnd2e+nSQ+vW/XqMSH6JdL0J6wKIr+LK2evQuEhKCmBs5+u2hJ/SNjCm7GiV0naaW9OLsQjOZrKNrq97XBW4P3v/o51qTmHzUtd8k+e0CrqsZwRpIWGI0KVN0N7TqaqNp59JUuEt2SutKXY5elmimZT9/t2Tk1F+z0ZiTFFdBHs738Mxrry+TCIEWhQ9sttRQl0tEsK6U4HEBKW3LkfDA6o3dst3H77rFM5BtTfm/P)

</div>
<div class="options-api">

當在 `v-for` 中使用模板引用時，相應的引用中包含的值是一個數組：

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

應該注意的是，ref 數組**並不**保證與源數組相同的順序。

## 函數模板引用 {#function-refs}

除了使用字符串值作名字，`ref` attribute 還可以綁定為一個函數，會在每次組件更新時都被調用。該函數會收到元素引用作為其第一個參數：

```vue-html
<input :ref="(el) => { /* 將 el 賦值給一個數據屬性或 ref 變量 */ }">
```

注意我們這裡需要使用動態的 `:ref` 綁定才能夠傳入一個函數。當綁定的元素被卸載時，函數也會被調用一次，此時的 `el` 參數會是 `null`。你當然也可以綁定一個組件方法而不是內聯函數。

## 組件上的 ref {#ref-on-component}

> 這一小節假設你已了解[組件](/guide/essentials/component-basics)的相關知識，或者你也可以先跳過這裡，之後再回來看。

模板引用也可以被用在一個子組件上。這種情況下引用中獲得的值是組件實例：

<div class="composition-api">

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 是 <Child /> 組件的實例
})
</script>

<template>
  <Child ref="child" />
</template>
```

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child 是 <Child /> 組件的實例
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

如果一個子組件使用的是選項式 API <span class="composition-api">或沒有使用 `<script setup>`</span>，被引用的組件實例和該子組件的 `this` 完全一致，這意味著父組件對子組件的每一個屬性和方法都有完全的訪問權。這使得在父組件和子組件之間創建緊密耦合的實現細節變得很容易，當然也因此，應該只在絕對需要時才使用組件引用。大多數情況下，你應該首先使用標準的 props 和 emit 接口來實現父子組件交互。

<div class="composition-api">

有一個例外的情況，使用了 `<script setup>` 的組件是**默認私有**的：一個父組件無法訪問到一個使用了 `<script setup>` 的子組件中的任何東西，除非子組件在其中通過 `defineExpose` 宏顯式暴露：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// 像 defineExpose 這樣的編譯器宏不需要導入
defineExpose({
  a,
  b
})
</script>
```

當父組件通過模板引用獲取到了該組件的實例時，得到的實例類型為 `{ a: number, b: number }` (ref 都會自動解包，和一般的實例一樣)。

TypeScript 用戶請參考：[為組件的模板引用標註類型](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

`expose` 選項可以用於限制對子組件實例的訪問：

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

在上面這個例子中，父組件通過模板引用訪問到子組件實例後，只能訪問 `publicData` 和 `publicMethod`。

</div>
