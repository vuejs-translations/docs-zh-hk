# TypeScript 與組合式 API {#typescript-with-composition-api}

> 這一章假設你已經閱讀了[搭配 TypeScript 使用 Vue](./overview) 的概覽。

## 為組件的 props 標註類型 {#typing-component-props}

### 使用 `<script setup>` {#using-script-setup}

當使用 `<script setup>` 時，`defineProps()` 宏函數支持從它的參數中推導類型：

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

這被稱之為“運行時聲明”，因為傳遞給 `defineProps()` 的參數會作為運行時的 `props` 選項使用。

然而，通過泛型參數來定義 props 的類型通常更直接：

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

這被稱之為“基於類型的聲明”。編譯器會盡可能地嘗試根據類型參數推導出等價的運行時選項。在這種場景下，我們第二個例子中編譯出的運行時選項和第一個是完全一致的。

基於類型的聲明或者運行時聲明可以擇一使用，但是不能同時使用。

我們也可以將 props 的類型移入一個單獨的接口中：

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

這同樣適用於 `Props` 從另一個源文件中導入的情況。該功能要求 TypeScript 作為 Vue 的一個 peer dependency。

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### 語法限制 {#syntax-limitations}

在 3.2 及以下版本中，`defineProps()` 的泛型類型參數僅限於類型文字或對本地接口的引用。

這個限制在 3.3 中得到了解決。最新版本的 Vue 支持在類型參數位置引用導入和有限的複雜類型。但是，由於類型到運行時轉換仍然基於 AST，一些需要實際類型分析的複雜類型，例如條件類型，還未支持。您可以使用條件類型來指定單個 prop 的類型，但不能用於整個 props 對象的類型。

### Props 解構默認值 {#props-default-values}

When using type-based declaration, we lose the ability to declare default values for the props. This can be resolved by using [Reactive Props Destructure](/guide/components/props#reactive-props-destructure) <sup class="vt-badge" data-text="3.5+" />:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const { msg = 'hello', labels = ['one', 'two'] } = defineProps<Props>()
```

In 3.4 and below, Reactive Props Destructure is not enabled by default. An alternative is to use the `withDefaults` compiler macro:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

這將被編譯為等效的運行時 props `default` 選項。此外，`withDefaults` 幫助程序為默認值提供類型檢查，並確保返回的 props 類型刪除了已聲明默認值的屬性的可選標誌。

:::info
Note that default values for mutable reference types (like arrays or objects) should be wrapped in functions when using `withDefaults` to avoid accidental modification and external side effects. This ensures each component instance gets its own copy of the default value. This is **not** necessary when using default values with destructure.
:::

### 非 `<script setup>` 場景下 {#without-script-setup}

如果沒有使用 `<script setup>`，那麼為了開啟 props 的類型推導，必須使用 `defineComponent()`。傳入 `setup()` 的 props 對象類型是從 `props` 選項中推導而來。

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- 類型：string
  }
})
```

### 複雜的 prop 類型 {#complex-prop-types}

通過基於類型的聲明，一個 prop 可以像使用其他任何類型一樣使用一個複雜類型：

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

對於運行時聲明，我們可以使用 `PropType` 工具類型：

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

其工作方式與直接指定 `props` 選項基本相同：

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

`props` 選項通常用於 Options API，因此你會在[選項式 API 與 TypeScript](/guide/typescript/options-api#typing-component-props) 指南中找到更詳細的例子。這些例子中展示的技術也適用於使用 `defineProps()` 的運行時聲明。

## 為組件的 emits 標註類型 {#typing-component-emits}

在 `<script setup>` 中，`emit` 函數的類型標註也可以通過運行時聲明或是類型聲明進行：

```vue
<script setup lang="ts">
// 運行時
const emit = defineEmits(['change', 'update'])

// 基於選項
const emit = defineEmits({
  change: (id: number) => {
    // 返回 `true` 或 `false`
    // 表明驗證通過或失敗
  },
  update: (value: string) => {
    // 返回 `true` 或 `false`
    // 表明驗證通過或失敗
  }
})

// 基於類型
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: 可選的、更簡潔的語法
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

類型參數可以是以下的一種：

1. 一個可調用的函數類型，但是寫作一個包含[調用簽名](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures)的類型字面量。它將被用作返回的 `emit` 函數的類型。
2. 一個類型字面量，其中鍵是事件名稱，值是數組或元組類型，表示事件的附加接受參數。上面的示例使用了具名元組，因此每個參數都可以有一個顯式的名稱。

我們可以看到，基於類型的聲明使我們可以對所觸發事件的類型進行更細粒度的控制。

若沒有使用 `<script setup>`，`defineComponent()` 也可以根據 `emits` 選項推導暴露在 setup 上下文中的 `emit` 函數的類型：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- 類型檢查 / 自動補全
  }
})
```

## 為 `ref()` 標註類型 {#typing-ref}

ref 會根據初始化時的值推導其類型：

```ts
import { ref } from 'vue'

// 推導出的類型：Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

有時我們可能想為 ref 內的值指定一個更復雜的類型，可以通過使用 `Ref` 這個類型：

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

或者，在調用 `ref()` 時傳入一個泛型參數，來覆蓋默認的推導行為：

```ts
// 得到的類型：Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // 成功！
```

如果你指定了一個泛型參數但沒有給出初始值，那麼最後得到的就將是一個包含 `undefined` 的聯合類型：

```ts
// 推導得到的類型：Ref<number | undefined>
const n = ref<number>()
```

## 為 `reactive()` 標註類型 {#typing-reactive}

`reactive()` 也會隱式地從它的參數中推導類型：

```ts
import { reactive } from 'vue'

// 推導得到的類型：{ title: string }
const book = reactive({ title: 'Vue 3 指引' })
```

要顯式地標註一個 `reactive` 變量的類型，我們可以使用接口：

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

:::tip
不推薦使用 `reactive()` 的泛型參數，因為處理了深層次 ref 解包的返回值與泛型參數的類型不同。
:::

## 為 `computed()` 標註類型 {#typing-computed}

`computed()` 會自動從其計算函數的返回值上推導出類型：

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// 推導得到的類型：ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

你還可以通過泛型參數顯式指定類型：

```ts
const double = computed<number>(() => {
  // 若返回值不是 number 類型則會報錯
})
```

## 為事件處理函數標註類型 {#typing-event-handlers}

在處理原生 DOM 事件時，應該為我們傳遞給事件處理函數的參數正確地標註類型。讓我們看一下這個例子：

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` 隱式地標註為 `any` 類型
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

沒有類型標註時，這個 `event` 參數會隱式地標註為 `any` 類型。這也會在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 時報出一個 TS 錯誤。因此，建議顯式地為事件處理函數的參數標註類型。此外，你在訪問 `event` 上的屬性時可能需要使用類型斷言：

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## 為 provide / inject 標註類型 {#typing-provide-inject}

provide 和 inject 通常會在不同的組件中運行。要正確地為注入的值標記類型，Vue 提供了一個 `InjectionKey` 接口，它是一個繼承自 `Symbol` 的泛型類型，可以用來在提供者和消費者之間同步注入值的類型：

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // 若提供的是非字符串值會導致錯誤

const foo = inject(key) // foo 的類型：string | undefined
```

建議將注入 key 的類型放在一個單獨的文件中，這樣它就可以被多個組件導入。

當使用字符串注入 key 時，注入值的類型是 `unknown`，需要通過泛型參數顯式聲明：

```ts
const foo = inject<string>('foo') // 類型：string | undefined
```

注意注入的值仍然可以是 `undefined`，因為無法保證提供者一定會在運行時 provide 這個值。

當提供了一個默認值後，這個 `undefined` 類型就可以被移除：

```ts
const foo = inject<string>('foo', 'bar') // 類型：string
```

如果你確定該值將始終被提供，則還可以強制轉換該值：

```ts
const foo = inject('foo') as string
```

## 為模板引用標註類型 {#typing-template-refs}

With Vue 3.5 and `@vue/language-tools` 2.1 (powering both the IDE language service and `vue-tsc`), the type of refs created by `useTemplateRef()` in SFCs can be **automatically inferred** for static refs based on what element the matching `ref` attribute is used on.

In cases where auto-inference is not possible, you can still cast the template ref to an explicit type via the generic argument:

```ts
const el = useTemplateRef<HTMLInputElement>(null)
```

<details>
<summary>Usage before 3.5</summary>

模板引用需要通過一個顯式指定的泛型參數和一個初始值 `null` 來創建：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

</details>

</details>

可以通過類似於 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/input#technical_summary) 的頁面來獲取正確的 DOM 接口。

注意為了嚴格的類型安全，有必要在訪問 `el.value` 時使用可選鏈或類型守衛。這是因為直到組件被掛載前，這個 ref 的值都是初始的 `null`，並且在由於 `v-if` 的行為將引用的元素卸載時也可以被設置為 `null`。

## 為組件模板引用標註類型 {#typing-component-template-refs}

With Vue 3.5 and `@vue/language-tools` 2.1 (powering both the IDE language service and `vue-tsc`), the type of refs created by `useTemplateRef()` in SFCs can be **automatically inferred** for static refs based on what element or component the matching `ref` attribute is used on.

In cases where auto-inference is not possible (e.g. non-SFC usage or dynamic components), you can still cast the template ref to an explicit type via the generic argument.

In order to get the instance type of an imported component, we need to first get its type via `typeof`, then use TypeScript's built-in `InstanceType` utility to extract its instance type:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

type FooType = InstanceType<typeof Foo>
type BarType = InstanceType<typeof Bar>

const compRef = useTemplateRef<FooType | BarType>('comp')
</script>

<template>
  <component :is="Math.random() > 0.5 ? Foo : Bar" ref="comp" />
</template>
```

In cases where the exact type of the component isn't available or isn't important, `ComponentPublicInstance` can be used instead. This will only include properties that are shared by all components, such as `$el`:

```ts
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = useTemplateRef<ComponentPublicInstance | null>(null)
```

In cases where the component referenced is a [generic component](/guide/typescript/overview.html#generic-components), for instance `MyGenericModal`:

```vue
<!-- MyGenericModal.vue -->
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

It needs to be referenced using `ComponentExposed` from the [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers) library as `InstanceType` won't work.

```vue
<!-- App.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import MyGenericModal from './MyGenericModal.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

const modal = useTemplateRef<ComponentExposed<typeof MyGenericModal>>(null)

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```

Note that with `@vue/language-tools` 2.1+, static template refs' types can be automatically inferred and the above is only needed in edge cases.
