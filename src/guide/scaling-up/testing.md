<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# 測試 {#testing}

## 為什麼需要測試 {#why-test}

自動化測試能夠預防無意引入的 bug，並鼓勵開發者將應用分解為可測試、可維護的函數、模塊、類和組件。這能夠幫助你和你的團隊更快速、自信地構建複雜的 Vue 應用。與任何應用一樣，新的 Vue 應用可能會以多種方式崩潰，因此，在發佈前發現並解決這些問題就變得十分重要。

在本篇指引中，我們將介紹一些基本術語，並就你的 Vue 3 應用應選擇哪些工具提供一些建議。

還有一個特定用於 Vue 的小節，介紹了組合式函數的測試，詳情請參閱[測試組合式函數](#testing-composables)。

## 何時測試 {#when-to-test}

越早越好！我們建議你儘快開始編寫測試。拖得越久，應用就會有越多的依賴和複雜性，想要開始添加測試也就越困難。

## 測試的類型 {#testing-types}

當設計你的 Vue 應用的測試策略時，你應該利用以下幾種測試類型：

- **單元測試**：檢查給定函數、類或組合式函數的輸入是否產生預期的輸出或副作用。
- **組件測試**：檢查你的組件是否正常掛載和渲染、是否可以與之互動，以及表現是否符合預期。這些測試比單元測試導入了更多的代碼，更復雜，需要更多時間來執行。
- **端到端測試**：檢查跨越多個頁面的功能，並對生產構建的 Vue 應用進行實際的網絡請求。這些測試通常涉及到建立一個數據庫或其他後端。

每種測試類型在你的應用的測試策略中都發揮著作用，保護你免受不同類型的問題的影響。

## 總覽 {#overview}

我們將簡要地討論這些測試是什麼，以及如何在 Vue 應用中實現它們，並提供一些普遍性建議。

## 單元測試 {#unit-testing}

編寫單元測試是為了驗證小的、獨立的代碼單元是否按預期工作。一個單元測試通常覆蓋一個單個函數、類、組合式函數或模塊。單元測試側重於邏輯上的正確性，只關注應用整體功能的一小部分。他們可能會模擬你的應用環境的很大一部分（如初始狀態、複雜的類、第三方模塊和網絡請求）。

一般來說，單元測試將捕獲函數的業務邏輯和邏輯正確性的問題。

以這個 `increment` 函數為例：

```js
// helpers.js
export function increment (current, max = 10) {
  if (current < max) {
    return current + 1
  }
  return current
}
```

因為它很獨立，可以很容易地調用 `increment` 函數並斷言它是否返回了所期望的內容，所以我們將編寫一個單元測試。

如果任何一條斷言失敗了，那麼問題一定是出在 `increment` 函數上。

```js{4-16}
// helpers.spec.js
import { increment } from './helpers'

describe('increment', () => {
  test('increments the current number by 1', () => {
    expect(increment(0, 10)).toBe(1)
  })

  test('does not increment the current number over the max', () => {
    expect(increment(10, 10)).toBe(10)
  })

  test('has a default max of 10', () => {
    expect(increment(10)).toBe(10)
  })
})
```

如前所述，單元測試通常適用於獨立的業務邏輯、組件、類、模塊或函數，並不涉及 UI 渲染、網絡請求或其他環境問題。

這些通常是與 Vue 無關的純 JavaScript/TypeScript 模塊。一般來說，在 Vue 應用中為業務邏輯編寫單元測試與使用其他框架的應用沒有明顯區別。

但有兩種情況，你必須對 Vue 的特定功能進行單元測試：

1. 組合式函數
2. 組件

### 組合式函數 {#composables}

有一類 Vue 應用中特有的函數被稱為 [組合式函數](/guide/reusability/composables)，在測試過程中可能需要特殊處理。
你可以跳轉到下方查看 [測試組合式函數](#testing-composables) 瞭解更多細節。

### 組件的單元測試 {#unit-testing-components}

一個組件可以通過兩種方式測試：

1. 白盒：單元測試

   白盒測試知曉一個組件的實現細節和依賴關係。它們更專注於將組件進行更 **獨立** 的測試。這些測試通常會涉及到模擬一些組件的部分子組件，以及設置插件的狀態和依賴性（例如 Pinia）。

2. 黑盒：組件測試

   黑盒測試不知曉一個組件的實現細節。這些測試儘可能少地模擬，以測試組件在整個系統中的集成情況。它們通常會渲染所有子組件，因而會被認為更像一種“集成測試”。請查看下方的[組件測試建議](#component-testing)作進一步瞭解。

### 推薦方案 {#recommendation}

- [Vitest](https://vitest.dev/)

  因為由 `create-vue` 創建的官方項目配置是基於 [Vite](https://cn.vitejs.dev/) 的，所以我們推薦你使用一個可以使用同一套 Vite 配置和轉換管道的單元測試框架。[Vitest](https://cn.vitest.dev/) 正是一個針對此目標設計的單元測試框架，它由 Vue / Vite 團隊成員開發和維護。在 Vite 的項目集成它會非常簡單，而且速度非常快。

### 其他選擇 {#other-options}

- [Jest](https://jestjs.io/) 是一個廣受歡迎的單元測試框架。不過，我們只推薦你在已有一套 Jest 測試配置、且需要遷移到基於 Vite 的項目時使用它，因為 Vitest 提供了更無縫的集成和更好的性能。

## 組件測試 {#component-testing}

在 Vue 應用中，主要用組件來構建用戶界面。因此，當驗證應用的行為時，組件是一個很自然的獨立單元。從粒度的角度來看，組件測試位於單元測試之上，可以被認為是集成測試的一種形式。你的 Vue 應用中大部分內容都應該由組件測試來覆蓋，我們建議每個 Vue 組件都應有自己的組件測試文件。

組件測試應該捕捉組件中的 prop、事件、提供的插槽、樣式、CSS class 名、生命週期鉤子，和其他相關的問題。

組件測試不應該模擬子組件，而應該像用戶一樣，通過與組件互動來測試組件和其子組件之間的交互。例如，組件測試應該像用戶那樣點擊一個元素，而不是編程式地與組件進行交互。

組件測試主要需要關心組件的公開接口而不是內部實現細節。對於大部分的組件來說，公開接口包括觸發的事件、prop 和插槽。當進行測試時，請記住，**測試這個組件做了什麼，而不是測試它是怎麼做到的**。

- **推薦的做法**

  - 對於 **視圖** 的測試：根據輸入 prop 和插槽斷言渲染輸出是否正確。
  - 對於 **交互** 的測試：斷言渲染的更新是否正確或觸發的事件是否正確地響應了用戶輸入事件。

  在下面的例子中，我們展示了一個步進器（Stepper）組件，它擁有一個標記為 `increment` 的可點擊的 DOM 元素。我們還傳入了一個名為 `max` 的 prop 防止步進器增長超過 `2`，因此如果我們點擊了按鈕 3 次，視圖將仍然顯示 `2`。

  我們不瞭解這個步進器的實現細節，只知道“輸入”是這個 `max` prop，“輸出”是這個組件狀態所呈現出的視圖。

<VTCodeGroup>
  <VTCodeGroupTab label="Vue Test Utils">

  ```js
  const valueSelector = '[data-testid=stepper-value]'
  const buttonSelector = '[data-testid=increment]'

  const wrapper = mount(Stepper, {
    props: {
      max: 1
    }
  })

  expect(wrapper.find(valueSelector).text()).toContain('0')

  await wrapper.find(buttonSelector).trigger('click')

  expect(wrapper.find(valueSelector).text()).toContain('1')
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="Cypress">

  ```js
  const valueSelector = '[data-testid=stepper-value]'
  const buttonSelector = '[data-testid=increment]'

  mount(Stepper, {
    props: {
      max: 1
    }
  })

  cy.get(valueSelector).should('be.visible').and('contain.text', '0')
    .get(buttonSelector).click()
    .get(valueSelector).should('contain.text', '1')
  ```

  </VTCodeGroupTab>
  <VTCodeGroupTab label="Testing Library">

  ```js
  const { getByText } = render(Stepper, {
    props: {
      max: 1
    }
  })

  getByText('0') // Implicit assertion that "0" is within the component

  const button = getByRole('button', { name: /increment/i })

  // Dispatch a click event to our increment button.
  await fireEvent.click(button)

  getByText('1')

  await fireEvent.click(button)
  ```

  </VTCodeGroupTab>
</VTCodeGroup>

- **應避免的做法**

  不要去斷言一個組件實例的私有狀態或測試一個組件的私有方法。測試實現細節會使測試代碼太脆弱，因為當實現發生變化時，它們更有可能失敗並需要更新重寫。

  組件的最終工作是渲染正確的 DOM 輸出，所以專注於 DOM 輸出的測試提供了足夠的正確性保證（如果你不需要更多其他方面測試的話），同時更加健壯、需要的改動更少。

  不要完全依賴快照測試。斷言 HTML 字符串並不能完全說明正確性。應當編寫有意圖的測試。

  如果一個方法需要測試，把它提取到一個獨立的實用函數中，併為它寫一個專門的單元測試。如果它不能被直截了當地抽離出來，那麼對它的調用應該作為交互測試的一部分。

### 推薦方案 {#recommendation-1}

- [Vitest](https://vitest.dev/) 對於組件和組合式函數都採用無頭渲染的方式 (例如 VueUse 中的 [`useFavicon`](https://vueuse.org/core/useFavicon/#usefavicon) 函數)。組件和 DOM 都可以通過 [@vue/test-utils](https://github.com/vuejs/test-utils) 來測試。

- [Cypress 組件測試](https://on.cypress.io/component) 會預期其準確地渲染樣式或者觸發原生 DOM 事件。它可以搭配 [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro) 這個庫一同進行測試。

Vitest 和基於瀏覽器的運行器之間的主要區別是速度和執行上下文。簡而言之，基於瀏覽器的運行器，如 Cypress，可以捕捉到基於 Node 的運行器（如 Vitest）所不能捕捉的問題（例如樣式問題、原生 DOM 事件、Cookies、本地存儲和網絡故障），但基於瀏覽器的運行器比 Vitest *慢幾個數量級*，因為它們要執行打開瀏覽器，編譯樣式表以及其他步驟。Cypress 是一個基於瀏覽器的運行器，支持組件測試。請閱讀 [Vitest 文檔的“比較”這一章](https://vitest.dev/guide/comparisons.html#cypress) 瞭解 Vitest 和 Cypress 最新的比較信息。

### 組件掛載庫 {#mounting-libraries}

組件測試通常涉及到單獨掛載被測試的組件，觸發模擬的用戶輸入事件，並對渲染的 DOM 輸出進行斷言。有一些專門的工具庫可以使這些任務變得更簡單。

- [`@vue/test-utils`](https://github.com/vuejs/test-utils) 是官方的底層組件測試庫，用來提供給用戶訪問 Vue 特有的 API。`@testing-library/vue` 也是基於此庫構建的。

- [`@testing-library/vue`](https://github.com/testing-library/vue-testing-library) 是一個專注於測試組件而不依賴於實現細節的 Vue 測試庫。它的指導原則是：測試越是類似於軟件的使用方式，它們就能提供越多的信心。

我們推薦在應用中使用 `@vue/test-utils` 測試組件。`@testing-library/vue` 在測試帶有 Suspense 的異步組件時存在問題，在使用時需要謹慎。

### 其他選擇 {#other-options-1}

- [Nightwatch](https://v2.nightwatchjs.org/) 是一個端到端測試運行器，支持 Vue 的組件測試。(Nightwatch v2 版本的 [示例項目](https://github.com/nightwatchjs-community/todo-vue))

- [WebdriverIO](https://webdriver.io/docs/component-testing/vue) 用於跨瀏覽器組件測試，該測試依賴於基於標準自動化的原生用戶交互。它也可以與測試庫一起使用。

## 端到端（E2E）測試 {#e2e-testing}

雖然單元測試為所寫的代碼提供了一定程度的驗證，但單元測試和組件測試在部署到生產時，對應用整體覆蓋的能力有限。因此，端到端測試針對的可以說是應用最重要的方面：當用戶實際使用你的應用時發生了什麼。

端到端測試的重點是多頁面的應用表現，針對你的應用在生產環境下進行網絡請求。他們通常需要建立一個數據庫或其他形式的後端，甚至可能針對一個預備上線的環境運行。

端到端測試通常會捕捉到路由、狀態管理庫、頂級組件（常見為 App 或 Layout）、公共資源或任何請求處理方面的問題。如上所述，它們可以捕捉到單元測試或組件測試無法捕捉的關鍵問題。

端到端測試不導入任何 Vue 應用的代碼，而是完全依靠在真實瀏覽器中瀏覽整個頁面來測試你的應用。

端到端測試驗證了你的應用中的許多層。可以在你的本地構建的應用中，甚至是一個預上線的環境中運行。針對預上線環境的測試不僅包括你的前端代碼和靜態服務器，還包括所有相關的後端服務和基礎設施。

> 你的測試越相似於你的軟件的使用方式，它們就越能值得你信賴。- [Kent C. Dodds](https://twitter.com/kentcdodds/status/977018512689455106) - Testing Library 的作者

通過測試用戶操作如何影響你的應用，端到端測試通常是提高應用能否正常運行的可信度的關鍵。

### 選擇一個端到端測試解決方案 {#choosing-an-e2e-testing-solution}

雖然因為不可靠且拖慢了開發過程，市面上對 Web 上的端到端測試的評價並不好，但現代端到端工具已經在創建更可靠、更有用和交互性更好的測試方面取得了很大進步。在選擇端到端測試框架時，以下小節會為你給應用選擇測試框架時需要注意的事項提供一些指導。

#### 跨瀏覽器測試 {#cross-browser-testing}

端到端測試的一個主要優點是你可以瞭解你的應用在多個不同瀏覽器上運行的情況。儘管理想情況應該是 100% 的跨瀏覽器覆蓋率，但很重要的一點是跨瀏覽器測試對團隊資源的回報是逐渐减小的，因為需要額外的時間和機器來持續運行它們。因此，在選擇應用所需的跨瀏覽器測試的數量時，注意權衡是很有必要的。

#### 更快的反饋 {#faster-feedback-loops}

端到端測試和相應開發過程的主要問題之一是，運行整個套件需要很長的時間。通常情況下，這只在持續集成和部署（CI/CD）管道中進行。現代的端到端測試框架通過增加並行化等功能來幫助解決這個問題，這使得 CI/CD 管道的運行速度比以前快了幾倍。此外，在本地開發時，能夠有選擇地為你正在工作的頁面運行單個測試，同時還提供測試的熱重載，大大提高了開發者的工作流程和生產力。

#### 第一優先級的調試體驗 {#first-class-debugging-experience}

傳統的工具需要開發者依靠掃描終端窗口中的日志來幫助確定測試中出現的問題，而現代端到端測試框架允許開發者利用他們已經熟悉的工具，例如瀏覽器開發工具。

#### 無頭模式下的可見性 {#visibility-in-headless-mode}

當端到端測試在 CI/CD 管道中運行時，它們通常在無頭瀏覽器（即不帶界面的瀏覽器）中運行。因此，當錯誤發生時，現代端到端測試框架的一個關鍵特性是能夠在不同的測試階段查看應用的快照、視頻，從而深入瞭解錯誤的原因。而在很早以前，要手動維護這些集成是非常繁瑣的。

### 推薦方案 {#recommendation-2}

- [Cypress](https://www.cypress.io/)

  總的來說，我們認為 Cypress 提供了最完整的端到端解決方案，其具有信息豐富的圖形界面、出色的調試性、內置斷言和存根、抗剝落性、並行化和快照等諸多特性。而且如上所述，它還提供對 [組件測試](https://docs.cypress.io/guides/component-testing/introduction) 的支持。不過，它只支持測試基於 Chromium 的瀏覽器和 Firefox。

### 其他選項 {#other-options-2}

- [Playwright](https://playwright.dev/) 也是一個非常好的端到端測試解決方案，支持測試範圍更廣的瀏覽器品類（主要是 WebKit 型的）。查看這篇文章 [《為什麼選擇 Playwright》](https://playwright.dev/docs/why-playwright) 瞭解更多細節。

- [Nightwatch](https://nightwatchjs.org/) 是一個基於 [Selenium WebDriver](https://www.npmjs.com/package/selenium-webdriver) 的端到端測試解決方案。它的瀏覽器品類支持範圍是最廣的。

- [WebdriverIO](https://webdriver.io/) 是一個基於 WebDriver 協議的網絡和移動測試的自動化測試框架。

## 用例指南 {#recipes}

### 添加 Vitest 到項目中 {#adding-vitest-to-a-project}

在一個基於 Vite 的 Vue 項目中，運行如下命令：

```sh
> npm install -D vitest happy-dom @testing-library/vue
```

接著，更新你的 Vite 配置，添加上 `test` 選項：

```js{6-12}
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
  test: {
    // 啟用類似 jest 的全局測試 API
    globals: true,
    // 使用 happy-dom 模擬 DOM
    // 這需要你安裝 happy-dom 作為對等依賴（peer dependency）
    environment: 'happy-dom'
  }
})
```

:::tip
如果使用 TypeScript，請將 `vitest/globals` 添加到 `tsconfig.json` 的 `types` 字段當中。

```json
// tsconfig.json

{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

:::

接著，在你的項目中創建名字以 `*.test.js` 結尾的文件。你可以把所有的測試文件放在項目根目錄下的 `test` 目錄中，或者放在源文件旁邊的 `test` 目錄中。Vitest 會使用命名規則自動搜索它們。

```js
// MyComponent.test.js
import { render } from '@testing-library/vue'
import MyComponent from './MyComponent.vue'

test('it should work', () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    }
  })

  // 斷言輸出
  getByText('...')
})
```

最後，在 `package.json` 之中添加測試命令，然後運行它：

```json{4}
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
> npm test
```

### 測試組合式函數 {#testing-composables}

> 這一小節假設你已經讀過了[組合式函數](/guide/reusability/composables)這一章。

當涉及到測試組合式函數時，我們可以根據是否依賴宿主組件實例把它們分為兩類。

當一個組合式函數使用以下 API 時，它依賴於一個宿主組件實例：

- 生命週期鉤子
- 供給/注入

如果一個組合式程序只使用響應式 API，那麼它可以通過直接調用並斷言其返回的狀態或方法來進行測試。

```js
// counter.js
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++

  return {
    count,
    increment
  }
}
```

```js
// counter.test.js
import { useCounter } from './counter.js'

test('useCounter', () => {
  const { count, increment } = useCounter()
  expect(count.value).toBe(0)

  increment()
  expect(count.value).toBe(1)
})
```

一個依賴生命週期鉤子或供給/注入的組合式函數需要被包裝在一個宿主組件中才可以測試。我們可以創建下面這樣的幫手函數：

```js
// test-utils.js
import { createApp } from 'vue'

export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      // 忽略模板警告
      return () => {}
    }
  })
  app.mount(document.createElement('div'))
  // 返回結果與應用實例
  // 用來測試供給和組件卸載
  return [result, app]
}
```

```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // 為注入的測試模擬一方供給
  app.provide(...)
  // 執行斷言
  expect(result.foo.value).toBe(1)
  // 如果需要的話可以這樣觸發
  app.unmount()
})
```

對於更復雜的組合式函數，通過使用[組件測試](#component-testing)編寫針對這個包裝器組件的測試，這會容易很多。

<!--
TODO more testing recipes can be added in the future e.g.
- How to set up CI via GitHub actions
- How to do mocking in component testing
-->

<!-- zhlint disabled -->
