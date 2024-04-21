# Vue 與 Web Components {#vue-and-web-components}

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 是一組 web 原生 API 的統稱，允許開發者創建可複用的自定義元素 (custom elements)。

我們認為 Vue 和 Web Components 是互補的技術。Vue 為使用和創建自定義元素提供了出色的支持。無論你是將自定義元素集成到現有的 Vue 應用中，還是使用 Vue 來構建和分發自定義元素都很方便。

## 在 Vue 中使用自定義元素 {#using-custom-elements-in-vue}

Vue [在 Custom Elements Everywhere 測試中取得了 100% 的成績](https://custom-elements-everywhere.com/libraries/vue/results/results.html)。在 Vue 應用中使用自定義元素基本上與使用原生 HTML 元素的效果相同，但需要留意以下幾點：

### 跳過組件解析 {#skipping-component-resolution}

默認情況下，Vue 會將任何非原生的 HTML 標籤優先當作 Vue 組件處理，而將“渲染一個自定義元素”作為後備選項。這會在開發時導致 Vue 拋出一個“解析組件失敗”的警告。要讓 Vue 知曉特定元素應該被視為自定義元素並跳過組件解析，我們可以指定 [`compilerOptions.isCustomElement` 這個選項](/api/application#app-config-compileroptions)。

如果在開發 Vue 應用時進行了構建配置，則應該在構建配置中傳遞該選項，因為它是一個編譯時選項。

#### 瀏覽器內編譯時的示例配置 {#example-in-browser-config}

```js
// 僅在瀏覽器內編譯時才會工作
// 如果使用了構建工具，請看下面的配置示例
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Vite 示例配置 {#example-vite-config}

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 將所有帶短橫線的標籤名都視為自定義元素
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Vue CLI 示例配置 {#example-vue-cli-config}

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // 將所有以 ion- 開頭的標籤都視為自定義元素
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### 傳遞 DOM 屬性 {#passing-dom-properties}

由於 DOM attribute 只能為字符串值，因此我們只能使用 DOM 對象的屬性來傳遞複雜數據。當為自定義元素設置 props 時，Vue 3 將通過 `in` 操作符自動檢查該屬性是否已經存在於 DOM 對象上，並且在這個 key 存在時，更傾向於將值設置為一個 DOM 對象的屬性。這意味著，在大多數情況下，如果自定義元素遵循[推薦的最佳實踐](https://web.dev/custom-elements-best-practices/)，你就不需要考慮這個問題。

然而，也會有一些特別的情況：必須將數據以一個 DOM 對象屬性的方式傳遞，但該自定義元素無法正確地定義/反射這個屬性 (因為 `in` 檢查失敗)。在這種情況下，你可以強制使用一個 `v-bind` 綁定、通過 `.prop` 修飾符來設置該 DOM 對象的屬性：

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- 等價簡寫 -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## 使用 Vue 構建自定義元素 {#building-custom-elements-with-vue}

自定義元素的主要好處是，它們可以在使用任何框架，甚至是在不使用框架的場景下使用。當你面向的最終用戶可能使用了不同的前端技術棧，或是當你希望將最終的應用與它使用的組件實現細節解耦時，它們會是理想的選擇。

### defineCustomElement {#definecustomelement}

Vue 提供了一個和定義一般 Vue 組件幾乎完全一致的 [`defineCustomElement`](/api/general#definecustomelement) 方法來支持創建自定義元素。這個方法接收的參數和 [`defineComponent`](/api/general#definecomponent) 完全相同。但它會返回一個繼承自 `HTMLElement` 的自定義元素構造器：

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 這裡是與正常用法相同的 Vue 組件選項
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement 特有的：注入到 shadow root 的 CSS
  styles: [`/* inlined css */`]
})

// 註冊自定義元素
// 註冊之後，所有此頁面中的 `<my-vue-element>` 標籤
// 都會被提升
customElements.define('my-vue-element', MyVueElement)

// 你也可以編程式地實例化元素：
// （必須在註冊之後）
document.body.appendChild(
  new MyVueElement({
    // 初始化 props（可選）
  })
)
```

#### 生命週期 {#lifecycle}

- 當該元素的 [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) 初次調用時，一個 Vue 自定義元素會在內部掛載一個 Vue 組件實例到它的 shadow root 上。

- 當此元素的 `disconnectedCallback` 被調用時，Vue 會在一個微任務後檢查元素是否還留在文檔中。

  - 如果元素仍然在文檔中，說明它是一次移動操作，組件實例將被保留；

  - 如果該元素不再存在於文檔中，說明這是一次移除操作，組件實例將被銷毀。

#### Props {#props}

- 所有使用 `props` 選項聲明了的 props 都會作為屬性定義在該自定義元素上。Vue 會自動地、恰當地處理其作為 attribute 還是屬性的反射。

  - attribute 總是根據需要反射為相應的屬性類型。

  - 基礎類型的屬性值 (`string`，`boolean` 或 `number`) 會被反射為 attribute。

- 當它們被設為 attribute 時 (永遠是字符串)，Vue 也會自動將以 `Boolean` 或 `Number` 類型聲明的 prop 轉換為所期望的類型。例如下面這樣的 props 聲明：

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  並以下面這樣的方式使用自定義元素：

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  在組件中，`selected` 會被轉換為 `true` (boolean 類型值) 而 `index` 會被轉換為 `1` (number 類型值)。

#### 事件 {#events}

通過 `this.$emit` 或者 setup 中的 `emit` 觸發的事件都會通過以 [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) 的形式從自定義元素上派發。額外的事件參數 (payload) 將會被暴露為 CustomEvent 對象上的一個 `detail` 數組。

#### 插槽 {#slots}

在一個組件中，插槽將會照常使用 `<slot/>` 渲染。然而，當使用最終的元素時，它只接受[原生插槽的語法](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots)：

- 不支持[作用域插槽](/guide/components/slots#scoped-slots)。

- 當傳遞具名插槽時，應使用 `slot` attribute 而不是 `v-slot` 指令：

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### 依賴注入 {#provide-inject}

[Provide / Inject API](/guide/components/provide-inject#provide-inject) 和[相應的組合式 API](/api/composition-api-dependency-injection#provide) 在 Vue 定義的自定義元素中都可以正常工作。但是請注意，依賴關係**只在自定義元素之間**起作用。例如一個 Vue 定義的自定義元素就無法注入一個由常規 Vue 組件所提供的屬性。

### 將 SFC 編譯為自定義元素 {#sfc-as-custom-element}

`defineCustomElement` 也可以搭配 Vue 單文件組件 (SFC) 使用。但是，根據默認的工具鏈配置，SFC 中的 `<style>` 在生產環境構建時仍然會被抽取和合併到一個單獨的 CSS 文件中。當正在使用 SFC 編寫自定義元素時，通常需要改為注入 `<style>` 標籤到自定義元素的 shadow root 上。

官方的 SFC 工具鏈支持以“自定義元素模式”導入 SFC (需要 `@vitejs/plugin-vue@^1.4.0` 或 `vue-loader@^16.5.0`)。一個以自定義元素模式加載的 SFC 將會內聯其 `<style>` 標籤為 CSS 字符串，並將其暴露為組件的 `styles` 選項。這會被 `defineCustomElement` 提取使用，並在初始化時注入到元素的 shadow root 上。

要開啟這個模式，只需要將你的組件文件以 `.ce.vue` 結尾即可：

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* 內聯 css */"]

// 轉換為自定義元素構造器
const ExampleElement = defineCustomElement(Example)

// 註冊
customElements.define('my-example', ExampleElement)
```

如果你想要自定義如何判斷是否將文件作為自定義元素導入 (例如將所有的 SFC 都視為用作自定義元素)，你可以通過給構建插件傳遞相應插件的 `customElement` 選項來實現：

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### 基於 Vue 構建自定義元素庫 {#tips-for-a-vue-custom-elements-library}

當使用 Vue 構建自定義元素時，該元素將依賴於 Vue 的運行時。這會有大約 16kb 的基本打包大小，並視功能的使用情況而增長。這意味著如果只編寫一個自定義元素，那麼使用 Vue 並不是理想的選擇。你可能想要使用原生 JavaScript、[petite-vue](https://github.com/vuejs/petite-vue)，或其他框架以追求更小的運行時體積。但是，如果你需要編寫的是一組具有複雜邏輯的自定義元素，那麼這個基本體積是非常合理的，因為 Vue 允許用更少的代碼編寫每個組件。在一起發佈的元素越多，收益就會越高。

如果自定義元素將在同樣使用 Vue 的應用中使用，那麼你可以選擇將構建包中的 Vue 外部化 (externalize)，這樣這些自定義元素將與宿主應用使用同一份 Vue。

建議按元素分別導出構造函數，以便用戶可以靈活地按需導入它們，並使用期望的標籤名稱註冊它們。你還可以導出一個函數來方便用戶自動註冊所有元素。下面是一個 Vue 自定義元素庫的入口文件示例：

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// 分別導出元素
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

如果你有非常多的組件，你也可以利用構建工具的功能，例如 Vite 的 [glob 導入](https://cn.vitejs.dev/guide/features.html#glob-import)或者 webpack 的 [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext) 來從一個文件夾加載所有的組件。

### Web Components 和 TypeScript {#web-components-and-typescript}

如果你正在開發一個應用或者庫，你可能想要為你的 Vue 組件添加[類型檢查](/guide/scaling-up/tooling.html#typescript)，包括那些被定義為自定義元素的組件。

自定義元素是使用原生 API 全局註冊的，所以默認情況下，當在 Vue 模板中使用時，它們不會有類型推斷。為了給註冊為自定義元素的 Vue 組件提供類型支持，我們可以通過 Vue 模板和/或 [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) 中的 [`GlobalComponents` 接口](https://github.com/vuejs/language-tools/blob/master/packages/vscode-vue/README.md#usage)來註冊全局組件的類型：

```typescript
import { defineCustomElement } from 'vue'

// vue 單文件組件
import CounterSFC from './src/components/counter.ce.vue'

// 將組件轉換為 web components
export const Counter = defineCustomElement(CounterSFC)

// 註冊全局類型
declare module 'vue' {
  export interface GlobalComponents {
    'Counter': typeof Counter,
  }
}
```

## Web Components vs. Vue Components {#web-components-vs-vue-components}

一些開發者認為應該避免使用框架專有的組件模型，而改為全部使用自定義元素來構建應用，因為這樣可以使應用“永不過時”。在這裡，我們將解釋為什麼我們認為這樣的想法過於簡單。

自定義元素和 Vue 組件之間確實存在一定程度的功能重疊：它們都允許我們定義具有數據傳遞、事件發射和生命週期管理的可重用組件。然而，Web Components 的 API 相對來說是更底層的和更基礎的。要構建一個實際的應用，我們需要相當多平台沒有涵蓋的附加功能：

- 一個聲明式的、高效的模板系統；

- 一個響應式的，利於跨組件邏輯提取和重用的狀態管理系統；

- 一種在服務器上呈現組件並在客戶端“激活”(hydrate) 組件的高性能方法 (SSR)，這對 SEO 和 [LCP 這樣的 Web 關鍵指標](https://web.dev/vitals/)非常重要。原生自定義元素 SSR 通常需要在 Node.js 中模擬 DOM，然後序列化更改後的 DOM，而 Vue SSR 則儘可能地將其編譯為拼接起來的字符串，這會高效得多。

Vue 的組件模型在設計時同時兼顧了這些需求，因此是一個更內聚的系統。

當你的團隊有足夠的技術水平時，可能可以在原生自定義元素的基礎上構建具備同等功能的組件。但這也意味著你將承擔長期維護內部框架的負擔，同時失去了像 Vue 這樣成熟的框架生態社區所帶來的收益。

也有一些框架使用自定義元素作為其組件模型的基礎，但它們都不可避免地要引入自己的專有解決方案來解決上面列出的問題。選擇使用這些框架便需要接受他們它們針對這些問題的技術決策承擔相應的後果。不管這類框架怎麼宣傳它們“永不過時”，它們其實都無法保證你以後永遠不需要重構。

除此之外，我們還發現自定義元素存在以下限制：

- 貪婪 (eager) 的插槽求值會阻礙組件之間的可組合性。Vue 的[作用域插槽](/guide/components/slots#scoped-slots)是一套強大的組件組合機制，而由於原生插槽的貪婪求值性質，自定義元素無法支持這樣的設計。貪婪求值的插槽也意味著接收組件時不能控制何時或是否創建插槽內容的節點。

- 在當下要想使用 shadow DOM 書寫局部作用域的 CSS，必須將樣式嵌入到 JavaScript 中才可以在運行時將其注入到 shadow root 上。這也導致了 SSR 場景下需要渲染大量重複的樣式標籤。雖然有一些[平台功能](https://github.com/whatwg/html/pull/4898/)在嘗試解決這一領域的問題，但是直到現在還沒有達到通用支持的狀態，而且仍有生產性能 / SSR 方面的問題需要解決。可與此同時，Vue 的 SFC 本身就提供了 [CSS 局域化機制](/api/sfc-css-features)，並支持抽取樣式到純 CSS 文件中。

Vue 將始終緊貼 Web 平台的最新標準，如果平台的新功能能讓我們的工作變得更簡單，我們將非常樂於利用它們。但是，我們的目標是提供“好用，且現在就能用”的解決方案。這意味著我們在採用新的原生功能時需要保持客觀、批判性的態度，並在原生功能完成度不足的時候選擇更適當的解決方案。
