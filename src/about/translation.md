---
aside: deep
---

# 翻譯說明

此繁體中文文檔翻譯由 [@dy-xiaodong2022](https://github.com/dy-xiaodong2022/) 發起。

## 翻譯須知

請暫時移步至簡體中文官方倉庫的[維基頁面](https://github.com/vuejs-translations/docs-zh-cn/wiki/%E7%BF%BB%E8%AF%91%E9%A1%BB%E7%9F%A5)查閱。

## 協作指南

請暫時移步至簡體中文官方倉庫的[維基頁面](https://github.com/vuejs-translations/docs-zh-cn/wiki/%E5%8D%8F%E4%BD%9C%E6%8C%87%E5%8D%97)查閱。

> 編寫文檔是一種需要換位思考的練習。我們並不是在描述客觀現實，那是源代碼已經做到了的。我們的工作是幫助塑造用戶與 Vue 生態系統之間的關係。

<details>
<summary>原版翻譯說明，僅供備忘和歸檔</summary>

## 基本原則

翻譯工作追求的無外乎 “信、達、雅” 三個字，因此我們總結了以下原則：

1. **忠實原文，通俗易懂**，保證正確是最基本的要求。此外，還應該儘可能將一些特定概念降維，使得入門級讀者也能夠流暢閱讀。

2. **中文詞彙優先，特殊概念次之**：要儘可能地將文檔中的英語單詞譯作讀者好理解的詞彙。

   同時用詞應儘可能地從前端開發領域已有的詞彙中衍生。我們認為作為 Vue 文檔的譯者應承擔這樣一種職責：避免創建一套獨立於標準 JavaScript 環境之外、Vue 專屬的語境。

   但也有例外的情況，某些英文單詞我們傾向於選擇不翻譯、用原詞。開發者常常與一部分英語單詞打交道，許多英語單詞甚至作為了開發框架或操作系統的專有名詞，直接拋出這個單詞也的確能夠幫助用戶更好的理解、鎖定所講的是什麼概念。

3. **更符合中文的表述方式**：我們必須正視英語和中文本身的差異與不同，由於表達方式和語法結構的區別，常常一個結構複雜的多重定語從句很難逐字逐詞地直譯成中文，翻譯出的句子應符合母語者的敘述習慣，即儘可能避免英語式的倒裝（哪怕講述方式與作者原文有較大區別），表述儘可能口語化。最好的方式應該是將視線從單個句子中移出來，結合上下文先進行理解再用中文的習慣性表達將其重新複述出來。

## 格式規範

### 提交規範

可以參考 [這個網站](https://www.conventionalcommits.org/) 瞭解提交信息的既定書寫格式：

```text
<type>(<scope>): <subject>
^-------------^  ^-------^
|                |
|                +-> 主題。總結 commit 內容，用現在時書寫。
|
+-------> 目的: chore, docs, feat, fix, refactor, style, 或 test。<scope> 為可選項。

// 以下是 body 部分，這部分是可選的：
  hash: (對應到官方英文文檔的某次更新 commit hash)
  time: (由 `new Date().toLocaleString()` 生成的時間戳)
```

- 如果你貢獻提交的目的並不是與官方英文文檔同步內容相關，為 `chore` 或其他類型，body 部分可以省略。
- body 部分的信息只是為了在特定情況下方便溯源。

#### 釋義

- feat: (新功能，面向用戶)
- fix: (bug 修復，面向用戶)
- docs: (編輯文檔)
- style: (格式，如全角半角；對生產環境沒有影響)
- refactor: (例如重命名變量)
- test: (加入缺少的測試，對生產環境沒有影響)
- chore: (更新依賴等，對生產環境沒有影響)

### 文檔格式規範

#### 譯註寫法

1. 在原文需要加譯者注的位置添加角標：

```html
... <sup>[[1]](#footnote-1)</sup> ... <sup>[[2]](#footnote-2)</sup> ...
```

2. 在文章最末尾加入譯者注的內容，格式如下：

```html
<small>
  __譯者注__
  <a id="footnote-1"></a>[1] ... <a id="footnote-2"></a>[2] ...
  <a id="footnote-3"></a>[3] ...
</small>
```

#### 標點符號

- 逗號、句號、分號、冒號、歎號、問號，統一使用全角字符：，。；：！？
- 破折號使用：——
- 引號統一使用 “ ” 和 ‘ ’
- 括號統一使用全角括號 （）
- 非註釋部分的代碼除外，保留英文標點符號。

#### 內聯代碼或代碼關鍵字

- 務必用反引號（即英文輸入法下，按鍵盤上 Tab 鍵上方的那個鍵）將內容括起來。
- 包括代碼註釋中出現代碼或代碼關鍵字時，也要括起來。

#### 空格的使用

- 英文單詞和英文單詞之間要有一個空格
  `something in English`

- 中文和英文單詞之間要有一個空格
  `中文當中有 something 是英文`

- 英文單詞和標點符號之間沒有空格
  `這裡是一句中文，something 又是英文`

#### 鏈接、斜體、粗體與行內代碼等

對於 Markdown 中上述的行內簡單樣式，為了保證 Vitepress 中良好的渲染效果，我們提倡在文檔中使用如下的格式：

```markdown
<!-- 鏈接 -->

這是一個 [鏈接](https://github.com/vitejs/vite) 指向 Vite 官方倉庫

<!-- 加粗 -->

這是一個 **加粗** 的文字

<!-- 斜體 -->

這是一個 _斜體_ 的文字 <!-- Good -->
這是一個 _斜體_ 的文字 <!-- 不推薦，盡在下劃線效果不可用時作為替代使用 -->

<!-- 行內代碼 -->

這是一個 `code` 行內代碼
假如後面就是標點符號 `code`：
```

你可能已經注意到，默認情況下，在兩端我們都加上了空格。

**此處的某些規則可能暫時和舊有的 [Vue.js 中文文檔的風格](https://github.com/vuejs/cn.vuejs.org/wiki) 不太一致**，如果你曾參與過 Vue 中文文檔相關工作，可能與你的習慣有一定區別。

這是為了保證文檔視圖中不會出現字符靠太近而黏合的問題。

關於文檔中的鏈接，針對以下兩種 Markdown 書寫：

```markdown
<!-- 鏈接前後帶空格  -->

Vite 支持了一套 [通用插件 API](./api-plugin) 擴展了 Rollup 的插件接口

<!-- 鏈接前後不帶空格 -->

Vite 支持了一套[通用插件 API](./api-plugin)擴展了 Rollup 的插件接口
```

Vitepress 和 Vuepress 中對以上兩種寫法的渲染視覺效果為：

**鏈接前後帶空格**

![鏈接前後帶空格](/images/link-with-around-spaces.png)

**鏈接前後不帶空格**

![鏈接前後不帶空格](/images/link-without-around-spaces.png)

不帶空格的形式 與 帶空格相比，沒有那麼突出。

同樣這類情況還包括 Markdown 中的斜體字：

```markdown
這是一個_斜體_嘗試 <!-- Vitepress 和 Vuepress 中無效！  -->

這是一個*斜體*嘗試 <!-- 前後無空格 -->

這是一個 *斜體* 嘗試 <!-- 前後有空格 -->
```

下面是效果，不帶空格的情況看上去中文字體的筆畫之間會接在一起，變得很擁擠，觀感較差。

![斜體嘗試](/images/italic-demo.png)

#### 關於加粗和斜體格式的約定

根據 [GitHub Flavored Markdown Spec](https://github.github.com/gfm/#emphasis-and-strong-emphasis)，用成對的星號或下劃線都可以用來代表加粗或斜體，但是使用下劃線的時候存在更多的特殊條件限制，例如：

> `5*6*78` → `<p>5<em>6</em>78</p>` https://github.github.com/gfm/#example-346
>
> `5_6_78` → `<p>5_6_78</p>` https://github.github.com/gfm/#example-351

經過討論，考慮到 GFM 的規範以及中文的特殊情況，決定：

- 中文翻譯統一使用星號來標註加粗和斜體，而不是使用下劃線，同時尊重英文版自身的用法。
- 仍然不能正確渲染的地方，允許適當調整包含或不包含加粗或斜體部分兩側的標點符號。參見 [這個例子](https://github.com/vuejs/composition-api-rfc/pull/30/files)。
- 仍然不能正確渲染的地方，手動使用 `<strong>` 或 `<em>` 標記。

## 術語翻譯參考

| 英文 | 建議翻譯 | 備註 |
| --- | --- | --- |
| property | 屬性 | 組件的屬性（數據、計算屬性等） |
| attribute | _不翻譯_ | 特指 HTML 元素上的屬性 |
| getter | _一般不翻譯_ | 計算屬性中作計算函數 |
| setter | _一般不翻譯_ | 計算屬性中作設置函數 |
| prop | _不翻譯_ | |
| ref | _不翻譯_ | |
| feature/functionality | 功能 | |
| directive | 指令 | |
| mixin | 混入 | |
| listen/listener | 監聽/監聽器 | |
| observe/observer | 偵聽/偵聽器 | |
| watch/watcher | 偵聽/偵聽器 | |
| normalize (HTML code, ...) | 規範化 | |
| standardize | 標準化 | |
| fire/trigger (事件) | 觸發 | |
| emit (某個值或事件) | 拋出 | |
| queue (v.) | 把……加入隊列 | |
| workaround (n.) | 變通辦法 | |
| workaround (v.) | 繞過 | |
| convention | 約定 | |
| parse | 解析 | |
| stringify | 字符串化 | |
| side effect | 副作用 | |
| declarative | 聲明式 | |
| imperative | 命令式 | |
| handler | 處理函數 | |
| you | 你 (而不用 “您”) | |
| computed | 計算屬性 | |
| computed property | 計算屬性 | |
| guard | 守衛 | |
| hook | 鉤子 | |
| selector | 選擇器 | |
| truthy | 真值 | 需加 MDN 的解釋作為譯註 |
| falsy | 假值 | 需加 MDN 的解釋作為譯註 |
| mutate/mutation | 變更 | |
| immutable | 不可變 | |
| mutable | 可變 | |

- MDN - `truthy` → https://developer.mozilla.org/en-US/docs/Glossary/Truthy
- MDN - `falsy` → https://developer.mozilla.org/en-US/docs/Glossary/Falsy

## 工作流

### 更新內容同步策略

此中文文檔由 [印記中文](https://docschina.org/) 團隊進行翻譯，它們也是 Vite 官方中文文檔背後的翻譯維護團隊。

[QC-L](https://github.com/QC-L) 曾在 Vue 文檔的討論區提出過這套 [中英文檔同步工作流](https://github.com/vuejs/docs-next-zh-cn/discussions/522#discussioncomment-779521)，這也是 Vite 官方中文文檔正在使用的一套工作流。

- 保留英文文檔的原始 commit 記錄，以保證可以對後續的更新進行再翻譯、合併
- 由於 Vue 文檔以 Markdown 書寫，每一行成一個自然段。因此在 Markdown 文檔中原則上應該保證中英文行號一一對應，以保證後續更新時位置不發生錯亂
- 由機器人每日定時從英文文檔倉庫同步新的提交，並生成 Pull Request 交由翻譯團隊 Review、翻譯並最終合入中文文檔

### 錨點鏈接的統一化

:::tip 插件支持
我們提供了一個包含此項功能的 [Vue 官方文檔翻譯助手插件](https://marketplace.visualstudio.com/items?itemName=shenqingchuan.vue-docs-tr-helper)，你可以在 VSCode 中安裝，並遵照 README 的指引來使用。
:::

在 Markdown 文檔中 `[title](link)` 形式的鏈接非常常用，而 Vue 文檔中大量使用了這一語法，用來作章節的跳轉。

鏈接中有時還會帶有錨點（以 `#` 作前綴）用來定位到頁面的對應位置，例如 `[props 大小寫格式](/guide/components/props.html#prop-name-casing)`。

但是在 VitePress 中，由於錨點是對應 Markdown 內容中的 “標題行” 的，因此若改動了英文內容的標題行，別處引用此處的錨點就是失效了：

```markdown
<!-- 英文文檔中該標題行為 -->

## Props name casing

<!-- 中文文檔將標題翻譯為 -->

## Props 大小寫格式

<!-- 此時這個鏈接在頁面上無法正常跳轉 -->

[props 大小寫格式](/guide/components/props.html#prop-name-casing)
```

若將鏈接中的錨點也改為中文內容的確可以暫時解決問題，但若後續該標題有改動，又需要修改所有引用了該錨點的地方，可維護性較差。

因此我們提供了一種特殊的錨點標記：

```markdown
<!-- 標記的內容就是原來的錨點 -->

## Props 大小寫格式 {#props-name-casing}
```

我們會為 VitePress 提供處理這個標記的邏輯，保證它不會在頁面上顯示出來。

但也有需要注意的例外情況：若按上面的方式為一篇文章的所有標題行都生成了標記，但文章中出現了兩個相同的標記，例如 “類和 CSS 樣式” 章節中的 “綁定對象” 小節，可以為其加上數字標記，保證其在文章中的唯一性。

此外，由於文章的總標題也被加上了錨點標記，導致在開發環境下，瀏覽器的標籤頁上會看到標記。但在構建發佈時，我們運行了一個腳本，為文檔的 frontmatter 中添加了不含標記的 `title`，因此讀者將不會看到該標記。

</details>

<!-- zhlint disabled -->
