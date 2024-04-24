# TypeScript 與選項式 API {#typescript-with-options-api}

> 這一章假設你已經閱讀了[搭配 TypeScript 使用 Vue](./overview) 的概覽。

:::tip
雖然 Vue 的確支持在選項式 API 中使用 TypeScript，但在使用 TypeScript 的前提下更推薦使用組合式 API，因為它提供了更簡單、高效和可靠的類型推導。
:::

## 為組件的 props 標註類型 {#typing-component-props}

選項式 API 中對 props 的類型推導需要用 `defineComponent()` 來包裝組件。有了它，Vue 才可以通過 `props` 以及一些額外的選項，例如 `required: true` 和 `default` 來推導出 props 的類型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 啟用了類型推導
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // 類型：string | undefined
    this.id // 類型：number | string | undefined
    this.msg // 類型：string
    this.metadata // 類型：any
  }
})
```

然而，這種運行時 `props` 選項僅支持使用構造函數來作為一個 prop 的類型——沒有辦法指定多層級對象或函數簽名之類的複雜類型。

我們可以使用 `PropType` 這個工具類型來標記更復雜的 props 類型：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // 提供相對 `Object` 更確定的類型
      type: Object as PropType<Book>,
      required: true
    },
    // 也可以標記函數
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // TS Error: argument of type 'string' is not
    // assignable to parameter of type 'number'
    this.callback?.('123')
  }
})
```

### 注意事項 {#caveats}

如果你的 TypeScript 版本低於 `4.7`，在使用函數作為 prop 的 `validator` 和 `default` 選項值時需要格外小心——確保使用箭頭函數：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // 如果你的 TypeScript 版本低於 4.7，確保使用箭頭函數
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

這會防止 TypeScript 將 `this` 根據函數內的環境作出不符合我們期望的類型推導。這是之前版本的一個[設計限制](https://github.com/microsoft/TypeScript/issues/38845)，不過現在已經在 [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods) 中解決了。

## 為組件的 emits 標註類型 {#typing-component-emits}

我們可以給 `emits` 選項提供一個對象來聲明組件所觸發的事件，以及這些事件所期望的參數類型。試圖觸發未聲明的事件會拋出一個類型錯誤：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // 執行運行時校驗
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // 類型錯誤
      })

      this.$emit('non-declared-event') // 類型錯誤
    }
  }
})
```

## 為計算屬性標記類型 {#typing-computed-properties}

計算屬性會自動根據其返回值來推導其類型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // 類型：string
  }
})
```

在某些場景中，你可能想要顯式地標記出計算屬性的類型以確保其實現是正確的：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // 顯式標註返回類型
    greeting(): string {
      return this.message + '!'
    },

    // 標註一個可寫的計算屬性
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

在某些 TypeScript 因循環引用而無法推導類型的情況下，可能必須進行顯式的類型標註。

## 為事件處理函數標註類型 {#typing-event-handlers}

在處理原生 DOM 事件時，應該為我們傳遞給事件處理函數的參數正確地標註類型。讓我們看一下這個例子：

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` 隱式地標註為 `any` 類型
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

沒有類型標註時，這個 `event` 參數會隱式地標註為 `any` 類型。這也會在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 時拋出一個 TS 錯誤。因此，建議顯式地為事件處理函數的參數標註類型。此外，在訪問 `event` 上的屬性時你可能需要使用類型斷言：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## 擴展全局屬性 {#augmenting-global-properties}

某些插件會通過 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 為所有組件都安裝全局可用的屬性。舉例來說，我們可能為了請求數據而安裝了 `this.$http`，或者為了國際化而安裝了 `this.$translate`。為了使 TypeScript 更好地支持這個行為，Vue 暴露了一個被設計為可以通過 [TypeScript 模塊擴展](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)來擴展的 `ComponentCustomProperties` 接口：

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

參考：

- [對組件類型擴展的 TypeScript 單元測試](https://github.com/vuejs/core/blob/main/packages/dts-test/componentTypeExtensions.test-d.tsx)

### 類型擴展的位置 {#type-augmentation-placement}

我們可以將這些類型擴展放在一個 `.ts` 文件，或是一個影響整個項目的 `*.d.ts` 文件中。無論哪一種，都應確保在 `tsconfig.json` 中包括了此文件。對於庫或插件作者，這個文件應該在 `package.json` 的 `types` 屬性中被列出。

為了利用模塊擴展的優勢，你需要確保將擴展的模塊放在 [TypeScript 模塊](https://www.typescriptlang.org/docs/handbook/modules.html) 中。 也就是說，該文件需要包含至少一個頂級的 `import` 或 `export`，即使它只是 `export {}`。如果擴展被放在模塊之外，它將覆蓋原始類型，而不是擴展!

```ts
// 不工作，將覆蓋原始類型。
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// 正常工作。
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## 擴展自定義選項 {#augmenting-custom-options}

某些插件，例如 `vue-router`，提供了一些自定義的組件選項，例如 `beforeRouteEnter`：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

如果沒有確切的類型標註，這個鉤子函數的參數會隱式地標註為 `any` 類型。我們可以為 `ComponentCustomOptions` 接口擴展自定義的選項來支持：

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

現在這個 `beforeRouteEnter` 選項會被準確地標註類型。注意這只是一個例子——像 `vue-router` 這種類型完備的庫應該在它們自己的類型定義中自動執行這些擴展。

這種類型擴展和全局屬性擴展受到[相同的限制](#type-augmentation-placement)。

參考：

- [對組件類型擴展的 TypeScript 單元測試](https://github.com/vuejs/core/blob/main/packages/dts-test/componentTypeExtensions.test-d.tsx)

<!-- zhlint disabled -->
