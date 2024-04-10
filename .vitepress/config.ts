import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'

const nav: ThemeConfig['nav'] = [
  {
    text: '文檔',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: '簡介', link: '/guide/introduction' },
      { text: '互動教程', link: '/tutorial/' },
      { text: '示例', link: '/examples/' },
      { text: '快速上手', link: '/guide/quick-start' },
      // { text: '風格指南', link: '/style-guide/' },
      { text: '術語表', link: '/glossary/' },
      { text: '錯誤碼參照表', link: '/error-reference/' },
      {
        text: 'Vue 2 文檔',
        link: 'https://v2.cn.vuejs.org'
      },
      {
        text: '從 Vue 2 遷移',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: '演習場',
    link: 'https://play.vuejs.org'
  },
  {
    text: '生態系統',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: '資源',
        items: [
          { text: '合作伙伴', link: '/partners/' },
          { text: '主題', link: '/ecosystem/themes' },
          { text: 'UI 組件', link: 'https://ui-libs.vercel.app/' },
          {
            text: '證書',
            link: 'https://certification.vuejs.org/?ref=vuejs-nav'
          },
          { text: '找工作', link: 'https://vuejobs.com/?ref=vuejs' },
          { text: 'T-Shirt 商店', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: '官方庫',
        items: [
          { text: 'Vue Router', link: 'https://router.vuejs.org/zh/' },
          { text: 'Pinia', link: 'https://pinia.vuejs.org/zh/' },
          { text: '工具鏈指南', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      {
        text: '視頻課程',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: '幫助',
        items: [
          {
            text: 'Discord 聊天室',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'GitHub 論壇',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'DEV Community', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: '動態',
        items: [
          { text: '博客', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          { text: '活動', link: 'https://events.vuejs.org/' },
          { text: '新聞簡報', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: '關於',
    activeMatch: `^/about/`,
    items: [
      { text: '常見問題', link: '/about/faq' },
      { text: '團隊', link: '/about/team' },
      { text: '版本發佈', link: '/about/releases' },
      {
        text: '社區指南',
        link: '/about/community-guide'
      },
      { text: '行為規範', link: '/about/coc' },
      {
        text: '紀錄片',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: '贊助',
    link: '/sponsor/'
  },
  {
    text: '合作伙伴',
    link: '/partners/',
    activeMatch: `^/partners/`
  }
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: '開始',
      items: [
        { text: '簡介', link: '/guide/introduction' },
        {
          text: '快速上手',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: '基礎',
      items: [
        {
          text: '創建一個應用',
          link: '/guide/essentials/application'
        },
        {
          text: '模板語法',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: '響應式基礎',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: '計算屬性',
          link: '/guide/essentials/computed'
        },
        {
          text: '類與樣式綁定',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: '條件渲染',
          link: '/guide/essentials/conditional'
        },
        { text: '列表渲染', link: '/guide/essentials/list' },
        {
          text: '事件處理',
          link: '/guide/essentials/event-handling'
        },
        { text: '表單輸入綁定', link: '/guide/essentials/forms' },
        {
          text: '生命週期',
          link: '/guide/essentials/lifecycle'
        },
        { text: '偵聽器', link: '/guide/essentials/watchers' },
        { text: '模板引用', link: '/guide/essentials/template-refs' },
        {
          text: '組件基礎',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: '深入組件',
      items: [
        {
          text: '註冊',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: '事件', link: '/guide/components/events' },
        { text: '組件 v-model', link: '/guide/components/v-model' },
        {
          text: '透傳 Attributes',
          link: '/guide/components/attrs'
        },
        { text: '插槽', link: '/guide/components/slots' },
        {
          text: '依賴注入',
          link: '/guide/components/provide-inject'
        },
        {
          text: '異步組件',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: '邏輯複用',
      items: [
        {
          text: '組合式函數',
          link: '/guide/reusability/composables'
        },
        {
          text: '自定義指令',
          link: '/guide/reusability/custom-directives'
        },
        { text: '插件', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: '內置組件',
      items: [
        { text: 'Transition', link: '/guide/built-ins/transition' },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        { text: 'Teleport', link: '/guide/built-ins/teleport' },
        { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: '應用規模化',
      items: [
        { text: '單文件組件', link: '/guide/scaling-up/sfc' },
        { text: '工具鏈', link: '/guide/scaling-up/tooling' },
        { text: '路由', link: '/guide/scaling-up/routing' },
        {
          text: '狀態管理',
          link: '/guide/scaling-up/state-management'
        },
        { text: '測試', link: '/guide/scaling-up/testing' },
        {
          text: '服務端渲染 (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: '最佳實踐',
      items: [
        {
          text: '生產部署',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: '性能優化',
          link: '/guide/best-practices/performance'
        },
        {
          text: '無障礙訪問',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: '安全',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        { text: '總覽', link: '/guide/typescript/overview' },
        {
          text: 'TS 與組合式 API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS 與選項式 API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: '進階主題',
      items: [
        {
          text: '使用 Vue 的多種方式',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: '組合式 API 常見問答',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: '深入響應式系統',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: '渲染機制',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: '渲染函數 & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue 與 Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: '動畫技巧',
          link: '/guide/extras/animation'
        }
        // {
        //   text: '為 Vue 構建一個庫',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React 開發者',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: '全局 API',
      items: [
        { text: '應用實例', link: '/api/application' },
        {
          text: '通用',
          link: '/api/general'
        }
      ]
    },
    {
      text: '組合式 API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: '響應式: 核心',
          link: '/api/reactivity-core'
        },
        {
          text: '響應式: 工具',
          link: '/api/reactivity-utilities'
        },
        {
          text: '響應式: 進階',
          link: '/api/reactivity-advanced'
        },
        {
          text: '生命週期鉤子',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: '依賴注入',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    {
      text: '選項式 API',
      items: [
        { text: '狀態選項', link: '/api/options-state' },
        { text: '渲染選項', link: '/api/options-rendering' },
        {
          text: '生命週期選項',
          link: '/api/options-lifecycle'
        },
        {
          text: '組合選項',
          link: '/api/options-composition'
        },
        { text: '其他雜項', link: '/api/options-misc' },
        {
          text: '組件實例',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: '內置內容',
      items: [
        { text: '指令', link: '/api/built-in-directives' },
        { text: '組件', link: '/api/built-in-components' },
        {
          text: '特殊元素',
          link: '/api/built-in-special-elements'
        },
        {
          text: '特殊屬性',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: '單文件組件',
      items: [
        { text: '語法定義', link: '/api/sfc-spec' },
        { text: '<script setup>', link: '/api/sfc-script-setup' },
        { text: 'CSS 功能', link: '/api/sfc-css-features' }
      ]
    },
    {
      text: '進階 API',
      items: [
        { text: '渲染函數', link: '/api/render-function' },
        { text: '服務端渲染', link: '/api/ssr' },
        { text: 'TypeScript 工具類型', link: '/api/utility-types' },
        { text: '自定義渲染', link: '/api/custom-renderer' },
        { text: '編譯時標誌', link: '/api/compile-time-flags' }
      ]
    }
  ],
  '/examples/': [
    {
      text: '基礎',
      items: [
        {
          text: '你好，世界',
          link: '/examples/#hello-world'
        },
        {
          text: '處理用戶輸入',
          link: '/examples/#handling-input'
        },
        {
          text: '屬性綁定',
          link: '/examples/#attribute-bindings'
        },
        {
          text: '條件與循環',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: '表單綁定',
          link: '/examples/#form-bindings'
        },
        {
          text: '簡單組件',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: '實戰',
      items: [
        {
          text: 'Markdown 編輯器',
          link: '/examples/#markdown'
        },
        {
          text: '獲取數據',
          link: '/examples/#fetching-data'
        },
        {
          text: '帶有排序和過濾器的網格',
          link: '/examples/#grid'
        },
        {
          text: '樹狀視圖',
          link: '/examples/#tree'
        },
        {
          text: 'SVG 圖像',
          link: '/examples/#svg'
        },
        {
          text: '帶過渡動效的模態框',
          link: '/examples/#modal'
        },
        {
          text: '帶過渡動畫的列表',
          link: '/examples/#list-transition'
        },
        {
          text: 'TodoMVC',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: '計數器',
          link: '/examples/#counter'
        },
        {
          text: '溫度轉換器',
          link: '/examples/#temperature-converter'
        },
        {
          text: '機票預訂',
          link: '/examples/#flight-booker'
        },
        {
          text: '計時器',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: '畫圓',
          link: '/examples/#circle-drawer'
        },
        {
          text: '單元格',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Style Guide',
      items: [
        {
          text: 'Overview',
          link: '/style-guide/'
        },
        {
          text: 'A - Essential',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Strongly Recommended',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Recommended',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Use with Caution',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

const i18n: ThemeConfig['i18n'] = {
  search: '搜索',
  menu: '菜單',
  toc: '本頁目錄',
  returnToTop: '返回頂部',
  appearance: '外觀',
  previous: '前一篇',
  next: '下一篇',
  pageNotFound: '頁面未找到',
  deadLink: {
    before: '你打開了一個不存在的鏈接：',
    after: '。'
  },
  deadLinkReport: {
    before: '不介意的話請提交到',
    link: '這裡',
    after: '，我們會跟進修復。'
  },
  footerLicense: {
    before: '',
    after: ''
  },
  ariaAnnouncer: {
    before: '',
    after: '已經加載完畢'
  },
  ariaDarkMode: '切換深色模式',
  ariaSkipToContent: '直接跳到內容',
  ariaToC: '當前頁面的目錄',
  ariaMainNav: '主導航',
  ariaMobileNav: '移動版導航',
  ariaSidebarNav: '側邊欄導航'
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'zh-CN',
  title: 'Vue.js',
  description: 'Vue.js - 漸進式的 JavaScript 框架',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:url', content: 'https://vuejs.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.js' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Vue.js - 漸進式的 JavaScript 框架'
      }
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    ['meta', { name: 'twitter:site', content: '@vuejs' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
      }
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'ZPMMDSYA',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      {
        link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
      {
        link: '/translations/',
        text: '幫助我們翻譯！',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs_cn2',
      appId: 'UURH1MHAF7',
      apiKey: 'c23eb8e7895f42daeaf2bf6f63eb4bf6',
      searchParameters: {
        facetFilters: ['version:v3']
      },
      placeholder: '搜索文檔',
      translations: {
        button: {
          buttonText: '搜索'
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查詢條件',
            resetButtonAriaLabel: '清除查詢條件',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消'
          },
          startScreen: {
            recentSearchesTitle: '搜索歷史',
            noRecentSearchesText: '暫無搜索歷史',
            saveRecentSearchButtonTitle: '保存到搜索歷史',
            removeRecentSearchButtonTitle: '從搜索歷史中移除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '從收藏中移除'
          },
          errorScreen: {
            titleText: '無法獲取結果',
            helpText: '你可能需要檢查你的網絡連接'
          },
          footer: {
            selectText: '選擇',
            navigateText: '切換',
            closeText: '關閉',
            searchByText: '搜索供應商'
          },
          noResultsScreen: {
            noResultsText: '無法找到相關結果',
            suggestedQueryText: '你可以嘗試查詢',
            reportMissingResultsText: '你認為這個查詢應該有結果？',
            reportMissingResultsLinkText: '向我們反饋'
          }
        }
      }
    },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs-translations/docs-zh-cn',
      text: '在 GitHub 上編輯此頁'
    },

    footer: {
      license: {
        text: '版權聲明',
        link: 'https://github.com/vuejs-translations/docs-zh-cn#%E7%89%88%E6%9D%83%E5%A3%B0%E6%98%8E'
      },
      copyright:
        '本中文文檔採用 知識共享署名-非商業性使用-相同方式共享 4.0 國際許可協議  (CC BY-NC-SA 4.0) 進行許可。'
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin)
      // .use(textAdPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  }
})
