import { NuxtConfig } from '@nuxt/types'

const isDev = process.env.NODE_ENV === 'development'

const config: NuxtConfig = {
  srcDir: 'app',
  head: {
    titleTemplate: '%s - 自己省察テスト',
    title: '自己省察テスト',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex',
    'nuxt-build-optimisations',
  ],
  modules: ['@nuxtjs/firebase'],
  typescript: {
    typecheck: true,
  },
  vuetify: {
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
  buildOptimisations: {
    profile: isDev ? 'risky' : 'false',
  },
}

export default config
