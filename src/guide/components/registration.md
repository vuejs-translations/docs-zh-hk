# 組件註冊 {#component-registration}

> 此章節假設你已經看過了[組件基礎](/guide/essentials/component-basics)。若你還不了解組件是什麼，請先閱讀該章節。

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="免費的 Vue.js 組件註冊課程"/>

一個 Vue 組件在使用前需要先被“註冊”，這樣 Vue 才能在渲染模板時找到其對應的實現。組件註冊有兩種方式：全局註冊和局部註冊。

## 全局註冊 {#global-registration}

我們可以使用 [Vue 應用實例](/guide/essentials/application)的 `.component()` 方法，讓組件在當前 Vue 應用中全局可用。

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // 註冊的名字
  'MyComponent',
  // 組件的實現
  {
    /* ... */
  }
)
```

如果使用單文件組件，你可以註冊被導入的 `.vue` 文件：

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

`.component()` 方法可以被鏈式調用：

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

全局註冊的組件可以在此應用的任意組件的模板中使用：

```vue-html
<!-- 這在當前應用的任意組件中都可用 -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

所有的子組件也可以使用全局註冊的組件，這意味著這三個組件也都可以在*彼此內部*使用。

## 局部註冊 {#local-registration}

全局註冊雖然很方便，但有以下幾個問題：

1. 全局註冊，但並沒有被使用的組件無法在生產打包時被自動移除 (也叫“tree-shaking”)。如果你全局註冊了一個組件，即使它並沒有被實際使用，它仍然會出現在打包後的 JS 文件中。

2. 全局註冊在大型項目中使項目的依賴關係變得不那麼明確。在父組件中使用子組件時，不太容易定位子組件的實現。和使用過多的全局變量一樣，這可能會影響應用長期的可維護性。

相比之下，局部註冊的組件需要在使用它的父組件中顯式導入，並且只能在該父組件中使用。它的優點是使組件之間的依賴關係更加明確，並且對 tree-shaking 更加友好。

<div class="composition-api">

在使用 `<script setup>` 的單文件組件中，導入的組件可以直接在模板中使用，無需註冊：

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

如果沒有使用 `<script setup>`，則需要使用 `components` 選項來顯式註冊：

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

局部註冊需要使用 `components` 選項：

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

對於每個 `components` 對象裡的屬性，它們的 key 名就是註冊的組件名，而值就是相應組件的實現。上面的例子中使用的是 ES2015 的縮寫語法，等價於：

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

請注意：**局部註冊的組件在後代組件中<i>不</i>可用**。在這個例子中，`ComponentA` 註冊後僅在當前組件可用，而在任何的子組件或更深層的子組件中都不可用。

## 組件名格式 {#component-name-casing}

在整個指引中，我們都使用 PascalCase 作為組件名的註冊格式，這是因為：

1. PascalCase 是合法的 JavaScript 標識符。這使得在 JavaScript 中導入和註冊組件都很容易，同時 IDE 也能提供較好的自動補全。

2. `<PascalCase />` 在模板中更明顯地表明了這是一個 Vue 組件，而不是原生 HTML 元素。同時也能夠將 Vue 組件和自定義元素 (web components) 區分開來。

在單文件組件和內聯字符串模板中，我們都推薦這樣做。但是，PascalCase 的標籤名在 DOM 內模板中是不可用的，詳情參見 [DOM 內模板解析注意事項](/guide/essentials/component-basics#in-dom-template-parsing-caveats)。

為了方便，Vue 支持將模板中使用 kebab-case 的標籤解析為使用 PascalCase 註冊的組件。這意味著一個以 `MyComponent` 為名註冊的組件，在模板中可以通過 `<MyComponent>` 或 `<my-component>` 引用。這讓我們能夠使用同樣的 JavaScript 組件註冊代碼來配合不同來源的模板。
