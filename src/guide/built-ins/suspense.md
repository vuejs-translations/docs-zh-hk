---
outline: deep
---

# Suspense {#suspense}

:::warning 實驗性功能
`<Suspense>` 是一項實驗性功能。它不一定會最終成為穩定功能，並且在穩定之前相關 API 也可能會發生變化。
:::

`<Suspense>` 是一個內置組件，用來在組件樹中協調對異步依賴的處理。它讓我們可以在組件樹上層等待下層的多個嵌套異步依賴項解析完成，並可以在等待時渲染一個加載狀態。

## 異步依賴 {#async-dependencies}

要了解 `<Suspense>` 所解決的問題和它是如何與異步依賴進行交互的，我們需要想象這樣一種組件層級結構：

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus>（組件有異步的 setup()）
   └─ <Content>
      ├─ <ActivityFeed> （異步組件）
      └─ <Stats>（異步組件）
```

在這個組件樹中有多個嵌套組件，要渲染出它們，首先得解析一些異步資源。如果沒有 `<Suspense>`，則它們每個都需要處理自己的加載、報錯和完成狀態。在最壞的情況下，我們可能會在頁面上看到三個旋轉的加載態，在不同的時間顯示出內容。

有了 `<Suspense>` 組件後，我們就可以在等待整個多層級組件樹中的各個異步依賴獲取結果時，在頂層展示出加載中或加載失敗的狀態。

`<Suspense>` 可以等待的異步依賴有兩種：

1. 帶有異步 `setup()` 鉤子的組件。這也包含了使用 `<script setup>` 時有頂層 `await` 表達式的組件。

2. [異步組件](/guide/components/async)。

### `async setup()` {#async-setup}

組合式 API 中組件的 `setup()` 鉤子可以是異步的：

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

如果使用 `<script setup>`，那麼頂層 `await` 表達式會自動讓該組件成為一個異步依賴：

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### 異步組件 {#async-components}

異步組件默認就是<strong>“suspensible”</strong>的。這意味著如果組件關係鏈上有一個 `<Suspense>`，那麼這個異步組件就會被當作這個 `<Suspense>` 的一個異步依賴。在這種情況下，加載狀態是由 `<Suspense>` 控制，而該組件自己的加載、報錯、延時和超時等選項都將被忽略。

異步組件也可以通過在選項中指定 `suspensible: false` 表明不用 `Suspense` 控制，並讓組件始終自己控制其加載狀態。

## 加載中狀態 {#loading-state}

`<Suspense>` 組件有兩個插槽：`#default` 和 `#fallback`。兩個插槽都只允許**一個**直接子節點。在可能的時候都將顯示默認槽中的節點。否則將顯示後備槽中的節點。

```vue-html
<Suspense>
  <!-- 具有深層異步依賴的組件 -->
  <Dashboard />

  <!-- 在 #fallback 插槽中顯示 “正在加載中” -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

在初始渲染時，`<Suspense>` 將在內存中渲染其默認的插槽內容。如果在這個過程中遇到任何異步依賴，則會進入**掛起**狀態。在掛起狀態期間，展示的是後備內容。當所有遇到的異步依賴都完成後，`<Suspense>` 會進入**完成**狀態，並將展示出默認插槽的內容。

如果在初次渲染時沒有遇到異步依賴，`<Suspense>` 會直接進入完成狀態。

進入完成狀態後，只有當默認插槽的根節點被替換時，`<Suspense>` 才會回到掛起狀態。組件樹中新的更深層次的異步依賴**不會**造成 `<Suspense>` 回退到掛起狀態。

發生回退時，後備內容不會立即展示出來。相反，`<Suspense>` 在等待新內容和異步依賴完成時，會展示之前 `#default` 插槽的內容。這個行為可以通過一個 `timeout` prop 進行配置：在等待渲染新內容耗時超過 `timeout` 之後，`<Suspense>` 將會切換為展示後備內容。若 `timeout` 值為 `0` 將導致在替換默認內容時立即顯示後備內容。

## 事件 {#events}

`<Suspense>` 組件會觸發三個事件：`pending`、`resolve` 和 `fallback`。`pending` 事件是在進入掛起狀態時觸發。`resolve` 事件是在 `default` 插槽完成獲取新內容時觸發。`fallback` 事件則是在 `fallback` 插槽的內容顯示時觸發。

例如，可以使用這些事件在加載新組件時在之前的 DOM 最上層顯示一個加載指示器。

## 錯誤處理 {#error-handling}

`<Suspense>` 組件自身目前還不提供錯誤處理，不過你可以使用 [`errorCaptured`](/api/options-lifecycle#errorcaptured) 選項或者 [`onErrorCaptured()`](/api/composition-api-lifecycle#onerrorcaptured) 鉤子，在使用到 `<Suspense>` 的父組件中捕獲和處理異步錯誤。

## 和其他組件結合 {#combining-with-other-components}

我們常常會將 `<Suspense>` 和 [`<Transition>`](./transition)、[`<KeepAlive>`](./keep-alive) 等組件結合。要保證這些組件都能正常工作，嵌套的順序非常重要。

另外，這些組件都通常與 [Vue Router](https://router.vuejs.org/zh/) 中的 `<RouterView>` 組件結合使用。

下面的示例展示了如何嵌套這些組件，使它們都能按照預期的方式運行。若想組合得更簡單，你也可以刪除一些你不需要的組件：

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主要內容 -->
          <component :is="Component"></component>

          <!-- 加載中狀態 -->
          <template #fallback>
            正在加載...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router 使用動態導入對[懶加載組件](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)進行了內置支持。這些與異步組件不同，目前他們不會觸發 `<Suspense>`。但是，它們仍然可以有異步組件作為後代，這些組件可以照常觸發 `<Suspense>`。

---

**參考**

- [`<Suspense>` API 參考](/api/built-in-components#suspense)
