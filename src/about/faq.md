# 常見問題 {#frequently-asked-questions}

## 誰在維護 Vue？ {#who-maintains-vue}

Vue 是一個獨立的社區驅動的項目。它是由[尤雨溪](https://twitter.com/yuxiyou)在 2014 年作為其個人項目創建的。今天，Vue 由[來自世界各地的全職成員和志願者組成的團隊](/about/team)積極活躍地維護著，並由尤雨溪擔任項目負責人。你可以在[這部紀錄片](https://www.youtube.com/watch?v=OrxmtDw4pVI)中瞭解更多關於 Vue 的故事。

自 2016 年以來，Vue 的發展主要是通過贊助來保障的，我們在財務上是可維續的。如果你或你的企業從 Vue 中受益，請考慮[贊助](/sponsor/)我們，以支持 Vue 的發展！

## Vue 2 和 Vue 3 之間的區別是什麼？ {#what-s-the-difference-between-vue-2-and-vue-3}

Vue 3 是 Vue 當前的最新主版本。它包含了一些 Vue 2 中沒有的新特性 (例如 Teleport、Suspense，以及多根元素模板)。同時它也包含了一些與 Vue 2 不兼容的變更。更多細節請參考 [Vue 3 遷移指南](https://v3-migration.vuejs.org/zh/)。

儘管存在差異，但大多數 Vue API 在兩個大版本之間是相同的，所以你的大部分 Vue 2 知識將繼續在 Vue 3 中發揮作用。需要注意的是，組合式 API 原本是一個 Vue 3 獨有的特性，但目前已兼容至 Vue 2 且在 [Vue 2.7](https://github.com/vuejs/vue/blob/main/CHANGELOG.md#270-2022-07-01) 中可用。

總的來說，Vue 3 提供了更小的包體積、更好的性能、更好的可擴展性和更好的 TypeScript/IDE 支持。如果你現在要開始一個新項目，我們推薦你選擇 Vue 3。而只在以下原因下需要考慮使用 Vue 2：

- 你需要支持 IE11。Vue 3 用到了一些 IE11 不支持的現代 JavaScript 特性。

如果你打算將現有的 Vue 2 應用遷移到 Vue 3，請查閱[遷移指南](https://v3-migration.vuejs.org/zh/)。

<!-- TODO: Outdated(LTS has already ended) [No Review] -->
## Vue 2 仍在維護嗎？ {#is-vue-2-still-supported}

Vue 2 在 2022 年 6 月發佈了最後一個小版本 (2.7)。目前 Vue 2 已經進入維護模式：它將不再提供新特性，但從 2.7 的發佈日期開始的 18 個月內，它將繼續針對重大錯誤修復和安全更新進行發佈。這意味著 **Vue 2 在 2023 年 12 月 31 日將到達它的截止維護日期**。

我們相信這將為大多數的生態系統提供了足夠長的時間來遷移到 Vue 3。然而，我們也理解可能會有無法在此時間軸上升級的團隊或項目仍需滿足其安全及合規需求。我們正在與業內專家合作為有這種需求的團隊提供 Vue 2 的擴展支持——如果您的團隊預期在 2023 年底之後仍然需要使用 Vue 2，請確保提前計劃，詳見 [Vue 2 延長 LTS](https://v2.vuejs.org/lts/)。

## Vue 使用什麼開源協議？ {#what-license-does-vue-use}

Vue 是完全免費的開源項目，且基於 [MIT License](https://opensource.org/licenses/MIT) 發佈。

## Vue 支持哪些瀏覽器？ {#what-browsers-does-vue-support}

最新版本的 Vue (3.x) 只支持[原生支持 ES2015 的瀏覽器](https://caniuse.com/es6)。這並不包括 IE11。Vue 3.x 使用的 ES2015 功能無法在舊版本的瀏覽器中進行兼容，如果你需要支持舊版本的瀏覽器，請使用 Vue 2.x 替代。

## Vue 可靠嗎？ {#is-vue-reliable}

Vue 是一個成熟的、經歷了無數實戰考驗的框架。它是目前生產環境中使用最廣泛的 JavaScript 框架之一，在全球擁有超過 150 萬用戶，並且在 npm 上的月下載量超過 1000 萬次。

Vue 被世界各地知名且多元的組織在生產環境中使用，包括 Wikimedia 基金會、NASA、Apple、Google、微軟、GitLab、Zoom、騰訊、微博、嗶哩嗶哩、快手等等。

## Vue 速度快嗎？ {#is-vue-fast}

Vue 3 是性能最強的主流前端框架之一，可以輕鬆處理大多數 web 應用的場景，並且幾乎不需要手動優化。

跑分方面，Vue 在 [js-framework-benchmark](https://krausest.github.io/js-framework-benchmark/current.html) 中的表現比 React 和 Angular 要好得多。在該基準測試中，它還與一些生產環境下最快級別的非虛擬 DOM 框架不分上下。

請注意，像上面這樣的跑分的側重點在於原始渲染性能在特定情況下的優化，因此不能完全代表真實世界的性能結果。如果你更關心頁面加載性能，歡迎用 [WebPageTest](https://www.webpagetest.org/lighthouse) 或是 [PageSpeed Insights](https://pagespeed.web.dev/) 來測試本站。本文檔站是一個完全由 Vue 本身構建，通過靜態生成預渲染，並在客戶端進行 hydration 的單頁應用。它在模擬 4 倍 CPU 降速的 Moto G4 + 低速 4G 網絡的情況下依然能獲得 100 分的性能得分。

你可以在[渲染機制](/guide/extras/rendering-mechanism)章節瞭解更多關於 Vue 如何自動優化運行時性能的信息，也可以在[性能優化指南](/guide/best-practices/performance)中瞭解如何在特別苛刻的情況下優化 Vue 應用。

## Vue 體積小嗎？ {#is-vue-lightweight}

當你通過構建工具使用時，Vue 的許多 API 都是可以[“tree-shake”](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)的。例如，如果你不使用內置的 `<Transition>` 組件，它就不會被包含在最終的生產環境包裡。

對於一個 Vue 的最少 API 使用的 hello world 應用來說，配合最小化和 brotli 壓縮，其基線大小隻有 **16kb** 左右。但實際的應用大小取決於你使用了多少框架的可選特性。在極端情況下，如果一個應用使用了 Vue 提供的每一個特性，那麼總的運行時大小大約為 **27kb**。

如果不通過構建工具使用 Vue，我們不僅失去了 tree-shaking，而且還必須將模板編譯器加載到瀏覽器。這就使包體積增大到了 **41kb** 左右。因此，如果你為了漸進式增強在沒有構建步驟的情況下使用 Vue，則可以考慮使用 [petite-vue](https://github.com/vuejs/petite-vue) (僅 **6kb**) 來代替。

一些諸如 Svelte 的框架使用了一種為單個組件產生極輕量級輸出的編譯策略。然而，[我們的研究](https://github.com/yyx990803/vue-svelte-size-analysis)表明，包大小的差異在很大程度上取決於應用中的組件數量。雖然 Vue 的基線大小更重，但它生成的每個組件的代碼更少。在現實的場景中，Vue 應用很可能最終會更輕。

## Vue 能勝任大規模場景嗎？ {#does-vue-scale}

是的。儘管有一種誤解是 Vue 只適用於簡單的場景，但其實 Vue 完全有能力處理大規模的應用：

- [單文件組件](/guide/scaling-up/sfc)提供了一個模塊化的開發模型，讓應用的不同部分能夠被隔離開發。

- [組合式 API](/guide/reusability/composables) 提供一流的 TypeScript 集成，同時為組織、提取和重用複雜邏輯提供了簡潔的模式。

- [全面的工具鏈支持](/guide/scaling-up/tooling)使得開發體驗在應用增長的過程中依然可以保持平滑。

- 較低的入門門檻和優秀的文檔能夠顯著降低新手開發者的入職和培訓成本。

## 我可以為 Vue 做貢獻嗎？ {#how-do-i-contribute-to-vue}

非常歡迎！請閱讀我們的[社區指南](/about/community-guide)。

## 我應該使用選項式 API 還是組合式 API？ {#should-i-use-options-api-or-composition-api}

如果你剛剛開始學習 Vue，我們在[這裡](/guide/introduction#which-to-choose)提供了一個兩者之間宏觀的比較。

如果你過去使用過選項式 API 且正在考慮轉用組合式 API，可以查閱[組合式 API 常見問題](/guide/extras/composition-api-faq)。

## 用 Vue 的時候應該選擇 JS 還是 TS？ {#should-i-use-javascript-or-typescript-with-vue}

雖然 Vue 本身是用 TypeScript 實現的，並提供一流的 TypeScript 支持，但它並不強制要求用戶使用 TypeScript。

在向 Vue 添加新特性時，對 TypeScript 的支持是一個重要的考慮因素。即使你自己不使用 TypeScript，考慮了 TypeScript 支持的 API 設計也通常更容易被 IDE 和靜態分析工具分析，因此這對大家都有好處。Vue 的 API 設計也儘可能在 JavaScript 和 TypeScript 中以相同的方式工作。

選用 TypeScript 會涉及在上手複雜性和長期可維護性收益之間作出權衡。這種權衡是否合理取決於你的團隊背景和項目規模，但 Vue 並不會真正成為影響這一決定的因素。

## Vue 相比於 Web Components 究竟如何？ {#how-does-vue-compare-to-web-components}

Vue 是在 Web Components 出現之前被創建的，Vue 在某些方面的設計 (例如插槽) 受到了 Web Components 模型的啟發。

Web Components 規範相對底層一些，因為它們是以自定義元素為中心的。作為一個框架，Vue 解決了更多上層的問題，如高效的 DOM 渲染、響應式狀態管理、工具鏈、客戶端路由和服務器端渲染等。

Vue 完全支持在 Vue 組件中使用原生自定義元素，也支持將 Vue 組件導出為原生自定義元素——請參閱 [Vue 和 Web Components 指南](/guide/extras/web-components)以瞭解更多細節。

<!-- ## TODO How does Vue compare to React? -->

<!-- ## TODO How does Vue compare to Angular? -->
