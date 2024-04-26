# Teleport {#teleport}

`<Teleport>` 是一個內置組件，它可以將一個組件內部的一部分模板“傳送”到該組件的 DOM 結構外層的位置去。

## 基本用法 {#basic-usage}

有時我們可能會遇到這樣的場景：一個組件模板的一部分在邏輯上從屬於該組件，但從整個應用視圖的角度來看，它在 DOM 中應該被渲染在整個 Vue 應用外部的其他地方。

這類場景最常見的例子就是全屏的模態框。理想情況下，我們希望觸發模態框的按鈕和模態框本身是在同一個組件中，因為它們都與組件的開關狀態有關。但這意味著該模態框將與按鈕一起渲染在應用 DOM 結構裡很深的地方。這會導致該模態框的 CSS 佈局代碼很難寫。

試想下面這樣的 HTML 結構：

```vue-html
<div class="outer">
  <h3>Tooltips with Vue 3 Teleport</h3>
  <div>
    <MyModal />
  </div>
</div>
```

接下來我們來看看 `<MyModal>` 的實現：

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

這個組件中有一個 `<button>` 按鈕來觸發打開模態框，和一個 class 名為 `.modal` 的 `<div>`，它包含了模態框的內容和一個用來關閉的按鈕。

當在初始 HTML 結構中使用這個組件時，會有一些潛在的問題：

- `position: fixed` 能夠相對於瀏覽器窗口放置有一個條件，那就是不能有任何祖先元素設置了 `transform`、`perspective` 或者 `filter` 樣式屬性。也就是說如果我們想要用 CSS `transform` 為祖先節點 `<div class="outer">` 設置動畫，就會不小心破壞模態框的佈局！

- 這個模態框的 `z-index` 受限於它的容器元素。如果有其他元素與 `<div class="outer">` 重疊並有更高的 `z-index`，則它會覆蓋住我們的模態框。

`<Teleport>` 提供了一個更簡單的方式來解決此類問題，讓我們不需要再顧慮 DOM 結構的問題。讓我們用 `<Teleport>` 改寫一下 `<MyModal>`：

```vue-html{3,8}
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

`<Teleport>` 接收一個 `to` prop 來指定傳送的目標。`to` 的值可以是一個 CSS 選擇器字符串，也可以是一個 DOM 元素對象。這段代碼的作用就是告訴 Vue“把以下模板片段**傳送到 `body`** 標籤下”。

你可以點擊下面這個按鈕，然後通過瀏覽器的開發者工具，在 `<body>` 標籤下找到模態框元素：

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">Open Modal</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">Hello from the modal!</p>
        <button @click="open = false">Close</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

我們也可以將 `<Teleport>` 和 [`<Transition>`](./transition) 結合使用來創建一個帶動畫的模態框。你可以看看[這個示例](/examples/#modal)。

:::tip
`<Teleport>` 掛載時，傳送的 `to` 目標必須已經存在於 DOM 中。理想情況下，這應該是整個 Vue 應用 DOM 樹外部的一個元素。如果目標元素也是由 Vue 渲染的，你需要確保在掛載 `<Teleport>` 之前先掛載該元素。
:::

## 搭配組件使用 {#using-with-components}

`<Teleport>` 只改變了渲染的 DOM 結構，它不會影響組件間的邏輯關係。也就是說，如果 `<Teleport>` 包含了一個組件，那麼該組件始終和這個使用了 `<teleport>` 的組件保持邏輯上的父子關係。傳入的 props 和觸發的事件也會照常工作。

這也意味著來自父組件的注入也會按預期工作，子組件將在 Vue Devtools 中嵌套在父級組件下面，而不是放在實際內容移動到的地方。

## 禁用 Teleport {#disabling-teleport}

在某些場景下可能需要視情況禁用 `<Teleport>`。舉例來說，我們想要在桌面端將一個組件當做浮層來渲染，但在移動端則當作行內組件。我們可以通過對 `<Teleport>` 動態地傳入一個 `disabled` prop 來處理這兩種不同情況。

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

這裡的 `isMobile` 狀態可以根據 CSS media query 的不同結果動態地更新。

## 多個 Teleport 共享目標 {#multiple-teleports-on-the-same-target}

一個可重用的模態框組件可能同時存在多個實例。對於此類場景，多個 `<Teleport>` 組件可以將其內容掛載在同一個目標元素上，而順序就是簡單的順次追加，後掛載的將排在目標元素下更後面的位置上。

比如下面這樣的用例：

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

渲染的結果為：

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

---

**參考**

- [`<Teleport>` API 參考](/api/built-in-components#teleport)
- [在 SSR 中處理 Teleports](/guide/scaling-up/ssr#teleports)
