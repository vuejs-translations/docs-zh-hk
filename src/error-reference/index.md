<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# 生產環境錯誤代碼參考 {#error-reference}

## 運行時錯誤 {#runtime-errors}

在生產環境中，傳遞給以下錯誤處理程序 API 的第三個參數是一個短代碼，而不是含有完整信息的字符串：

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (組合式 API)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (選項式 API)

下表提供了代碼和其原始的完整信息字符串的映射。

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## 編譯錯誤 {#compiler-errors}

下表提供了生產環境的編譯錯誤代碼與其原始消息的映射。

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />
