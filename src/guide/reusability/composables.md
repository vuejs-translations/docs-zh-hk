# 組合式函數 {#composables}

<script setup>
import { useMouse } from './mouse'
const { x, y } = useMouse()
</script>

:::tip
此章節假設你已經對組合式 API 有了基本的了解。如果你只學習過選項式 API，你可以使用左側邊欄上方的切換按鈕將 API 風格切換為組合式 API 後，重新閱讀[響應性基礎](/guide/essentials/reactivity-fundamentals)和[生命週期鉤子](/guide/essentials/lifecycle)兩個章節。
:::

## 什麼是“組合式函數”？ {#what-is-a-composable}

在 Vue 應用的概念中，“組合式函數”(Composables) 是一個利用 Vue 的組合式 API 來封裝和複用**有狀態邏輯**的函數。

當構建前端應用時，我們常常需要複用公共任務的邏輯。例如為了在不同地方格式化時間，我們可能會抽取一個可複用的日期格式化函數。這個函數封裝了**無狀態的邏輯**：它在接收一些輸入後立刻返回所期望的輸出。複用無狀態邏輯的庫有很多，例如你可能已經用過的 [lodash](https://lodash.com/) 或是 [date-fns](https://date-fns.org/)。

相比之下，有狀態邏輯負責管理會隨時間而變化的狀態。一個簡單的例子是跟蹤當前鼠標在頁面中的位置。在實際應用中，也可能是像觸摸手勢或與數據庫的連接狀態這樣的更復雜的邏輯。

## 鼠標跟蹤器示例 {#mouse-tracker-example}

如果我們要直接在組件中使用組合式 API 實現鼠標跟蹤功能，它會是這樣的：

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

但是，如果我們想在多個組件中複用這個相同的邏輯呢？我們可以把這個邏輯以一個組合式函數的形式提取到外部文件中：

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照慣例，組合式函數名以“use”開頭
export function useMouse() {
  // 被組合式函數封裝和管理的狀態
  const x = ref(0)
  const y = ref(0)

  // 組合式函數可以隨時更改其狀態。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一個組合式函數也可以掛靠在所屬組件的生命週期上
  // 來啟動和卸載副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通過返回值暴露所管理的狀態
  return { x, y }
}
```

下面是它在組件中使用的方式：

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

<div class="demo">
  Mouse position is at: {{ x }}, {{ y }}
</div>

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNkj1rwzAQhv/KocUOGKVzSAIdurVjoQUvJj4XlfgkJNmxMfrvPcmJkkKHLrbu69H7SlrEszFyHFDsxN6drDIeHPrBHGtSvdHWwwKDwzfNHwjQWd1DIbd9jOW3K2qq6aTJxb6pgpl7Dnmg3NS0365YBnLgsTfnxiNHACvUaKe80gTKQeN3sDAIQqjignEhIvKYqMRta1acFVrsKtDEQPLYxuU7cV8Msmg2mdTilIa6gU5p27tYWKKq1c3ENphaPrGFW25+yMXsHWFaFlfiiOSvFIBJjs15QJ5JeWmaL/xYS/Mfpc9YYrPxl52ULOpwhIuiVl9k07Yvsf9VOY+EtizSWfR6xKK6itgkvQ/+fyNs6v4XJXIsPwVL+WprCiL8AEUxw5s=)

如你所見，核心邏輯完全一致，我們做的只是把它移到一個外部函數中去，並返回需要暴露的狀態。和在組件中一樣，你也可以在組合式函數中使用所有的[組合式 API](/api/#composition-api)。現在，`useMouse()` 的功能可以在任何組件中輕易複用了。

更酷的是，你還可以嵌套多個組合式函數：一個組合式函數可以調用一個或多個其他的組合式函數。這使得我們可以像使用多個組件組合成整個應用一樣，用多個較小且邏輯獨立的單元來組合形成複雜的邏輯。實際上，這正是為什麼我們決定將實現了這一設計模式的 API 集合命名為組合式 API。

舉例來說，我們可以將添加和清除 DOM 事件監聽器的邏輯也封裝進一個組合式函數中：

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 如果你想的話，
  // 也可以用字符串形式的 CSS 選擇器來尋找目標 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

有了它，之前的 `useMouse()` 組合式函數可以被簡化為：

```js{3,9-12}
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

:::tip
每一個調用 `useMouse()` 的組件實例會創建其獨有的 `x`、`y` 狀態拷貝，因此他們不會互相影響。如果你想要在組件之間共享狀態，請閱讀[狀態管理](/guide/scaling-up/state-management)這一章。
:::

## 異步狀態示例 {#async-state-example}

`useMouse()` 組合式函數沒有接收任何參數，因此讓我們再來看一個需要接收一個參數的組合式函數示例。在做異步數據請求時，我們常常需要處理不同的狀態：加載中、加載成功和加載失敗。

```vue
<script setup>
import { ref } from 'vue'

const data = ref(null)
const error = ref(null)

fetch('...')
  .then((res) => res.json())
  .then((json) => (data.value = json))
  .catch((err) => (error.value = err))
</script>

<template>
  <div v-if="error">Oops! Error encountered: {{ error.message }}</div>
  <div v-else-if="data">
    Data loaded:
    <pre>{{ data }}</pre>
  </div>
  <div v-else>Loading...</div>
</template>
```

如果在每個需要獲取數據的組件中都要重複這種模式，那就太繁瑣了。我們可以把它抽離成一個組合式函數：

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

現在我們在組件裡只需要：

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

### 接收響應式狀態 {#accepting-reactive-state}

`useFetch()` 接收一個靜態 URL 字符串作為輸入——因此它只會執行一次 fetch 並且就此結束。如果我們想要在 URL 改變時重新 fetch 呢？為了實現這一點，我們需要將響應式狀態傳入組合式函數，並讓它基於傳入的狀態來創建執行操作的偵聽器。

舉例來說，`useFetch()` 應該能夠接收一個 ref：

```js
const url = ref('/initial-url')

const { data, error } = useFetch(url)

// 這將會重新觸發 fetch
url.value = '/new-url'
```

或者接收一個 getter 函數：

```js
// 當 props.id 改變時重新 fetch
const { data, error } = useFetch(() => `/posts/${props.id}`)
```

我們可以用 [`watchEffect()`](/api/reactivity-core.html#watcheffect) 和 [`toValue()`](/api/reactivity-utilities.html#tovalue) API 來重構我們現有的實現：

```js{8,13}
// fetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  const fetchData = () => {
    // reset state before fetching..
    data.value = null
    error.value = null

    fetch(toValue(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error }
}
```

`toValue()` 是一個在 3.3 版本中新增的 API。它的設計目的是將 ref 或 getter 規範化為值。如果參數是 ref，它會返回 ref 的值；如果參數是函數，它會調用函數並返回其返回值。否則，它會原樣返回參數。它的工作方式類似於 [`unref()`](/api/reactivity-utilities.html#unref)，但對函數有特殊處理。

注意 `toValue(url)` 是在 `watchEffect` 回調函數的**內部**調用的。這確保了在 `toValue()` 規範化期間訪問的任何響應式依賴項都會被偵聽器跟蹤。

這個版本的 `useFetch()` 現在能接收靜態 URL 字符串、ref 和 getter，使其更加靈活。watch effect 會立即運行，並且會跟蹤 `toValue(url)` 期間訪問的任何依賴項。如果沒有跟蹤到依賴項 (例如 url 已經是字符串)，則 effect 只會運行一次；否則，它將在跟蹤到的任何依賴項更改時重新運行。

這是[更新後的 `useFetch()`](https://play.vuejs.org/#eNp9Vdtu20YQ/ZUpUUA0qpAOjL4YktCbC7Rom8BN8sSHrMihtfZql9iLZEHgv2dml6SpxMiDIWkuZ+acmR2fs1+7rjgEzG6zlaut7Dw49KHbVFruO2M9nMFiu4Ta7LvgsYEeWmv2sKCkxSwoOPwTfb2b/EU5mopHR5GVro12HrbC4UerYA2Lnfeduy3LR2d0p0SNO6MatIU/dbI2DRZUtPSmMa4kgJQuG8qkjvLF28XVaAwRb2wxz69gvZkK/UQ5xUGogBQ/ZpyhEV4sAa01lnpeTwRyApsFWvT2RO6Eea40THBMgfq6NLwlS1/pVZnUJB3ph8c98fNIvwD+MaKBzkQut2xYbYP3RsPhTWvsusokSA0/Vxn8UitZP7GFSX/+8Sz7z1W2OZ9BQt+vypQXS1R+1cgDQciW4iMrimR0wu8270znfoC7SBaJWdAeLTa3QFgxuNijc+IBIy5PPyYOjU19RDEI954/Z/UptKTy6VvqA5XD1AwLTTl/0Aco4s5lV51F5sG+VJJ+v4qxYbmkfiiKYvSvyknPbJnNtoyW+HJpj4Icd22LtV+CN5/ikC4XuNL4HFPaoGsvie3FIqSJp1WIzabl00HxkoyetEVfufhv1kAu3EnX8z0CKEtKofcGzhMb2CItAELL1SPlFMV1pwVj+GROc/vWPoc26oDgdxhfSArlLnbWaBOcOoEzIP3CgbeifqLXLRyICaDBDnVD+3KC7emCSyQ4sifspOx61Hh4Qy/d8BsaOEdkYb1sZS2FoiJKnIC6FbqhsaTVZfk8gDgK6cHLPZowFGUzAQTNWl/BUSrFbzRYHXmSdeAp28RMsI0fyFDaUJg9Spd0SbERZcvZDBRleCPdQMCPh8ARwdRRnBCTjGz5WkT0i0GlSMqixTR6VKyHmmWEHIfV+naSOETyRx8vEYwMv7pa8dJU+hU9Kz2t86ReqjcgaTzCe3oGpEOeD4uyJOcjTXe+obScHwaAi82lo9dC/q/wuyINjrwbuC5uZrS4WAQeyTN9ftOXIVwy537iecoX92kR4q/F1UvqIMsSbq6vo5XF6ekCeEcTauVDFJpuQESvMv53IBXadx3r4KqMrt0w0kwoZY5/R5u3AZejvd5h/fSK/dE9s63K3vN7tQesssnnhX1An9x3//+Hz/R9cu5NExRFf8d5zyIF7jGF/RZ0Q23P4mK3f8XLRmfhg7t79qjdSIobjXLE+Cqju/b7d6i/tHtT3MQ8VrH/Ahstp5A=)，為了便於演示，添加了人為延遲和隨機錯誤。

## 約定和最佳實踐 {#conventions-and-best-practices}

### 命名 {#naming}

組合式函數約定用駝峰命名法命名，並以“use”作為開頭。

### 輸入參數 {#input-arguments}

即便不依賴於 ref 或 getter 的響應性，組合式函數也可以接收它們作為參數。如果你正在編寫一個可能被其他開發者使用的組合式函數，最好處理一下輸入參數是 ref 或 getter 而非原始值的情況。可以利用 [`toValue()`](/api/reactivity-utilities#tovalue) 工具函數來實現：

```js
import { toValue } from 'vue'

function useFeature(maybeRefOrGetter) {
  // 如果 maybeRefOrGetter 是一個 ref 或 getter，
  // 將返回它的規範化值。
  // 否則原樣返回。
  const value = toValue(maybeRefOrGetter)
}
```

如果你的組合式函數在輸入參數是 ref 或 getter 的情況下創建了響應式 effect，為了讓它能夠被正確追蹤，請確保要麼使用 `watch()` 顯式地監視 ref 或 getter，要麼在 `watchEffect()` 中調用 `toValue()`。

[前面討論過的 useFetch() 實現](#accepting-reactive-state)提供了一個接受 ref、getter 或普通值作為輸入參數的組合式函數的具體示例。

### 返回值 {#return-values}

你可能已經注意到了，我們一直在組合式函數中使用 `ref()` 而不是 `reactive()`。我們推薦的約定是組合式函數始終返回一個包含多個 ref 的普通的非響應式對象，這樣該對象在組件中被解構為 ref 之後仍可以保持響應性：

```js
// x 和 y 是兩個 ref
const { x, y } = useMouse()
```

從組合式函數返回一個響應式對象會導致在對象解構過程中丟失與組合式函數內狀態的響應性連接。與之相反，ref 則可以維持這一響應性連接。

如果你更希望以對象屬性的形式來使用組合式函數中返回的狀態，你可以將返回的對象用 `reactive()` 包裝一次，這樣其中的 ref 會被自動解包，例如：

```js
const mouse = reactive(useMouse())
// mouse.x 鏈接到了原來的 x ref
console.log(mouse.x)
```

```vue-html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

### 副作用 {#side-effects}

在組合式函數中的確可以執行副作用 (例如：添加 DOM 事件監聽器或者請求數據)，但請注意以下規則：

- 如果你的應用用到了[服務端渲染](/guide/scaling-up/ssr) (SSR)，請確保在組件掛載後才調用的生命週期鉤子中執行 DOM 相關的副作用，例如：`onMounted()`。這些鉤子只會在瀏覽器中被調用，因此可以確保能訪問到 DOM。

- 確保在 `onUnmounted()` 時清理副作用。舉例來說，如果一個組合式函數設置了一個事件監聽器，它就應該在 `onUnmounted()` 中被移除 (就像我們在 `useMouse()` 示例中看到的一樣)。當然也可以像之前的 `useEventListener()` 示例那樣，使用一個組合式函數來自動幫你做這些事。

### 使用限制 {#usage-restrictions}

組合式函數只能在 `<script setup>` 或 `setup()` 鉤子中被調用。在這些上下文中，它們也只能被**同步**調用。在某些情況下，你也可以在像 `onMounted()` 這樣的生命週期鉤子中調用它們。

這些限制很重要，因為這些是 Vue 用於確定當前活躍的組件實例的上下文。訪問活躍的組件實例很有必要，這樣才能：

1. 將生命週期鉤子註冊到該組件實例上

2. 將計算屬性和監聽器註冊到該組件實例上，以便在該組件被卸載時停止監聽，避免內存洩漏。

:::tip
`<script setup>` 是唯一在調用 `await` **之後**仍可調用組合式函數的地方。編譯器會在異步操作之後自動為你恢復當前的組件實例。
:::

## 通過抽取組合式函數改善代碼結構 {#extracting-composables-for-code-organization}

抽取組合式函數不僅是為了複用，也是為了代碼組織。隨著組件複雜度的增高，你可能會最終發現組件多得難以查詢和理解。組合式 API 會給予你足夠的靈活性，讓你可以基於邏輯問題將組件代碼拆分成更小的函數：

```vue
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```

在某種程度上，你可以將這些提取出的組合式函數看作是可以相互通信的組件範圍內的服務。

## 在選項式 API 中使用組合式函數 {#using-composables-in-options-api}

如果你正在使用選項式 API，組合式函數必須在 `setup()` 中調用。且其返回的綁定必須在 `setup()` 中返回，以便暴露給 `this` 及其模板：

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的屬性可以在通過 `this` 訪問到
    console.log(this.x)
  }
  // ...其他選項
}
```

## 與其他模式的比較 {#comparisons-with-other-techniques}

### 和 Mixin 的對比 {#vs-mixins}

Vue 2 的用戶可能會對 [mixins](/api/options-composition#mixins) 選項比較熟悉。它也讓我們能夠把組件邏輯提取到可複用的單元裡。然而 mixins 有三個主要的短板：

1. **不清晰的數據來源**：當使用了多個 mixin 時，實例上的數據屬性來自哪個 mixin 變得不清晰，這讓追溯實現和理解組件行為變得困難。這也是我們推薦在組合式函數中使用 ref + 解構模式的理由：讓屬性的來源在消費組件時一目瞭然。

2. **命名空間衝突**：多個來自不同作者的 mixin 可能會註冊相同的屬性名，造成命名衝突。若使用組合式函數，你可以通過在解構變量時對變量進行重命名來避免相同的鍵名。

3. **隱式的跨 mixin 交流**：多個 mixin 需要依賴共享的屬性名來進行相互作用，這使得它們隱性地耦合在一起。而一個組合式函數的返回值可以作為另一個組合式函數的參數被傳入，像普通函數那樣。

基於上述理由，我們不再推薦在 Vue 3 中繼續使用 mixin。保留該功能只是為了項目遷移的需求和照顧熟悉它的用戶。

### 和無渲染組件的對比 {#vs-renderless-components}

在組件插槽一章中，我們討論過了基於作用域插槽的[無渲染組件](/guide/components/slots#renderless-components)。我們甚至用它實現了一樣的鼠標追蹤器示例。

組合式函數相對於無渲染組件的主要優勢是：組合式函數不會產生額外的組件實例開銷。當在整個應用中使用時，由無渲染組件產生的額外組件實例會帶來無法忽視的性能開銷。

我們推薦在純邏輯複用時使用組合式函數，在需要同時複用邏輯和視圖佈局時使用無渲染組件。

### 和 React Hooks 的對比 {#vs-react-hooks}

如果你有 React 的開發經驗，你可能注意到組合式函數和自定義 React hooks 非常相似。組合式 API 的一部分靈感正來自於 React hooks，Vue 的組合式函數也的確在邏輯組合能力上與 React hooks 相近。然而，Vue 的組合式函數是基於 Vue 細粒度的響應性系統，這和 React hooks 的執行模型有本質上的不同。這一話題在[組合式 API 的常見問題](/guide/extras/composition-api-faq#comparison-with-react-hooks)中有更細緻的討論。

## 延伸閱讀 {#further-reading}

- [深入響應性原理](/guide/extras/reactivity-in-depth)：理解 Vue 響應性系統的底層細節。
- [狀態管理](/guide/scaling-up/state-management)：多個組件間共享狀態的管理模式。
- [測試組合式函數](/guide/scaling-up/testing#testing-composables)：組合式函數的單元測試技巧。
- [VueUse](https://vueuse.org/)：一個日益增長的 Vue 組合式函數集合。源代碼本身就是一份不錯的學習資料。
