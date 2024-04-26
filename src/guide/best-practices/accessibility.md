# 無障礙訪問 {#accessibility}

Web 無障礙訪問 (也稱為 a11y) 是指創建可供任何人使用的網站的做法——無論是身患某種障礙、通過慢速的網絡連接訪問、使用老舊或損壞的硬件，還是僅處於某種不方便的環境。例如，在視頻中添加字幕可以幫助失聰、有聽力障礙或身處嘈雜環境而聽不到手機的用戶。同樣地，確保文字樣式沒有處於太低的對比度，可以對低視力用戶和在明亮的強光下使用手機的用戶都有所幫助。

你是否已經準備開始卻又無從下手？

請先閱讀由[萬維網聯盟 (W3C)](https://www.w3.org/) 提供的 [Web 無障礙訪問的規劃和管理](https://www.w3.org/WAI/planning-and-managing/)。

## 跳過鏈接 {#skip-link}

你應該在每個頁面的頂部添加一個直接指向主內容區域的鏈接，這樣用戶就可以跳過在多個網頁上重複的內容。

通常這個鏈接會放在 `App.vue` 的頂部，這樣它就會是所有頁面上的第一個可聚焦元素：

```vue-html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink" class="skip-link">Skip to main content</a>
  </li>
</ul>
```

若想在非聚焦狀態下隱藏該鏈接，可以添加以下樣式：

```css
.skip-link {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skip-link:focus {
  opacity: 1;
  background-color: white;
  padding: 0.5em;
  border: 1px solid black;
}
```

一旦用戶改變路由，請將焦點放回到這個“跳過”鏈接。通過如下方式聚焦“跳過”鏈接的模板引用 (假設使用了 `vue-router`) 即可實現：

<div class="options-api">

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus()
    }
  }
}
</script>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const skipLink = ref()

watch(
  () => route.path,
  () => {
    skipLink.value.focus()
  }
)
</script>
```

</div>

[閱讀關於跳過鏈接到主要內容的文檔](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## 內容結構 {#content-structure}

確保設計可以支持易於訪問的實現是無障礙訪問最重要的部分之一。設計不僅要考慮顏色對比度、字體選擇、文本大小和語言，還要考慮應用中的內容是如何組織的。

### 標題 {#headings}

用戶可以通過標題在應用中進行導航。為應用的每個部分設置描述性標題，這可以讓用戶更容易地預測每個部分的內容。說到標題，有幾個推薦的無障礙訪問實踐：

- 按級別順序嵌套標題：`<h1>` - `<h6>`
- 不要在一個章節內跳躍標題的級別
- 使用實際的標題標記，而不是通過對文本設置樣式以提供視覺上的標題

[閱讀更多有關標題的信息](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```vue-html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title-1">
    <h2 id="section-title-1"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- 內容 -->
  </section>
  <section aria-labelledby="section-title-2">
    <h2 id="section-title-2"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- 內容 -->
    <h3>Section Subtitle</h3>
    <!-- 內容 -->
  </section>
</main>
```

### Landmarks {#landmarks}

[Landmark](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) 會為應用中的章節提供訪問規劃。依賴輔助技術的用戶可以跳過內容直接導航到應用的每個部分。你可以使用 [ARIA role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) 幫助你實現這個目標。

| HTML    | ARIA Role            | 地標的目的 |
|---------| -------------------- | --------- |
| header  | role="banner"        | 主標題：頁面的標題 |
| nav     | role="navigation"    | 適合用作文檔或相關文檔導航的鏈接集合 |
| main    | role="main"          | 文檔的主體或中心內容 |
| footer  | role="contentinfo"   | 關於父級文檔的信息：腳註/版權/隱私聲明鏈接 |
| aside   | role="complementary" | 用來支持主內容，同時其自身的內容是相對獨立且有意義的 |
| search  | role="search"        | 該章節包含整個應用的搜索功能 |
| form    | role="form"          | 表單相關元素的集合 |
| section | role="region"        | 相關的且用戶可能會導航至此的內容。必須為該元素提供 label |


:::tip 提示：
建議同時使用 landmark HTML 元素和 role 屬性，以最大程度地兼容[不支持 HTML5 語義元素的傳統瀏覽器](https://caniuse.com/#feat=html5semantic)。
:::

[閱讀更多有關標題的細節](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)

## 語義化表單 {#semantic-forms}

當創建一個表單，你可能使用到以下幾個元素：`<form>`、`<label>`、`<input>`、`<textarea>` 和 `<button>`。

標籤通常放置在表格字段的頂部或左側：

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

請注意這裡我們是如何在表單元素中引入 `autocomplete='on'` 的，它將應用於表單中的所有 input 框。你也可以為每個 input 框都設置不同的 [autocomplete attribute 的值](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)。

### 標籤 {#labels}

提供標籤來描述所有表單控件的用途；使 `for` 和 `id` 鏈接起來：

```vue-html
<label for="name">Name: </label>
<input type="text" name="name" id="name" v-model="name" />
```

如果你在 Chrome 開發工具中檢查這個元素，並打開 Elements 選項卡中的 Accessibility 選項卡，你將看到輸入是如何從標籤中獲取其名稱的：

![Chrome 開發者工具正在通過標籤展示無障礙訪問的 input 框的名字](./images/AccessibleLabelChromeDevTools.png)

:::warning 警告：
你可能還見過這樣的包裝 input 框的標籤：

```vue-html
<label>
  Name：
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

但我們仍建議你顯式地為 input 元素設置 id 相匹配的標籤，以更好地實現無障礙訪問。
:::

#### `aria-label` {#aria-label}

你也可以為 input 框配置一個帶有 [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) 的無障礙訪問名。

```vue-html
<label for="name">Name: </label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

在 Chrome DevTools 中審查此元素，查看無障礙名稱是如何更改的：

![Chrome 開發者工具正在通過 aria-label 展示無障礙訪問的 input 框名字](./images/AccessibleARIAlabelDevTools.png)

#### `aria-labelledby` {#aria-labelledby}

使用 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) 類似於 `aria-label`，除非標籤文本在屏幕上可見。它通過 `id` 與其他元素配對，你可以連結多個 `id`：

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

![Chrome 開發者工具通過 aria-labelledby 展示 input 的無障礙訪問名稱](./images/AccessibleARIAlabelledbyDevTools.png)

#### `aria-describedby` {#aria-describedby}

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) 的用法與 `aria-labelledby` 相同，它提供了一條用戶可能需要的附加描述信息。這可用於描述任何輸入的標準：

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name: </label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

你可以通過使用 Chrome 開發工具來查看說明：

![Chrome 開發者工具正在根據 aria-labelledby 和 aria-describedby 展示 input 的無障礙訪問名和無障礙訪問描述信息](./images/AccessibleARIAdescribedby.png)

### 佔位符 {#placeholder}

避免使用佔位符，因為它們可能會使許多用戶感到困惑。

佔位符的缺陷之一是默認情況下它們不符合[顏色對比度標準](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)；應當修改其顏色，讓它看起來像是預先填入 input 框中的數據一樣。查看以下示例，可以看到滿足顏色對比度條件的姓氏佔位符看起來像預填充的數據：

![可訪問的佔位文本](./images/AccessiblePlaceholder.png)

```vue-html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      type="text"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
      :placeholder="item.placeholder"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

```css
/* https://www.w3schools.com/howto/howto_css_placeholder.asp */

#lastName::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: black;
  opacity: 1; /* Firefox */
}

#lastName:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: black;
}

#lastName::-ms-input-placeholder {
  /* Microsoft Edge */
  color: black;
}
```

最好在表單外提供所有用戶需要填寫輸入的信息。

### 用法說明 {#instructions}

添加用法說明時，請確保將其正確鏈接到目標 input 框。你可以提供附加用法說明並在 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) 內綁定多個 id。這可以使設計更加靈活。

```vue-html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date: </label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

或者，你可以通過 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) 將用法說明附加到 input 框上。

```vue-html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth: </label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

### 隱藏內容 {#hiding-content}

通常，即使 input 框具有無障礙的名稱，也不建議在視覺上隱藏標籤。但是，如果可以藉助周圍的內容來理解輸入的功能，那麼我們也可以隱藏視覺標籤。

讓我們看看這個搜索框：

```vue-html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

現在，只要視力情況良好，用戶可以就能通過按鈕的內容識別出該 input 框的目的。

此時我們可以使用 CSS 從視覺上隱藏元素，同時也不會影響到無障礙訪問：

```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

#### `aria-hidden="true"` {#aria-hidden-true}

添加 `aria-hidden="true"` 在無障礙訪問時被隱藏，但對其他可視用戶仍然是可見的。不要在可聚焦的元素上使用它，請只在裝飾性的、重複的或屏幕外的內容上使用它。

```vue-html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### 按鈕 {#buttons}

在表單中使用按鈕時，必須設置類型以防止提交表單。
你也可以使用一個 input 元素來創建按鈕：

```vue-html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- 按鈕 -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- 輸入按鈕 -->
  <input type="button" value="Cancel" />
  <input type="submit" value="Submit" />
</form>
```

### 功能圖片 {#functional-images}

你可以使用這種方式來創建一個帶有功能的圖片。

- input 框

  - 這些圖片會像一個類型為 submit 的表單按鈕一樣

  ```vue-html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- 圖標

```vue-html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

## 規範 {#standards}

萬維網聯盟 (W3C) Web 無障礙訪問倡議 (WAI) 為不同的組件制定了 Web 無障礙性標準：

- [用戶代理無障礙訪問指南 (UAAG)](https://www.w3.org/WAI/standards-guidelines/uaag/)
  - 瀏覽器和媒體查詢，包括一些其他方面的輔助技術
- [創作工具無障礙訪問指南 (ATAG)](https://www.w3.org/WAI/standards-guidelines/atag/)
  - 創作工具
- [Web 內容無障礙訪問指南 (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
  - 網站內容 - 由開發者、創作工具和無障礙訪問評估工具使用。

### 網絡內容無障礙指南 (WCAG) {#web-content-accessibility-guidelines-wcag}

[WCAG 2.1](https://www.w3.org/TR/WCAG21/) 繼承自 [WCAG 2.0](https://www.w3.org/TR/WCAG20/)，接納 Web 演進過程中的新技術。W3C 鼓勵在開發或更新 Web 無障礙訪問策略時使用 WCAG 的最新版本。

#### WCAG 2.1 四大指導原則 (縮寫 POUR)：{#wcag-2-1-four-main-guiding-principles-abbreviated-as-pour}

- [可感知性](https://www.w3.org/TR/WCAG21/#perceivable)
  - 用戶必須能夠感知所渲染的信息
- [可操作性](https://www.w3.org/TR/WCAG21/#operable)
  - 表單界面，控件和導航是可操作的
- [可理解性](https://www.w3.org/TR/WCAG21/#understandable)
  - 信息和用戶界面的操作必須為所有用戶所理解
- [健壯性](https://www.w3.org/TR/WCAG21/#robust)
  - 隨著技術的進步，用戶必須能夠訪問內容

#### Web 無障礙倡議 – 無障礙訪問豐富的互聯網應用 (WAI-ARIA) {#web-accessibility-initiative-–-accessible-rich-internet-applications-wai-aria}

W3C 的 WAI-ARIA 為如何構建動態內容和高階用戶界面控件提供了指導。

- [可便捷訪問的豐富互聯網應用 (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA 實踐 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

## 資源 {#resources}

### 文檔 {#documentation}

- [WCAG 2.0](https://www.w3.org/TR/WCAG20/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/TR/wai-aria-practices-1.2/)

### 輔助技術 {#assistive-technologies}

- 屏幕助讀器
  - [NVDA](https://www.nvaccess.org/download/)
  - [VoiceOver](https://www.apple.com/accessibility/mac/vision/)
  - [JAWS](https://www.freedomscientific.com/products/software/jaws/?utm_term=jaws%20screen%20reader&utm_source=adwords&utm_campaign=All+Products&utm_medium=ppc&hsa_tgt=kwd-394361346638&hsa_cam=200218713&hsa_ad=296201131673&hsa_kw=jaws%20screen%20reader&hsa_grp=52663682111&hsa_net=adwords&hsa_mt=e&hsa_src=g&hsa_acc=1684996396&hsa_ver=3&gclid=Cj0KCQjwnv71BRCOARIsAIkxW9HXKQ6kKNQD0q8a_1TXSJXnIuUyb65KJeTWmtS6BH96-5he9dsNq6oaAh6UEALw_wcB)
  - [ChromeVox](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)
- 縮放工具
  - [MAGic](https://www.freedomscientific.com/products/software/magic/)
  - [ZoomText](https://www.freedomscientific.com/products/software/zoomtext/)
  - [Magnifier](https://support.microsoft.com/en-us/help/11542/windows-use-magnifier-to-make-things-easier-to-see)

### 測試 {#testing}

- 自動化相關的工具
  - [Lighthouse](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
  - [WAVE](https://chrome.google.com/webstore/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)
  - [ARC Toolkit](https://chrome.google.com/webstore/detail/arc-toolkit/chdkkkccnlfncngelccgbgfmjebmkmce?hl=en-US)
- 顏色相關的工具
  - [WebAim Color Contrast](https://webaim.org/resources/contrastchecker/)
  - [WebAim Link Color Contrast](https://webaim.org/resources/linkcontrastchecker)
- 其他有用的工具
  - [HeadingMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi?hl=en…)
  - [Color Oracle](https://colororacle.org)
  - [NerdeFocus](https://chrome.google.com/webstore/detail/nerdefocus/lpfiljldhgjecfepfljnbjnbjfhennpd?hl=en-US…)
  - [Visual Aria](https://chrome.google.com/webstore/detail/visual-aria/lhbmajchkkmakajkjenkchhnhbadmhmk?hl=en-US)
  - [Silktide Website Accessibility Simulator](https://chrome.google.com/webstore/detail/silktide-website-accessib/okcpiimdfkpkjcbihbmhppldhiebhhaf?hl=en-US)

### 用戶 {#users}

世界衛生組織估計，全世界 15% 的人口患有某種形式的殘疾，其中約 2 - 4% 的人嚴重殘疾。估計全世界有 10 億殘障人士，他們是世界上最大的少數群體。

殘疾的種類繁多，大致可分為以下四類：

- _[視覺](https://webaim.org/articles/visual/)_ - 可以為這些用戶提供屏幕助讀器、屏幕縮放、控制屏幕對比度或盲文顯示等幫助。
- _[聽覺](https://webaim.org/articles/auditory/)_ - 可以為這些用戶提供視頻字幕、文字記錄或手語視頻。
- _[運動能力](https://webaim.org/articles/motor/)_ - 可以為這些用戶提供一系列[運動障礙輔助技術](https://webaim.org/articles/motor/assistive)：比如語音識別軟件、眼球跟蹤、單刀式開關、超大軌跡球鼠標、自適應鍵盤等等。
- _[認知能力](https://webaim.org/articles/cognitive/)_ - 可以為這些用戶提供補充媒體、更清晰和簡單、更結構化的內容。

你可以查看以下來自 WebAim 的鏈接，更深入地瞭解這些用戶的需求：

- [Web 無障礙願景：探索改變 & 人人受益](https://www.w3.org/WAI/perspective-videos/)
- [Web 用戶的故事](https://www.w3.org/WAI/people-use-web/user-stories/)
