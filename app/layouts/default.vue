<template>
  <v-app>
    <v-app-bar app dense absolute elevation="3" class="">
      <n-link
        to="/"
        style="text-decoration: none"
        class="font-weight-bold block mx-auto"
      >
        <h1 class="text-h6 font-weight-bold">自己省察テスト</h1>
      </n-link>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer>
      <v-container class="py-3" :style="{ display: 'flex', gap: '12px', flexWrap: 'wrap' }">
        <n-link to="/">トップ</n-link>
        <n-link to="/posts">記事一覧</n-link>
        <span>
          &copy; {{ new Date().getFullYear() }} - Created by
          <a
            href="https://twitter.com/y_temp4"
            target="_blank"
            rel="noopener noreferrer"
            >@y_temp4</a
          >
        </span>
      </v-container>
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
      link: [
        {
          rel: 'canonical',
          href: `https://pvcs.y-temp4.com${this.$route.fullPath}`,
        },
      ],
    }
  },
})
</script>
