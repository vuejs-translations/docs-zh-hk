# 狀態選項 {#options-state}

## data {#data}

用於聲明組件初始響應式狀態的函數。

- **類型**

  ```ts
  interface ComponentOptions {
    data?(
      this: ComponentPublicInstance,
      vm: ComponentPublicInstance
    ): object
  }
  ```

- **詳細信息**

  該函數應當返回一個普通 JavaScript 對象，Vue 會將它轉換為響應式對象。實例創建後，可以通過 `this.$data` 訪問該響應式對象。組件實例也代理了該數據對象上所有的屬性，因此 `this.a` 等價於 `this.$data.a`。

  所有會用到的頂層數據屬性都應該提前在這個對象中聲明。雖然理論上可以向 `this.$data` 添加新屬性，但並不推薦這麼做。如果一個屬性的值在一開始還獲取不到，應當先用 `undefined` 或是 `null` 值來佔位，讓 Vue 知道這個屬性是存在的。

  以 `_` 或 `$` 開頭的屬性將**不會**被組件實例代理，因為它們可能和 Vue 的內置屬性、API 方法衝突。你必須以 `this.$data._property` 的方式訪問它們。

  **不**推薦返回一個可能改變自身狀態的對象，如瀏覽器 API 原生對象或是帶原型的類實例等。理想情況下，返回的對象應是一個純粹代表組件狀態的普通對象。

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    created() {
      console.log(this.a) // 1
      console.log(this.$data) // { a: 1 }
    }
  }
  ```

  注意，如果你為 `data` 屬性使用了一個箭頭函數，則 `this` 將不會指向該組件實例，不過你仍然可以通過該函數的第一個參數來訪問實例：

  ```js
  data: (vm) => ({ a: vm.myProp })
  ```

- **參考**[深入響應式系統](/guide/extras/reactivity-in-depth)

## props {#props}

用於聲明一個組件的 props。

- **類型**

  ```ts
  interface ComponentOptions {
    props?: ArrayPropsOptions | ObjectPropsOptions
  }

  type ArrayPropsOptions = string[]

  type ObjectPropsOptions = { [key: string]: Prop }

  type Prop<T = any> = PropOptions<T> | PropType<T> | null

  interface PropOptions<T> {
    type?: PropType<T>
    required?: boolean
    default?: T | ((rawProps: object) => T)
    validator?: (value: unknown, rawProps: object) => boolean
  }

  type PropType<T> = { new (): T } | { new (): T }[]
  ```

  > 為了便於閱讀，對類型進行了簡化。

- **詳細信息**

  在 Vue 中，所有的組件 props 都需要被顯式聲明。組件 props 可以通過兩種方式聲明：

  - 使用字符串數組的簡易形式。
  - 使用對象的完整形式。該對象的每個屬性鍵是對應 prop 的名稱，值則是該 prop 應具有的類型的構造函數，或是更高級的選項。

  在基於對象的語法中，每個 prop 可以進一步定義如下選項：

  - **`type`**：可以是下列原生構造函數之一：`String`、`Number`、`Boolean`、`Array`、`Object`、`Date`、`Function`、`Symbol`、任何自定義構造函數，或由上述內容組成的數組。在開發模式中，Vue 會檢查一個 prop 的值是否匹配其聲明的類型，如果不匹配則會拋出警告。詳見 [Prop 校驗](/guide/components/props#prop-validation)。

    還要注意，一個 `Boolean` 類型的 prop 會影響它在開發或生產模式下的值轉換行為。詳見 [Boolean 類型轉換](/guide/components/props#boolean-casting)。

  - **`default`**：為該 prop 指定一個當其沒有被傳入或值為 `undefined` 時的默認值。對象或數組的默認值必須從一個工廠函數返回。工廠函數也接收原始 prop 對象作為參數。

  - **`required`**：定義該 prop 是否必需傳入。在非生產環境中，如果 required 值為[真值](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)且 prop 未被傳入，一個控制檯警告將會被拋出。

  - **`validator`**：將 prop 值和 prop 對象作為參數傳入的自定義驗證函數。在開發模式下，如果該函數返回一個[假值](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) (即驗證失敗)，一個控制檯警告將會被拋出。

- **示例**

  簡易聲明：

  ```js
  export default {
    props: ['size', 'myMessage']
  }
  ```

  對象聲明，帶有驗證：

  ```js
  export default {
    props: {
      // 類型檢查
      height: Number,
      // 類型檢查 + 其他驗證
      age: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => {
          return value >= 0
        }
      }
    }
  }
  ```

- **參考**
  - [指南 - Props](/guide/components/props)
  - [指南 - 為組件的 props 標註類型](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

## computed {#computed}

用於聲明要在組件實例上暴露的計算屬性。

- **類型**

  ```ts
  interface ComponentOptions {
    computed?: {
      [key: string]: ComputedGetter<any> | WritableComputedOptions<any>
    }
  }

  type ComputedGetter<T> = (
    this: ComponentPublicInstance,
    vm: ComponentPublicInstance
  ) => T

  type ComputedSetter<T> = (
    this: ComponentPublicInstance,
    value: T
  ) => void

  type WritableComputedOptions<T> = {
    get: ComputedGetter<T>
    set: ComputedSetter<T>
  }
  ```

- **詳細信息**

  該選項接收一個對象，其中鍵是計算屬性的名稱，值是一個計算屬性 getter，或一個具有 `get` 和 `set` 方法的對象 (用於聲明可寫的計算屬性)。

  所有的 getters 和 setters 會將它們的 `this` 上下文自動綁定為組件實例。

  注意，如果你為一個計算屬性使用了箭頭函數，則 `this` 不會指向該組件實例，不過你仍然可以通過該函數的第一個參數來訪問實例：

  ```js
  export default {
    computed: {
      aDouble: (vm) => vm.a * 2
    }
  }
  ```

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    computed: {
      // 只讀
      aDouble() {
        return this.a * 2
      },
      // 可寫
      aPlus: {
        get() {
          return this.a + 1
        },
        set(v) {
          this.a = v - 1
        }
      }
    },
    created() {
      console.log(this.aDouble) // => 2
      console.log(this.aPlus) // => 2

      this.aPlus = 3
      console.log(this.a) // => 2
      console.log(this.aDouble) // => 4
    }
  }
  ```

- **參考**
  - [指南 - 計算屬性](/guide/essentials/computed)
  - [指南 - 為計算屬性標記類型](/guide/typescript/options-api#typing-computed-properties) <sup class="vt-badge ts" />

## methods {#methods}

用於聲明要混入到組件實例中的方法。

- **類型**

  ```ts
  interface ComponentOptions {
    methods?: {
      [key: string]: (this: ComponentPublicInstance, ...args: any[]) => any
    }
  }
  ```

- **詳細信息**

  聲明的方法可以直接通過組件實例訪問，或者在模板語法表達式中使用。所有的方法都會將它們的 `this` 上下文自動綁定為組件實例，即使在傳遞時也如此。

  在聲明方法時避免使用箭頭函數，因為它們不能通過 `this` 訪問組件實例。

- **示例**

  ```js
  export default {
    data() {
      return { a: 1 }
    },
    methods: {
      plus() {
        this.a++
      }
    },
    created() {
      this.plus()
      console.log(this.a) // => 2
    }
  }
  ```

- **參考**[事件處理](/guide/essentials/event-handling)

## watch {#watch}

用於聲明在數據更改時調用的偵聽回調。

- **類型**

  ```ts
  interface ComponentOptions {
    watch?: {
      [key: string]: WatchOptionItem | WatchOptionItem[]
    }
  }

  type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem

  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void

  type ObjectWatchOptionItem = {
    handler: WatchCallback | string
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: 'pre' | 'post' | 'sync' // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```

  > 為了便於閱讀，對類型進行了簡化。

- **詳細信息**

  `watch` 選項期望接受一個對象，其中鍵是需要偵聽的響應式組件實例屬性 (例如，通過 `data` 或 `computed` 聲明的屬性)——值是相應的回調函數。該回調函數接受被偵聽源的新值和舊值。

  除了一個根級屬性，鍵名也可以是一個簡單的由點分隔的路徑，例如 `a.b.c`。注意，這種用法**不支持**複雜表達式——僅支持由點分隔的路徑。如果你需要偵聽複雜的數據源，可以使用命令式的 [`$watch()`](/api/component-instance#watch) API。

  值也可以是一個方法名稱的字符串 (通過 `methods` 聲明)，或包含額外選項的對象。當使用對象語法時，回調函數應被聲明在 `handler` 中。額外的選項包含：

  - **`immediate`**：在偵聽器創建時立即觸發回調。第一次調用時，舊值將為 `undefined`。
  - **`deep`**：如果源是對象或數組，則強制深度遍歷源，以便在深度變更時觸發回調。詳見[深層偵聽器](/guide/essentials/watchers#deep-watchers)。
  - **`flush`**：調整回調的刷新時機。詳見[回調的觸發時機](/guide/essentials/watchers#callback-flush-timing)及 [`watchEffect()`](/api/reactivity-core#watcheffect)。
  - **`onTrack / onTrigger`**：調試偵聽器的依賴關係。詳見[偵聽器調試](/guide/extras/reactivity-in-depth#watcher-debugging)。

  聲明偵聽器回調時避免使用箭頭函數，因為它們將無法通過 `this` 訪問組件實例。

- **示例**

  ```js
  export default {
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 4
        },
        e: 5,
        f: 6
      }
    },
    watch: {
      // 偵聽根級屬性
      a(val, oldVal) {
        console.log(`new: ${val}, old: ${oldVal}`)
      },
      // 字符串方法名稱
      b: 'someMethod',
      // 該回調將會在被偵聽的對象的屬性改變時調動，無論其被嵌套多深
      c: {
        handler(val, oldVal) {
          console.log('c changed')
        },
        deep: true
      },
      // 偵聽單個嵌套屬性：
      'c.d': function (val, oldVal) {
        // do something
      },
      // 該回調將會在偵聽開始之後立即調用
      e: {
        handler(val, oldVal) {
          console.log('e changed')
        },
        immediate: true
      },
      // 你可以傳入回調數組，它們將會被逐一調用
      f: [
        'handle1',
        function handle2(val, oldVal) {
          console.log('handle2 triggered')
        },
        {
          handler: function handle3(val, oldVal) {
            console.log('handle3 triggered')
          }
          /* ... */
        }
      ]
    },
    methods: {
      someMethod() {
        console.log('b changed')
      },
      handle1() {
        console.log('handle 1 triggered')
      }
    },
    created() {
      this.a = 3 // => new: 3, old: 1
    }
  }
  ```

- **參考**[偵聽器](/guide/essentials/watchers)

## emits {#emits}

用於聲明由組件觸發的自定義事件。

- **類型**

  ```ts
  interface ComponentOptions {
    emits?: ArrayEmitsOptions | ObjectEmitsOptions
  }

  type ArrayEmitsOptions = string[]

  type ObjectEmitsOptions = { [key: string]: EmitValidator | null }

  type EmitValidator = (...args: unknown[]) => boolean
  ```

- **詳細信息**

  可以以兩種形式聲明觸發的事件：

  - 使用字符串數組的簡易形式。
  - 使用對象的完整形式。該對象的每個屬性鍵是事件的名稱，值是 `null` 或一個驗證函數。

  驗證函數會接收到傳遞給組件的 `$emit` 調用的額外參數。例如，如果 `this.$emit('foo', 1)` 被調用，`foo` 相應的驗證函數將接受參數 `1`。驗證函數應返回布爾值，以表明事件參數是否通過了驗證。

  注意，`emits` 選項會影響一個監聽器被解析為組件事件監聽器，還是原生 DOM 事件監聽器。被聲明為組件事件的監聽器不會被透傳到組件的根元素上，且將從組件的 `$attrs` 對象中移除。詳見[透傳 Attributes](/guide/components/attrs)。

- **示例**

  數組語法：

  ```js
  export default {
    emits: ['check'],
    created() {
      this.$emit('check')
    }
  }
  ```

  對象語法：

  ```js
  export default {
    emits: {
      // 沒有驗證函數
      click: null,

      // 具有驗證函數
      submit: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      }
    }
  }
  ```

- **參考**
  - [指南 - 透傳 Attributes](/guide/components/attrs)
  - [指南 - 為組件的 emits 標註類型](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

## expose {#expose}

用於聲明當組件實例被父組件通過模板引用訪問時暴露的公共屬性。

- **類型**

  ```ts
  interface ComponentOptions {
    expose?: string[]
  }
  ```

- **詳細信息**

  默認情況下，當通過 `$parent`、`$root` 或模板引用訪問時，組件實例將向父組件暴露所有的實例屬性。這可能不是我們希望看到的，因為組件很可能擁有一些應保持私有的內部狀態或方法，以避免緊耦合。

  `expose` 選項值應當是一個包含要暴露的屬性名稱字符串的數組。當使用 `expose` 時，只有顯式列出的屬性將在組件實例上暴露。

  `expose` 僅影響用戶定義的屬性——它不會過濾掉內置的組件實例屬性。

- **示例**

  ```js
  export default {
    // 只有 `publicMethod` 在公共實例上可用
    expose: ['publicMethod'],
    methods: {
      publicMethod() {
        // ...
      },
      privateMethod() {
        // ...
      }
    }
  }
  ```
