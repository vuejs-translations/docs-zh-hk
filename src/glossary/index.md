# 術語表 {#glossary}

本術語表旨在為一些在討論 Vue 時常用的技術術語的含義提供指導。其目的在於*描述*術語的常見用法，而不是*規定*它們必須如何使用。在不同的上下文中，一些術語的含義可能會有細微的差別。

[[TOC]]

## 異步組件 (async component) {#async-component}

*異步組件*是為另一個組件提供的包裝器，來讓被包裝的組件可以進行懶加載。這通常用作減少構建後的 `.js` 文件大小的一種方式，通過將它們拆分為較小的塊來按需加載。

Vue Router 也有類似的功能，用於[路由懶加載](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)，但這並不是通過 Vue 的異步組件功能實現的。

詳見：
- [指南 - 異步組件](/guide/components/async.html)

## 編譯器宏 (compiler macro) {#compiler-macro}

*編譯器宏*是一種特殊的代碼，由編譯器處理並轉換為其他東西。它們實際上是一種更巧妙的字符串替換形式。

Vue 的[單文件組件](#single-file-component)編譯器支持各種宏，例如 `defineProps()`、`defineEmits()` 和 `defineExpose()`。這些宏有意設計得像是普通的 JavaScript 函數，以便它們可以利用 JavaScript / TypeScript 中的相同解析器和類型推斷工具。然而，它們不是在瀏覽器中運行的實際函數。這些特殊字符串會被編譯器檢測到並替換為實際真正運行的 JavaScript 代碼。

宏在使用上有一些不適用於普通 JavaScript 代碼的限制。例如，你可能認為 `const dp = defineProps` 會為 `defineProps` 創建一個別名，但實際上它會導致錯誤。相同的限制也存在於傳入 `defineProps()` 的值，因為“參數”必須由編譯器處理，而不是在運行時。

詳見：
- [`<script setup>` - `defineProps()` & `defineEmits()`](/api/sfc-script-setup.html#defineprops-defineemits)
- [`<script setup>` - `defineExpose()`](/api/sfc-script-setup.html#defineexpose)

## 組件 (component) {#component}

*組件*一詞不是 Vue 獨有的。它是許多 UI 框架都有的共同特性。它描述了 UI 的一部分，例如按鈕或複選框。多個組件也可以組合成更大的組件。

組件是 Vue 提供的將 UI 拆成較小部分的主要機制，既可以提高可維護性，也允許代碼重用。

一個 Vue 組件是一個對象。所有屬性都是可選的，但是必須有用於組件渲染的模板或渲染函數二選一。例如，以下對象將是一個有效的組件：

```js
const HelloWorldComponent = {
  render() {
    return 'Hello world!'
  }
}
```

在實踐中，大多數 Vue 應用都是通過[單文件組件](#single-file-component) (`.vue` 文件) 編寫的。雖然這些組件看起來不是對象，但單文件組件編譯器會將它們轉換為用作文件默認導出的一個對象。從外部來看，`.vue` 文件只是導出一個組件對象的 ES 模塊。

組件對象的屬性通常稱為*選項*。這就是[選項式 API](#options-api) 得名的原因。

組件的選項將定義如何創建該組件的實例。組件在概念上類似於類，儘管 Vue 並不使用實際的 JavaScript 類來定義它們。組件這個詞也可以更寬泛地用來指代組件實例。

詳見：
- [指南 - 組件基礎](/guide/essentials/component-basics.html)

“組件”一詞還出現在其他幾個術語中：
- [異步組件](#async-component)
- [動態組件](#dynamic-component)
- [函數式組件](#functional-component)
- [Web Component](#web-component)

## 組合式函數 (composable) {#composable}

*組合式函數*一詞描述了 Vue 中的一種常見用法。它不是 Vue 的一個單獨的特性，而是一種使用框架的[組合式 API](#composition-api) 的方式。

* 組合式函數是一個函數。
* 組合式函數用於封裝和重用有狀態的邏輯。
* 函數名通常以 `use` 開頭，以便讓其他開發者知道它是一個組合式函數。
* 函數通常在組件的 `setup()` 函數 (或等效的 `<script setup>` 塊) 的同步執行期間調用。這將組合式函數的調用與當前組件的上下文綁定，例如通過調用 `provide()`、`inject()` 或 `onMounted()`。
* 通常來說，組合式函數返回的是一個普通對象，而不是一個響應式對象。這個對象通常包含 `ref` 和函數，並且預期在調用它的代碼中進行解構。

與許多模式一樣，對於特定代碼是否符合上述定義可能會有一些爭議。並非所有的 JavaScript 工具函數都是組合式函數。如果一個函數沒有使用組合式 API，那麼它可能不是一個組合式函數。如果它不期望在 `setup()` 的同步執行期間被調用，那麼它可能不是一個組合式函數。組合式函數專門用於封裝有狀態的邏輯，它們不僅僅是函數的命名約定。

參考[指南 - 組合式函數](/guide/reusability/composables.html)獲取更多關於如何編寫組合式函數的細節。

## 組合式 API (Composition API) {#composition-api}

*組合式 API* 是 Vue 中的一組用於編寫組件和組合式函數的函數。

該詞也用於描述用於編寫組件的兩種主要風格之一，另一種是[選項式 API](#options-api)。通過組合式 API 編寫的組件使用 `<script setup>` 或顯式的 `setup()` 函數。

參考[組合式 API 常見問答](/guide/extras/composition-api-faq)獲取更多細節。

## 自定義元素 (custom element) {#custom-element}

*自定義元素*是現代 Web 瀏覽器中實現的 [Web Components](#web-component) 標準的一個特性。它指的是在 HTML 標記中使用自定義 HTML 元素，以在頁面的該位置加入一個 Web Component 的能力。

Vue 對渲染自定義元素有內置的支持，並允許它們直接在 Vue 組件模板中使用。

自定義元素不應該與在 Vue 組件的模板中包含另一個 Vue 組件的能力混淆。自定義元素是用於創建 Web Components 的，而不是 Vue 組件。

詳見：
- [Vue 與 Web Components](/guide/extras/web-components.html)

## 指令 (directive) {#directive}

*指令*一詞指的是以 `v-` 前綴開頭的模板屬性，或者它們的等效簡寫。

內置的指令包括 `v-if`、`v-for`、`v-bind`、`v-on` 和 `v-slot`。

Vue 也支持創建自定義指令，儘管它們通常只用作操作 DOM 節點的“逃生艙”。自定義指令通常不能用來重新創建內置指令的功能。

詳見：
- [指南 - 模板語法 - 指令](/guide/essentials/template-syntax.html#directives)
- [指南 - 自定義指令](/guide/reusability/custom-directives.html)

## 動態組件 (dynamic component) {#dynamic-component}

*動態組件*一詞用於描述需要動態選擇要渲染的子組件的情況。這通常是通過 `<component :is="type">` 來實現的。

動態組件不是一種特殊類型的組件。任何組件都可以用作動態組件。動態指的是的是組件的選擇，而不是組件本身。

詳見：
- [指南 - 組件基礎 - 動態組件](/guide/essentials/component-basics.html#dynamic-components)

## 作用 (effect) {#effect}

見[響應式作用](#reactive-effect)和[副作用](#side-effect)。

## 事件 (event) {#event}

通過事件在程序的不同部分之間進行通信在許多不同領域編程實踐中都是很常見的。在 Vue 中，這個術語通常被用於原生 HTML 元素事件和 Vue 組件事件。`v-on` 指令用於在模板中監聽這兩種類型的事件。

詳見：
- [指南 - 事件處理](/guide/essentials/event-handling.html)
- [指南 - 組件事件](/guide/components/events.html)

## 片段 (fragment) {#fragment}

*片段*一詞指的是一種特殊類型的 [VNode](#vnode)，它用作其他 VNode 的父節點，但它本身不渲染任何元素。

該名稱來自於一個類似概念：原生 DOM API 中的 [`DocumentFragment`](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)。

片段用於支持具有多個根節點的組件。雖然這樣的組件表面上有多個根節點，但背後還是有一個單一的片段根節點作為這些表面上“根”節點的父節點。

片段也作為包裝多個動態節點的一種方式被用於模板編譯器，例如通過 `v-for` 或 `v-if` 創建的節點。這允許我們向 [VDOM](#virtual-dom) 補丁算法傳遞額外的提示。這些大部分都是在內部處理的，但你可能會直接遇到的一種情況是在 `<template>` 標籤上使用 `v-for` 的 `key`。在此，`key` 會作為 [prop](#prop) 添加到片段的 VNode。

片段節點當前在 DOM 上被渲染為了空文本節點，但這只是一個實現細節。當你使用 `$el` 或嘗試通過瀏覽器內置的 API 遍歷 DOM 時，可能會意外地遇到這些文本節點。

## 函數式組件 (functional component) {#functional-component}

組件的定義通常是一個包含選項的對象。如果使用 `<script setup>` 的話它可能看起來不是這樣，但是從 `.vue` 文件導出的組件仍然是一個對象。

*函數式組件*是組件的一種替代形式，它使用函數來聲明。該函數充當組件的[渲染函數](#render-function)。

函數式組件無法擁有任何自己的狀態。它也不會經歷通常的組件生命週期，因此無法使用生命週期鉤子。這使得它們比正常的有狀態組件要稍微輕一些。

詳見：
- [指南 - 渲染函數 & JSX - 函數式組件](/guide/extras/render-function.html#functional-components)

## 變量提升 (hoisting) {#hoisting}

*變量提升*一詞用於描述在一段代碼到達之前就運行。執行被“提升”到一個較早的點。

JavaScript 對某些結構使用了變量提升，例如 `var`、`import` 和函數聲明。

在 Vue 上下文中，模板編譯器應用了*靜態變量提升*來提高性能。在將模板轉換為渲染函數時，對應於靜態內容的 VNode 可以只創建一次然後被重複使用。這些靜態 VNode 是被提升的，因為它們是在渲染函數運行之前，在其外面創建的。模板編譯器生成的靜態對象或數組也會應用類似的變量提升。

詳見：
- [指南 - 渲染機制 - 靜態提升](/guide/extras/rendering-mechanism.html#static-hoisting)

## DOM 內模板 (in-DOM template) {#in-dom-template}

指定組件模板的方式有很多。在大多數情況下，模板是以字符串的形式提供的。

*DOM 內模板*一詞指的是以 DOM 節點而非字符串形式提供模板的場景。然後 Vue 將通過 `innerHTML` 將 DOM 節點轉換為模板字符串。

通常來說，內聯 DOM 模板是直接在頁面的 HTML 中編寫的 HTML 標記。然後瀏覽器將其解析為 DOM 節點，Vue 再使用這些節點來讀取 `innerHTML`。

詳見：
- [指南 - 創建一個應用 - DOM 中的根組件模板](/guide/essentials/application.html#in-dom-root-component-template)
- [指南 - 組件基礎 - DOM 內模板解析注意事項](/guide/essentials/component-basics.html#in-dom-template-parsing-caveats)
- [渲染選項 - template](/api/options-rendering.html#template)

## 注入 (inject) {#inject}

見[提供 / 注入](#provide-inject)。

## 生命週期鉤子 (lifecycle hooks) {#lifecycle-hooks}

Vue 組件實例會經歷一個生命週期。例如，它會被創建、掛載、更新和卸載。

*生命週期鉤子*是監聽這些生命週期事件的一種方式。

在選項式 API 中，每個鉤子都作為單獨的選項提供，例如 `mounted`。而組合式 API 則使用函數，例如 `onMounted()`。

詳見：
- [指南 - 生命週期鉤子](/guide/essentials/lifecycle.html)

## 宏 (macro) {#macro}

見[編譯器宏](#compiler-macro)。

## 具名插槽 (named slot) {#named-slot}

組件可以有通過名稱進行區分的多個插槽。除了默認插槽之外的插槽被稱為*具名插槽*。

詳見：
- [指南 - 插槽 - 具名插槽](/guide/components/slots.html#named-slots)

## 選項式 API (Options API) {#options-api}

Vue 組件是通過對象定義的。這些組件對象的屬性被稱為*選項*。

組件可以用兩種風格編寫。一種風格將[組合式 API](#composition-api) 與 `setup` (通過 `setup()` 選項或 `<script setup>`) 結合使用。另一種風格幾乎不直接使用組合式 API，而是使用各種組件選項來達到類似的效果。以這種方式使用的組件選項被稱為*選項式 API*。

選項式 API 包括 `data()`、`computed`、`methods` 和 `created()` 等選項。

某些選項，例如 `props`、`emits` 和 `inheritAttrs`，可以用於任意一套 API 編寫組件。由於它們是組件選項，因此可以被認為是選項式 API 的一部分。但是，由於這些選項也與 `setup()` 結合使用，因此通常更適合將它們視為兩套組件風格之間共享的選項。

`setup()` 函數本身是一個組件選項，因此它*可以*被描述為選項式 API 的一部分。但是，這不是“選項式 API”這個術語的常見用法。相反，`setup()` 函數被認為是組合式 API 的一部分。

## 插件 (plugin) {#plugin}

*插件*一詞可以在各種上下文中使用，但是在 Vue 中它有一個特定的概念，即插件是向應用程序添加功能的一種方式。

調用 `app.use(plugin)` 可以將插件添加到應用中。插件本身可以是一個函數，也可以是一個帶有 `install` 函數的對象。該函數會被傳入應用實例，然後執行任何所需的操作。

詳見：
- [指南 - 插件](/guide/reusability/plugins.html)

## Prop {#prop}

*Prop* 一詞在 Vue 中有三種常見用法：

* 組件 prop
* VNode prop
* 插槽 prop

大多數情況下，prop 是指*組件 prop*。這些 prop 由組件通過 `defineProps()` 或 `props` 選項顯式定義。

*VNode prop* 一詞指的是作為第二個參數傳入 `h()` 的對象的屬性。這些屬性可以包括組件 prop，也可以包括組件事件、DOM 事件、DOM attribute 和 DOM property。通常只有在使用渲染函數直接操作 VNode 時才會用到 VNode prop。

*插槽 prop* 是傳遞給作用域插槽的屬性。

在所有情況下，prop 都是從其他地方傳遞過來的屬性。

雖然 prop 源自單詞 *properties*，但在 Vue 的上下文中，術語 prop 具有更加特定的含義。你應該避免將其用作 properties 的縮寫。

詳見：
- [指南 - Props](/guide/components/props.html)
- [指南 - 渲染函數 & JSX](/guide/extras/render-function.html)
- [指南 - 插槽 - 作用域插槽](/guide/components/slots.html#scoped-slots)

## 提供 / 注入 (provide / inject) {#provide-inject}

`provide` 和 `inject` 是一種組件間通信的形式。

當組件*提供*一個值時，該組件的所有後代組件都可以選擇使用 `inject` 來獲取該值。與 prop 不同，提供值的組件不知道哪些組件正在接收該值。

`provide` 和 `inject` 有時用於避免 *prop 逐級透傳*。它們也可以作為組件與其插槽內容進行隱式通信的一種方式。

`provide` 也可以在應用級別使用，使得該值對該應用中的所有組件都可用。

詳見：
- [指南 - 依賴注入](/guide/components/provide-inject.html)

## 響應式作用 (reactive effect) {#reactive-effect}

*響應式作用*是 Vue 響應性系統的一部分。它指的是跟蹤函數的依賴關係，並在它們的值發生變化時重新運行該函數的過程。

`watchEffect()` 是最直接的創建作用的方式。Vue 內部的其他各個部分也會使用作用。例如：組件渲染更新、`computed()` 和 `watch()`。

Vue 只能在響應式作用內部跟蹤響應式依賴關係。如果在響應式作用之外讀取屬性的值，它將“丟失”響應性，因為 Vue 不知道在該屬性發生變化後應該做什麼。

這個術語源自“副作用”。調用作用函數是屬性值被更改的副作用。

詳見：
- [指南 - 深入響應式系統](/guide/extras/reactivity-in-depth.html)

## reactivity {#reactivity}

In general, *reactivity* refers to the ability to automatically perform actions in response to data changes. For example, updating the DOM or making a network request when a data value changes.

In a Vue context, reactivity is used to describe a collection of features. Those features combine to form a *reactivity system*, which is exposed via the [Reactivity API](#reactivity-api).

There are various different ways that a reactivity system could be implemented. For example, it could be done by static analysis of code to determine its dependencies. However, Vue doesn't employ that form of reactivity system.

Instead, Vue's reactivity system tracks property access at runtime. It does this using both Proxy wrappers and [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description)/[setter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) functions for properties.

For more details see:
- [Guide - Reactivity Fundamentals](/guide/essentials/reactivity-fundamentals.html)
- [Guide - Reactivity in Depth](/guide/extras/reactivity-in-depth.html)

## 響應性 API (Reactivity API) {#reactivity-api}

*響應性 API* 是一組與[響應性](#reactivity)相關的核心 Vue 函數。這些函數可以獨立於組件使用。包括 `ref()`、`reactive()`、`computed()`、`watch()` 和 `watchEffect()` 等。

響應性 API 是組合式 API 的一個子集。

詳見：
- [響應性 API：核心](/api/reactivity-core.html)
- [響應性 API：工具](/api/reactivity-utilities.html)
- [響應性 API：進階](/api/reactivity-advanced.html)

## ref {#ref}

> 該條目是關於 `ref` 在響應性中的用法。對於模板中使用的 `ref` attribute，請參考[模板 ref](#template-ref)。

`ref` 是 Vue 響應性系統的一部分。它是一個具有單個響應式屬性 (稱為 `value`) 的對象。

Ref 有多種不同的類型。例如，可以使用 `ref()`、`shallowRef()`、`computed()` 和 `customRef()` 來創建 ref。函數 `isRef()` 可以用來檢查一個對象是否是 ref，`isReadonly()` 可以用來檢查 ref 是否允許被直接重新賦值。

詳見：
- [指南 - 響應式基礎](/guide/essentials/reactivity-fundamentals.html)
- [響應性 API：核心](/api/reactivity-core.html)
- [響應性 API：工具](/api/reactivity-utilities.html)
- [響應性 API：進階](/api/reactivity-advanced.html)

## 渲染函數 (render function) {#render-function}

*渲染函數*是組件的一部分，它在渲染期間生成 VNode。模板會被編譯成渲染函數。

詳見：
- [指南 - 渲染函數 & JSX](/guide/extras/render-function.html)

## 調度器 (scheduler) {#scheduler}

*調度器*是 Vue 內部的一部分，它控制著[響應式作用](#reactive-effect)運行的時機。

當響應式狀態發生變化時，Vue 不會立即觸發渲染更新。取而代之的是，它會通過隊列實現批處理。這確保了即使對底層數據進行了多次更改，組件也只重新渲染一次。

[偵聽器](/guide/essentials/watchers.html)也使用了調度器隊列進行批處理。具有 `flush: 'pre'` (默認值) 的偵聽器將在組件渲染之前運行，而具有 `flush: 'post'` 的偵聽器將在組件渲染之後運行。

調度器中的任務還用於執行各種其他內部任務，例如觸發一些[生命週期鉤子](#lifecycle-hooks)和更新[模板 ref](#template-ref)。

## 作用域插槽 (scoped slot) {#scoped-slot}

*作用域插槽*是指接收 [prop](#prop) 的[插槽](#slot)。

過去，Vue 在作用域插槽和非作用域插槽之間有很大的區別。在某種程度上，它們可以被視為被統一在一個公共的模板語法背後的兩個不同的功能。

在 Vue 3 中，插槽 API 被簡化為使所有插槽都像作用域插槽一樣。然而，作用域插槽和非作用域插槽的使用場景通常不一樣，因此該術語仍被用於特指具有 prop 的插槽。

傳遞給插槽的 prop 只能在父模板中負責定義該插槽內容的指定區域中使用。該模板區域的行為類似於 prop 的變量作用域，因此稱為“作用域插槽”。

詳見：
- [指南 - 插槽 - 作用域插槽](/guide/components/slots.html#scoped-slots)

## SFC {#sfc}

見[單文件組件](#single-file-component)。

## 副作用 (side effect) {#side-effect}

*副作用*一詞並非 Vue 特有。它用於描述超出其局部作用域的操作或函數。

舉個例子，在 `user.name = null` 這樣設置屬性的上下文中，我們可以預期 `user.name` 的值會被更改。如果它還做了其他事情，比如觸發 Vue 的響應性系統，那麼這就被描述為副作用。這就是 Vue 中的[響應式 effect](#reactive-effect) 一詞的起源。

當描述一個函數具有副作用時，這意味著該函數除了返回一個值之外，還執行了某種在函數外可觀察到的操作。這可能意味著它更新了狀態中的值，或者觸發了網絡請求。

該術語通常用於描述渲染或計算屬性。最佳實踐是渲染不應該有副作用。同樣，計算屬性的 getter 函數也不應該有副作用。

## 單文件組件 (Single-File Component) {#single-file-component}

*單文件組件* (SFC) 一詞指的是常用於 Vue 組件的 `.vue` 文件格式。

參考：
- [指南 - 單文件組件](/guide/scaling-up/sfc.html)
- [SFC 語法定義](/api/sfc-spec.html)

## 插槽 (slot) {#slot}

插槽用於向子組件傳遞內容。和 prop 用於傳遞數據不同，插槽用於傳遞更豐富的內容，包括 HTML 元素和其他 Vue 組件。

詳見：
- [指南 - 插槽](/guide/components/slots.html)

## 模板 ref (template ref) {#template-ref}

*模板 ref* 一詞指的是在模板中的標籤上使用 `ref` 屬性。組件渲染後，該屬性用於將相應的屬性填充為模板中的標籤對應的 HTML 元素或組件實例。

如果你使用的是選項式 API，那麼 ref 會通過 `$refs` 對象的屬性暴露出來。

通過組合式 API，模板 ref 會填充一個與之同名的[響應式 ref](#ref)。

模板 ref 不應該與 Vue 響應性系統中的響應式 ref 混淆。

詳見：
- [指南 - Template Refs](/guide/essentials/template-refs.html)

## VDOM {#vdom}

參考[虛擬 DOM](#virtual-dom)。

## 虛擬 DOM (virtual DOM) {#virtual-dom}

*虛擬 DOM* (VDOM) 一詞並非 Vue 獨有。它是多個 web 框架用於管理 UI 更新的常用方法。

瀏覽器使用節點樹來表示頁面的當前狀態。該樹及用於與之交互的 JavaScript API 稱為*文檔對象模型*或 *DOM*。

更新 DOM 是一個主要的性能瓶頸。虛擬 DOM 提供了一種管理 DOM 的策略。

與直接創建 DOM 節點不同，Vue 組件會生成它們想要的 DOM 節點的描述。這些描述符是普通的 JavaScript 對象，稱為 VNode (虛擬 DOM 節點)。創建 VNode 的成本相對較低。

每次組件重新渲染時，都會將新的 VNode 樹與先前的 VNode 樹進行比較，然後將它們之間的差異應用於真實 DOM。如果沒有任何更改，則不需要修改 DOM。

Vue 使用了一種混合方法，我們稱之為[帶編譯時信息的虛擬 DOM](/guide/extras/rendering-mechanism.html#compiler-informed-virtual-dom)。Vue 的模板編譯器能夠根據對模板的靜態分析添加性能優化。Vue 不會在運行時對組件的新舊 VNode 樹進行完整的對比，而是可以利用編譯器提取的信息，將樹的對比減少到實際可能發生變化的部分。

詳見：
- [指南 - 渲染機制](/guide/extras/rendering-mechanism.html)
- [指南 - 渲染函數 & JSX](/guide/extras/render-function.html)

## VNode {#vnode}

*VNode* 即*虛擬 DOM 節點*。它們可以使用 [`h()`](/api/render-function.html#h) 函數創建。

詳見[虛擬 DOM](#virtual-dom)。

## Web Component {#web-component}

*Web Component* 標準是現代 Web 瀏覽器中實現的一組功能。

Vue 組件不是 Web 組件，但是可以通過 `defineCustomElement()` 從 Vue 組件創建[自定義元素](#custom-element)。Vue 還支持在 Vue 組件內部使用自定義元素。

詳見：
- [指南 - Vue 和 Web Components](/guide/extras/web-components.html)
