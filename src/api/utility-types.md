# TypeScript 工具類型 {#utility-types}

:::info
此頁面僅列出了一些可能需要解釋其使用方式的常用工具類型。有關導出類型的完整列表，請查看[源代碼](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/index.ts#L131)。
:::

## PropType\<T> {#proptype-t}

用於在用運行時 props 聲明時給一個 prop 標註更復雜的類型定義。

- **示例**

  ```ts
  import type { PropType } from 'vue'

  interface Book {
    title: string
    author: string
    year: number
  }

  export default {
    props: {
      book: {
        // 提供一個比 `Object` 更具體的類型
        type: Object as PropType<Book>,
        required: true
      }
    }
  }
  ```

- **參考**[指南 - 為組件 props 標註類型](/guide/typescript/options-api#typing-component-props)

## MaybeRef\<T> {#mayberef}

`T | Ref<T>` 的別名。對於標註[組合式函數](/guide/reusability/composables.html)的參數很有用。

- 僅在 3.3+ 版本中支持。

## MaybeRefOrGetter\<T> {#maybereforgetter}

`T | Ref<T> | (() => T)` 的別名。對於標註[組合式函數](/guide/reusability/composables.html)的參數很有用。

- 僅在 3.3+ 版本中支持。

## ExtractPropTypes\<T> {#extractproptypes}

從運行時的 props 選項對象中提取 props 類型。提取到的類型是面向內部的，也就是說組件接收到的是解析後的 props。這意味著 boolean 類型的 props 和帶有默認值的 props 總是一個定義的值，即使它們不是必需的。

要提取面向外部的 props，即父組件允許傳遞的 props，請使用 [`ExtractPublicPropTypes`](#extractpublicproptypes)。

- **示例**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar: boolean,
  //   baz: number,
  //   qux: number
  // }
  ```

## ExtractPublicPropTypes\<T> {#extractpublicproptypes}

從運行時的 props 選項對象中提取 prop。提取的類型是面向外部的，即父組件允許傳遞的 props。

- 僅在 3.3+ 版本中支持。

- **示例**

  ```ts
  const propsOptions = {
    foo: String,
    bar: Boolean,
    baz: {
      type: Number,
      required: true
    },
    qux: {
      type: Number,
      default: 1
    }
  } as const

  type Props = ExtractPublicPropTypes<typeof propsOptions>
  // {
  //   foo?: string,
  //   bar?: boolean,
  //   baz: number,
  //   qux?: number
  // }
  ```

## ComponentCustomProperties {#componentcustomproperties}

用於增強組件實例類型以支持自定義全局屬性。

- **示例**

  ```ts
  import axios from 'axios'

  declare module 'vue' {
    interface ComponentCustomProperties {
      $http: typeof axios
      $translate: (key: string) => string
    }
  }
  ```

  :::tip
  類型擴展必須被放置在一個模塊 `.ts` 或 `.d.ts` 文件中。查看[類型擴展指南](/guide/typescript/options-api#augmenting-global-properties)瞭解更多細節
  :::

- **參考**[指南 - 擴展全局屬性](/guide/typescript/options-api#augmenting-global-properties)

## ComponentCustomOptions {#componentcustomoptions}

用來擴展組件選項類型以支持自定義選項。

- **示例**

  ```ts
  import { Route } from 'vue-router'

  declare module 'vue' {
    interface ComponentCustomOptions {
      beforeRouteEnter?(to: any, from: any, next: () => void): void
    }
  }
  ```

  :::tip
  類型擴展必須被放置在一個模塊 `.ts` 或 `.d.ts` 文件中。查看[類型擴展指南](/guide/typescript/options-api#augmenting-global-properties)瞭解更多細節。
  :::

- **參考**[指南 - 擴展自定義選項](/guide/typescript/options-api#augmenting-custom-options)

## ComponentCustomProps {#componentcustomprops}

用於擴展全局可用的 TSX props，以便在 TSX 元素上使用沒有在組件選項上定義過的 props。

- **示例**

  ```ts
  declare module 'vue' {
    interface ComponentCustomProps {
      hello?: string
    }
  }

  export {}
  ```

  ```tsx
  // 現在即使沒有在組件選項上定義過 hello 這個 prop 也依然能通過類型檢查了
  <MyComponent hello="world" />
  ```

  :::tip
  類型擴展必須被放置在一個模塊 `.ts` 或 `.d.ts` 文件中。查看[類型擴展指南](/guide/typescript/options-api#augmenting-global-properties)瞭解更多細節。
  :::

## CSSProperties {#cssproperties}

用於擴展在樣式屬性綁定上允許的值的類型。

- **示例**

允許任意自定義 CSS 屬性：

  ```ts
  declare module 'vue' {
    interface CSSProperties {
      [key: `--${string}`]: string
    }
  }
  ```

  ```tsx
  <div style={ { '--bg-color': 'blue' } }>
  ```

  ```html
  <div :style="{ '--bg-color': 'blue' }"></div>
  ```

:::tip
類型增強必須被放置在一個模塊 `.ts` 或 `.d.ts` 文件中。查看[類型增強指南](/guide/typescript/options-api#augmenting-global-properties)了解更多細節。
:::

:::info 參考
SFC `<style>` 標籤支持通過 `v-bind` CSS 函數來連結 CSS 值與組件狀態。這允許在沒有類型擴展的情況下自定義屬性。

- [CSS 中的 v-bind()](/api/sfc-css-features#v-bind-in-css)
:::
