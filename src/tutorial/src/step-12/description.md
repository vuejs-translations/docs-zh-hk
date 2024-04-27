# Props {#props}

子組件可以通過 **props** 從父組件接受動態數據。首先，需要聲明它所接受的 props：

<div class="composition-api">
<div class="sfc">

```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

注意 `defineProps()` 是一個編譯時宏，並不需要導入。一旦聲明，`msg` prop 就可以在子組件的模板中使用。它也可以通過 `defineProps()` 所返回的對象在 JavaScript 中訪問。

</div>

<div class="html">

```js
// 在子組件中
export default {
  props: {
    msg: String
  },
  setup(props) {
    // 訪問 props.msg
  }
}
```

一旦聲明，`msg` prop 就會暴露在 `this` 上，並可以在子組件的模板中使用。接收到的 props 會作為第一個參數傳遞給 `setup()`。

</div>

</div>

<div class="options-api">

```js
// 在子組件中
export default {
  props: {
    msg: String
  }
}
```

一旦聲明，`msg` prop 就會暴露在 `this` 上，並可以在子組件的模板中使用。

</div>

父組件可以像聲明 HTML 屬性一樣傳遞 props。若要傳遞動態值，也可以使用 `v-bind` 語法：

<div class="sfc">

```vue-html
<ChildComp :msg="greeting" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="greeting"></child-comp>
```

</div>

現在在編輯器中自己嘗試一下吧。
