# 組件 v-model {#component-v-model}

## 基本用法 {#basic-usage}

`v-model` 可以在組件上使用以實現雙向綁定。

<div class="composition-api">

從 Vue 3.4 開始，推薦的實現方式是使用 [`defineModel()`](/api/sfc-script-setup#definemodel) 宏：

```vue
<!-- Child.vue -->
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
</template>
```

父組件可以用 `v-model` 綁定一個值：

```vue-html
<!-- Parent.vue -->
<Child v-model="countModel" />
```

`defineModel()` 返回的值是一個 ref。它可以像其他 ref 一樣被訪問以及修改，不過它能起到在父組件和當前變量之間的雙向綁定的作用：

- 它的 `.value` 和父組件的 `v-model` 的值同步；
- 當它被子組件變更了，會觸發父組件綁定的值一起更新。

這意味著你也可以用 `v-model` 把這個 ref 綁定到一個原生 input 元素上，在提供相同的 `v-model` 用法的同時輕鬆包裝原生 input 元素：

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFUtFKwzAU/ZWYl06YLbK30Q10DFSYigq+5KW0t11mmoQknZPSf/cm3eqEsT0l555zuefmpKV3WsfbBuiUpjY3XDtiwTV6ziSvtTKOLNZcFKQ0qiZRnATkG6JB0BIDJen2kp5iMlfSOlLbisw8P4oeQAhFPpURxVV0zWSa9PNwEgIHtRaZA0SEpOvbeduG5q5LE0Sh2jvZ3tSqADFjFHlGSYJkmhz10zF1FseXvIo3VklcrfX9jOaq1lyAedGOoz1GpyQwnsvQ3fdTqDnTwPhQz9eQf52ob+zO1xh9NWDBbIHRgXOZqcD19PL9GXZ4H0h03whUnyHfwCrReI+97L6RBdo+0gW3j+H9uaw+7HLnQNrDUt6oV3ZBzyhmsjiz+p/dSTwJfUx2+IpD1ic+xz5enwQGXEDJJaw8Gl2I1upMzlc/hEvdOBR6SNKAjqP1J6P/o6XdL11L5h4=)

### 底層機制 {#under-the-hood}

`defineModel` 是一個便利宏。編譯器將其展開為以下內容：

- 一個名為 `modelValue` 的 prop，本地 ref 的值與其同步；
- 一個名為 `update:modelValue` 的事件，當本地 ref 的值發生變更時觸發。

在 3.4 版本之前，你一般會按照如下的方式來實現上述相同的子組件：

```vue
<!-- Child.vue -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```

然後，父組件中的 `v-model="modelValue"` 將被編譯為：

```vue-html
<!-- Parent.vue -->
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
```

如你所見，這顯得冗長得多。然而，這樣寫有助於理解其底層機制。

因為 `defineModel` 聲明了一個 prop，你可以通過給 `defineModel` 傳遞選項，來聲明底層 prop 的選項：

```js
// 使 v-model 必填
const model = defineModel({ required: true })

// 提供一個默認值
const model = defineModel({ default: 0 })
```

:::warning
如果為 `defineModel` prop 設置了一個 `default` 值且父組件沒有為該 prop 提供任何值，會導致父組件與子組件之間不同步。在下面的示例中，父組件的 `myRef` 是 undefined，而子組件的 `model` 是 1：

```js
// 子組件：
const model = defineModel({ default: 1 })

// 父組件
const myRef = ref()
```

```html
<Child v-model="myRef"></Child>
```

:::

</div>

<div class="options-api">

首先讓我們回憶一下 `v-model` 在原生元素上的用法：

```vue-html
<input v-model="searchText" />
```

在代碼背後，模板編譯器會對 `v-model` 進行更冗長的等價展開。因此上面的代碼其實等價於下面這段：

```vue-html
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

而當使用在一個組件上時，`v-model` 會被展開為如下的形式：

```vue-html
<CustomInput
  :model-value="searchText"
  @update:model-value="newValue => searchText = newValue"
/>
```

要讓這個例子實際工作起來，`<CustomInput>` 組件內部需要做兩件事：

1. 將內部原生 `<input>` 元素的 `value` 屬性綁定到 `modelValue` prop
2. 當原生的 `input` 事件觸發時，觸發一個攜帶了新值的 `update:modelValue` 自定義事件

這裡是相應的代碼：

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue']
}
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

現在 `v-model` 可以在這個組件上正常工作了：

```vue-html
<CustomInput v-model="searchText" />
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFkctqwzAQRX9lEAEn4Np744aWrvoD3URdiHiSGvRCHpmC8b93JDfGKYGCkJjXvTrSJF69r8aIohHtcA69p6O0vfEuELzFgZx5tz4SXIIzUFT1JpfGCmmlxe/c3uFFRU0wSQtwdqxh0dLQwHSnNJep3ilS+8PSCxCQYrC3CMDgMKgrNlB8odaOXVJ2TgdvvNp6vSwHhMZrRcgRQLs1G5+M61A/S/ErKQXUR5immwXMWW1VEKX4g3j3Mo9QfXCeKU9FtvpQmp/lM0Oi6RP/qYieebHZNvyL0acLLODNmGYSxCogxVJ6yW1c2iWz/QOnEnY48kdUpMIVGSllD8t8zVZb+PkHqPG4iw==)

另一種在組件內實現 `v-model` 的方式是使用一個可寫的，同時具有 getter 和 setter 的 `computed` 屬性。`get` 方法需返回 `modelValue` prop，而 `set` 方法需觸發相應的事件：

```vue
<!-- CustomInput.vue -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>

<template>
  <input v-model="value" />
</template>
```

</div>

## `v-model` 的參數 {#v-model-arguments}

組件上的 `v-model` 也可以接受一個參數：

```vue-html
<MyComponent v-model:title="bookTitle" />
```

<div class="composition-api">

在子組件中，我們可以通過將字符串作為第一個參數傳遞給 `defineModel()` 來支持相應的參數：

```vue
<!-- MyComponent.vue -->
<script setup>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFU9tu2zAM/RVBKOAWyGIM25PhFbugDxuwC7a+VX3wEiZ1K0uCRHkuDP/7SKlxk16BILbIQ/KcQ3mUn5xb9hFkJeuw8q3DU2XazlmP4vvtF0tvBgyKjbedKJblXozLCmWUgSHB17BpokYxKiPEaocKlRgPOk0Lzq8bbI5PMlYIDxi92Z2E+GvtzXmLGipR9G86uwYtGr+NHTeAoemc5tEMnfhBf/Sry1kBHRAI1SDQSYj66u3pON73FdNUlxRLuX12d9MqZNQHJecKJUVJ8Lqc+8qFfODGgYlPueK8dWTIRZHaF5fJCuhadumiiI5cgTy6uHxVUmtcxGwC3jomizCgkjlU9Y2OKZjZ5+jHVETRI556fDhyIY6gZylIXgMp4g4nufSxdgwrazbtdnkdrCHlSaCSvPhWg//psLUmKEn7z7OVbLS2/76lGPoISX2quYLVzRPx6zBwTMlfHgL4nmTMucwxp8/+/EjK5yTtMLLoF5K/IVgdmWOGfY5mTbT3cInt1/QptGZ7Hs4GBBN2ophounoJryStn+/Cc9Lv6b5bvt9dWTn9B6F1Lrs=)

如果需要額外的 prop 選項，應該在 model 名稱之後傳遞：

```js
const title = defineModel('title', { required: true })
```

<details>
<summary>3.4 之前的用法</summary>

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps({
  title: {
    required: true
  }
})
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9kE1rwzAMhv+KMIW00DXsGtKyMXYc7D7vEBplM8QfOHJoCfnvk+1QsjJ2svVKevRKk3h27jAGFJWoh7NXjmBACu4kjdLOeoIJPHYwQ+ethoJLi1vq7fpi+WfQ0JI+lCstcrkYQJqzNQMBKeoRjhG4LcYHbVvsofFfQUcCXhrteix20tRl9sIuOCBkvSHkCKD+fjxN04Ka57rkOOlrMwu7SlVHKdIrBZRcWpc3ntiLO7t/nKHFThl899YN248ikYpP9pj1V60o6sG1TMwDU/q/FZRxgeIPgK4uGcQLSZGlamz6sHKd1afUxOoGeeT298A9bHCMKxBfE3mTSNjl1vud5x8qNa76)

</details>
</div>
<div class="options-api">

在這種情況下，子組件應該使用 `title` prop 和 `update:title` 事件來更新父組件的值，而非默認的 `modelValue` prop 和 `update:modelValue` 事件：

```vue
<!-- MyComponent.vue -->
<script>
export default {
  props: ['title'],
  emits: ['update:title']
}
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFUNFqwzAM/BVhCm6ha9hryMrGnvcFdR9Mo26B2DGuHFJC/n2yvZakDAohtuTTne5G8eHcrg8oSlFdTr5xtFe2Ma7zBF/Xz45vFi3B2XcG5K6Y9eKYVFZZHBK8xrMOLcGoLMDphrqUMC6Ypm18rzXp9SZjATxS8PZWAVBDLZYg+xfT1diC9t/BxGEctHFtlI2wKR78468q7ttzQcgoTcgVQPXzuh/HzAnTVBVcp/58qz+lMqHelEinElAwtCrufGIrHhJYBPdfEs53jkM4yEQpj8k+miYmc5DBcRKYZeXxqZXGukDZPF1dWhQHUiK3yl63YbZ97r6nIe6uoup6KbmFFfbRCnHGyI4iwyaPPnqffgGMlsEM)

</div>

## 多個 `v-model` 綁定 {#multiple-v-model-bindings}

利用剛才在 [`v-model` 參數](#v-model-arguments)小節中學到的指定參數與事件名的技巧，我們可以在單個組件實例上創建多個 `v-model` 雙向綁定。

組件上的每一個 `v-model` 都會同步不同的 prop，而無需額外的選項：

```vue-html
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFkstuwjAQRX/F8iZUAqKKHQpIfbAoUmnVx86bKEzANLEt26FUkf+9Y4MDSAg2UWbu9fjckVv6oNRw2wAd08wUmitLDNhGTZngtZLakpZoKIkjpZY1SdCadNK3Ab3IazhowzQ2/ES0MVFIYSwpucbvxA/qJXO5FsldlKr8qDxL8EKW7kEQAQsLtapyC1gRkq3vp217mOccwf8wwLksRSlYIoMvCNkOarmEahyODAT2J4yGgtFzhx8UDf5/r6c4NEs7CNqnpxkvbO0kcVjNhCyh5AJe/SW9pBPOV3DJGvu3dsKFaiyxf8qTW9gheQwVs4Z90BDm5oF47cF/Ht4aZC75argxUmD61g9ktJC14hXoN2U5ZmJ0TILitbyq5O889KxuoB/7xRqKnwv9jdn5HqPvGnDVWwTpNJvrFSCul2efi4DeiRigqdB9RfwAI6vGM+5tj41YIvaJL9C+hOfNxerLzHYWhImhPKh3uuBnFJ/A05XoR9zRcBTOMeGo+wcs+yse)

<details>
<summary>3.4 之前的用法</summary>

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNUc1qwzAMfhVjCk6hTdg1pGWD7bLDGIydlh1Cq7SGxDaOEjaC332yU6cdFNpLsPRJ348y8idj0qEHnvOi21lpkHWAvdmWSrZGW2Qjs1Azx2qrWyZoVMzQZwf2rWrhhKVZbHhGGivVTqsOWS0tfTeeKBGv+qjEMkJNdUaeNXigyCYjZIEKhNY0FQJVjBXHh+04nvicY/QOBM4VGUFhJHrwBWPDutV7aPKwslbU35Q8FCX/P+GJ4oB/T3hGpEU2m+ArfpnxytX2UEsF71abLhk9QxDzCzn7QCvVYeW7XuGyWSpH0eP6SyuxS75Eb/akOpn302LFYi8SiO8bJ5PK9DhFxV/j0yH8zOnzoWr6+SbhbifkMSwSsgByk1zzsoABFKZY2QNgGpiW57Pdrx2z3JCeI99Svvxh7g8muf2x)

</details>
</div>
<div class="options-api">

```vue
<script>
export default {
  props: {
    firstName: String,
    lastName: String
  },
  emits: ['update:firstName', 'update:lastName']
}
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNkk1rg0AQhv/KIAETSJRexYYWeuqhl9JTt4clmSSC7i7rKCnif+/ObtYkELAiujPzztejQ/JqTNZ3mBRJ2e5sZWgrVNUYbQm+WrQfskE4WN1AmuXRwQmpUELh2Qv3eJBdTTAIBbDTLluhoraA4VpjXHNwL0kuV0EIYJE6q6IFcKhsSwWk7/qkUq/nq5be+aa5JztGfrmHu8t8GtoZhI2pJaGzAMrT03YYQk0YR3BnruSOZe5CXhKnC3X7TaP3WBc+ZaOc/1kk3hDJvYILRQGfQzx3Rct8GiJZJ7fA7gg/AmesNszMrUIXFpxbwCfZSh09D0Hc7tbN6sAWm4qZf6edcZgxrMHSdA3RF7PTn1l8lTIdhbXp1/CmhOeJRNHLupv4eIaXyItPdJEFD7R8NM0Ce/d/ZCTtESnzlVZXhP/vHbeZaT0tPdf59uONfx7mDVM=)

</div>

## 處理 `v-model` 修飾符 {#handling-v-model-modifiers}

在學習輸入綁定時，我們知道了 `v-model` 有一些[內置的修飾符](/guide/essentials/forms#modifiers)，例如 `.trim`，`.number` 和 `.lazy`。在某些場景下，你可能想要一個自定義組件的 `v-model` 支持自定義的修飾符。

我們來創建一個自定義的修飾符 `capitalize`，它會自動將 `v-model` 綁定輸入的字符串值第一個字母轉為大寫：

```vue-html
<MyComponent v-model.capitalize="myText" />
```

<div class="composition-api">

通過像這樣解構 `defineModel()` 的返回值，可以在子組件中訪問添加到組件 `v-model` 的修飾符：

```vue{4}
<script setup>
const [model, modifiers] = defineModel()

console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

為了能夠基於修飾符選擇性地調節值的讀取和寫入方式，我們可以給 `defineModel()` 傳入 `get` 和 `set` 這兩個選項。這兩個選項在從模型引用中讀取或設置值時會接收到當前的值，並且它們都應該返回一個經過處理的新值。下面是一個例子，展示了如何利用 `set` 選項來應用 `capitalize` (首字母大寫) 修飾符：

```vue{6-8}
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9UsFu2zAM/RVClzhY5mzoLUgHdEUPG9Bt2LLTtIPh0Ik6WxIkyosb5N9LybFrFG1OkvgeyccnHsWNtXkbUKzE2pdOWQKPFOwnqVVjjSM4gsMKTlA508CMqbMRuu9uDd80ajrD+XISi3WZDCB1abQnaLoNHgiuY8VsNptLvV72TbkdPwgbWxeE/ALY7JUHpW0gKAurqKjVI3rAFl1He6V30JkA3AbdKvLXUzXt+8Zssc6fM6+l6NtLAUtusF6O3cRCvFB9yY2SiYFw+8KSYcY/qfEC+FCVQuf/8rxbrJTG+4hkxyiWq2ZtUQecQ3oDqAqyMWeieyQAu0bBaUh5ebkv3A1lH+Y5md/WorstPGZzeHfGfa1KzD6yxzH11B/TCjHC4dPlX1j3P0CdjQ5S79/Z3WhpPF91lDz7Uald/uCNZj/TFFJE91SN7rslxX5JsRrmk6Koa/P/a4qRC7gY4uUey3+vxB/8Icak+OHQo2tRihGjwu2QtUb47te3pHsEWXWomX0B/Ine1CFq7Gmfg96y7Akvqf2StoKXcePvDoTaD0NFocnhxJeClyRu2FujP8u9yq+GnxGnJxSEO+M=)

<details>
<summary>3.4 之前的用法</summary>

```vue{11-13}
<script setup>
const props = defineProps({
  modelValue: String,
  modelModifiers: { default: () => ({}) }
})

const emit = defineEmits(['update:modelValue'])

function emitValue(e) {
  let value = e.target.value
  if (props.modelModifiers.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9Us1Og0AQfpUJF5ZYqV4JNTaNxyYmVi/igdCh3QR2N7tDIza8u7NLpdU0nmB+v5/ZY7Q0Jj10GGVR7iorDYFD6sxDoWRrtCU4gsUaBqitbiHm1ngqrfuV5j+Fik7ldH6R83u5GaBQlVaOoO03+Emw8BtFHCeFyucjKMNxQNiapiTkCGCzlw6kMh1BVRpJZSO/0AEe0Pa0l2oHve6AYdBmvj+/ZHO4bfUWm/Q8uSiiEb6IYM4A+XxCi2bRH9ZX3BgVGKuNYwFbrKXCZx+Jo0cPcG9l02EGL2SZ3mxKr/VW1hKty9hMniy7hjIQCSweQByHBIZCDWzGDwi20ps0Yjxx4MR73Jktc83OOPFHGKk7VZHUKkyFgsAEAqcG2Qif4WWYUml3yOp8wldlDSLISX+TvPDstAemLeGbVvvSLkncJSnpV2PQrkqHLOfmVHeNrFDcMz3w0iBQE1cUzMYBbuS2f55CPj4D6o0/I41HzMKsP+u0kLOPoZWzkx1X7j18A8s0DEY=)

</details>
</div>

<div class="options-api">

新增至組件的 `v-model` 的修飾符將透過 `modelModifiers` 屬性提供給組件。在下面的範例中，我們建立了一個包含 `modelModifiers` 屬性的組件，該屬性預設為空物件：

```vue{11}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  created() {
    console.log(this.modelModifiers) // { capitalize: true }
  }
}
</script>

<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

請注意，組件的 `modelModifiers` 屬性包含 `capitalize`，值為 `true` ——因為它是在 `v-model` 綁定的 `v-model.capitalize="myText"` 上設定的。

現在我們已經為組件配置了 prop，我們可以檢查 `modelModifiers` 屬性並編寫一個處理程序來更改發出的值。在下面的代碼中，每當 `<input />` 元素觸發 `input` 事件時，我們都會將字符串大寫。

```vue{13-15}
<script>
export default {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <input type="text" :value="modelValue" @input="emitValue" />
</template>
```

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFks1qg0AQgF9lkIKGpqa9iikNOefUtJfaw6KTZEHdZR1DbPDdO7saf0qgIq47//PNXL2N1uG5Ri/y4io1UtNrUspCK0Owa7aK/0osCQ5GFeCHq4nMuvlJCZCUeHEOGR5EnRNcrTS92VURXGex2qXVZ4JEsOhsAQxSbcrbDaBo9nihCHyXAaC1B3/4jVdDoXwhLHQuCPkGsD/JCmSpa4JUaEkilz9YAZ7RNHSS5REaVQPXgCay9vG0rPNToTLMw9FznXhdHYkHK04Qr4Zs3tL7g2JG8B4QbZS2LLqGXK5PkdcYwTsZrs1R6RU7lcmDRDPaM7AuWARMbf0KwbVdTNk4dyyk5f3l15r5YjRm8b+dQYF0UtkY1jo4fYDDLAByZBxWCmvAkIQ5IvdoBTcLeYCAiVbhvNwJvEk4GIK5M0xPwmwoeF6EpD60RrMVFXJXj72+ymWKwUvfXt+gfVzGB1tzcKfDZec+o/LfxsTdtlCj7bSpm3Xk4tjpD8FZ+uZMWTowu7MW7S+CWR77)

</div>

### 帶參數的 `v-model` 修飾符 {#modifiers-for-v-model-with-arguments}

<div class="options-api">

對於同時包含參數又有修飾符的 `v-model` 綁定，生成的 prop 名將是 `arg + "Modifiers"`。舉例來說：

```vue-html
<MyComponent v-model:title.capitalize="myText">
```

相應的聲明應該是：

```js
export default {
  props: ['title', 'titleModifiers'],
  emits: ['update:title'],
  created() {
    console.log(this.titleModifiers) // { capitalize: true }
  }
}
```

</div>

這裡是另一個例子，展示了如何在使用多個不同參數的 `v-model` 時使用修飾符：

```vue-html
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>
```

<div class="composition-api">

```vue
<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(firstNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```

<details>
<summary>3.4 之前的用法</summary>

```vue{5,6,10,11}
<script setup>
const props = defineProps({
firstName: String,
lastName: String,
firstNameModifiers: { default: () => ({}) },
lastNameModifiers: { default: () => ({}) }
})
defineEmits(['update:firstName', 'update:lastName'])

console.log(props.firstNameModifiers) // { capitalize: true }
console.log(props.lastNameModifiers) // { uppercase: true }
</script>
```

</details>
</div>
<div class="options-api">

```vue{15,16}
<script>
export default {
  props: {
    firstName: String,
    lastName: String,
    firstNameModifiers: {
      default: () => ({})
    },
    lastNameModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:firstName', 'update:lastName'],
  created() {
    console.log(this.firstNameModifiers) // { capitalize: true }
    console.log(this.lastNameModifiers) // { uppercase: true }
  }
}
</script>
```

</div>
