# 組合式 API：依賴注入 {#composition-api-dependency-injection}

## provide() {#provide}

提供一個值，可以被後代組件注入。

- **類型**

  ```ts
  function provide<T>(key: InjectionKey<T> | string, value: T): void
  ```

- **詳細信息**

  `provide()` 接受兩個參數：第一個參數是要注入的 key，可以是一個字符串或者一個 symbol，第二個參數是要注入的值。

  當使用 TypeScript 時，key 可以是一個被類型斷言為 `InjectionKey` 的 symbol。`InjectionKey` 是一個 Vue 提供的工具類型，繼承自 `Symbol`，可以用來同步 `provide()` 和 `inject()` 之間值的類型。

  與註冊生命週期鉤子的 API 類似，`provide()` 必須在組件的 `setup()` 階段同步調用。

- **示例**

  ```vue
  <script setup>
  import { ref, provide } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // 提供靜態值
  provide('path', '/project/')

  // 提供響應式的值
  const count = ref(0)
  provide('count', count)

  // 提供時將 Symbol 作為 key
  provide(countSymbol, count)
  </script>
  ```

- **參考**
  - [指南 - 依賴注入](/guide/components/provide-inject)
  - [指南 - 為 provide/inject 標註類型](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## inject() {#inject}

注入一個由祖先組件或整個應用 (通過 `app.provide()`) 提供的值。

- **類型**

  ```ts
  // 沒有默認值
  function inject<T>(key: InjectionKey<T> | string): T | undefined

  // 帶有默認值
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T

  // 使用工廠函數
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

- **詳細信息**

  第一個參數是注入的 key。Vue 會遍歷父組件鏈，通過匹配 key 來確定所提供的值。如果父組件鏈上多個組件對同一個 key 提供了值，那麼離得更近的組件將會“覆蓋”鏈上更遠的組件所提供的值。如果沒有能通過 key 匹配到值，`inject()` 將返回 `undefined`，除非提供了一個默認值。

  第二個參數是可選的，即在沒有匹配到 key 時使用的默認值。

  第二個參數也可以是一個工廠函數，用來返回某些創建起來比較複雜的值。在這種情況下，你必須將 `true` 作為第三個參數傳入，表明這個函數將作為工廠函數使用，而非值本身。

  與註冊生命週期鉤子的 API 類似，`inject()` 必須在組件的 `setup()` 階段同步調用。

  當使用 TypeScript 時，key 可以是一個類型為 `InjectionKey` 的 symbol。`InjectionKey` 是一個 Vue 提供的工具類型，繼承自 `Symbol`，可以用來同步 `provide()` 和 `inject()` 之間值的類型。

- **示例**

  假設有一個父組件已經提供了一些值，如前面 `provide()` 的例子中所示：

  ```vue
  <script setup>
  import { inject } from 'vue'
  import { countSymbol } from './injectionSymbols'

  // 注入不含默認值的靜態值
  const path = inject('path')

  // 注入響應式的值
  const count = inject('count')

  // 通過 Symbol 類型的 key 注入
  const count2 = inject(countSymbol)

  // 注入一個值，若為空則使用提供的默認值
  const bar = inject('path', '/default-path')

  // 注入一個值，若為空則使用提供的函數類型的默認值
  const fn = inject('function', () => {})

  // 注入一個值，若為空則使用提供的工廠函數
  const baz = inject('factory', () => new ExpensiveObject(), true)
  </script>
  ```
  
- **See also**
  - [指南 - 依賴注入](/guide/components/provide-inject)
  - [指南 - 為 provide/inject 標註類型](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

## hasInjectionContext() <sup class="vt-badge" data-text="3.3+" /> {#has-injection-context}

如果 [inject()](#inject) 可以在錯誤的地方 (例如 `setup()` 之外) 被調用而不觸發警告，則返回 `true`。此方法適用於希望在內部使用 `inject()` 而不向用戶發出警告的庫。

- **類型**

  ```ts
  function hasInjectionContext(): boolean
  ```
