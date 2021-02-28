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
      <div>
        &copy; {{ new Date().getFullYear() }} - Created by
        <a
          href="https://twitter.com/y_temp4"
          target="_blank"
          rel="noopener noreferrer"
          >@y_temp4</a
        >
      </div>
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
