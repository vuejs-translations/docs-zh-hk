<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` 是一個內置組件，它的功能是在多個組件間動態切換時緩存被移除的組件實例。

## 基本使用 {#basic-usage}

在組件基礎章節中，我們已經介紹了通過特殊的 `<component>` 元素來實現[動態組件](/guide/essentials/component-basics#dynamic-components)的用法：

```vue-html
<component :is="activeComponent" />
```

默認情況下，一個組件實例在被替換掉後會被銷毀。這會導致它丟失其中所有已變化的狀態——當這個組件再一次被顯示時，會創建一個只帶有初始狀態的新實例。

在下面的例子中，你會看到兩個有狀態的組件——A 有一個計數器，而 B 有一個通過 `v-model` 同步 input 框輸入內容的文字展示。嘗試先更改一下任意一個組件的狀態，然後切走，再切回來：

<SwitchComponent />

你會發現在切回來之後，之前已更改的狀態都被重置了。

在切換時創建新的組件實例通常是有意義的，但在這個例子中，我們的確想要組件能在被“切走”的時候保留它們的狀態。要解決這個問題，我們可以用 `<KeepAlive>` 內置組件將這些動態組件包裝起來：

```vue-html
<!-- 非活躍的組件將會被緩存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

現在，在組件切換時狀態也能被保留了：

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJqV+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPftaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[在演練場中嘗試一下](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiawasPxArRD/3rVNSEhbpVUrIWB3x7PM7jAkuVL3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
在 [DOM 內模板](/guide/essentials/component-basics#in-dom-template-parsing-caveats)中使用時，它應該被寫為 `<keep-alive>`。
:::

## 包含/排除 {#include-exclude}

`<KeepAlive>` 默認會緩存內部的所有組件實例，但我們可以通過 `include` 和 `exclude` prop 來定製該行為。這兩個 prop 的值都可以是一個以英文逗號分隔的字符串、一個正則表達式，或是包含這兩種類型的一個數組：

```vue-html
<!-- 以英文逗號分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正則表達式 (需使用 `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 數組 (需使用 `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

它會根據組件的 [`name`](/api/options-misc#name) 選項進行匹配，所以組件如果想要條件性地被 `KeepAlive` 緩存，就必須顯式聲明一個 `name` 選項。

:::tip
在 3.2.34 或以上的版本中，使用 `<script setup>` 的單文件組件會自動根據文件名生成對應的 `name` 選項，無需再手動聲明。
:::

## 最大緩存實例數 {#max-cached-instances}

我們可以通過傳入 `max` prop 來限制可被緩存的最大組件實例數。`<KeepAlive>` 的行為在指定了 `max` 後類似一個 [LRU 緩存](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>)：如果緩存的實例數量即將超過指定的那個最大數量，則最久沒有被訪問的緩存實例將被銷燬，以便為新的實例騰出空間。

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## 緩存實例的生命週期 {#lifecycle-of-cached-instance}

當一個組件實例從 DOM 上移除但因為被 `<KeepAlive>` 緩存而仍作為組件樹的一部分時，它將變為**不活躍**狀態而不是被卸載。當一個組件實例作為緩存樹的一部分插入到 DOM 中時，它將重新**被激活**。

<div class="composition-api">

一個持續存在的組件可以通過 [`onActivated()`](/api/composition-api-lifecycle#onactivated) 和 [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated) 註冊相應的兩個狀態的生命週期鉤子：

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // 調用時機為首次掛載
  // 以及每次從緩存中被重新插入時
})

onDeactivated(() => {
  // 在從 DOM 上移除、進入緩存
  // 以及組件卸載時調用
})
</script>
```

</div>
<div class="options-api">

一個持續存在的組件可以通過 [`activated`](/api/options-lifecycle#activated) 和 [`deactivated`](/api/options-lifecycle#deactivated) 選項來註冊相應的兩個狀態的生命週期鉤子：

```js
export default {
  activated() {
    // 在首次掛載、
    // 以及每次從緩存中被重新插入的時候調用
  },
  deactivated() {
    // 在從 DOM 上移除、進入緩存
    // 以及組件卸載時調用
  }
}
```

</div>

請注意：

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> 在組件掛載時也會調用，並且 <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> 在組件卸載時也會調用。

- 這兩個鉤子不僅適用於 `<KeepAlive>` 緩存的根組件，也適用於緩存樹中的後代組件。

---

**參考**

- [`<KeepAlive>` API 參考](/api/built-in-components#keepalive)
