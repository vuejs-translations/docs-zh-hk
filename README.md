# Vuejs 繁體中文文檔

這裡是全新推出的繁體中文文檔。

你也可以預覽對應的英文原文文檔 [https://vuejs.org](https://vuejs.org) 及 Vue 代碼倉庫 [vuejs/docs](https://github.com/vuejs/docs)。

## 如何參與貢獻

本倉庫是[官方文檔倉庫](https://github.com/vuejs/docs)的鏡像翻譯倉庫。我們僅對原文進行內容同步與翻譯，**不包含**基於英文原版的補充、刪改或演繹等。如對原文有任何意見或建議，歡迎到[官方文檔倉庫](https://github.com/vuejs/docs)提出 issue 或發起 PR。

有勞訪問我們的 [wiki](https://github.com/vuejs-translations/docs-zh-hk/wiki) 了解相關注意事項。

目前網站處於長期維護狀態，我們會定期同步英文版的更新，包括文檔內容和前端代碼等。歡迎大家：

- 同步英文站點最新的改動到此處
- 修復錯別字或錯誤的書寫格式
- 發布有關譯法或書寫格式的 issue 討論
- 翻譯有關部署或協作流程的 issue 討論

同時我們的文檔中有時可能會存在暫時未翻譯的段落，這些段落通常都以 `<!-- TODO: translation -->` 開頭作為標記。所以也歡迎大家在源碼中搜索這些段落並貢獻翻譯。你也可以通過[這個鏈接](https://github.com/vuejs-translations/docs-zh-hk/search?q=TODO%3A+translation)快速找到尚未翻譯好的內容。

### 注意事項

**請在提交前對翻譯內容進行[校對](https://github.com/vuejs-translations/docs-zh-hk/wiki/%E7%BF%BB%E8%AD%AF%E8%A6%8F%E7%AF%84)。**

## 如何在本地編輯和預覽該網站

This project requires Node.js to be `v18` or higher. And it is recommended to enable corepack:

```bash
corepack enable
```

This project requires Node.js to be `v20` or higher. And it is recommended to enable corepack:

```bash
corepack enable
```

## Working on the content

- See VitePress docs on supported [Markdown Extensions](https://vitepress.dev/guide/markdown) and the ability to [use Vue syntax inside markdown](https://vitepress.dev/guide/using-vue).

- See the [Writing Guide](https://github.com/vuejs/docs/blob/main/.github/contributing/writing-guide.md) for our rules and recommendations on writing and maintaining documentation content.

## Working on the theme

If changes need to be made for the theme, check out the [instructions for developing the theme alongside the docs](https://github.com/vuejs/vue-theme#developing-with-real-content).
