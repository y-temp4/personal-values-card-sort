<template>
  <v-app>
    <v-app-bar app dense absolute elevation="3" class="">
      <n-link
        to="/"
        style="text-decoration: none"
        class="font-weight-bold block mx-auto"
      >
        自己省察テスト
      </n-link>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

export default Vue.extend({
  head(): MetaInfo {
    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${process.env.BASE_URL}${this.$route.fullPath}`,
        },
      ],
    }
  },
})
</script>
