# 列表渲染 {#list-rendering}

我們可以使用 `v-for` 指令來渲染一個基於源數組的列表：

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

這裡的 `todo` 是一個局部變量，表示當前正在迭代的數組元素。它只能在 `v-for` 所綁定的元素上或是其內部訪問，就像函數的作用域一樣。

注意，我們還給每個 todo 對象設置了唯一的 `id`，並且將它作為<a target="_blank" href="/api/built-in-special-attributes.html#key">特殊的 `key` 屬性</a>綁定到每個 `<li>`。`key` 使得 Vue 能夠精確的移動每個 `<li>`，以匹配對應的對象在數組中的位置。

更新列表有兩種方式：

1. 在源數組上調用[變更方法](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating)：

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. 使用新的數組替代原數組：

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

這裡有一個簡單的 todo 列表——試著實現一下 `addTodo()` 和 `removeTodo()` 這兩個方法的邏輯，使列表能夠正常工作！

關於 `v-for` 的更多細節：<a target="_blank" href="/guide/essentials/list.html">指南 - 列表渲染</a>
