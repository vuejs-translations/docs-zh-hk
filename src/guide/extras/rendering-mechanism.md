---
outline: deep
---

# 渲染機制 {#rendering-mechanism}

Vue 是如何將一份模板轉換為真實的 DOM 節點的，又是如何高效地更新這些節點的呢？我們接下來就將嘗試通過深入研究 Vue 的內部渲染機制來解釋這些問題。

## 虛擬 DOM {#virtual-dom}

你可能已經聽說過“虛擬 DOM”的概念了，Vue 的渲染系統正是基於這個概念構建的。

虛擬 DOM (Virtual DOM，簡稱 VDOM) 是一種編程概念，意為將目標所需的 UI 通過數據結構“虛擬”地表示出來，保存在內存中，然後將真實的 DOM 與之保持同步。這個概念是由 [React](https://reactjs.org/) 率先開拓，隨後被許多不同的框架採用，當然也包括 Vue。

與其說虛擬 DOM 是一種具體的技術，不如說是一種模式，所以並沒有一個標準的實現。我們可以用一個簡單的例子來說明：

```js
const vnode = {
  type: 'div',
  props: {
    id: 'hello'
  },
  children: [
    /* 更多 vnode */
  ]
}
```

這裡所說的 `vnode` 即一個純 JavaScript 的對象 (一個“虛擬節點”)，它代表著一個 `<div>` 元素。它包含我們創建實際元素所需的所有信息。它還包含更多的子節點，這使它成為虛擬 DOM 樹的根節點。

一個運行時渲染器將會遍歷整個虛擬 DOM 樹，並據此構建真實的 DOM 樹。這個過程被稱為**掛載** (mount)。

如果我們有兩份虛擬 DOM 樹，渲染器將會有比較地遍歷它們，找出它們之間的區別，並應用這其中的變化到真實的 DOM 上。這個過程被稱為**更新** (patch)，又被稱為“比對”(diffing) 或“協調”(reconciliation)。

虛擬 DOM 帶來的主要收益是它讓開發者能夠靈活、聲明式地創建、檢查和組合所需 UI 的結構，同時只需把具體的 DOM 操作留給渲染器去處理。

## 渲染管線 {#render-pipeline}

從高層面的角度看，Vue 組件掛載時會發生如下幾件事：

1. **編譯**：Vue 模板被編譯為**渲染函數**：即用來返回虛擬 DOM 樹的函數。這一步驟可以通過構建步驟提前完成，也可以通過使用運行時編譯器即時完成。

2. **掛載**：運行時渲染器調用渲染函數，遍歷返回的虛擬 DOM 樹，並基於它創建實際的 DOM 節點。這一步會作為[響應式副作用](./reactivity-in-depth)執行，因此它會追蹤其中所用到的所有響應式依賴。

3. **更新**：當一個依賴發生變化後，副作用會重新運行，這時候會創建一個更新後的虛擬 DOM 樹。運行時渲染器遍歷這棵新樹，將它與舊樹進行比較，然後將必要的更新應用到真實 DOM 上去。

![render pipeline](./images/render-pipeline.png)

<!-- https://www.figma.com/file/elViLsnxGJ9lsQVsuhwqxM/Rendering-Mechanism -->

## 模板 vs. 渲染函數 {#templates-vs-render-functions}

Vue 模板會被預編譯成虛擬 DOM 渲染函數。Vue 也提供了 API 使我們可以不使用模板編譯，直接手寫渲染函數。在處理高度動態的邏輯時，渲染函數相比於模板更加靈活，因為你可以完全地使用 JavaScript 來構造你想要的 vnode。

那麼為什麼 Vue 默認推薦使用模板呢？有以下幾點原因：

1. 模板更貼近實際的 HTML。這使得我們能夠更方便地重用一些已有的 HTML 代碼片段，能夠帶來更好的可訪問性體驗、能更方便地使用 CSS 應用樣式，並且更容易使設計師理解和修改。

2. 由於其確定的語法，更容易對模板做靜態分析。這使得 Vue 的模板編譯器能夠應用許多編譯時優化來提升虛擬 DOM 的性能表現 (下面我們將展開討論)。

在實踐中，模板對大多數的應用場景都是夠用且高效的。渲染函數一般只會在需要處理高度動態渲染邏輯的可重用組件中使用。想了解渲染函數的更多使用細節可以去到[渲染函數 & JSX](./render-function) 章節繼續閱讀。

## 帶編譯時信息的虛擬 DOM {#compiler-informed-virtual-dom}

虛擬 DOM 在 React 和大多數其他實現中都是純運行時的：更新算法無法預知新的虛擬 DOM 樹會是怎樣，因此它總是需要遍歷整棵樹、比較每個 vnode 上 props 的區別來確保正確性。另外，即使一棵樹的某個部分從未改變，還是會在每次重渲染時創建新的 vnode，帶來了大量不必要的內存壓力。這也是虛擬 DOM 最受詬病的地方之一：這種有點暴力的更新過程通過犧牲效率來換取聲明式的寫法和最終的正確性。

但實際上我們並不需要這樣。在 Vue 中，框架同時控制著編譯器和運行時。這使得我們可以為緊密耦合的模板渲染器應用許多編譯時優化。編譯器可以靜態分析模板並在生成的代碼中留下標記，使得運行時盡可能地走捷徑。與此同時，我們仍然保留了邊界情況時用戶想要使用底層渲染函數的能力。我們稱這種混合解決方案為**帶編譯時信息的虛擬 DOM**。

下面，我們將討論一些 Vue 編譯器用來提高虛擬 DOM 運行時性能的主要優化：

### 靜態提升 {#static-hoisting}

在模板中常常有部分內容是不帶任何動態綁定的：

```vue-html{2-3}
<div>
  <div>foo</div> <!-- 需提升 -->
  <div>bar</div> <!-- 需提升 -->
  <div>{{ dynamic }}</div>
</div>
```

[在模板編譯預覽中查看](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2PmZvbzwvZGl2PiA8IS0tIGhvaXN0ZWQgLS0+XG4gIDxkaXY+YmFyPC9kaXY+IDwhLS0gaG9pc3RlZCAtLT5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj5cbiIsIm9wdGlvbnMiOnsiaG9pc3RTdGF0aWMiOnRydWV9fQ==)

`foo` 和 `bar` 這兩個 div 是完全靜態的，沒有必要在重新渲染時再次創建和比對它們。Vue 編譯器自動地會提升這部分 vnode 創建函數到這個模板的渲染函數之外，並在每次渲染時都使用這份相同的 vnode，渲染器知道新舊 vnode 在這部分是完全相同的，所以會完全跳過對它們的差異比對。

此外，當有足夠多連續的靜態元素時，它們還會再被壓縮為一個“靜態 vnode”，其中包含的是這些節點相應的純 HTML 字符串。([示例](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdiBjbGFzcz1cImZvb1wiPmZvbzwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiZm9vXCI+Zm9vPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJmb29cIj5mb288L2Rpdj5cbiAgPGRpdj57eyBkeW5hbWljIH19PC9kaXY+XG48L2Rpdj4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlfX0=))。這些靜態節點會直接通過 `innerHTML` 來掛載。同時還會在初次掛載後緩存相應的 DOM 節點。如果這部分內容在應用中其他地方被重用，那麼將會使用原生的 `cloneNode()` 方法來克隆新的 DOM 節點，這會非常高效。

### 更新類型標記 {#patch-flags}

對於單個有動態綁定的元素來說，我們可以在編譯時推斷出大量信息：

```vue-html
<!-- 僅含 class 綁定 -->
<div :class="{ active }"></div>

<!-- 僅含 id 和 value 綁定 -->
<input :id="id" :value="value">

<!-- 僅含文本子節點 -->
<div>{{ dynamic }}</div>
```

[在模板編譯預覽中查看](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2IDpjbGFzcz1cInsgYWN0aXZlIH1cIj48L2Rpdj5cblxuPGlucHV0IDppZD1cImlkXCIgOnZhbHVlPVwidmFsdWVcIj5cblxuPGRpdj57eyBkeW5hbWljIH19PC9kaXY+Iiwib3B0aW9ucyI6e319)

在為這些元素生成渲染函數時，Vue 在 vnode 創建調用中直接編碼了每個元素所需的更新類型：

```js{3}
createElementVNode("div", {
  class: _normalizeClass({ active: _ctx.active })
}, null, 2 /* CLASS */)
```

最後這個參數 `2` 就是一個[更新類型標記 (patch flag)](https://github.com/vuejs/core/blob/main/packages/shared/src/patchFlags.ts)。一個元素可以有多個更新類型標記，會被合併成一個數字。運行時渲染器也將會使用[位運算](https://en.wikipedia.org/wiki/Bitwise_operation)來檢查這些標記，確定相應的更新操作：

```js
if (vnode.patchFlag & PatchFlags.CLASS /* 2 */) {
  // 更新節點的 CSS class
}
```

位運算檢查是非常快的。通過這樣的更新類型標記，Vue 能夠在更新帶有動態綁定的元素時做最少的操作。

Vue 也為 vnode 的子節點標記了類型。舉例來說，包含多個根節點的模板被表示為一個片段 (fragment)，大多數情況下，我們可以確定其順序是永遠不變的，所以這部分信息就可以提供給運行時作為一個更新類型標記。

```js{4}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

運行時會完全跳過對這個根片段中子元素順序的重新協調過程。

### 樹結構打平 {#tree-flattening}

再來看看上面這個例子中生成的代碼，你會發現所返回的虛擬 DOM 樹是經一個特殊的 `createElementBlock()` 調用創建的：

```js{2}
export function render() {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    /* children */
  ], 64 /* STABLE_FRAGMENT */))
}
```

這裡我們引入一個概念“區塊”，內部結構是穩定的一個部分可被稱之為一個區塊。在這個用例中，整個模板只有一個區塊，因為這裡沒有用到任何結構性指令 (例如 `v-if` 或者 `v-for`)。

每一個塊都會追蹤其所有帶更新類型標記的後代節點 (不只是直接子節點)，舉例來說：

```vue-html{3,5}
<div> <!-- root block -->
  <div>...</div>         <!-- 不會追蹤 -->
  <div :id="id"></div>   <!-- 要追蹤 -->
  <div>                  <!-- 不會追蹤 -->
    <div>{{ bar }}</div> <!-- 要追蹤 -->
  </div>
</div>
```

編譯的結果會被打平為一個數組，僅包含所有動態的後代節點：

```
div (block root)
- div 帶有 :id 綁定
- div 帶有 {{ bar }} 綁定
```

當這個組件需要重新渲染時，只需要遍歷這個打平的樹而非整棵樹。這也就是我們所說的**樹結構打平**，這大大減少了我們在虛擬 DOM 協調時需要遍歷的節點數量。模板中任何的靜態部分都會被高效地略過。

`v-if` 和 `v-for` 指令會創建新的區塊節點：

```vue-html
<div> <!-- 根區塊 -->
  <div>
    <div v-if> <!-- if 區塊 -->
      ...
    <div>
  </div>
</div>
```

一個子區塊會在父區塊的動態子節點數組中被追蹤，這為他們的父區塊保留了一個穩定的結構。

### 對 SSR 激活的影響 {#impact-on-ssr-hydration}

更新類型標記和樹結構打平都大大提升了 Vue [SSR 激活](/guide/scaling-up/ssr#client-hydration)的性能表現：

- 單個元素的激活可以基於相應 vnode 的更新類型標記走更快的捷徑。

- 在激活時只有區塊節點和其動態子節點需要被遍歷，這在模板層面上實現更高效的部分激活。
