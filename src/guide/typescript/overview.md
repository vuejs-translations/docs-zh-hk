---
outline: deep
---

# 搭配 TypeScript 使用 Vue {#using-vue-with-typescript}

像 TypeScript 這樣的類型系統可以在編譯時通過靜態分析檢測出很多常見錯誤。這減少了生產環境中的運行時錯誤，也讓我們在重構大型項目的時候更有信心。通過 IDE 中基於類型的自動補全，TypeScript 還改善了開發體驗和效率。

Vue 本身就是用 TypeScript 編寫的，並對 TypeScript 提供了良好的支持。所有的 Vue 官方庫都自帶了類型聲明文件，開箱即用。

## 項目配置 {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue)，即官方的項目腳手架工具，提供了搭建基於 [Vite](https://cn.vitejs.dev/) 且 TypeScript 就緒的 Vue 項目的選項。

### 總覽 {#overview}

在基於 Vite 的配置中，開發服務器和打包器將只會對 TypeScript 文件執行語法轉譯，而不會執行任何類型檢查，這保證了 Vite 開發服務器在使用 TypeScript 時也能始終保持飛快的速度。

- 在開發階段，我們推薦你依賴一個好的 [IDE 配置](#ide-support)來獲取即時的類型錯誤反饋。

- 對於單文件組件，你可以使用工具 [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) 在命令行檢查類型和生成類型聲明文件。`vue-tsc` 是對 TypeScript 自身命令行界面 `tsc` 的一個封裝。它的工作方式基本和 `tsc` 一致。除了 TypeScript 文件，它還支持 Vue 的單文件組件。你可以在開啟 Vite 開發服務器的同時以偵聽模式運行 `vue-tsc`，或是使用 [vite-plugin-checker](https://vite-plugin-checker.netlify.app/) 這樣在另一個 worker 線程裡做靜態檢查的插件。

- Vue CLI 也提供了對 TypeScript 的支持，但是已經不推薦了。詳見[下方的說明](#note-on-vue-cli-and-ts-loader)。

### IDE 支持 {#ide-support}

- 強烈推薦 [Visual Studio Code](https://code.visualstudio.com/) (VSCode)，因為它對 TypeScript 有著很好的內置支持。

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (之前是 Volar) 是官方的 VSCode 擴展，提供了 Vue 單文件組件中的 TypeScript 支持，還伴隨著一些其他非常棒的特性。

    :::tip
    Vue - Official 擴展取代了我們之前為 Vue 2 提供的官方 VSCode 擴展 [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)。如果你之前已經安裝了 Vetur，請確保在 Vue 3 的項目中禁用它。
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) 對 TypeScript 和 Vue 也都提供了開箱即用的支持。其他的 JetBrains IDE 也同樣可以通過一個[免費插件](https://plugins.jetbrains.com/plugin/9442-vue-js)支持。從 2023.2 版開始，WebStorm 和 Vue 插件內置了對 Vue 語言服務器的支持。你可以在設置 > 語言和框架 > TypeScript > Vue 下將 Vue 服務設置為在所有 TypeScript 版本上使用 Volar 集成。默認情況下，Volar 將用於 TypeScript 5.0 及更高版本。

### 配置 `tsconfig.json` {#configuring-tsconfig-json}

通過 `create-vue` 搭建的項目包含了預先配置好的 `tsconfig.json`。其底層配置抽象於 [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) 包中。在項目內我們使用 [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) 來確保運行在不同環境下的代碼的類型正確 (例如應用代碼和測試代碼應該有不同的全局變量)。

手動配置 `tsconfig.json` 時，請留意以下選項：

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) 應當設置為 `true`，因為 Vite 使用 [esbuild](https://esbuild.github.io/) 來轉譯 TypeScript，並受限於單文件轉譯的限制。[`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) 是 [`isolatedModules` 的一個超集](https://github.com/microsoft/TypeScript/issues/53601)且也是一個不錯的選擇——它正是 [`@vue/tsconfig`](https://github.com/vuejs/tsconfig) 所使用的。

- 如果你正在使用選項式 API，需要將 [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) 設置為 `true` (或者至少開啟 [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis)，它是 `strict` 模式的一部分)，才可以獲得對組件選項中 `this` 的類型檢查。否則 `this` 會被認為是 `any`。

- 如果你在構建工具中配置了路徑解析別名，例如 `@/*` 這個別名被默認配置在了 `create-vue` 項目中，你需要通過 [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) 選項為 TypeScript 再配置一遍。

- 如果你打算在 Vue 中使用 TSX，請將 [`compilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) 設置為 `"preserve"`，並將 [`compilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) 設置為 `"vue"`。

參考：

- [官方 TypeScript 編譯選項文檔](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [esbuild TypeScript 編譯註意事項](https://esbuild.github.io/content-types/#typescript-caveats)

### 關於 Vue CLI 和 `ts-loader` {#note-on-vue-cli-and-ts-loader}

像 Vue CLI 這樣的基於 webpack 搭建的項目，通常是在模塊編譯的過程中順便執行類型檢查，例如使用 `ts-loader`。然而這並不是一個理想的解決方案，因為類型系統需要了解整個模塊關係才能執行類型檢查。loader 中只適合單個模塊的編譯，並不適合做需要全局信息的工作。這導致了下面的問題：

- `ts-loader` 只能對在它之前的 loader 編譯轉換後的代碼執行類型檢查，這和我們在 IDE 或 `vue-tsc` 中看到的基於源代碼的錯誤提示並不一致。

- 類型檢查可能會很慢。當它和代碼轉換在相同的線程/進程中執行時，它會顯著影響整個應用的構建速度。

- 我們已經在 IDE 中通過單獨的進程運行著類型檢查了，卻還要在構建流程中執行類型檢查導致降低開發體驗，這似乎不太合理。

如果你正通過 Vue CLI 使用 Vue 3 和 TypeScript，我們強烈建議你遷移到 Vite。我們也在為 CLI 開發僅執行 TS 語法轉譯的選項，以允許你切換至 `vue-tsc` 來執行類型檢查。

## 常見使用說明 {#general-usage-notes}

### `defineComponent()` {#definecomponent}

為了讓 TypeScript 正確地推導出組件選項內的類型，我們需要通過 [`defineComponent()`](/api/general#definecomponent) 這個全局 API 來定義組件：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 啟用了類型推導
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // 類型：string | undefined
    this.msg // 類型：string
    this.count // 類型：number
  }
})
```

當沒有結合 `<script setup>` 使用組合式 API 時，`defineComponent()` 也支持對傳遞給 `setup()` 的 prop 的推導：

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // 啟用了類型推導
  props: {
    message: String
  },
  setup(props) {
    props.message // 類型：string | undefined
  }
})
```

參考：

- [webpack Treeshaking 的注意事項](/api/general#note-on-webpack-treeshaking)
- [對 `defineComponent` 的類型測試](https://github.com/vuejs/core/blob/main/packages/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` 也支持對原生 JavaScript 編寫的組件進行類型推導。
:::

### 在單文件組件中的用法 {#usage-in-single-file-components}

要在單文件組件中使用 TypeScript，需要在 `<script>` 標籤上加上 `lang="ts"` 的屬性。當 `lang="ts"` 存在時，所有的模板內表達式都將受到更嚴格的類型檢查。

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- 啟用了類型檢查和自動補全 -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` 也可以用於 `<script setup>`：

```vue
<script setup lang="ts">
// 啟用了 TypeScript
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- 啟用了類型檢查和自動補全 -->
  {{ count.toFixed(2) }}
</template>
```

### 模板中的 TypeScript {#typescript-in-templates}

在使用了 `<script lang="ts">` 或 `<script setup lang="ts">` 後，`<template>` 在綁定表達式中也支持 TypeScript。這對需要在模板表達式中執行類型轉換的情況下非常有用。

這裡有一個假想的例子：

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- 出錯，因為 x 可能是字符串 -->
  {{ x.toFixed(2) }}
</template>
```

可以使用內聯類型強制轉換解決此問題：

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
如果正在使用 Vue CLI 或基於 webpack 的配置，支持模板內表達式的 TypeScript 需要 `vue-loader@^16.8.0`。
:::

### 使用 TSX {#usage-with-tsx}

Vue 也支持使用 JSX / TSX 編寫組件。詳情請查閱[渲染函數 & JSX](/guide/extras/render-function.html#jsx-tsx)。

## 泛型組件 {#generic-components}

泛型組件支持兩種使用方式：

- 在單文件組件中：[在 `<script setup>` 上使用 `generic` 屬性](/api/sfc-script-setup.html#generics)
- 渲染函數 / JSX 組件：[`defineComponent()` 的函數簽名](/api/general.html#function-signature)

## 特定 API 的使用指南 {#api-specific-recipes}

- [TS 與組合式 API](./composition-api)
- [TS 與選項式 API](./options-api)
