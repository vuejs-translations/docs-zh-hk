# 生命週期鉤子 {#lifecycle-hooks}

每個 Vue 組件實例在創建時都需要經歷一系列的初始化步驟，例如設置好數據偵聽，編譯模板，掛載實例到 DOM，以及在數據改變時更新 DOM。在此過程中，它也會運行被稱為生命週期鉤子的函數，讓開發者有機會在特定階段運行自己的代碼。

## 註冊週期鉤子 {#registering-lifecycle-hooks}

舉例來說，<span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> 鉤子可以用來在組件完成初始渲染並創建 DOM 節點後運行代碼：

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`the component is now mounted.`)
  }
}
```

</div>

還有其他一些鉤子，會在實例生命週期的不同階段被調用，最常用的是 <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle#onmounted)、[`onUpdated`](/api/composition-api-lifecycle#onupdated) 和 [`onUnmounted`](/api/composition-api-lifecycle#onunmounted)。所有生命週期鉤子的完整參考及其用法請參考 [API 索引](/api/composition-api-lifecycle.html)。</span><span class="options-api">[`mounted`](/api/options-lifecycle#mounted)、[`updated`](/api/options-lifecycle#updated) 和 [`unmounted`](/api/options-lifecycle#unmounted)。</span>

<div class="options-api">

所有生命週期鉤子函數的 `this` 上下文都會自動指向當前調用它的組件實例。注意：避免用箭頭函數來定義生命週期鉤子，因為如果這樣的話你將無法在函數中通過 `this` 獲取組件實例。

</div>

<div class="composition-api">

當調用 `onMounted` 時，Vue 會自動將回調函數註冊到當前正被初始化的組件實例上。這意味著這些鉤子應當在組件初始化時被**同步**註冊。例如，請不要這樣做：

```js
setTimeout(() => {
  onMounted(() => {
    // 異步註冊時當前組件實例已丟失
    // 這將不會正常工作
  })
}, 100)
```

注意這並不意味著對 `onMounted` 的調用必須放在 `setup()` 或 `<script setup>` 內的詞法上下文中。`onMounted()` 也可以在一個外部函數中調用，只要調用棧是同步的，且最終起源自 `setup()` 就可以。

</div>

## 生命週期圖示 {#lifecycle-diagram}

下面是實例生命週期的圖表。你現在並不需要完全理解圖中的所有內容，但以後它將是一個有用的參考。

![組件生命週期圖示](./images/lifecycle_zh-CN.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->
<!-- https://www.figma.com/file/QHo4ehJ4TRx3f7gzRP1F1k/Vue-Lifecycle-(zh-CN) -->

有關所有生命週期鉤子及其各自用例的詳細信息，請參考<span class="composition-api">[生命週期鉤子 API 索引](/api/composition-api-lifecycle)</span><span class="options-api">[生命週期鉤子 API 索引](/api/options-lifecycle)</span>。
