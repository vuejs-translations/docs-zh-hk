# 事件處理 {#event-handling}

## 監聽事件 {#listening-to-events}

我們可以使用 `v-on` 指令 (簡寫為 `@`) 來監聽 DOM 事件，並在事件觸發時執行對應的 JavaScript。用法：`v-on:click="handler"` 或 `@click="handler"`。

事件處理器 (handler) 的值可以是：

1. **內聯事件處理器**：事件被觸發時執行的內聯 JavaScript 語句 (與 `onclick` 類似)。

2. **方法事件處理器**：一個指向組件上定義的方法的屬性名或是路徑。

## 內聯事件處理器 {#inline-handlers}

內聯事件處理器通常用於簡單場景，例如：

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## 方法事件處理器 {#method-handlers}

隨著事件處理器的邏輯變得愈發複雜，內聯代碼方式變得不夠靈活。因此 `v-on` 也可以接受一個方法名或對某個方法的調用。

舉例來說：

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` 是 DOM 原生事件
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // 方法中的 `this` 指向當前活躍的組件實例
    alert(`Hello ${this.name}!`)
    // `event` 是 DOM 原生事件
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` 是上面定義過的方法名 -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

方法事件處理器會自動接收原生 DOM 事件並觸發執行。在上面的例子中，我們能夠通過被觸發事件的 `event.target.tagName` 訪問到該 DOM 元素。

<div class="composition-api">

你也可以看看[為事件處理器標註類型](/guide/typescript/composition-api#typing-event-handlers)這一章瞭解更多。<sup class="vt-badge ts" />

</div>
<div class="options-api">

你也可以看看[為事件處理器標註類型](/guide/typescript/options-api#typing-event-handlers)這一章瞭解更多。<sup class="vt-badge ts" />

</div>

### 方法與內聯事件判斷 {#method-vs-inline-detection}

模板編譯器會通過檢查 `v-on` 的值是否是合法的 JavaScript 標識符或屬性訪問路徑來斷定是何種形式的事件處理器。舉例來說，`foo`、`foo.bar` 和 `foo['bar']` 會被視為方法事件處理器，而 `foo()` 和 `count++` 會被視為內聯事件處理器。

## 在內聯處理器中調用方法 {#calling-methods-in-inline-handlers}

除了直接綁定方法名，你還可以在內聯事件處理器中調用方法。這允許我們向方法傳入自定義參數以代替原生事件：

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## 在內聯事件處理器中訪問事件參數 {#accessing-event-argument-in-inline-handlers}

有時我們需要在內聯事件處理器中訪問原生 DOM 事件。你可以向該處理器方法傳入一個特殊的 `$event` 變量，或者使用內聯箭頭函數：

```vue-html
<!-- 使用特殊的 $event 變量 -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- 使用內聯箭頭函數 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // 這裡可以訪問原生事件
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // 這裡可以訪問 DOM 原生事件
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## 事件修飾符 {#event-modifiers}

在處理事件時調用 `event.preventDefault()` 或 `event.stopPropagation()` 是很常見的。儘管我們可以直接在方法內調用，但如果方法能更專注於數據邏輯而不用去處理 DOM 事件的細節會更好。

為解決這一問題，Vue 為 `v-on` 提供了**事件修飾符**。修飾符是用 `.` 表示的指令後綴，包含以下這些：

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- 單擊事件將停止傳遞 -->
<a @click.stop="doThis"></a>

<!-- 提交事件將不再重新加載頁面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修飾語可以使用鏈式書寫 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修飾符 -->
<form @submit.prevent></form>

<!-- 僅當 event.target 是元素本身時才會觸發事件處理器 -->
<!-- 例如：事件處理器不來自子元素 -->
<div @click.self="doThat">...</div>
```

::: tip
使用修飾符時需要注意調用順序，因為相關代碼是以相同的順序生成的。因此使用 `@click.prevent.self` 會阻止**元素及其子元素的所有點擊事件的默認行為**，而 `@click.self.prevent` 則只會阻止對元素本身的點擊事件的默認行為。
:::

`.capture`、`.once` 和 `.passive` 修飾符與[原生 `addEventListener` 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#options)相對應：

```vue-html
<!-- 添加事件監聽器時，使用 `capture` 捕獲模式 -->
<!-- 例如：指向內部元素的事件，在被內部元素處理前，先被外部處理 -->
<div @click.capture="doThis">...</div>

<!-- 點擊事件最多被觸發一次 -->
<a @click.once="doThis"></a>

<!-- 滾動事件的默認行為 (scrolling) 將立即發生而非等待 `onScroll` 完成 -->
<!-- 以防其中包含 `event.preventDefault()` -->
<div @scroll.passive="onScroll">...</div>
```

`.passive` 修飾符一般用於觸摸事件的監聽器，可以用來[改善移動端設備的滾屏性能](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E4%BD%BF%E7%94%A8_passive_%E6%94%B9%E5%96%84%E6%BB%9A%E5%B1%8F%E6%80%A7%E8%83%BD)。

::: tip
請勿同時使用 `.passive` 和 `.prevent`，因為 `.passive` 已經向瀏覽器表明了你*不想*阻止事件的默認行為。如果你這麼做了，則 `.prevent` 會被忽略，並且瀏覽器會拋出警告。
:::

## 按鍵修飾符 {#key-modifiers}

在監聽鍵盤事件時，我們經常需要檢查特定的按鍵。Vue 允許在 `v-on` 或 `@` 監聽按鍵事件時添加按鍵修飾符。

```vue-html
<!-- 僅在 `key` 為 `Enter` 時調用 `submit` -->
<input @keyup.enter="submit" />
```

你可以直接使用 [`KeyboardEvent.key`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key/Key_Values) 暴露的按鍵名稱作為修飾符，但需要轉為 kebab-case 形式。

```vue-html
<input @keyup.page-down="onPageDown" />
```

在上面的例子中，僅會在 `$event.key` 為 `'PageDown'` 時調用事件處理。

### 按鍵別名 {#key-aliases}

Vue 為一些常用的按鍵提供了別名：

- `.enter`
- `.tab`
- `.delete` (捕獲“Delete”和“Backspace”兩個按鍵)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### 系統按鍵修飾符 {#system-modifier-keys}

你可以使用以下系統按鍵修飾符來觸發鼠標或鍵盤事件監聽器，只有當按鍵被按下時才會觸發。

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip 注意
在 Mac 鍵盤上，meta 是 Command 鍵 (⌘)。在 Windows 鍵盤上，meta 鍵是 Windows 鍵 (⊞)。在 Sun 微機系統鍵盤上，meta 是鑽石鍵 (◆)。在某些鍵盤上，特別是 MIT 和 Lisp 機器的鍵盤及其後代版本的鍵盤，如 Knight 鍵盤，space-cadet 鍵盤，meta 都被標記為“META”。在 Symbolics 鍵盤上，meta 也被標識為“META”或“Meta”。
:::

舉例來說：

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + 點擊 -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
請注意，系統按鍵修飾符和常規按鍵不同。與 `keyup` 事件一起使用時，該按鍵必須在事件發出時處於按下狀態。換句話說，`keyup.ctrl` 只會在你仍然按住 `ctrl` 但鬆開了另一個鍵時被觸發。若你單獨鬆開 `ctrl` 鍵將不會觸發。
:::

### `.exact` 修飾符 {#exact-modifier}

`.exact` 修飾符允許精確控制觸發事件所需要的系統修飾符的組合。

```vue-html
<!-- 當按下 Ctrl 時，即使同時按下 Alt 或 Shift 也會觸發 -->
<button @click.ctrl="onClick">A</button>

<!-- 僅當按下 Ctrl 且未按任何其他鍵時才會觸發 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 僅當沒有按下任何系統按鍵時觸發 -->
<button @click.exact="onClick">A</button>
```

## 鼠標按鍵修飾符 {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

這些修飾符將處理程序限定為由特定鼠標按鍵觸發的事件。
