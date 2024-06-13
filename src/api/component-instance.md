# 組件實例 {#component-instance}

:::info
本頁文檔描述了組件公共實例 (即 `this`) 上暴露的內置屬性和方法，

本頁羅列的所有屬性，除 `$data` 下的嵌套屬性之外，都是只讀的。
:::

## $data {#data}

從 [`data`](./options-state#data) 選項函數中返回的對象，會被組件賦為響應式。組件實例將會代理對其數據對象的屬性訪問。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $data: object
  }
  ```

## $props {#props}

表示組件當前已解析的 props 對象。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $props: object
  }
  ```

- **詳細信息**

  這裡只包含通過 [`props`](./options-state#props) 選項聲明的 props。組件實例將會代理對其 props 對象上屬性的訪問。

## $el {#el}

該組件實例管理的 DOM 根節點。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $el: Node | undefined
  }
  ```

- **詳細信息**

  `$el` 直到組件[掛載完成 (mounted)](./options-lifecycle#mounted) 之前都會是 `undefined`。

  - 對於單一根元素的組件，`$el` 將會指向該根元素。
  - 對於以文本節點為根的組件，`$el` 將會指向該文本節點。
  - 對於以多個元素為根的組件，`$el` 將是一個僅作佔位符的 DOM 節點，Vue 使用它來跟蹤組件在 DOM 中的位置 (文本節點或 SSR 激活模式下的註釋節點)。

  :::tip
  為保持一致性，我們推薦使用[模板引用](/guide/essentials/template-refs)來直接訪問元素而不是依賴 `$el`。
  :::

## $options {#options}

已解析的用於實例化當前組件的組件選項。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $options: ComponentOptions
  }
  ```

- **詳細信息**

  這個 `$options` 對象暴露了當前組件的已解析選項，並且會是以下幾種可能來源的合併結果：

  - 全局 mixin
  - 組件 `extends` 的基組件
  - 組件級 mixin

  它通常用於支持自定義組件選項：

  ```js
  const app = createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

- **參考** [`app.config.optionMergeStrategies`](/api/application#app-config-optionmergestrategies)

## $parent {#parent}

當前組件可能存在的父組件實例，如果當前組件是頂層組件，則為 `null`。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $parent: ComponentPublicInstance | null
  }
  ```

## $root {#root}

當前組件樹的根組件實例。如果當前實例沒有父組件，那麼這個值就是它自己。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $root: ComponentPublicInstance
  }
  ```

## $slots {#slots}

一個表示父組件所傳入[插槽](/guide/components/slots)的對象。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $slots: { [name: string]: Slot }
  }

  type Slot = (...args: any[]) => VNode[]
  ```

- **詳細信息**

  通常用於手寫[渲染函數](/guide/extras/render-function)，但也可用於檢測是否存在插槽。

  每一個插槽都在 `this.$slots` 上暴露為一個函數，返回一個 vnode 數組，同時 key 名對應著插槽名。默認插槽暴露為 `this.$slots.default`。

  如果插槽是一個[作用域插槽](/guide/components/slots#scoped-slots)，傳遞給該插槽函數的參數可以作為插槽的 prop 提供給插槽。

- **參考**[渲染函數 - 渲染插槽](/guide/extras/render-function#rendering-slots)

## $refs {#refs}

一個包含 DOM 元素和組件實例的對象，通過[模板引用](/guide/essentials/template-refs)註冊。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $refs: { [name: string]: Element | ComponentPublicInstance | null }
  }
  ```

- **參考**

  - [模板引用](/guide/essentials/template-refs)
  - [特殊 Attribute - ref](./built-in-special-attributes.md#ref)

## $attrs {#attrs}

一個包含了組件所有透傳屬性的對象。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $attrs: object
  }
  ```

- **詳細信息**

  [透傳 Attributes](/guide/components/attrs) 是指由父組件傳入，且沒有被子組件聲明為 props 或是組件自定義事件的 attributes 和事件處理函數。

  默認情況下，若是單一根節點組件，`$attrs` 中的所有屬性都是直接自動繼承自組件的根元素。而多根節點組件則不會如此，同時你也可以通過配置 [`inheritAttrs`](./options-misc#inheritattrs) 選項來顯式地關閉該行為。

- **參考**

  - [透傳 Attribute](/guide/components/attrs)

## $watch() {#watch}

用於命令式地創建偵聽器的 API。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $watch(
      source: string | (() => any),
      callback: WatchCallback,
      options?: WatchOptions
    ): StopHandle
  }

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  interface WatchOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **詳細信息**

  第一個參數是監視源。它可以是一個組件屬性名稱字符串、一個簡單的以點分隔的路徑字符串或一個 [getter 函數](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)。

  第二個參數是回調函數。回調函數接收被監視源的新值和舊值。

  - **`immediate`**：在創建監視器時立即觸發回調。在第一次調用時，舊值將為 `undefined`。
  - **`deep`**：如果源是對象，則強制對其進行深度遍歷，以便在深度突變時觸發回調。請參閱[深度觀察者](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：調整回調的刷新時序。請參閱 [Callback Flush Timing](/guide/essentials/watchers#callback-flush-timing) 和 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：調試觀察者的依賴關係。請參閱[監視器調試](/guide/extras/reactivity-in-depth#watcher-debugging)。

- **示例**

  偵聽一個屬性名：

  ```js
  this.$watch('a', (newVal, oldVal) => {})
  ```

  偵聽一個由 `.` 分隔的路徑：

  ```js
  this.$watch('a.b', (newVal, oldVal) => {})
  ```

  對更復雜表達式使用 getter 函數：

  ```js
  this.$watch(
    // 每一次這個 `this.a + this.b` 表達式生成一個
    // 不同的結果，處理函數都會被調用
    // 這就好像我們在偵聽一個計算屬性
    // 而不定義計算屬性本身。
    () => this.a + this.b,
    (newVal, oldVal) => {}
  )
  ```

  停止該偵聽器：

  ```js
  const unwatch = this.$watch('a', cb)

  // 之後……
  unwatch()
  ```

- **參考**
  - [選項 - `watch`](/api/options-state#watch)
  - [指南 - 偵聽器](/guide/essentials/watchers)

## $emit() {#emit}

在當前組件觸發一個自定義事件。任何額外的參數都會傳遞給事件監聽器的回調函數。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $emit(event: string, ...args: any[]): void
  }
  ```

- **示例**

  ```js
  export default {
    created() {
      // 僅觸發事件
      this.$emit('foo')
      // 帶有額外的參數
      this.$emit('bar', 1, 2, 3)
    }
  }
  ```

- **參考**

  - [組件 - 事件](/guide/components/events)
  - [`emits` 選項](./options-state#emits)

## $forceUpdate() {#forceupdate}

強制該組件重新渲染。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $forceUpdate(): void
  }
  ```

- **詳細信息**

  鑑於 Vue 的全自動響應性系統，這個功能應該很少會被用到。唯一可能需要它的情況是，你使用高階響應式 API 顯式創建了一個非響應式的組件狀態。

## $nextTick() {#nexttick}

綁定在實例上的 [`nextTick()`](./general#nexttick) 函數。

- **類型**

  ```ts
  interface ComponentPublicInstance {
    $nextTick(callback?: (this: ComponentPublicInstance) => void): Promise<void>
  }
  ```

- **詳細信息**

  和全局版本的 `nextTick()` 的唯一區別就是組件傳遞給 `this.$nextTick()` 的回調函數會帶上 `this` 上下文，其綁定了當前組件實例。

- **參考** [`nextTick()`](./general#nexttick)
