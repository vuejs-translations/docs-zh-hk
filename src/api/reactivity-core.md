# 響應式 API：核心 {#reactivity-api-core}

:::info 參考
要更好地了解響應式 API，推薦閱讀下面幾個指南中的章節：

- [響應式基礎](/guide/essentials/reactivity-fundamentals) (with the API preference set to Composition API)
- [深入響應式系統](/guide/extras/reactivity-in-depth)
  :::

## ref() {#ref}

接受一個內部值，返回一個響應式的、可更改的 ref 對象，此對象只有一個指向其內部值的屬性 `.value`。

- **類型**

  ```ts
  function ref<T>(value: T): Ref<UnwrapRef<T>>

  interface Ref<T> {
    value: T
  }
  ```

- **詳細信息**

  ref 對象是可更改的，也即是你可以為 `.value` 賦予新的值。它也是響應式的，即所有對 `.value` 的操作都將被追蹤，並且寫操作會觸發與之相關的副作用。

  如果將一個對象賦值給 ref，那麼這個對象將通過 [reactive()](#reactive) 轉為具有深層次響應式的對象。這也意味著如果對象中包含了嵌套的 ref，它們將被深層地解包。

  若要避免這種深層次的轉換，請使用 [`shallowRef()`](./reactivity-advanced#shallowref) 來替代。

- **示例**

  ```js
  const count = ref(0)
  console.log(count.value) // 0

  count.value = 1
  console.log(count.value) // 1
  ```

- **參考**
  - [指南 - `ref()` 的響應式基礎](/guide/essentials/reactivity-fundamentals#reactive-variables-with-ref)
  - [指南 - 為 `ref()` 標註類型](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

## computed() {#computed}

接收一個 [getter 函數](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description)，並為 getter 返回的值返回一個只讀的響應式 [ref](#ref) 對象。他還可以使用帶有 `get` 和 `set` 函數的對象來創建一個可寫的 ref 對象。

- **類型**

  ```ts
  // 只讀
  function computed<T>(
    getter: (oldValue: T | undefined) => T,
    // 查看下方的 "計算屬性調試" 鏈接
    debuggerOptions?: DebuggerOptions
  ): Readonly<Ref<Readonly<T>>>

  // 可寫的
  function computed<T>(
    options: {
      get: (oldValue: T | undefined) => T
      set: (value: T) => void
    },
    debuggerOptions?: DebuggerOptions
  ): Ref<T>
  ```

- **示例**

  創建一個只讀的計算屬性 ref：

  ```js
  const count = ref(1)
  const plusOne = computed(() => count.value + 1)

  console.log(plusOne.value) // 2

  plusOne.value++ // 錯誤
  ```

  創建一個可寫的計算屬性 ref：

  ```js
  const count = ref(1)
  const plusOne = computed({
    get: () => count.value + 1,
    set: (val) => {
      count.value = val - 1
    }
  })

  plusOne.value = 1
  console.log(count.value) // 0
  ```

  調試：

  ```js
  const plusOne = computed(() => count.value + 1, {
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **參考**
  - [指南 - 計算屬性](/guide/essentials/computed)
  - [指南 - 計算屬性調試](/guide/extras/reactivity-in-depth#computed-debugging)
  - [指南 - 為 `computed()` 標註類型](/guide/typescript/composition-api#typing-computed) <sup class="vt-badge ts" />
  - [指南 - 性能優化 - 計算屬性穩定性](/guide/best-practices/performance#computed-stability) <sup class="vt-badge" data-text="3.4+" />

## reactive() {#reactive}

返回一個對象的響應式代理。

- **類型**

  ```ts
  function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
  ```

- **詳細信息**

  響應式轉換是“深層”的：它會影響到所有嵌套的屬性。一個響應式對象也將深層地解包任何 [ref](#ref) 屬性，同時保持響應性。

  值得注意的是，當訪問到某個響應式數組或 `Map` 這樣的原生集合類型中的 ref 元素時，不會執行 ref 的解包。

  若要避免深層響應式轉換，只想保留對這個對象頂層次訪問的響應性，請使用 [shallowReactive()](./reactivity-advanced#shallowreactive) 作替代。

  返回的對象以及其中嵌套的對象都會通過 [ES Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 包裹，因此**不等於**源對象，建議只使用響應式代理，避免使用原始對象。

- **示例**

  創建一個響應式對象：

  ```js
  const obj = reactive({ count: 0 })
  obj.count++
  ```

  ref 的解包：

  ```ts
  const count = ref(1)
  const obj = reactive({ count })

  // ref 會被解包
  console.log(obj.count === count.value) // true

  // 會更新 `obj.count`
  count.value++
  console.log(count.value) // 2
  console.log(obj.count) // 2

  // 也會更新 `count` ref
  obj.count++
  console.log(obj.count) // 3
  console.log(count.value) // 3
  ```

	注意當訪問到某個響應式數組或 `Map` 這樣的原生集合類型中的 ref 元素時，**不會**執行 ref 的解包：

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // 這裡需要 .value
  console.log(books[0].value)

  const map = reactive(new Map([['count', ref(0)]]))
  // 這裡需要 .value
  console.log(map.get('count').value)
  ```

  將一個 [ref](#ref) 賦值給一個 `reactive` 屬性時，該 ref 會被自動解包：

  ```ts
  const count = ref(1)
  const obj = reactive({})

  obj.count = count

  console.log(obj.count) // 1
  console.log(obj.count === count.value) // true
  ```

- **參考**
  - [指南 - 響應式基礎](/guide/essentials/reactivity-fundamentals)
  - [指南 - 為 `reactive()` 標註類型](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

## readonly() {#readonly}

接受一個對象 (不論是響應式還是普通的) 或是一個 [ref](#ref)，返回一個原值的只讀代理。

- **類型**

  ```ts
  function readonly<T extends object>(
    target: T
  ): DeepReadonly<UnwrapNestedRefs<T>>
  ```

- **詳細信息**

  只讀代理是深層的：對任何嵌套屬性的訪問都將是只讀的。它的 ref 解包行為與 `reactive()` 相同，但解包得到的值是只讀的。

  要避免深層級的轉換行為，請使用 [shallowReadonly()](./reactivity-advanced#shallowreadonly) 作替代。

- **示例**

  ```js
  const original = reactive({ count: 0 })

  const copy = readonly(original)

  watchEffect(() => {
    // 用來做響應性追蹤
    console.log(copy.count)
  })

  // 更改源屬性會觸發其依賴的偵聽器
  original.count++

  // 更改該只讀副本將會失敗，並會得到一個警告
  copy.count++ // warning!
  ```

## watchEffect() {#watcheffect}

立即運行一個函數，同時響應式地追蹤其依賴，並在依賴更改時重新執行。

- **類型**

  ```ts
  function watchEffect(
    effect: (onCleanup: OnCleanup) => void,
    options?: WatchEffectOptions
  ): StopHandle

  type OnCleanup = (cleanupFn: () => void) => void

  interface WatchEffectOptions {
    flush?: 'pre' | 'post' | 'sync' // 默認：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }

  type StopHandle = () => void
  ```

- **詳細信息**

  第一個參數就是要運行的副作用函數。這個副作用函數的參數也是一個函數，用來註冊清理回調。清理回調會在該副作用下一次執行前被調用，可以用來清理無效的副作用，例如等待中的異步請求 (參見下面的示例)。

  第二個參數是一個可選的選項，可以用來調整副作用的刷新時機或調試副作用的依賴。

  默認情況下，偵聽器將在組件渲染之前執行。設置 `flush: 'post'` 將會使偵聽器延遲到組件渲染之後再執行。詳見[回調的觸發時機](/guide/essentials/watchers#callback-flush-timing)。在某些特殊情況下 (例如要使緩存失效)，可能有必要在響應式依賴發生改變時立即觸發偵聽器。這可以通過設置 `flush: 'sync'` 來實現。然而，該設置應謹慎使用，因為如果有多個屬性同時更新，這將導致一些性能和數據一致性的問題。

  返回值是一個用來停止該副作用的函數。

- **示例**

  ```js
  const count = ref(0)

  watchEffect(() => console.log(count.value))
  // -> 輸出 0

  count.value++
  // -> 輸出 1
  ```

  副作用清除：

  ```js
  watchEffect(async (onCleanup) => {
    const { response, cancel } = doAsyncWork(id.value)
    // `cancel` 會在 `id` 更改時調用
    // 以便取消之前
    // 未完成的請求
    onCleanup(cancel)
    data.value = await response
  })
  ```

  停止偵聽器：

  ```js
  const stop = watchEffect(() => {})

  // 當不再需要此偵聽器時:
  stop()
  ```

  選項：

  ```js
  watchEffect(() => {}, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

- **參考**
  - [指南 - 偵聽器](/guide/essentials/watchers#watcheffect)
  - [指南 - 偵聽器調試](/guide/extras/reactivity-in-depth#watcher-debugging)

## watchPostEffect() {#watchposteffect}

[`watchEffect()`](#watcheffect) 使用 `flush: 'post'` 選項時的別名。

## watchSyncEffect() {#watchsynceffect}

[`watchEffect()`](#watcheffect) 使用 `flush: 'sync'` 選項時的別名。

## watch() {#watch}

偵聽一個或多個響應式數據源，並在數據源變化時調用所給的回調函數。

- **類型**

  ```ts
  // 偵聽單個來源
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): StopHandle

  // 偵聽多個來源
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): StopHandle

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | T extends object
    ? T
    : never // 響應式對象

  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // 默認：false
    deep?: boolean // 默認：false
    flush?: 'pre' | 'post' | 'sync' // 默認：'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
    once?: boolean // 默認：false (3.4+)
  }
  ```

  > 為了便於閱讀，對類型進行了簡化。

- **詳細信息**

  `watch()` 默認是懶偵聽的，即僅在偵聽源發生變化時才執行回調函數。

  第一個參數是偵聽器的**源**。這個來源可以是以下幾種：

  - 一個函數，返回一個值
  - 一個 ref
  - 一個響應式對象
  - ...或是由以上類型的值組成的數組

  第二個參數是在發生變化時要調用的回調函數。這個回調函數接受三個參數：新值、舊值，以及一個用於註冊副作用清理的回調函數。該回調函數會在副作用下一次重新執行前調用，可以用來清除無效的副作用，例如等待中的異步請求。

	當偵聽多個來源時，回調函數接受兩個數組，分別對應來源數組中的新值和舊值。

  第三個可選的參數是一個對象，支持以下這些選項：

  - **`immediate`**：在偵聽器創建時立即觸發回調。第一次調用時舊值是 `undefined`。
  - **`deep`**：如果源是對象，強制深度遍歷，以便在深層級變更時觸發回調。參考[深層偵聽器](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：調整回調函數的刷新時機。參考[回調的刷新時機](/guide/essentials/watchers#callback-flush-timing)及 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：調試偵聽器的依賴。參考[調試偵聽器](/guide/extras/reactivity-in-depth#watcher-debugging)。
  - **`once`**：回調函數只會運行一次。偵聽器將在回調函數首次運行後自動停止。 <sup class="vt-badge" data-text="3.4+" />

  與 [`watchEffect()`](#watcheffect) 相比，`watch()` 使我們可以：

  - 懶執行副作用；
  - 更加明確是應該由哪個狀態觸發偵聽器重新執行；
  - 可以訪問所偵聽狀態的前一個值和當前值。

- **示例**

  偵聽一個 getter 函數：

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```

  偵聽一個 ref：

  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```

  當偵聽多個來源時，回調函數接受兩個數組，分別對應來源數組中的新值和舊值：

  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```

  當使用 getter 函數作為源時，回調只在此函數的返回值變化時才會觸發。如果你想讓回調在深層級變更時也能觸發，你需要使用 `{ deep: true }` 強制偵聽器進入深層級模式。在深層級模式時，如果回調函數由於深層級的變更而被觸發，那麼新值和舊值將是同一個對象。

  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```

  當直接偵聽一個響應式對象時，偵聽器會自動啟用深層模式：

  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* 深層級變更狀態所觸發的回調 */
  })
  ```

  `watch()` 和 [`watchEffect()`](#watcheffect) 享有相同的刷新時機和調試選項：

  ```js
  watch(source, callback, {
    flush: 'post',
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```

  停止偵聽器：

  ```js
  const stop = watch(source, callback)

  // 當已不再需要該偵聽器時：
  stop()
  ```

  副作用清理：

  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // 當 `id` 變化時，`cancel` 將被調用，
    // 取消之前的未完成的請求
    onCleanup(cancel)
    data.value = await response
  })
  ```

- **參考**

  - [指南 - 偵聽器](/guide/essentials/watchers)
  - [指南 - 偵聽器調試](/guide/extras/reactivity-in-depth#watcher-debugging)
