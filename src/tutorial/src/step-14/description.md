# 插槽 {#slots}

除了通過 props 傳遞數據外，父組件還可以通過**插槽** (slots) 將模板片段傳遞給子組件：

<div class="sfc">

```vue-html
<ChildComp>
  This is some slot content!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  This is some slot content!
</child-comp>
```

</div>

在子組件中，可以使用 `<slot>` 元素作為插槽出口 (slot outlet) 渲染父組件中的插槽內容 (slot content)：

<div class="sfc">

```vue-html
<!-- 在子組件的模板中 -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- 在子組件的模板中 -->
<slot></slot>
```

</div>

`<slot>` 插口中的內容將被當作“默認”內容：它會在父組件沒有傳遞任何插槽內容時顯示：

```vue-html
<slot>Fallback content</slot>
```

現在我們沒有給 `<ChildComp>` 傳遞任何插槽內容，所以你將看到默認內容。讓我們利用父組件的 `msg` 狀態為子組件提供一些插槽內容吧。
