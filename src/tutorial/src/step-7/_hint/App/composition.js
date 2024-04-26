import { ref } from 'vue'

export default {
  setup() {
    // 給每個 todo 對象一個唯一的 id
    let id = 0

    const newTodo = ref('')
    const todos = ref([
      { id: id++, text: 'Learn HTML' },
      { id: id++, text: 'Learn JavaScript' },
      { id: id++, text: 'Learn Vue' }
    ])

    function addTodo() {
      todos.value.push({ id: id++, text: newTodo.value })
      newTodo.value = ''
    }

    function removeTodo(todo) {
      todos.value = todos.value.filter((t) => t !== todo)
    }

    return {
      newTodo,
      todos,
      addTodo,
      removeTodo
    }
  }
}
