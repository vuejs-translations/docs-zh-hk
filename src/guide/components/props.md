# Props {#props}

> 此章節假設你已經看過了[組件基礎](/guide/essentials/component-basics)。若你還不了解組件是什麼，請先閱讀該章節。

## Props 聲明 {#props-declaration}

一個組件需要顯式聲明它所接受的 props，這樣 Vue 才能知道外部傳入的哪些是 props，哪些是透傳属性 (關於透傳属性，我們會在[專門的章節](/guide/components/attrs)中討論)。

<div class="composition-api">

在使用 `<script setup>` 的單文件組件中，props 可以使用 `defineProps()` 宏來聲明：

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

在沒有使用 `<script setup>` 的組件中，props 可以使用 [`props`](/api/options-state#props) 選項來聲明：

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() 接收 props 作為第一個參數
    console.log(props.foo)
  }
}
```

注意傳遞給 `defineProps()` 的參數和提供給 `props` 選項的值是相同的，兩種聲明方式背後其實使用的都是 props 選項。

</div>

<div class="options-api">

props 需要使用 [`props`](/api/options-state#props) 選項來定義：

```js
export default {
  props: ['foo'],
  created() {
    // props 會暴露到 `this` 上
    console.log(this.foo)
  }
}
```

</div>

除了使用字符串數組來聲明 props 外，還可以使用對象的形式：

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// 使用 <script setup>
defineProps({
  title: String,
  likes: Number
})
```

```js
// 非 <script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

對於以對象形式聲明的每個屬性，key 是 prop 的名稱，而值則是該 prop 預期類型的構造函數。比如，如果要求一個 prop 的值是 `number` 類型，則可使用 `Number` 構造函數作為其聲明的值。

對象形式的 props 聲明不僅可以一定程度上作為組件的文檔，而且如果其他開發者在使用你的組件時傳遞了錯誤的類型，也會在瀏覽器控制台中拋出警告。我們將在本章節稍後進一步討論有關 [prop 校驗](#prop-validation)的更多細節。

<div class="options-api">

TypeScript 用戶請參考：[為組件 Props 標註類型](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

如果你正在搭配 TypeScript 使用 `<script setup>`，也可以使用類型標註來聲明 props：

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

更多關於基於類型的聲明的細節請參考[組件 props 類型標註](/guide/typescript/composition-api#typing-component-props)。<sup class="vt-badge ts" />

</div>

## 傳遞 prop 的細節 {#prop-passing-details}

### Prop 名字格式 {#prop-name-casing}

如果一個 prop 的名字很長，應使用 camelCase 形式，因為它們是合法的 JavaScript 標識符，可以直接在模板的表達式中使用，也可以避免在作為屬性 key 名時必須加上引號。

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

雖然理論上你也可以在向子組件傳遞 props 時使用 camelCase 形式 (使用 [DOM 內模板](/guide/essentials/component-basics#in-dom-template-parsing-caveats)時例外)，但實際上為了和 HTML 屬性對齊，我們通常會將其寫為 kebab-case 形式：

```vue-html
<MyComponent greeting-message="hello" />
```

對於組件名我們推薦使用 [PascalCase](/guide/components/registration#component-name-casing)，因為這提高了模板的可讀性，能幫助我們區分 Vue 組件和原生 HTML 元素。然而對於傳遞 props 來說，使用 camelCase 並沒有太多優勢，因此我們推薦更貼近 HTML 的書寫風格。

### 靜態 vs. 動態 Props {#static-vs-dynamic-props}

至此，你已經見過了很多像這樣的靜態值形式的 props：

```vue-html
<BlogPost title="My journey with Vue" />
```

相應地，還有使用 `v-bind` 或縮寫 `:` 來進行動態綁定的 props：

```vue-html
<!-- 根據一個變量的值動態傳入 -->
<BlogPost :title="post.title" />

<!-- 根據一個更復雜表達式的值動態傳入 -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### 傳遞不同的值類型 {#passing-different-value-types}

在上述的兩個例子中，我們只傳入了字符串值，但實際上**任何**類型的值都可以作為 props 的值被傳遞。

#### Number {#number}

```vue-html
<!-- 雖然 `42` 是個常量，我們還是需要使用 v-bind -->
<!-- 因為這是一個 JavaScript 表達式而不是一個字符串 -->
<BlogPost :likes="42" />

<!-- 根據一個變量的值動態傳入 -->
<BlogPost :likes="post.likes" />
```

#### Boolean {#boolean}

```vue-html
<!-- 僅寫上 prop 但不傳值，會隱式轉換為 `true` -->
<BlogPost is-published />

<!-- 雖然 `false` 是靜態的值，我們還是需要使用 v-bind -->
<!-- 因為這是一個 JavaScript 表達式而不是一個字符串 -->
<BlogPost :is-published="false" />

<!-- 根據一個變量的值動態傳入 -->
<BlogPost :is-published="post.isPublished" />
```

#### Array {#array}

```vue-html
<!-- 雖然這個數組是個常量，我們還是需要使用 v-bind -->
<!-- 因為這是一個 JavaScript 表達式而不是一個字符串 -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- 根據一個變量的值動態傳入 -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Object {#object}

```vue-html
<!-- 雖然這個對象字面量是個常量，我們還是需要使用 v-bind -->
<!-- 因為這是一個 JavaScript 表達式而不是一個字符串 -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- 根據一個變量的值動態傳入 -->
<BlogPost :author="post.author" />
```

### 使用一個對象綁定多個 prop {#binding-multiple-properties-using-an-object}

如果你想要將一個對象的所有屬性都當作 props 傳入，你可以使用[沒有參數的 `v-bind`](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes)，即只使用 `v-bind` 而非 `:prop-name`。例如，這裡有一個 `post` 對象：

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'My Journey with Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}
```

</div>

以及下面的模板：

```vue-html
<BlogPost v-bind="post" />
```

而這實際上等價於：

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## 單向數據流 {#one-way-data-flow}

所有的 props 都遵循著**單向綁定**原則，props 因父組件的更新而變化，自然地將新的狀態向下流往子組件，而不會逆向傳遞。這避免了子組件意外修改父組件的狀態的情況，不然應用的數據流將很容易變得混亂而難以理解。

另外，每次父組件更新後，所有的子組件中的 props 都會被更新到最新值，這意味著你**不應該**在子組件中去更改一個 prop。若你這麼做了，Vue 會在控制台上向你拋出警告：

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ 警告！prop 是只讀的！
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ 警告！prop 是隻讀的！
    this.foo = 'bar'
  }
}
```

</div>

導致你想要更改一個 prop 的需求通常來源於以下兩種場景：

1. **prop 被用於傳入初始值；而子組件想在之後將其作為一個局部數據屬性**。在這種情況下，最好是新定義一個局部數據屬性，從 props 上獲取初始值即可：

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // 計數器只是將 props.initialCounter 作為初始值
   // 像下面這樣做就使 prop 和後續更新無關了
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // 計數器只是將 this.initialCounter 作為初始值
         // 像下面這樣做就使 prop 和後續更新無關了
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **需要對傳入的 prop 值做進一步的轉換**。在這種情況中，最好是基於該 prop 值定義一個計算屬性：

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // 該 prop 變更時計算屬性也會自動更新
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // 該 prop 變更時計算屬性也會自動更新
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### 更改對象 / 數組類型的 props {#mutating-object-array-props}

當對象或數組作為 props 被傳入時，雖然子組件無法更改 props 綁定，但仍然**可以**更改對象或數組內部的值。這是因為 JavaScript 的對象和數組是按引用傳遞，而對 Vue 來說，禁止這樣的改動，雖然可能生效，但有很大的性能損耗，比較得不償失。

這種更改的主要缺陷是它允許了子組件以某種不明顯的方式影響父組件的狀態，可能會使數據流在將來變得更難以理解。在最佳實踐中，你應該儘可能避免這樣的更改，除非父子組件在設計上本來就需要緊密耦合。在大多數場景下，子組件應該[拋出一個事件](/guide/components/events)來通知父組件做出改變。

## Prop 校驗 {#prop-validation}

Vue 組件可以更細緻地聲明對傳入的 props 的校驗要求。比如我們上面已經看到過的類型聲明，如果傳入的值不滿足類型要求，Vue 會在瀏覽器控制台中拋出警告來提醒使用者。這在開發給其他開發者使用的組件時非常有用。

要聲明對 props 的校驗，你可以向 <span class="composition-api">`defineProps()` 宏</span><span class="options-api">`props` 選項</span>提供一個帶有 props 校驗選項的對象，例如：

<div class="composition-api">

```js
defineProps({
  // 基礎類型檢查
  // （給出 `null` 和 `undefined` 值則會跳過任何類型檢查）
  propA: Number,
  // 多種可能的類型
  propB: [String, Number],
  // 必傳，且為 String 類型
  propC: {
    type: String,
    required: true
  },
  // Number 類型的默認值
  propD: {
    type: Number,
    default: 100
  },
  // 對象類型的默認值
  propE: {
    type: Object,
    // 對象或數組的默認值
    // 必須從一個工廠函數返回。
    // 該函數接收組件所接收到的原始 prop 作為參數。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定義類型校驗函數
  // 在 3.4+ 中完整的 props 作為第二個參數傳入
  propF: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函數類型的默認值
  propG: {
    type: Function,
    // 不像對象或數組的默認，這不是一個
    // 工廠函數。這會是一個用來作為默認值的函數
    default() {
      return 'Default function'
    }
  }
})
```

:::tip
`defineProps()` 宏中的參數**不可以訪問 `<script setup>` 中定義的其他變量**，因為在編譯時整個表達式都會被移到外部的函數中。
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // 基礎類型檢查
    //（給出 `null` 和 `undefined` 值則會跳過任何類型檢查）
    propA: Number,
    // 多種可能的類型
    propB: [String, Number],
    // 必傳，且為 String 類型
    propC: {
      type: String,
      required: true
    },
    // Number 類型的默認值
    propD: {
      type: Number,
      default: 100
    },
    // 對象類型的默認值
    propE: {
      type: Object,
      // 對象或者數組應當用工廠函數返回。
      // 工廠函數會收到組件所接收的原始 props
      // 作為參數
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // 自定義類型校驗函數
    // 在 3.4+ 中完整的 props 作為第二個參數傳入
    propF: {
      validator(value, props) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // 函數類型的默認值
    propG: {
      type: Function,
      // 不像對象或數組的默認，這不是一個
      // 工廠函數。這會是一個用來作為默認值的函數
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

一些補充細節：

- 所有 prop 默認都是可選的，除非聲明了 `required: true`。

- 除 `Boolean` 外的未傳遞的可選 prop 將會有一個默認值 `undefined`。

- `Boolean` 類型的未傳遞 prop 將被轉換為 `false`。這可以通過為它設置 `default` 來更改——例如：設置為 `default: undefined` 將與非布爾類型的 prop 的行為保持一致。

- 如果聲明了 `default` 值，那麼在 prop 的值被解析為 `undefined` 時，無論 prop 是未被傳遞還是顯式指明的 `undefined`，都會改為 `default` 值。

當 prop 的校驗失敗後，Vue 會拋出一個控制台警告 (在開發模式下)。

<div class="composition-api">

如果使用了[基於類型的 prop 聲明](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" />，Vue 會盡最大努力在運行時按照 prop 的類型標註進行編譯。舉例來說，`defineProps<{ msg: string }>` 會被編譯為 `{ msg: { type: String, required: true }}`。

</div>
<div class="options-api">

::: tip 注意
注意 prop 的校驗是在組件實例被創建**之前**，所以實例的屬性 (比如 `data`、`computed` 等) 將在 `default` 或 `validator` 函數中不可用。
:::

</div>

### 運行時類型檢查 {#runtime-type-checks}

校驗選項中的 `type` 可以是下列這些原生構造函數：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

另外，`type` 也可以是自定義的類或構造函數，Vue 將會通過 `instanceof` 來檢查類型是否匹配。例如下面這個類：

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

你可以將其作為一個 prop 的類型：

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

Vue 會通過 `instanceof Person` 來校驗 `author` prop 的值是否是 `Person` 類的一個實例。

## Boolean 類型轉換 {#boolean-casting}

為了更貼近原生 boolean attributes 的行為，聲明為 `Boolean` 類型的 props 有特別的類型轉換規則。以帶有如下聲明的 `<MyComponent>` 組件為例：

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

該組件可以被這樣使用：

```vue-html
<!-- 等同於傳入 :disabled="true" -->
<MyComponent disabled />

<!-- 等同於傳入 :disabled="false" -->
<MyComponent />
```

當一個 prop 被聲明為允許多種類型時，`Boolean` 的轉換規則也將被應用。然而，當同時允許 `String` 和 `Boolean` 時，有一種邊緣情況——只有當 `Boolean` 出現在 `String` 之前時，`Boolean` 轉換規則才適用：

<div class="composition-api">

```js
// disabled 將被轉換為 true
defineProps({
  disabled: [Boolean, Number]
})
  
// disabled 將被轉換為 true
defineProps({
  disabled: [Boolean, String]
})
  
// disabled 將被轉換為 true
defineProps({
  disabled: [Number, Boolean]
})
  
// disabled 將被解析為空字符串 (disabled="")
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// disabled 將被轉換為 true
export default {
  props: {
    disabled: [Boolean, Number]
  }
}
  
// disabled 將被轉換為 true
export default {
  props: {
    disabled: [Boolean, String]
  }
}
  
// disabled 將被轉換為 true
export default {
  props: {
    disabled: [Number, Boolean]
  }
}
  
// disabled 將被解析為空字符串 (disabled="")
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>
