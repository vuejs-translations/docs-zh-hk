# 插件 {#plugins}

## 介紹 {#introduction}

插件 (Plugins) 是一種能為 Vue 添加全局功能的工具代碼。下面是如何安裝一個插件的示例：

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* 可選的選項 */
})
```

一個插件可以是一個擁有 `install()` 方法的對象，也可以直接是一個安裝函數本身。安裝函數會接收到安裝它的[應用實例](/api/application)和傳遞給 `app.use()` 的額外選項作為參數：

```js
const myPlugin = {
  install(app, options) {
    // 配置此應用
  }
}
```

插件沒有嚴格定義的使用範圍，但是插件發揮作用的常見場景主要包括以下幾種：

1. 通過 [`app.component()`](/api/application#app-component) 和 [`app.directive()`](/api/application#app-directive) 註冊一到多個全局組件或自定義指令。

2. 通過 [`app.provide()`](/api/application#app-provide) 使一個資源[可被注入](/guide/components/provide-inject)進整個應用。

3. 向 [`app.config.globalProperties`](/api/application#app-config-globalproperties) 中添加一些全局實例屬性或方法

4. 一個可能上述三種都包含了的功能庫 (例如 [vue-router](https://github.com/vuejs/vue-router-next))。

## 編寫一個插件 {#writing-a-plugin}

為了更好地理解如何構建 Vue.js 插件，我們可以試著寫一個簡單的 `i18n` ([國際化 (Internationalization)](https://en.wikipedia.org/wiki/Internationalization_and_localization) 的縮寫) 插件。

讓我們從設置插件對象開始。建議在一個單獨的文件中創建並導出它，以保證更好地管理邏輯，如下所示：

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // 在這裡編寫插件代碼
  }
}
```

我們希望有一個翻譯函數，這個函數接收一個以 `.` 作為分隔符的 `key` 字符串，用來在用戶提供的翻譯字典中查找對應語言的文本。期望的使用方式如下：

```vue-html
<h1>{{ $translate('greetings.hello') }}</h1>
```

這個函數應當能夠在任意模板中被全局調用。這一點可以通過在插件中將它添加到 `app.config.globalProperties` 上來實現：

```js{4-11}
// plugins/i18n.js
export default {
  install: (app, options) => {
    // 注入一個全局可用的 $translate() 方法
    app.config.globalProperties.$translate = (key) => {
      // 獲取 `options` 對象的深層屬性
      // 使用 `key` 作為索引
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options)
    }
  }
}
```

我們的 `$translate` 函數會接收一個例如 `greetings.hello` 的字符串，在用戶提供的翻譯字典中查找，並返回翻譯得到的值。

用於查找的翻譯字典對象則應當在插件被安裝時作為 `app.use()` 的額外參數被傳入：

```js
import i18nPlugin from './plugins/i18n'

app.use(i18nPlugin, {
  greetings: {
    hello: 'Bonjour!'
  }
})
```

這樣，我們一開始的表達式 `$translate('greetings.hello')` 就會在運行時被替換為 `Bonjour!` 了。

TypeScript 用戶請參考：[擴展全局屬性](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

:::tip
請謹慎使用全局屬性，如果在整個應用中使用不同插件注入的太多全局屬性，很容易讓應用變得難以理解和維護。
:::

### 插件中的 Provide / Inject {#provide-inject-with-plugins}

在插件中，我們可以通過 `provide` 來為插件用戶供給一些內容。舉例來說，我們可以將插件接收到的 `options` 參數提供給整個應用，讓任何組件都能使用這個翻譯字典對象。

```js{10}
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.provide('i18n', options)
  }
}
```

現在，插件用戶就可以在他們的組件中以 `i18n` 為 key 注入並訪問插件的選項對象了。

<div class="composition-api">

```vue
<script setup>
import { inject } from 'vue'

const i18n = inject('i18n')

console.log(i18n.greetings.hello)
</script>
```

</div>
<div class="options-api">

```js
export default {
  inject: ['i18n'],
  created() {
    console.log(this.i18n.greetings.hello)
  }
}
```

</div>
