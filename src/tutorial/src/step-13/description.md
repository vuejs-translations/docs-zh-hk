# Emits {#emits}

除了接收 props，子組件還可以向父組件觸發事件：

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// 聲明觸發的事件
const emit = defineEmits(['response'])

// 帶參數觸發
emit('response', 'hello from child')
</script>
```

</div>

<div class="html">

```js
export default {
  // 聲明觸發的事件
  emits: ['response'],
  setup(props, { emit }) {
    // 帶參數觸發
    emit('response', 'hello from child')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // 聲明觸發的事件
  emits: ['response'],
  created() {
    // 帶參數觸發
    this.$emit('response', 'hello from child')
  }
}
```

</div>

<span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> 的第一個參數是事件的名稱。其他所有參數都將傳遞給事件監聽器。

父組件可以使用 `v-on` 監聽子組件觸發的事件——這裡的處理函數接收了子組件觸發事件時的額外參數並將它賦值給了本地狀態：

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

現在在編輯器中自己嘗試一下吧。
