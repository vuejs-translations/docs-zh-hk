import fs from 'fs'
import path from 'path'
import {
  defineConfigWithTheme,
  type HeadConfig,
  type Plugin
} from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import llmstxt from 'vitepress-plugin-llms'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
// import { textAdPlugin } from './textAdMdPlugin'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'

const nav: ThemeConfig['nav'] = [
  {
    text: '文檔',
    activeMatch: `^/(guide|tutorial|examples|api|glossary|error-reference)/`,
    items: [
      { text: '快速上手', link: '/guide/quick-start' },
      { text: '簡介', link: '/guide/introduction' },
      { text: '互動教程', link: '/tutorial/' },
      { text: '示例', link: '/examples/' },
      { text: 'API', link: '/api/' },
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
    text: '演練場',
    link: 'https://play.vuejs.org'
  },
  {
    text: '生態系統',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: '資源',
        items: [
          { text: '主題', link: '/ecosystem/themes' },
          { text: 'UI 組件', link: 'https://ui-libs.vercel.app/' },
          {
            text: '插件集合',
            link: 'https://www.vue-plugins.org/'
          },
          {
            text: '認證',
            link: 'https://certificates.dev/vuejs/?ref=vuejs-nav'
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
            text: 'GitHub 討論區',
            link: 'https://github.com/vuejs/core/discussions'
          },
          { text: 'DEV 社區', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: '新聞',
        items: [
          { text: '博客', link: 'https://blog.vuejs.org/' },
          { text: 'Twitter', link: 'https://x.com/vuejs' },
          { text: '事件', link: 'https://events.vuejs.org/' },
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
      { text: '隱私政策', link: '/about/privacy' },
      {
        text: '紀錄片',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: '支持',
    activeMatch: `^/(sponsor|partners)/`,
    items: [
      { text: '贊助', link: '/sponsor/' },
      { text: '合作伙伴', link: '/partners/' }
    ]
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
          text: 'Class 與 Style 綁定',
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
        { text: '偵聽器', link: '/guide/essentials/watchers' },
        { text: '模板引用', link: '/guide/essentials/template-refs' },
        {
          text: '組件基礎',
          link: '/guide/essentials/component-basics'
        },
        {
          text: '生命週期鉤子',
          link: '/guide/essentials/lifecycle'
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
      text: '可重用性',
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
          text: '生產環境部署',
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
          text: '搭配組合式 API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: '搭配選項式 API',
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
          text: '深入響應性原理',
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
        //   text: 'Building a Library for Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React Devs',
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
          text: '響應性 API：核心',
          link: '/api/reactivity-core'
        },
        {
          text: '響應性 API：工具',
          link: '/api/reactivity-utilities'
        },
        {
          text: '響應性 API：進階',
          link: '/api/reactivity-advanced'
        },
        {
          text: '生命週期鉤子',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: '依賴注入',
          link: '/api/composition-api-dependency-injection'
        },
        {
          text: '輔助函數',
          link: '/api/composition-api-helpers'
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
          text: '特殊 Attributes',
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
        { text: '自定義元素', link: '/api/custom-elements' },
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
          text: 'Hello World',
          link: '/examples/#hello-world'
        },
        {
          text: '處理用戶輸入',
          link: '/examples/#handling-input'
        },
        {
          text: 'Attribute 綁定',
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
          text: '帶有排序和篩選的網格',
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
          text: '帶過渡效果的彈窗',
          link: '/examples/#modal'
        },
        {
          text: '帶過渡效果的列表',
          link: '/examples/#list-transition'
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
          text: '溫度轉換',
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
      text: '風格指南',
      items: [
        {
          text: '總覽',
          link: '/style-guide/'
        },
        {
          text: 'A - 必要的',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - 強烈推薦',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - 推薦',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - 謹慎使用',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

// Placeholder of the i18n config for @vuejs-translations.
// const i18n: ThemeConfig['i18n'] = {
// }

function inlineScript(file: string): HeadConfig {
  return [
    'script',
    {},
    fs.readFileSync(
      path.resolve(__dirname, `./inlined-scripts/${file}`),
      'utf-8'
    )
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  sitemap: {
    hostname: 'https://vuejs.org'
  },

  lang: 'en-US',
  title: 'Vue.js',
  description: 'Vue.js - The Progressive JavaScript Framework',
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
        content: 'Vue.js - The Progressive JavaScript Framework'
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
        href: 'https://automation.vuejs.org'
      }
    ],
    inlineScript('restorePreference.js'),
    inlineScript('uwu.js'),
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    [
      'script',
      {
        src: 'https://media.bitterbrains.com/main.js?from=vuejs&type=top',
        async: 'true'
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,
    // Placeholder of the i18n config for @vuejs-translations.
    // i18n,

    localeLinks: [
      {
        link: 'https://cn.vuejs.org',
        text: '简体中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-cn'
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
        link: 'https://de.vuejs.org',
        text: 'Deutsch',
        repo: 'https://github.com/vuejs-translations/docs-de'
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
        link: 'https://fa.vuejs.org',
        text: 'فارسی',
        repo: 'https://github.com/vuejs-translations/docs-fa'
      },
      {
        link: 'https://ru.vuejs.org',
        text: 'Русский',
        repo: 'https://github.com/vuejs-translations/docs-ru'
      },
      {
        link: 'https://cs.vuejs.org',
        text: 'Čeština',
        repo: 'https://github.com/vuejs-translations/docs-cs'
      },
      {
        link: 'https://zh-hk.vuejs.org',
        text: '繁體中文',
        repo: 'https://github.com/vuejs-translations/docs-zh-hk'
      },
      {
        link: 'https://pl.vuejs.org',
        text: 'Polski',
        repo: 'https://github.com/vuejs-translations/docs-pl'
      },
      {
        link: '/translations/',
        text: '幫助我們翻譯！',
        isTranslationsDesc: true
      }
    ],

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: '10e7a8b13e6aec4007343338ab134e05',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://x.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/vue' }
    ],

    editLink: {
      repo: 'vuejs/docs',
      text: '在 GitHub 上編輯此頁'
    },

    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(headerPlugin).use(groupIconMdPlugin)
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
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    },
    plugins: [
      llmstxt({
        ignoreFiles: [
          'about/team/**/*',
          'about/team.md',
          'about/privacy.md',
          'about/coc.md',
          'developers/**/*',
          'ecosystem/themes.md',
          'examples/**/*',
          'partners/**/*',
          'sponsor/**/*',
          'index.md'
        ],
        customLLMsTxtTemplate: `\
# Vue.js

Vue.js - The Progressive JavaScript Framework

## Table of Contents

{toc}`
      }) as Plugin,
      groupIconVitePlugin({
        customIcon: {
          cypress: 'vscode-icons:file-type-cypress',
          'testing library': 'logos:testing-library'
        }
      }) as Plugin
    ]
  }
})
