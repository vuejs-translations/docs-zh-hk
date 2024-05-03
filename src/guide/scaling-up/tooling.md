<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# 工具鏈 {#tooling}

## 在線嘗試 {#try-it-online}

你不需要在機器上安裝任何東西，也可以嘗試基於單文件組件的 Vue 開發體驗。我們提供了一個在線的演練場，可以在瀏覽器中訪問：

- [Vue SFC 演練場](https://play.vuejs.org)
  - 自動隨著 Vue 倉庫最新的提交更新
  - 支持檢查編譯輸出的結果
- [StackBlitz 中的 Vue + Vite](https://vite.new/vue)
  - 類似 IDE 的環境，但實際是在瀏覽器中運行 Vite 開發服務器
  - 和本地開發效果更接近

在報告 Bug 時，我們也建議使用這些在線演練場來提供最小化重現。

## 項目腳手架 {#project-scaffolding}

### Vite {#vite}

[Vite](https://cn.vitejs.dev/) 是一個輕量級的、速度極快的構建工具，對 Vue SFC 提供第一優先級支持。作者是尤雨溪，同時也是 Vue 的作者！

要使用 Vite 來創建一個 Vue 項目，非常簡單：

<VTCodeGroup>
  <VTCodeGroupTab label="npm">

  ```sh
  $ npm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="pnpm">
  
  ```sh
  $ pnpm create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="yarn">
  
  ```sh
  $ yarn create vue@latest
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="bun">
  
  ```sh
  $ bun create vue@latest
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

這個命令會安裝和執行 [create-vue](https://github.com/vuejs/create-vue)，它是 Vue 提供的官方腳手架工具。跟隨命令行的提示繼續操作即可。

- 要學習更多關於 Vite 的知識，請查看 [Vite 官方文檔](https://cn.vitejs.dev)。
- 若要了解如何為一個 Vite 項目配置 Vue 相關的特殊行為，例如向 Vue 編譯器傳遞相關選項，請查看 [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme) 的文檔。

上面提到的兩種在線演練場也支持將文件作為一個 Vite 項目下載。

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/zh/) 是官方提供的基於 Webpack 的 Vue 工具鏈，它現在處於維護模式。我們建議使用 Vite 開始新的項目，除非你依賴特定的 Webpack 的特性。在大多數情況下，Vite 將提供更優秀的開發體驗。

關於從 Vue CLI 遷移到 Vite 的資源：

- [VueSchool.io 的 Vue CLI -> Vite 遷移指南](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [遷移支持工具 / 插件](https://github.com/vitejs/awesome-vite#vue-cli)

### 瀏覽器內模板編譯註意事項 {#note-on-in-browser-template-compilation}

當以無構建步驟方式使用 Vue 時，組件模板要麼是寫在頁面的 HTML 中，要麼是內聯的 JavaScript 字符串。在這些場景中，為了執行動態模板編譯，Vue 需要將模板編譯器運行在瀏覽器中。相對的，如果我們使用了構建步驟，由於提前編譯了模板，那麼就無須再在瀏覽器中運行了。為了減小打包出的客戶端代碼體積，Vue 提供了[多種格式的“構建文件”](https://unpkg.com/browse/vue@3/dist/)以適配不同場景下的優化需求。

- 前綴為 `vue.runtime.*` 的文件是**只包含運行時的版本**：不包含編譯器，當使用這個版本時，所有的模板都必須由構建步驟預先編譯。

- 名稱中不包含 `.runtime` 的文件則是**完全版**：即包含了編譯器，並支持在瀏覽器中直接編譯模板。然而，體積也會因此增長大約 14kb。

默認的工具鏈中都會使用僅含運行時的版本，因為所有 SFC 中的模板都已經被預編譯了。如果因為某些原因，在有構建步驟時，你仍需要瀏覽器內的模板編譯，你可以更改構建工具配置，將 `vue` 改為相應的版本 `vue/dist/vue.esm-bundler.js`。

如果你需要一種更輕量級，不依賴構建步驟的替代方案，也可以看看 [petite-vue](https://github.com/vuejs/petite-vue)。

## IDE 支持 {#ide-support}

- 推薦使用的 IDE 是 [VS Code](https://code.visualstudio.com/)，配合 [Vue - Official 擴展](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (之前是 Volar)。該插件提供了語法高亮、TypeScript 支持，以及模板內表達式與組件 props 的智能提示。

  :::tip
  Vue - Official replaces [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), our previous official VS Code extension for Vue 2. If you have Vetur currently installed, make sure to disable it in Vue 3 projects.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) 同樣也為 Vue 的單文件組件提供了很好的內置支持。

- 其他支持[語言服務協議](https://microsoft.github.io/language-server-protocol/) (LSP) 的 IDE 也可以通過 LSP 享受到 Volar 所提供的核心功能：

  - Sublime Text 通過 [LSP-Volar](https://github.com/sublimelsp/LSP-volar) 支持。

  - vim / Neovim 通過 [coc-volar](https://github.com/yaegassy/coc-volar) 支持。

  - emacs 通過 [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/) 支持。

## 瀏覽器開發者插件 {#browser-devtools}

<VueSchoolLink href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3" title="免費的 Vue.js Devtools 課程"/>

Vue 的瀏覽器開發者插件使我們可以瀏覽一個 Vue 應用的組件樹，查看各個組件的狀態，追蹤狀態管理的事件，還可以進行組件性能分析。

![devtools 截圖](https://raw.githubusercontent.com/vuejs/devtools/main/media/screenshot-shadow.png)

- [文檔](https://devtools.vuejs.org/)
- [Chrome 擴展商店頁](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Firefox 所屬插件頁](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [Edge 擴展](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)
- [獨立的 Electron 應用所屬插件](https://devtools.vuejs.org/guide/installation.html#standalone)

## TypeScript {#typescript}

具體細節請參考章節：[配合 TypeScript 使用 Vue](/guide/typescript/overview)。

- [Vue - Official 擴展](https://github.com/vuejs/language-tools)能夠為 `<script lang="ts">` 塊提供類型檢查，也能對模板內表達式和組件之間 props 提供自動補全和類型檢查。

- 使用 [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) 可以在命令行中執行相同的類型檢查，通常用來生成單文件組件的 `d.ts` 文件。

## 測試 {#testing}

具體細節請參考章節：[測試指南](/guide/scaling-up/testing)。

- [Cypress](https://www.cypress.io/) 推薦用於 E2E 測試。也可以通過 [Cypress 組件測試運行器](https://docs.cypress.io/guides/component-testing/introduction)來給 Vue SFC 作單文件組件測試。

- [Vitest](https://vitest.dev/) 是一個追求更快運行速度的測試運行器，由 Vue / Vite 團隊成員開發。主要針對基於 Vite 的應用設計，可以為組件提供即時響應的測試反饋。

- [Jest](https://jestjs.io/) 可以通過 [vite-jest](https://github.com/sodatea/vite-jest) 配合 Vite 使用。不過只推薦在你已經有一套基於 Jest 的測試集、且想要遷移到基於 Vite 的開發配置時使用，因為 Vitest 也能夠提供類似的功能，且後者與 Vite 的集成更方便高效。

## 代碼規範 {#linting}

Vue 團隊維護著 [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) 項目，它是一個 [ESLint](https://eslint.org/) 插件，會提供 SFC 相關規則的定義。

之前使用 Vue CLI 的用戶可能習慣於通過 webpack loader 來配置規範檢查器。然而，若基於 Vite 構建，我們一般推薦：

1. `npm install -D eslint eslint-plugin-vue`，然後遵照 `eslint-plugin-vue` 的[指引](https://eslint.vuejs.org/user-guide/#usage)進行配置。

2. 啟用 ESLint IDE 插件，例如 [ESLint for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)，然後你就可以在開發時獲得規範檢查器的反饋。這同時也避免了啟動開發服務器時不必要的規範檢查。

3. 將 ESLint 格式檢查作為一個生產構建的步驟，保證你可以在最終打包時獲得完整的規範檢查反饋。

4. (可選) 啟用類似 [lint-staged](https://github.com/okonet/lint-staged) 一類的工具在 git commit 提交時自動執行規範檢查。

## 格式化 {#formatting}

- [Vue - Official](https://github.com/vuejs/language-tools) VS Code 插件為 Vue SFC 提供了開箱即用的格式化功能。

- 除此之外，[Prettier](https://prettier.io/) 也提供了內置的 Vue SFC 格式化支持。

## SFC 自定義塊集成 {#sfc-custom-block-integrations}

自定義塊被編譯成導入到同一 Vue 文件的不同請求查詢。這取決於底層構建工具如何處理這類導入請求。

- 如果使用 Vite，需使用一個自定義 Vite 插件將自定義塊轉換為可執行的 JavaScript 代碼。[示例](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)。

- 如果使用 Vue CLI 或只是 webpack，需要使用一個 loader 來配置如何轉換匹配到的自定義塊。[示例](https://vue-loader.vuejs.org/zh/guide/custom-blocks.html)。

## 底層庫 {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [文檔](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

這個包是 Vue 核心 monorepo 的一部分，並始終和 `vue` 主包版本號保持一致。它已經成為 `vue` 主包的一個依賴並代理到了 `vue/compiler-sfc` 目錄下，因此你無需單獨安裝它。

這個包本身提供了處理 Vue SFC 的底層的功能，並只適用於需要支持 Vue SFC 相關工具鏈的開發者。

:::tip
請始終選擇通過 `vue/compiler-sfc` 的深度導入來使用這個包，因為這樣可以確保其與 Vue 運行時版本同步。<!-- TODO: need check -->
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [文檔](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

為 Vite 提供 Vue SFC 支持的官方插件。

### `vue-loader` {#vue-loader}

- [文檔](https://vue-loader.vuejs.org/zh/)

為 webpack 提供 Vue SFC 支持的官方 loader。如果你正在使用 Vue CLI，也可以看看[如何在 Vue CLI 中更改 `vue-loader` 選項的文檔](https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9)。

## 其他在線演練場 {#other-online-playgrounds}

- [VueUse Playground](https://play.vueuse.org)
- [Vue + Vite on Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue on CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue on Codepen](https://codepen.io/pen/editor/vue)
- [Vue on Components.studio](https://components.studio/create/vue3)
- [Vue on WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->
