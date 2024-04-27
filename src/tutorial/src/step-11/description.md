# 組件 {#components}

目前為止，我們只使用了單個組件。真正的 Vue 應用往往是由嵌套組件創建的。

父組件可以在模板中渲染另一個組件作為子組件。要使用子組件，我們需要先引入它：

<div class="composition-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'
```

</div>
</div>

<div class="options-api">
<div class="sfc">

```js
import ChildComp from './ChildComp.vue'

export default {
  components: {
    ChildComp
  }
}
```

我們還需要使用 `components` 選項註冊組件。這裡我們使用對象屬性的簡寫形式在 `ChildComp` 鍵下注冊 `ChildComp` 組件。

</div>
</div>

<div class="sfc">

然後我們就可以在模板中使用組件，就像這樣：

```vue-html
<ChildComp />
```

</div>

<div class="html">

```js
import ChildComp from './ChildComp.js'

createApp({
  components: {
    ChildComp
  }
})
```

我們還需要使用 `components` 選項註冊組件。這裡我們使用對象屬性的簡寫形式在 `ChildComp` 鍵下注冊 `ChildComp` 組件。

因為我們是在 DOM 中編寫模板語法，因此需要遵循瀏覽器的大小寫敏感的標籤解析規則。所以，我們需要使用 kebab-case 的名字來引用子組件：

```vue-html
<child-comp></child-comp>
```

</div>


現在自己嘗試一下——導入子組件並在模板中渲染它。
