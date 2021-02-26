import { NuxtConfig } from '@nuxt/types'
import colors from 'vuetify/es5/util/colors'

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
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex',
  ],
  modules: ['@nuxtjs/firebase'],
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      // dark: true,
      themes: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
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
        emulatorPort: process.env.NODE_ENV === 'development' ? 9099 : undefined,
      },
      firestore: {
        emulatorPort: process.env.NODE_ENV === 'development' ? 8080 : undefined,
      },
      functions: {
        emulatorPort: process.env.NODE_ENV === 'development' ? 5001 : undefined,
      },
      analytics: true,
    },
  },
  build: {},
}

export default config
