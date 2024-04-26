<script setup>
import ListBasic from './transition-demos/ListBasic.vue'
import ListMove from './transition-demos/ListMove.vue'
import ListStagger from './transition-demos/ListStagger.vue'
</script>

# TransitionGroup {#transitiongroup}

`<TransitionGroup>` 是一個內置組件，用於對 `v-for` 列表中的元素或組件的插入、移除和順序改變添加動畫效果。

## 和 `<Transition>` 的區別 {#differences-from-transition}

`<TransitionGroup>` 支持和 `<Transition>` 基本相同的 props、CSS 過渡 class 和 JavaScript 鉤子監聽器，但有以下幾點區別：

- 默認情況下，它不會渲染一個容器元素。但你可以通過傳入 `tag` prop 來指定一個元素作為容器元素來渲染。

- [過渡模式](./transition#transition-modes)在這裡不可用，因為我們不再是在互斥的元素之間進行切換。

- 列表中的每個元素都**必須**有一個獨一無二的 `key` 屬性。

- CSS 過渡 class 會被應用在列表內的元素上，**而不是**容器元素上。

:::tip
當在 [DOM 內模板](/guide/essentials/component-basics#in-dom-template-parsing-caveats)中使用時，組件名需要寫為 `<transition-group>`。
:::

## 進入 / 離開動畫 {#enter-leave-transitions}

這裡是 `<TransitionGroup>` 對一個 `v-for` 列表添加進入 / 離開動畫的示例：

```vue-html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</TransitionGroup>
```

```css
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
```

<ListBasic />

## 移動動畫 {#move-transitions}

上面的示例有一些明顯的缺陷：當某一項被插入或移除時，它周圍的元素會立即發生“跳躍”而不是平穩地移動。我們可以通過添加一些額外的 CSS 規則來解決這個問題：

```css{1,13-17}
.list-move, /* 對移動中的元素應用的過渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 確保將離開的元素從佈局流中刪除
  以便能夠正確地計算移動的動畫。 */
.list-leave-active {
  position: absolute;
}
```

現在它看起來好多了，甚至對整個列表執行洗牌的動畫也都非常流暢：

<ListMove />

[完整的示例](/examples/#list-transition)

## 漸進延遲列表動畫 {#staggering-list-transitions}

通過在 JavaScript 鉤子中讀取元素的 data 屬性，我們可以實現帶漸進延遲的列表動畫。首先，我們把每一個元素的索引渲染為該元素上的一個 data 屬性：

```vue-html{11}
<TransitionGroup
  tag="ul"
  :css="false"
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @leave="onLeave"
>
  <li
    v-for="(item, index) in computedList"
    :key="item.msg"
    :data-index="index"
  >
    {{ item.msg }}
  </li>
</TransitionGroup>
```

接著，在 JavaScript 鉤子中，我們基於當前元素的 data attribute 對該元素的進場動畫添加一個延遲。以下是一個基於 [GSAP library](https://gsap.com/) 的動畫示例：

```js{5}
function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: el.dataset.index * 0.15,
    onComplete: done
  })
}
```

<ListStagger />

<div class="composition-api">

[在演練場中查看完整示例](https://play.vuejs.org/#eNqlVMuu0zAQ/ZVRNklRm7QLWETtBW4FSFCxYkdYmGSSmjp28KNQVfl3xk7SFyvEponPGc+cOTPNOXrbdenRYZRHa1Nq3lkwaF33VEjedkpbOIPGeg6lajtnsYIeaq1aiOlSfAlqDOtG3L8SUchSSWNBcPrZwNdCAqVqTZND/KxdibBDjKGf3xIfWXngCNs9k4/Udu/KA3xWWnPz1zW0sOOP6CcnG3jv9ImIQn67SvrpUJ9IE/WVxPHsSkw97gbN0zFJZrB5grNPrskcLUNXac2FRZ0k3GIbIvxLSsVTq3bqF+otM5jMUi5L4So0SSicHplwOKOyfShdO1lariQo+Yy10vhO+qwoZkNFFKmxJ4Gp6ljJrRe+vMP3yJu910swNXqXcco1h0pJHDP6CZHEAAcAYMydwypYCDAkJRdX6Sts4xGtUDAKotIVs9Scpd4q/A0vYJmuXo5BSm7JOIEW81DVo77VR207ZEf8F23LB23T+X9VrbNh82nn6UAz7ASzSCeANZe0AnBctIqqbIoojLCIIBvoL5pJw31DH7Ry3VDKsoYinSii4ZyXxhBQM2Fwwt58D7NeoB8QkXfDvwRd2XtceOsCHkwc8KCINAk+vADJppQUFjZ0DsGVGT3uFn1KSjoPeKLoaYtvCO/rIlz3vH9O5FiU/nXny/pDT6YGKZngg0/Zg1GErrMbp6N5NHxJFi3N/4dRkj5IYf5ULxCmiPJpI4rIr4kHimhvbWfyLHOyOzQpNZZ57jXNy4nRGFLTR/0fWBqe7w==)

</div>
<div class="options-api">

[在演練場中查看完整示例](https://play.vuejs.org/#eNqtVE2P0zAQ/SujXNqgNmkPcIjaBbYCJKg4cSMcTDJNTB07+KNsVfW/M3aabNpyQltViT1vPPP8Zian6H3bJgeHURatTKF5ax9yyZtWaQuVYS3stGpg4peTXOayUNJYEJwea/ieS4ATNKbKYPKoXYGwRZzAeTYGPrNizxE2NZO30KZ2xR6+Kq25uTuGFrb81vrFyQo+On0kIJc/PCV8CmxL3DEnLJy8e8ksm8bdGkCjdVr2O4DfDvWRgtGN/JYC0SOkKVTTOotl1jv3hi3d+DngENILkey4sKinU26xiWH9AH6REN/Eqq36g3rDDE7jhMtCuBLN1NbcJIFEHN9RaNDWqjQDAyUfcac0fpA+CYoRCRSJsUeBiWpZwe2RSrK4w2rkVe2rdYG6LD5uH3EGpZI4iuurTdwDNBjpRJclg+UlhP914UnMZfIGm8kIKVEwciYivhoGLQlQ4hO8gkWyfD1yVHJDKgu0mAUmPXLuxRkYb5Ed8H8YL/7BeGx7Oa6hkLmk/yodBoo21BKtYBZpB7DikroKDvNGUeZ1HoVmyCNIO/ibZtJwy5X8pJVru9CWVeTpRB51+6wwhgw7Jgz2tnc/Q6/M0ZeWwKvmGZye0Wu78PIGexC6swdGxEnw/q6HOYUkt9DwMwhKxfS6GpY+KPHc45G8+6EYAV7reTjucf/uwUtSmvvTME1wDuISlVTwTqf0RiiyrtKR0tEs6r5l84b645dRkr5zoT8oXwBMHg2Tlke+jbwhj2prW5OlqZPtvkroYqnH3lK9nLgI46scnf8Cn22kBA==)

</div>

---

**參考**

- [`<TransitionGroup>` API 參考](/api/built-in-components#transitiongroup)
