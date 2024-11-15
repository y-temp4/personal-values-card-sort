import { NuxtConfig } from '@nuxt/types'

const isDev = process.env.NODE_ENV === 'development'
const ogImage = 'https://pvcs.y-temp4.com/ogp.png'
const title = '自己省察テスト'
const description = '自己省察テストを通じて自己理解を深めましょう。'

const config: NuxtConfig = {
  target: 'static',
  srcDir: 'app',
  head: {
    titleTemplate: `%s - ${title}`,
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: description },
      { hid: 'og:title', property: 'og:title', content: title },
      {
        hid: 'og:description',
        property: 'og:description',
        content: description,
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:image', property: 'og:image', content: ogImage },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { hid: 'twitter:site', name: 'twitter:site', content: '@y_temp4' },
      { hid: 'twitter:image', name: 'twitter:image', content: ogImage },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['~/assets/style.css'],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex',
  ],
  modules: ['@nuxtjs/firebase', '@nuxt/content', '@nuxtjs/sitemap'],
  typescript: {
    typecheck: true,
  },
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#40c057',
        },
      },
    },
  },
  firebase: {
    config: {
      apiKey: 'AIzaSyCuBrQhbPYEZjjIXakj6nTWiXw4hvkCkxA',
      authDomain: 'personal-values-card-sort.firebaseapp.com',
      projectId: 'personal-values-card-sort',
      storageBucket: 'personal-values-card-sort.appspot.com',
      messagingSenderId: '474614373751',
      appId: '1:474614373751:web:b95f7739a84779ea189572',
      measurementId: 'G-YJLFDY332V',
    },
    services: {
      auth: {
        emulatorPort: isDev ? 9099 : undefined,
      },
      firestore: {
        emulatorPort: isDev ? 8080 : undefined,
      },
      functions: {
        emulatorPort: isDev ? 5001 : undefined,
      },
      analytics: true,
    },
  },
  build: {
    extractCSS: true,
  },
  sitemap: {
    hostname: 'https://pvcs.y-temp4.com',
    gzip: true,
    exclude: ['/ranking', '/submission', '/values'],
    routes: async () => {
      // HACK: await import すると @nuxt/content の型が読み込まれ、その結果
      // @nuxtjs/firebase が型エラーになるため仕方なく require で読み込んでいる。
      const { $content } = require('@nuxt/content')
      const posts = await $content()
        .only(['path', 'publishedAt', 'editedAt'])
        .fetch()
      if (!Array.isArray(posts)) return
      return [
        ...posts.map((entry) => {
          return {
            url: `/posts/${entry.path}`,
            lastmod: entry.publishedAt,
          }
        }),
      ]
    },
  },
  generate: {
    // For Cloudflare Pages
    fallback: '404.html',
    subFolders: false,
  },
}

export default config
