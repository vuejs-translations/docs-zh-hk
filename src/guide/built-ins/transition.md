<script setup>
import Basic from './transition-demos/Basic.vue'
import SlideFade from './transition-demos/SlideFade.vue'
import CssAnimation from './transition-demos/CssAnimation.vue'
import NestedTransitions from './transition-demos/NestedTransitions.vue'
import JsHooks from './transition-demos/JsHooks.vue'
import BetweenElements from './transition-demos/BetweenElements.vue'
import BetweenComponents from './transition-demos/BetweenComponents.vue'
</script>

# Transition {#transition}

Vue 提供了兩個內置組件，可以幫助你製作基於狀態變化的過渡和動畫：

- `<Transition>` 會在一個元素或組件進入和離開 DOM 時應用動畫。本章節會介紹如何使用它。

- `<TransitionGroup>` 會在一個 `v-for` 列表中的元素或組件被插入，移動，或移除時應用動畫。我們將在[下一章節](/guide/built-ins/transition-group)中介紹。

除了這兩個組件，我們也可以通過其他技術手段來應用動畫，比如切換 CSS class 或用狀態綁定樣式來驅動動畫。這些其他的方法會在[動畫技巧](/guide/extras/animation)章節中展開。

## `<Transition>` 組件 {#the-transition-component}

`<Transition>` 是一個內置組件，這意味著它在任意別的組件中都可以被使用，無需註冊。它可以將進入和離開動畫應用到通過默認插槽傳遞給它的元素或組件上。進入或離開可以由以下的條件之一觸發：

- 由 `v-if` 所觸發的切換
- 由 `v-show` 所觸發的切換
- 由特殊元素 `<component>` 切換的動態組件
- 改變特殊的 `key` 屬性

以下是最基本用法的示例：

```vue-html
<button @click="show = !show">Toggle</button>
<Transition>
  <p v-if="show">hello</p>
</Transition>
```

```css
/* 下面我們會解釋這些 class 的用處 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
```

<Basic />

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpVkEFuwyAQRa8yZZNWqu1sunFJ1N4hSzYUjRNUDAjGVJHluxcCipIV/OG/pxEr+/a+TwuykfGogvYEEWnxR2H17F0gWCHgBBtMwc2wy9WdsMIqZ2OuXtwfHErhlcKCb8LyoVoynwPh7I0kzAmA/yxEzsKXMlr9HgRr9Es5BTue3PlskA+1VpFTkDZq0i3niYfU6anRmbqgMY4PZeH8OjwBfHhYIMdIV1OuferQEoZOKtIJ328TgzJhm8BabHR3jeC8VJqusO8/IqCM+CnsVqR3V/mfRxO5amnkCPuK5B+6rcG2fydshks=)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNpVkMFuAiEQhl9lyqlNuouXXrZo2nfwuBeKs0qKQGBAjfHdZZfVrAmB+f/M/2WGK/v1vs0JWcdEVEF72vQWz94Fgh0OMhmCa28BdpLk+0etAQJSCvahAOLBnTqgkLA6t/EpVzmCP7lFEB69kYRFAYi/ROQs/Cij1f+6ZyMG1vA2vj3bbN1+b1Dw2lYj2yBt1KRnXRwPudHDnC6pAxrjBPe1n78EBF8MUGSkixnLNjdoCUMjFemMn5NjUGacnboqPVkdOC+Vpgus2q8IKCN+T+suWENwxyWJXKXMyQ5WNVJ+aBqD3e6VSYoi)

</div>

:::tip
`<Transition>` 僅支持單個元素或組件作為其插槽內容。如果內容是一個組件，這個組件必須僅有一個根元素。
:::

當一個 `<Transition>` 組件中的元素被插入或移除時，會發生下面這些事情：

1. Vue 會自動檢測目標元素是否應用了 CSS 過渡或動畫。如果是，則一些 [CSS 過渡 class](#transition-classes) 會在適當的時機被添加和移除。

2. 如果有作為監聽器的 [JavaScript 鉤子](#javascript-hooks)，這些鉤子函數會在適當時機被調用。

3. 如果沒有探測到 CSS 過渡或動畫、也沒有提供 JavaScript 鉤子，那麼 DOM 的插入、刪除操作將在瀏覽器的下一個動畫幀後執行。

## 基於 CSS 的過渡效果 {#css-based-transitions}

### CSS 過渡 class {#transition-classes}

一共有 6 個應用於進入與離開過渡效果的 CSS class。

![過渡圖示](./images/transition-classes.png)

<!-- https://www.figma.com/file/rlOv0ZKJFFNA9hYmzdZv3S/Transition-Classes -->

1. `v-enter-from`：進入動畫的起始狀態。在元素插入之前添加，在元素插入完成後的下一幀移除。

2. `v-enter-active`：進入動畫的生效狀態。應用於整個進入動畫階段。在元素被插入之前添加，在過渡或動畫完成之後移除。這個 class 可以被用來定義進入動畫的持續時間、延遲與速度曲線類型。

3. `v-enter-to`：進入動畫的結束狀態。在元素插入完成後的下一幀被添加 (也就是 `v-enter-from` 被移除的同時)，在過渡或動畫完成之後移除。

4. `v-leave-from`：離開動畫的起始狀態。在離開過渡效果被觸發時立即添加，在一幀後被移除。

5. `v-leave-active`：離開動畫的生效狀態。應用於整個離開動畫階段。在離開過渡效果被觸發時立即添加，在過渡或動畫完成之後移除。這個 class 可以被用來定義離開動畫的持續時間、延遲與速度曲線類型。

6. `v-leave-to`：離開動畫的結束狀態。在一個離開動畫被觸發後的下一幀被添加 (也就是 `v-leave-from` 被移除的同時)，在過渡或動畫完成之後移除。

`v-enter-active` 和 `v-leave-active` 給我們提供了為進入和離開動畫指定不同速度曲線的能力，我們將在下面的小節中看到一個示例。

### 為過渡效果命名 {#named-transitions}

我們可以給 `<Transition>` 組件傳一個 `name` prop 來聲明一個過渡效果名：

```vue-html
<Transition name="fade">
  ...
</Transition>
```

對於一個有名字的過渡效果，對它起作用的過渡 class 會以其名字而不是 `v` 作為前綴。比如，上方例子中被應用的 class 將會是 `fade-enter-active` 而不是 `v-enter-active`。這個“fade”過渡的 class 應該是這樣：

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

### CSS 的 transition {#css-transitions}

`<Transition>` 一般都會搭配[原生 CSS 過渡](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)一起使用，正如你在上面的例子中所看到的那樣。這個 `transition` CSS 屬性是一個簡寫形式，使我們可以一次定義一個過渡的各個方面，包括需要執行動畫的屬性、持續時間和[速度曲線](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function)。

下面是一個更高級的例子，它使用了不同的持續時間和速度曲線來過渡多個屬性：

```vue-html
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>
```

```css
/*
  進入和離開動畫可以使用不同
  持續時間和速度曲線。
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<SlideFade />

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFkc9uwjAMxl/F6wXQKIVNk1AX0HbZC4zDDr2E4EK0NIkStxtDvPviFQ0OSFzyx/m+n+34kL16P+lazMpMRBW0J4hIrV9WVjfeBYIDBKzhCHVwDQySdFDZyipnY5Lu3BcsWDCk0OKosqLoKcmfLoSNN5KQbyTWLZGz8KKMVp+LKju573ivsuXKbbcG4d3oDcI9vMkNiqL3JD+AWAVpoyadGFY2yATW5nVSJj9rkspDl+v6hE/hHRrjRMEdpdfiDEkBUVxWaEWkveHj5AzO0RKGXCrSHcKBIfSPKEEaA9PJYwSUEXPX0nNlj8y6RBiUHd5AzCOodq1VvsYfjWE4G6fgEy/zMcxG17B9ZTyX8bV85C5y1S40ZX/kdj+GD1P/zVQA56XStC9h2idJI/z7huz4CxoVvE4=)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqFkc1uwjAMgF/F6wk0SmHTJNQFtF32AuOwQy+hdSFamkSJ08EQ776EbMAkJKTIf7I/O/Y+ezVm3HvMyoy52gpDi0rh1mhL0GDLvSTYVwqg4cQHw2QDWCRv1Z8H4Db6qwSyHlPkEFUQ4bHixA0OYWckJ4wesZUn0gpeainqz3mVRQzM4S7qKlss9XotEd6laBDu4Y03yIpUE+oB2NJy5QSJwFC8w0iIuXkbMkN9moUZ6HPR/uJDeINSalaYxCjOkBBgxeWEijnayWiOz+AcFaHNeU2ix7QCOiFK4FLCZPzoALnDXHt6Pq7hP0Ii7/EGYuag9itR5yv8FmgH01EIPkUxG8F0eA2bJmut7kbX+pG+6NVq28WTBTN+92PwMDHbSAXQhteCdiVMUpNwwuMassMP8kfAJQ==)

</div>

### CSS 的 animation {#css-animations}

[原生 CSS 動畫](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)和 CSS transition 的應用方式基本上是相同的，只有一點不同，那就是 `*-enter-from` 不是在元素插入後立即移除，而是在一個 `animationend` 事件觸發時被移除。

對於大多數的 CSS 動畫，我們可以簡單地在 `*-enter-active` 和 `*-leave-active` class 下聲明它們。下面是一個示例：

```vue-html
<Transition name="bounce">
  <p v-if="show" style="text-align: center;">
    Hello here is some bouncy text!
  </p>
</Transition>
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<CssAnimation />

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNksGOgjAQhl9lJNmoBwRNvCAa97YP4JFLbQZsLG3TDqzG+O47BaOezCYkpfB9/0wHbsm3c4u+w6RIyiC9cgQBqXO7yqjWWU9wA4813KH2toUpo9PKVEZaExg92V/YRmBGvsN5ZcpsTGGfN4St04Iw7qg8dkTWwF5qJc/bKnnYk7hWye5gm0ZjmY0YKwDlwQsTFCnWjGiRpaPtjETG43smHPSpqh9pVQKBrjpyrfCNMilZV8Aqd5cNEF4oFVo1pgCJhtBvnjEAP6i1hRN6BBUg2BZhKHUdvMmjWhYHE9dXY/ygzN4PasqhB75djM2mQ7FUSFI9wi0GCJ6uiHYxVsFUGcgX67CpzP0lahQ9/k/kj9CjDzgG7M94rT1PLLxhQ0D+Na4AFI9QW98WEKTQOMvnLAOwDrD+wC0Xq/Ubusw/sU+QL/45hskk9z8Bddbn)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNUs2OwiAQfpWxySZ66I8mXioa97YP4LEXrNNKpEBg2tUY330pqOvJmBBgyPczP1yTb2OyocekTJirrTC0qRSejbYEB2x4LwmulQI4cOLTWbwDWKTeqkcE4I76twSyPcaX23j4zS+WP3V9QNgZyQnHiNi+J9IKtrUU9WldJaMMrGEynlWy2em2lcjyCPMUALazXDlBwtMU79CT9rpXNXp4tGYGhlQ0d7UqAUcXOeI6bluhUtKmhEVhzisgPFPKpWhVCTUqQrt6ygD8oJQajmgRhAOnO4RgdQm8yd0tNzGv/D8x/8Dy10IVCzn4axaTTYNZymsSA8YuciU6PrLL6IKpUFBkS7cKXXwQJfIBPyP6IQ1oHUaB7QkvjfUdcy+wIFB8PeZIYwmNtl0JruYSp8XMk+/TXL7BzbPF8gU6L95hn8D4OUJnktsfM1vavg==)

</div>

### 自定義過渡 class {#custom-transition-classes}

你也可以向 `<Transition>` 傳遞以下的 props 來指定自定義的過渡 class：

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

你傳入的這些 class 會覆蓋相應階段的默認 class 名。這個功能在你想要在 Vue 的動畫機制下集成其他的第三方 CSS 動畫庫時非常有用，比如 [Animate.css](https://daneden.github.io/animate.css/)：

```vue-html
<!-- 假設你已經在頁面中引入了 Animate.css -->
<Transition
  name="custom-classes"
  enter-active-class="animate__animated animate__tada"
  leave-active-class="animate__animated animate__bounceOutRight"
>
  <p v-if="show">hello</p>
</Transition>
```

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNUctuwjAQ/BXXF9oDsZB6ogbRL6hUcbSEjLMhpn7JXtNWiH/vhqS0R3zxPmbWM+szf02pOVXgSy6LyTYhK4A1rVWwPsWM7MwydOzCuhw9mxF0poIKJoZC0D5+stUAeMRc4UkFKcYpxKcEwSenEYYM5b4ixsA2xlnzsVJ8Yj8Mt+LrbTwcHEgxwojCmNxmHYpFG2kaoxO0B2KaWjD6uXG6FCiKj00ICHmuDdoTjD2CavJBCna7KWjZrYK61b9cB5pI93P3sQYDbxXf7aHHccpVMolO7DS33WSQjPXgXJRi2Cl1xZ8nKkjxf0dBFvx2Q7iZtq94j5jKUgjThmNpjIu17ZzO0JjohT7qL+HsvohJWWNKEc/NolncKt6Goar4y/V7rg/wyw9zrLOy)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNUcFuwjAM/RUvp+1Ao0k7sYDYF0yaOFZCJjU0LE2ixGFMiH9f2gDbcVKU2M9+tl98Fm8hNMdMYi5U0tEEXraOTsFHho52mC3DuXUAHTI+PlUbIBLn6G4eQOr91xw4ZqrIZXzKVY6S97rFYRqCRabRY7XNzN7BSlujPxetGMvAAh7GtxXLtd/vLSlZ0woFQK0jumTY+FJt7ORwoMLUObEfZtpiSpRaUYPkmOIMNZsj1VhJRWeGMsFmczU6uCOMHd64lrCQ/s/d+uw0vWf+MPuea5Vp5DJ0gOPM7K4Ci7CerPVKhipJ/moqgJJ//8ipxN92NFdmmLbSip45pLmUunOH1Gjrc7ezGKnRfpB4wJO0ZpvkdbJGpyRfmufm+Y4Mxo1oK16n9UwNxOUHwaK3iQ==)

</div>

### 同時使用 transition 和 animation {#using-transitions-and-animations-together}

Vue 需要附加事件監聽器，以便知道過渡何時結束。可以是 `transitionend` 或 `animationend`，這取決於你所應用的 CSS 規則。如果你僅僅使用二者的其中之一，Vue 可以自動探測到正確的類型。

然而在某些場景中，你或許想要在同一個元素上同時使用它們兩個。舉例來說，Vue 觸發了一個 CSS 動畫，同時鼠標懸停觸發另一個 CSS 過渡。此時你需要顯式地傳入 `type` prop 來聲明，告訴 Vue 需要關心哪種類型，傳入的值是 `animation` 或 `transition`：

```vue-html
<Transition type="animation">...</Transition>
```

### 深層級過渡與顯式過渡時長 {#nested-transitions-and-explicit-transition-durations}

儘管過渡 class 僅能應用在 `<Transition>` 的直接子元素上，我們還是可以使用深層級的 CSS 選擇器，在深層級的元素上觸發過渡效果：

```vue-html
<Transition name="nested">
  <div v-if="show" class="outer">
    <div class="inner">
      Hello
    </div>
  </div>
</Transition>
```

```css
/* 應用於嵌套元素的規則 */
.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateX(30px);
  opacity: 0;
}

/* ... 省略了其他必要的 CSS */
```

我們甚至可以在深層元素上添加一個過渡延遲，從而創建一個帶漸進延遲的動畫序列：

```css{3}
/* 延遲嵌套元素的進入以獲得交錯效果 */
.nested-enter-active .inner {
  transition-delay: 0.25s;
}
```

然而，這會帶來一個小問題。默認情況下，`<Transition>` 組件會通過監聽過渡根元素上的**第一個** `transitionend` 或者 `animationend` 事件來嘗試自動判斷過渡何時結束。而在嵌套的過渡中，期望的行為應該是等待所有內部元素的過渡完成。

在這種情況下，你可以通過向 `<Transition>` 組件傳入 `duration` prop 來顯式指定過渡的持續時間 (以毫秒為單位)。總持續時間應該匹配延遲加上內部元素的過渡持續時間：

```vue-html
<Transition :duration="550">...</Transition>
```

<NestedTransitions />

[在演練場中嘗試一下](https://play.vuejs.org/#eNqVVd9v0zAQ/leO8LAfrE3HNKSFbgKmSYMHQNAHkPLiOtfEm2NHttN2mvq/c7bTNi1jgFop9t13d9995ziPyfumGc5bTLJkbLkRjQOLrm2uciXqRhsHj2BwBiuYGV3DAUEPcpUrrpUlaKUXcOkBh860eJSrcRqzUDxtHNaNZA5pBzCets5pBe+4FPz+Mk+66Bf+mSdXE12WEsdphMWQiWHKCicoLCtaw/yKIs/PR3kCitVIG4XWYUEJfATFFGIO84GYdRUIyCWzlra6dWg2wA66dgqlts7c+d8tSqk34JTQ6xqb9TjdUiTDOO21TFvrHqRfDkPpExiGKvBITjdl/L40ulVFBi8R8a3P17CiEKrM4GzULIOlFmpQoSgrl8HpKFpX3kFZu2y0BNhJxznvwaJCA1TEYcC4E3MkKp1VIptjZ43E3KajDJiUMBqeWUBmcUBUqJGYOT2GAiV7gJAA9Iy4GyoBKLH2z+N0W3q/CMC2yCCkyajM63Mbc+9z9mfvZD+b071MM23qLC69+j8PvX5HQUDdMC6cL7BOTtQXCJwpas/qHhWIBdYtWGgtDWNttWTmThu701pf1W6+v1Hd8Xbz+k+VQxmv8i7Fv1HZn+g/iv2nRkjzbd6npf/Rkz49DifQ3dLZBBYOJzC4rqgCwsUbmLYlCAUVU4XsCd1NrCeRHcYXb1IJC/RX2hEYCwJTvHYVMZoavbBI09FmU+LiFSzIh0AIXy1mqZiFKaKCmVhiEVJ7GftHZTganUZ56EYLL3FykjhL195MlMM7qxXdmEGDPOG6boRE86UJVPMki+p4H01WLz4Fm78hSdBo5xXy+yfsd3bpbXny1SA1M8c82fgcMyW66L75/hmXtN44a120ktDPOL+h1bL1HCPsA42DaPdwge3HcO/TOCb2ZumQJtA15Yl65Crg84S+BdfPtL6lezY8C3GkZ7L6Bc1zNR0=)

如果有必要的話，你也可以用對象的形式傳入，分開指定進入和離開所需的時間：

```vue-html
<Transition :duration="{ enter: 500, leave: 800 }">...</Transition>
```

### 性能考量 {#performance-considerations}

你可能注意到我們上面例子中展示的動畫所用到的 CSS 屬性大多是 `transform` 和 `opacity` 之類的。用這些屬性製作動畫非常高效，因為：

1. 他們在動畫過程中不會影響到 DOM 結構，因此不會每一幀都觸發昂貴的 CSS 佈局重新計算。

2. 大多數的現代瀏覽器都可以在執行 `transform` 動畫時利用 GPU 進行硬件加速。

相比之下，像 `height` 或者 `margin` 這樣的屬性會觸發 CSS 佈局變動，因此執行它們的動畫效果更昂貴，需要謹慎使用。我們可以在 [CSS-Triggers](https://csstriggers.com/) 這類的網站查詢哪些屬性會在執行動畫時觸發 CSS 佈局變動。

## JavaScript 鉤子 {#javascript-hooks}

你可以通過監聽 `<Transition>` 組件事件的方式在過渡過程中掛上鉤子函數：

```html
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <!-- ... -->
</Transition>
```

<div class="composition-api">

```js
// 在元素被插入到 DOM 之前被調用
// 用這個來設置元素的 "enter-from" 狀態
function onBeforeEnter(el) {}

// 在元素被插入到 DOM 之後的下一幀被調用
// 用這個來開始進入動畫
function onEnter(el, done) {
  // 調用回調函數 done 表示過渡結束
  // 如果與 CSS 結合使用，則這個回調是可選參數
  done()
}

// 當進入過渡完成時調用。
function onAfterEnter(el) {}

// 當進入過渡在完成之前被取消時調用
function onEnterCancelled(el) {}

// 在 leave 鉤子之前調用
// 大多數時候，你應該只會用到 leave 鉤子
function onBeforeLeave(el) {}

// 在離開過渡開始時調用
// 用這個來開始離開動畫
function onLeave(el, done) {
  // 調用回調函數 done 表示過渡結束
  // 如果與 CSS 結合使用，則這個回調是可選參數
  done()
}

// 在離開過渡完成、
// 且元素已從 DOM 中移除時調用
function onAfterLeave(el) {}

// 僅在 v-show 過渡中可用
function onLeaveCancelled(el) {}
```

</div>
<div class="options-api">

```js
export default {
  // ...
  methods: {
    // 在元素被插入到 DOM 之前被調用
    // 用這個來設置元素的 "enter-from" 狀態
    onBeforeEnter(el) {},

    // 在元素被插入到 DOM 之後的下一幀被調用
    // 用這個來開始進入動畫
    onEnter(el, done) {
      // 調用回調函數 done 表示過渡結束
      // 如果與 CSS 結合使用，則這個回調是可選參數
      done()
    },

    // 當進入過渡完成時調用。
    onAfterEnter(el) {},

    // 當進入過渡在完成之前被取消時調用
    onEnterCancelled(el) {},

    // 在 leave 鉤子之前調用
    // 大多數時候，你應該只會用到 leave 鉤子
    onBeforeLeave(el) {},

    // 在離開過渡開始時調用
    // 用這個來開始離開動畫
    onLeave(el, done) {
      // 調用回調函數 done 表示過渡結束
      // 如果與 CSS 結合使用，則這個回調是可選參數
      done()
    },

    // 在離開過渡完成、
    // 且元素已從 DOM 中移除時調用
    onAfterLeave(el) {},

    // 僅在 v-show 過渡中可用
    onLeaveCancelled(el) {}
  }
}
```

</div>

這些鉤子可以與 CSS 過渡或動畫結合使用，也可以單獨使用。

在使用僅由 JavaScript 執行的動畫時，最好是添加一個 `:css="false"` prop。這顯式地向 Vue 表明可以跳過對 CSS 過渡的自動探測。除了性能稍好一些之外，還可以防止 CSS 規則意外地干擾過渡效果：

```vue-html{3}
<Transition
  ...
  :css="false"
>
  ...
</Transition>
```

在有了 `:css="false"` 後，我們就自己全權負責控制什麼時候過渡結束了。這種情況下對於 `@enter` 和 `@leave` 鉤子來說，回調函數 `done` 就是必須的。否則，鉤子將被同步調用，過渡將立即完成。

這裡是使用 [GSAP 庫](https://gsap.com/)執行動畫的一個示例，你也可以使用任何你想要的庫，比如 [Anime.js](https://animejs.com/) 或者 [Motion One](https://motion.dev/)：

<JsHooks />

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNVMtu2zAQ/JUti8I2YD3i1GigKmnaorcCveTQArpQFCWzlkiCpBwHhv+9Sz1qKYckJ3FnlzvD2YVO5KvW4aHlJCGpZUZoB5a7Vt9lUjRaGQcnMLyEM5RGNbDA0sX/VGWpHnB/xEQmmZIWe+zUI9z6m0tnWr7ymbKVzAklQclvvFSG/5COmyWvV3DKJHTdQiRHZN0jAJbRmv9OIA432/UE+jODlKZMuKcErnx8RrazP8woR7I1FEryKaVTU8aiNdRfwWZTQtQwi1HAGF/YB4BTyxNY8JpaJ1go5K/WLTfhdg1Xq8V4SX5Xja65w0ovaCJ8Jvsnpwc+l525F2XH4ac3Cj8mcB3HbxE9qnvFMRzJ0K3APuhIjPefmTTyvWBAGvWbiDuIgeNYRh3HCCDNW+fQmHtWC7a/zciwaO/8NyN3D6qqap5GfVnXAC89GCqt8Bp77vu827+A+53AJrOFzMhQdMnO8dqPpMO74Yx4wqxFtKS1HbBOMdIX4gAMffVp71+Qq2NG4BCIcngBKk8jLOvfGF30IpBGEwcwtO6p9sdwbNXPIadsXxnVyiKB9x83+c3N9WePN9RUQgZO6QQ2sT524KMo3M5Pf4h3XFQ7NwFyZQpuAkML0doEtvEHhPvRDPRkTfq/QNDgRvy1SuIvpFOSDQmbkWTckf7hHsjIzjltkyhqpd5XIVNN5HNfGlW09eAcMp3J+R+pEn7L)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqNVFFvmzAQ/is3pimNlABNF61iaddt2tukvfRhk/xiwIAXsJF9pKmq/PedDTSwh7ZSFLjvzvd9/nz4KfjatuGhE0ES7GxmZIu3TMmm1QahtLyFwugGFu51wRQAU+Lok7koeFcjPDk058gvlv07gBHYGTVGALbSDwmg6USPnNzjtHL/jcBK5zZxxQwZavVNFNqIHwqF8RUAWs2jn4IffCfqQz+mik5lKLWi3GT1hagHRU58aAUSshpV2YzX4ncCcbjZDp099GcG6ZZnEh8TuPR8S0/oTJhQjmQryLUSU0rUU8a8M9wtoWZTQtIwi0nAGJ/ZB0BwKxJYiJpblFko1a8OLzbhdgWXy8WzP99109YCqdIJmgifyfYuzmUzfFF2HH56o/BjAldx/BbRo7pXHKMjGbrl1IcciWn9fyaNfC8YsIueR5wCFFTGUVAEsEs7pOmDu6yW2f6GBW5o4QbeuScLbu91WdZiF/VlvgEtujdcWek09tx3qZ+/tXAzQU1mA8mCoeicneO1OxKP9yM+4ElmLaEFr+2AecVEn8sDZOSrSzv/1qk+sgAOa1kMOyDlu4jK+j1GZ70E7KKJAxRafKzdazi26s8h5dm+NLpTeQLvP27S6+urz/7T5aaUao26TWATt0cPPsgcK3f6Q1wJWVY4AVJtcmHWhueyo89+G38guD+agT5YBf39s25oIv5arehu8krYkLAs8BeG86DfuANYUCG2NomiTrX7Msx0E7ncl0bnXT04566M4PQPykWaWw==)

</div>

## 可複用過渡效果 {#reusable-transitions}

得益於 Vue 的組件系統，過渡效果是可以被封裝複用的。要創建一個可被複用的過渡，我們需要為 `<Transition>` 組件創建一個包裝組件，並向內傳入插槽內容：

```vue{5}
<!-- MyTransition.vue -->
<script>
// JavaScript 鉤子邏輯...
</script>

<template>
  <!-- 包裝內置的 Transition 組件 -->
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave">
    <slot></slot> <!-- 向內傳遞插槽內容 -->
  </Transition>
</template>

<style>
/*
  必要的 CSS...
  注意：避免在這裡使用 <style scoped>
  因為那不會應用到插槽內容上
*/
</style>
```

現在 `MyTransition` 可以在導入後像內置組件那樣使用了：

```vue-html
<MyTransition>
  <div v-if="show">Hello</div>
</MyTransition>
```

## 出現時過渡 {#transition-on-appear}

如果你想在某個節點初次渲染時應用一個過渡效果，你可以添加 `appear` prop：

```vue-html
<Transition appear>
  ...
</Transition>
```

## 元素間過渡 {#transition-between-elements}

除了通過 `v-if` / `v-show` 切換一個元素，我們也可以通過 `v-if` / `v-else` / `v-else-if` 在幾個組件間進行切換，只要確保任一時刻只會有一個元素被渲染即可：

```vue-html
<Transition>
  <button v-if="docState === 'saved'">Edit</button>
  <button v-else-if="docState === 'edited'">Save</button>
  <button v-else-if="docState === 'editing'">Cancel</button>
</Transition>
```

<BetweenElements />

[在演練場中嘗試一下](https://play.vuejs.org/#eNqdk8tu2zAQRX9loI0SoLLcFN2ostEi6BekmwLa0NTYJkKRBDkSYhj+9wxJO3ZegBGu+Lhz7syQ3Bd/nJtNIxZN0QbplSMISKNbdkYNznqCPXhcwwHW3g5QsrTsTGekNYGgt/KBBCEsouimDGLCvrztTFtnGGN4QTg4zbK4ojY4YSDQTuOiKwbhN8pUXm221MDd3D11xfJeK/kIZEHupEagrbfjZssxzAgNs5nALIC2VxNILUJg1IpMxWmRUAY9U6IZ2/3zwgRFyhowYoieQaseq9ElDaTRrkYiVkyVWrPiXNdiAcequuIkPo3fMub5Sg4l9oqSevmXZ22dwR8YoQ74kdsL4Go7ZTbR74HT/KJfJlxleGrG8l4YifqNYVuf251vqOYr4llbXz4C06b75+ns1a3BPsb0KrBy14Aymnerlbby8Vc8cTajG35uzFITpu0t5ufzHQdeH6LBsezEO0eJVbB6pBiVVLPTU6jQEPpKyMj8dnmgkQs+HmQcvVTIQK1hPrv7GQAFt9eO9Bk6fZ8Ub52Qiri8eUo+4dbWD02exh79v/nBP+H2PStnwz/jelJ1geKvk/peHJ4BoRZYow==)

## 過渡模式 {#transition-modes}

在之前的例子中，進入和離開的元素都是在同時開始動畫的，因此我們不得不將它們設為 `position: absolute` 以避免二者同時存在時出現的佈局問題。

然而，很多情況下這可能並不符合需求。我們可能想要先執行離開動畫，然後在其完成**之後**再執行元素的進入動畫。手動編排這樣的動畫是非常複雜的，好在我們可以通過向 `<Transition>` 傳入一個 `mode` prop 來實現這個行為：

```vue-html
<Transition mode="out-in">
  ...
</Transition>
```

將之前的例子改為 `mode="out-in"` 後是這樣：

<BetweenElements mode="out-in" />

`<Transition>` 也支持 `mode="in-out"`，雖然這並不常用。

## 組件間過渡 {#transition-between-components}

`<Transition>` 也可以作用於[動態組件](/guide/essentials/component-basics#dynamic-components)之間的切換：

```vue-html
<Transition name="fade" mode="out-in">
  <component :is="activeComponent"></component>
</Transition>
```

<BetweenComponents />

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqtksFugzAMhl/F4tJNKtDLLoxWKnuDacdcUnC3SCGJiMmEqr77EkgLbXfYYZyI8/v77dinZG9M5npMiqS0dScMgUXqzY4p0RrdEZzAfnEp9fc7HuEMx063sPIZq6viTbdmHy+yfDwF5K2guhFUUcBUnkNvcelBGrjTooHaC7VCRXBAoT6hQTRyAH2w2DlsmKq1sgS8JuEwUCfxdgF7Gqt5ZqrMp+58X/5A2BrJCcOJSskPKP0v+K8UyvQENBjcsqTjjdAsAZe2ukHpI3dm/q5wXPZBPFqxZAf7gCrzGfufDlVwqB4cPjqurCChFSjeBvGRN+iTA9afdE+pUD43FjG/bSHsb667Mr9qJot89vCBMl8+oiotDTL8ZsE39UnYpRN0fQlK5A5jEE6BSVdiAdrwWtAAm+zFAnKLr0ydA3pJDDt0x/PrMrJifgGbKdFPfCwpWU+TuWz5omzfVCNcfJJ5geL8pqtFn5E07u7fSHFOj6TzDyUDNEM=)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqtks9ugzAMxl/F4tJNamGXXVhWqewVduSSgStFCkkUDFpV9d0XJyn9t8MOkxBg5/Pvi+Mci51z5TxhURdi7LxytG2NGpz1BB92cDvYezvAqqxixNLVjaC5ETRZ0Br8jpIe93LSBMfWAHRBYQ0aGms4Jvw6Q05rFvSS5NNzEgN4pMmbcwQgO1Izsj5CalhFRLDj1RN/wis8olpaCQHh4LQk5IiEll+owy+XCGXcREAHh+9t4WWvbFvAvBlsjzpk7gx5TeqJtdG4LbawY5KoLtR/NGjYoHkw+PTSjIqUNWDkwOK97DHUMjVEdqKNMqE272E5dajV+JvpVlSLJllUF4+QENX1ERox0kHzb8m+m1CEfpOgYYgpqVHOmJNpgLQQa7BOdooO8FK+joByxLc4tlsiX6s7HtnEyvU1vKTCMO+4pWKdBnO+0FfbDk31as5HsvR+Hl9auuozk+J1/hspz+mRdPoBYtonzg==)

</div>

## 動態過渡 {#dynamic-transitions}

`<Transition>` 的 props (比如 `name`) 也可以是動態的！這讓我們可以根據狀態變化動態地應用不同類型的過渡：

```vue-html
<Transition :name="transitionName">
  <!-- ... -->
</Transition>
```

這個特性的用處是可以提前定義好多組 CSS 過渡或動畫的 class，然後在它們之間動態切換。

你也可以根據你的組件的當前狀態在 JavaScript 過渡鉤子中應用不同的行為。最後，創建動態過渡的終極方式還是創建[可複用的過渡組件](#reusable-transitions)，並讓這些組件根據動態的 props 來改變過渡的效果。掌握了這些技巧後，就真的只有你想不到，沒有做不到的了。

## 使用 Key 屬性過渡 {#transitions-with-the-key-attribute}

有時為了觸發過渡，你需要強制重新渲染 DOM 元素。

以計數器組件為例：

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue';
const count = ref(0);

setInterval(() => count.value++, 1000);
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 1,
      interval: null 
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.count++;
    }, 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>

<template>
  <Transition>
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

</div>

如果不使用 `key` 屬性，則只有文本節點會被更新，因此不會發生過渡。但是，有了 `key` 屬性，Vue 就知道在 `count` 改變時創建一個新的 `span` 元素，因此 `Transition` 組件有兩個不同的元素在它們之間進行過渡。

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9UsFu2zAM/RVCl6Zo4nhYd/GcAtvQQ3fYhq1HXTSFydTKkiDJbjLD/z5KMrKgLXoTHx/5+CiO7JNz1dAja1gbpFcuQsDYuxtuVOesjzCCxx1MsPO2gwuiXnzkhhtpTYggbW8ibBJlUV/mBJXfmYh+EHqxuITNDYzcQGFWBPZ4dUXEaQnv6jrXtOuiTJoUROycFhEpAmi3agCpRQgbzp68cA49ZyV174UJKiprckxIcMJA84hHImc9oo7jPOQ0kQ4RSvH6WXW7JiV6teszfQpDPGqEIK3DLSGpQbazsyaugvqLDVx77JIhbqp5wsxwtrRvPFI7NWDhEGtYYVrQSsgELzOiUQw4I2Vh8TRgA9YJqeIR6upDABQh9TpTAPE7WN3HlxLp084Foi3N54YN1KWEVpOMkkO2ZJHsmp3aVw/BGjqMXJE22jml0X93STRw1pReKSe0tk9fMxZ9nzwVXP5B+fgK/hAOCePsh8dAt4KcnXJR+D3S16X07a9veKD3KdnZba+J/UbyJ+Zl0IyF9rk3Wxr7jJenvcvnrcz+PtweItKuZ1Np0MScMp8zOvkvb1j/P+776jrX0UbZ9A+fYSTP)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNp9U8tu2zAQ/JUFTwkSyw6aXlQ7QB85pIe2aHPUhZHWDhOKJMiVYtfwv3dJSpbbBgEMWJydndkdUXvx0bmi71CUYhlqrxzdVAa3znqCBtey0wT7ygA0kuTZeX4G8EidN+MJoLadoRKuLkdAGULfS12C6bSGDB/i3yFx2tiAzaRIjyoUYxesICDdDaczZq1uJrNETY4XFx8G5Uu4WiwW55PBA66txy8YyNvdZFNrlP4o/Jdpbq4M/5bzYxZ8IGydloR8Alg2qmcVGcKqEi9eOoe+EqnExXsvTVCkrBkQxoKTBspn3HFDmprp+32ODA4H9mLCKDD/R2E5Zz9+Ws5PpuBjoJ1GCLV12DASJdKGa2toFtRvLOHaY8vx8DrFMGdiOJvlS48sp3rMHGb1M4xRzGQdYU6REY6rxwHJGdJxwBKsk7WiHSyK9wFQhqh14gDyIVjd0f8Wa2/bUwOyWXwQLGGRWzicuChvKC4F8bpmrTbFU7CGL2zqiJm2Tmn03100DZUox5ddCam1ffmaMPJd3Cnj9SPWz6/gT2EbsUr88Bj4VmAljjWSfoP88mL59tc33PLzsdjaptPMfqP4E1MYPGOmfepMw2Of8NK0d238+JTZ3IfbLSFnPSwVB53udyX4q/38xurTuO+K6/Fqi8MffqhR/A==)

</div>

---

**參考**

- [`<Transition>` API 參考](/api/built-in-components#transition)
