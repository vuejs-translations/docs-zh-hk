---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# 版本發佈 {#releases}

<p v-if="version">
當前 Vue 的最新穩定版本是 <strong>{{ version }}</strong>。
</p>
<p v-else>
正在檢測最新版本……
</p>

完整的過往發佈記錄可以在 [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md) 查閱。

## 發佈週期 {#release-cycle}

Vue 並沒有固定的發佈週期。

- 補丁版本 (patch releases) 發佈會及時按需進行。

- 小版本 (minor releases) 發佈總是會包含一些新特性，發佈週期通常會在 3~6 個月之間，並會經歷 beta 預發佈階段。

- 大版本 (major releases) 發佈會提前告知，且經歷早期討論和 alpha、beta 等預發佈階段。

## 語義化版本控制的特殊情況 {#semantic-versioning-edge-cases}

Vue 的發佈會遵循[語義化版本控制](https://semver.org/)，但同時伴隨一些特殊情況。

### TypeScript 類型聲明 {#typescript-definitions}

我們可能會在**小版本**發佈之間包含 TypeScript 類型聲明的不兼容變更，因為：

1. 有時 TypeScript 自身會在其小版本之間發佈不兼容的變更，因此我們不得不為了支持更新版本的 TypeScript 而調整自身的類型定義。

2. 我們偶爾也需要使用最新版本的 TypeScript 中才可用的特性，並提升對應功能的 TypeScript 的最低版本要求。

如果你正在使用 TypeScript，則可以使用一個語義化版本的範圍來鎖定當前的小版本，並在 Vue 新的小版本發佈時進行手動升級。

### 編譯後的代碼和舊版運行時之間的兼容性 {#compiled-code-compatibility-with-older-runtime}

較新**小版本**的 Vue 編譯器可能會生成與較舊小版本的 Vue 運行時不兼容的代碼。例如，由 Vue 3.2 編譯器生成的代碼可能不完全兼容 Vue 3.1 的運行時。

只有庫的作者需要考慮這個問題，因為編譯器版本和運行時版本在應用中總是相同的。只有當你把預編譯的 Vue 組件代碼發佈為一個包，而用戶在一個使用舊版本 Vue 的項目中使用它時，才會發生版本不匹配。因此，你的包可能需要明確指定 Vue 的最低小版本要求。

## 預發佈版本 {#pre-releases}

小版本發佈通常會經過不定量的 beta 版。而大版本發佈則會先經過 alpha 和 beta 階段。

此外，我們每週都會從 GitHub 上的 `main` 和 `minor` 分支發佈金絲雀版本。它們將作為不同的軟件包發佈以避免穩定通道的 npm 元數據變得臃腫。你可以分別通過 `npx install-vue@canary` 或 `npx install-vue@canary-minor` 安裝它們。

預發佈版本 (pre releases) 是為了進行集成/穩定性測試，並讓早期用戶為不穩定的功能提供反饋。請不要在生產中使用預發佈版本。所有的預發佈版本都被認為是不穩定的，並且可能會在兩者之間產生不兼容變更，所以在使用預發佈版本時，一定要精確鎖定版本號。

## 廢棄的特性 {#deprecations}

我們可能會定期廢棄那些在新的小版本中擁有更新更好的替代品的功能。被廢棄的功能仍將繼續工作，但會在進入廢棄狀態後的下一個大版本中被刪除。

## RFC {#rfcs}

具有可觀表層 API 的新特性和 Vue 的重大變更都將經歷**意見徵集** (RFC) 流程。RFC 流程的目的是為新功能進入該框架提供一個一致且可控的路徑，並給用戶一個機會參與設計過程並提供反饋。

該 RFC 流程會在 GitHub 上的 [vuejs/rfcs](https://github.com/vuejs/rfcs) 倉庫進行。

## 試驗性特性 {#experimental-features}

有些特性在 Vue 的穩定版本中已經發布並被記錄，但被標記為試驗性的。試驗性特性通常與某些 RFC 討論相關聯，這些討論中的大部分設計問題已經在理論上得到了解決，但仍缺乏來自真實實踐的反饋。

試驗性特性的目的是允許用戶通過在生產環境中測試它們來提供反饋，而不必使用不穩定的 Vue 版本。試驗性特性本身是被認為不穩定的，只能以某種受控的方式使用，且該特性可預期地會在任何發佈類型中發生變化。
