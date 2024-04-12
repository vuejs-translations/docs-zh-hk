# 創建一個 Vue 應用 {#creating-a-vue-application}

## 應用實例 {#the-application-instance}

每個 Vue 應用均通過 [`createApp`](/api/application#createapp) 函數創建一個新的 **應用實例**：

```js
import { createApp } from 'vue'

const app = createApp({
  /* 根組件選項 */
})
```

## 根組件 {#the-root-component}

我們傳入 `createApp` 的對象實際上是一個組件，每個應用都需要一個“根組件”，其他組件將作為其子組件。

如果你使用的是單文件組件，我們可以直接從另一個文件中導入根組件。

```js
import { createApp } from 'vue'
// 從一個單文件組件中導入根組件
import App from './App.vue'

const app = createApp(App)
```

雖然本指南中的大部分示例只需要一個組件，但大多數真實的應用都是由一棵嵌套的、可重用的組件樹組成的。例如，一個待辦事項 (Todos) 應用的組件樹可能是這樣的：

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

我們會在指南的後續章節中討論如何定義和組合多個組件。在那之前，我們得先關注一個組件內到底發生了什麼。

## 掛載應用 {#mounting-the-app}

應用實例必須在調用了 `.mount()` 方法後才會渲染出來。該方法接收一個“容器”參數，可以是一個實際的 DOM 元素或是一個 CSS 選擇器字符串：

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

應用根組件的內容將會被渲染在容器元素裡面。容器元素自己將**不會**被視為應用的一部分。

`.mount()` 方法應該始終在整個應用配置和資源註冊完成後被調用。同時請注意，不同於其他資源註冊方法，它的返回值是根組件實例而非應用實例。

### DOM 中的根組件模板 {#in-dom-root-component-template}

根組件的模板通常是組件本身的一部分，但也可以直接通過在掛載容器內編寫模板來單獨提供：

```html
<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```js
import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```

當根組件沒有設置 `template` 選項時，Vue 將自動使用容器的 `innerHTML` 作為模板。

DOM 內的模板通常用於[無構建步驟](/guide/quick-start.html#using-vue-from-cdn)的 Vue 應用程序。它們也可以與服務器端框架一起使用，其中根模板可能是由服務器動態生成的。

## 應用配置 {#app-configurations}

應用實例會暴露一個 `.config` 對象來允許我們配置一些應用級的選項，例如定義一個應用級的錯誤處理器，用來捕獲所有子組件上的錯誤：

```js
app.config.errorHandler = (err) => {
  /* 處理錯誤 */
}
```

應用實例還提供了一些方法來註冊應用範圍內可用的資源，例如註冊一個組件：

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

這讓 `TodoDeleteButton` 在應用的任何地方都是可用的。我們會在指南的後續章節中討論關於組件和其他資源的註冊。你也可以在 [API 參考](/api/application)中瀏覽應用實例 API 的完整列表。

確保在掛載應用實例之前完成所有應用配置！

## 多個應用實例 {#multiple-application-instances}

應用實例並不只限於一個。`createApp` API 允許你在同一個頁面中創建多個共存的 Vue 應用，而且每個應用都擁有自己的用於配置和全局資源的作用域。

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

如果你正在使用 Vue 來增強服務端渲染 HTML，並且只想要 Vue 去控制一個大型頁面中特殊的一小部分，應避免將一個單獨的 Vue 應用實例掛載到整個頁面上，而是應該創建多個小的應用實例，將它們分別掛載到所需的元素上去。

<!-- zhlint disabled -->
