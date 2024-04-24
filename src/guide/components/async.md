# 異步組件 {#async-components}

## 基本用法 {#basic-usage}

在大型項目中，我們可能需要拆分應用為更小的模塊，並僅在需要時再從服務器加載相關組件。Vue 提供了 [`defineAsyncComponent`](/api/general#defineasynccomponent) 方法來實現此功能：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...從服務器獲取組件
    resolve(/* 獲取到的組件 */)
  })
})
// ... 像使用其他一般組件一樣使用 `AsyncComp`
```

如你所見，`defineAsyncComponent` 方法接收一個返回 Promise 的加載函數。這個 Promise 的 `resolve` 回調方法應該在從服務器獲得組件定義時調用。你也可以調用 `reject(reason)` 表明加載失敗。

[ES 模塊動態導入](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)也會返回一個 Promise，所以多數情況下我們會將它和 `defineAsyncComponent` 搭配使用。類似 Vite 和 Webpack 這樣的構建工具也支持此語法 (並且會將它們作為打包時的代碼分割點)，因此我們也可以用它來導入 Vue 單文件組件：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

最後得到的 `AsyncComp` 是一個外層封裝過的組件，只在頁面需要它渲染時才會調用加載內部實際組件的函數。它會將接收到的 props 和插槽傳給內部組件，所以你可以使用這個異步的包裝組件無縫地替換原始組件，同時實現延遲加載。

與普通組件一樣，異步組件可以使用 `app.component()` [全局註冊](/guide/components/registration#global-registration)：

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

你也可以在[局部註冊組件](/guide/components/registration#local-registration)時使用 `defineAsyncComponent`：

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

也可以直接在父組件中直接定義它們：

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## 加載與錯誤狀態 {#loading-and-error-states}

異步操作不可避免地會涉及到加載和錯誤狀態，因此 `defineAsyncComponent()` 也支持在高級選項中處理這些狀態：

```js
const AsyncComp = defineAsyncComponent({
  // 加載函數
  loader: () => import('./Foo.vue'),

  // 加載異步組件時使用的組件
  loadingComponent: LoadingComponent,
  // 展示加載組件前的延遲時間，默認為 200ms
  delay: 200,

  // 加載失敗後展示的組件
  errorComponent: ErrorComponent,
  // 如果提供了一個 timeout 時間限制，並超時了
  // 也會顯示這裡配置的報錯組件，默認值是：Infinity
  timeout: 3000
})
```

如果提供了一個加載組件，它將在內部組件加載時先行顯示。在加載組件顯示之前有一個默認的 200ms 延遲——這是因為在網絡狀況較好時，加載完成得很快，加載組件和最終組件之間的替換太快可能產生閃爍，反而影響用戶感受。

如果提供了一個報錯組件，則它會在加載器函數返回的 Promise 拋錯時被渲染。你還可以指定一個超時時間，在請求耗時超過指定時間時也會渲染報錯組件。

## 搭配 Suspense 使用 {#using-with-suspense}

異步組件可以搭配內置的 `<Suspense>` 組件一起使用，若想了解 `<Suspense>` 和異步組件之間交互，請參閱 [`<Suspense>`](/guide/built-ins/suspense) 章節。
