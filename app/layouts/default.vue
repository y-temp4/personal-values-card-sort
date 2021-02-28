<template>
  <v-app>
    <v-app-bar app dense absolute elevation="3">
      <v-toolbar>
        <v-spacer />
        <v-toolbar-title>
          <n-link to="/" style="text-decoration: none" class="font-weight-bold">
            自己省察テスト
          </n-link>
        </v-toolbar-title>
        <v-spacer />
      </v-toolbar>
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

export default Vue.extend({})
</script>
