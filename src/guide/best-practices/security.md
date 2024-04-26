# 安全 {#security}

## 報告漏洞 {#reporting-vulnerabilities}

當一個漏洞被上報時，它會立刻成為我們最關心的問題，會有全職的貢獻者暫時停止其他所有任務來解決這個問題。如需報告漏洞，請發送電子郵件至 [security@vuejs.org](mailto:security@vuejs.org)。

雖然很少發現新的漏洞，但我們仍建議始終使用最新版本的 Vue 及其官方配套庫，以確保你的應用盡可能地安全。

## 首要規則：不要使用無法信賴的模板 {#rule-no-1-never-use-non-trusted-templates}

使用 Vue 時最基本的安全規則就是**不要將無法信賴的內容作為你的組件模板**。使用無法信賴的模板相當於允許任意的 JavaScript 在你的應用中執行。更糟糕的是，如果在服務端渲染時執行了這些代碼，可能會導致服務器被攻擊。舉例來說：

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // 永遠不要這樣做！
}).mount('#app')
```

Vue 模板會被編譯成 JavaScript，而模板內的表達式將作為渲染過程的一部分被執行。儘管這些表達式在特定的渲染環境中執行，但由於全局執行環境的複雜性，Vue 作為一個開發框架，要在性能開銷合理的前提下完全避免潛在的惡意代碼執行是不現實的。避免這類問題最直接的方法是確保你的 Vue 模板始終是可信的，並且完全由你控制。

## Vue 自身的安全機制 {#what-vue-does-to-protect-you}

### HTML 內容 {#html-content}

無論是使用模板還是渲染函數，內容都是自動轉義的。這意味著在這個模板中：

```vue-html
<h1>{{ userProvidedString }}</h1>
```

如果 `userProvidedString` 包含了：

```js
'<script>alert("hi")</script>'
```

那麼它將被轉義為如下的 HTML：

```vue-html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

從而防止腳本注入。這種轉義是使用 `textContent` 這樣的瀏覽器原生 API 完成的，所以只有當瀏覽器本身存在漏洞時，才會存在漏洞。

### 屬性綁定 {#attribute-bindings}

同樣地，動態屬性的綁定也會被自動轉義。這意味著在這個模板中：

```vue-html
<h1 :title="userProvidedString">
  hello
</h1>
```

如果 `userProvidedString` 包含了：

```js
'" onclick="alert(\'hi\')'
```

那麼它將被轉義為如下的 HTML：

```vue-html
&quot; onclick=&quot;alert('hi')
```

從而防止在 `title` 屬性解析時，注入任意的 HTML。這種轉義是使用 `setAttribute` 這樣的瀏覽器原生 API 完成的，所以只有當瀏覽器本身存在漏洞時，才會存在漏洞。

## 潛在的危險 {#potential-dangers}

在任何 Web 應用中，允許以 HTML、CSS 或 JavaScript 形式執行未經無害化處理的、用戶提供的內容都有潛在的安全隱患，因此這應盡可能避免。不過，有時候一些風險或許是可以接受的。

例如，像 CodePen 和 JSFiddle 這樣的服務允許執行用戶提供的內容，但這是在 iframe 這樣一個可預期的沙盒環境中。當一個重要的功能本身會伴隨某種程度的漏洞時，就需要你自行權衡該功能的重要性和該漏洞所帶來的最壞情況。

### 注入 HTML {#html-injection}

我們現在已經知道 Vue 會自動轉義 HTML 內容，防止你意外地將可執行的 HTML 注入到你的應用中。然而，**在你知道 HTML 安全的情況下**，你還是可以顯式地渲染 HTML 內容。

- 使用模板：

  ```vue-html
  <div v-html="userProvidedHtml"></div>
  ```

- 使用渲染函數：

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- 以 JSX 形式使用渲染函數：

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::warning 警告
用戶提供的 HTML 永遠不能被認為是 100% 安全的，除非它在 iframe 這樣的沙盒環境中，或者該 HTML 只會被該用戶看到。此外，允許用戶編寫自己的 Vue 模板也會帶來類似的危險。
:::

### URL 注入 {#url-injection}

在這樣一個使用 URL 的場景中：

```vue-html
<a :href="userProvidedUrl">
  click me
</a>
```

如果這個 URL 允許通過 `javascript:` 執行 JavaScript，即沒有進行無害化處理，那麼就會有一些潛在的安全問題。可以使用一些庫來解決此類問題，比如 [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url)，但請注意：如果你發現你需要在前端做 URL 無害化處理，那你的應用已經存在一個更嚴重的安全問題了。**任何用戶提供的 URL 在被保存到數據庫之前都應該先在後端做無害化處理**。這樣，連接到你 API 的*每一個*客戶端都可以避免這個問題，包括原生移動應用。另外，即使是經過無害化處理的 URL，Vue 也不能保證它們指向安全的目的地。

### 樣式注入 {#style-injection}

我們來看這樣一個例子：

```vue-html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

我們假設 `sanitizedUrl` 已進行無害化處理，它是一個正常 URL 而非 JavaScript。然而，由於 `userProvidedStyles` 的存在，惡意用戶仍然能利用 CSS 進行“點擊劫持”，例如，可以在“登錄”按鈕上方覆蓋一個透明的鏈接。如果用戶控制的頁面 `https://user-controlled-website.com/` 專門仿造了你應用的登錄頁，那麼他們就有可能捕獲用戶的真實登錄信息。

你可以想象，如果允許在 `<style>` 元素中插入用戶提供的內容，會造成更大的漏洞，因為這使得用戶能控制整個頁面的樣式。因此 Vue 阻止了在模板中像這樣渲染 style 標籤：

```vue-html
<style>{{ userProvidedStyles }}</style>
```

為了避免用戶的點擊被劫持，我們建議僅在沙盒環境的 iframe 中允許用戶控制 CSS。或者，當用戶控制樣式綁定時，我們建議使用其[對象值形式](/guide/essentials/class-and-style#object-syntax-2)並僅允許用戶提供能夠安全控制的、特定的屬性，就像這樣：

```vue-html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### JavaScript 注入 {#javascript-injection}

我們強烈建議任何時候都不要在 Vue 中渲染 `<script>`，因為模板和渲染函數不應有其他副作用。但是，渲染 `<script>` 並不是插入在運行時執行的 JavaScript 字符串的唯一方法。

每個 HTML 元素都有能接受字符串形式 JavaScript 的屬性，例如 `onclick`、`onfocus` 和 `onmouseenter`。綁定任何用戶提供的 JavaScript 給這些事件屬性都具有潛在風險，因此需要避免這麼做。

:::warning 警告
用戶提供的 JavaScript 永遠不能被認為是 100% 安全的，除非它在 iframe 這樣的沙盒環境中，或者該段代碼只會在該用戶登錄的頁面上被執行。
:::

有時我們會收到漏洞報告，說在 Vue 模板中可以進行跨站腳本攻擊 (XSS)。一般來說，我們不認為這種情況是真正的漏洞，因為沒有切實可行的方法，能夠在以下兩種場景中保護開發者不受 XSS 的影響。

1. 開發者顯式地將用戶提供的、未經無害化處理的內容作為 Vue 模板渲染。這本身就是不安全的，Vue 也無從溯源。

2. 開發者將 Vue 掛載到可能包含服務端渲染或用戶提供內容的 HTML 頁面上，這與 \#1 的問題基本相同，但有時開發者可能會不知不覺地這樣做。攻擊者提供的 HTML 可能在普通 HTML 中是安全的，但在 Vue 模板中是不安全的，這就會導致漏洞。最佳實踐是：**不要將 Vue 掛載到可能包含服務端渲染或用戶提供內容的 DOM 節點上**。

## 最佳實踐 {#best-practices}

最基本的規則就是只要你允許執行未經無害化處理的、用戶提供的內容 (無論是 HTML、JavaScript 還是 CSS)，你就可能面臨攻擊。無論是使用 Vue、其他框架，或是不使用框架，道理都是一樣的。

除了上面為處理[潛在危險](#potential-dangers)提供的建議，我們也建議你熟讀下面這些資源：

- [HTML5 安全手冊](https://html5sec.org/)
- [OWASP 的跨站腳本攻擊 (XSS) 防護手冊](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

接著你可以利用學到的知識，來審查依賴項的源代碼，看看是否有潛在的危險，防止它們中的任何一個以第三方組件或其他方式影響 DOM 渲染的內容。

## 後端協調 {#backend-coordination}

類似跨站請求偽造 (CSRF/XSRF) 和跨站腳本引入 (XSSI) 這樣的 HTTP 安全漏洞，主要由後端負責處理，因此它們不是 Vue 職責範圍內的問題。但是，你應該與後端團隊保持溝通，瞭解如何更好地與後端 API 進行交互，例如，在提交表單時附帶 CSRF 令牌。

## 服務端渲染 (SSR) {#server-side-rendering-ssr}

在使用 SSR 時還有一些其他的安全注意事項，因此請確保遵循我們的 [SSR 文檔](/guide/scaling-up/ssr)給出的最佳實踐來避免產生漏洞。
