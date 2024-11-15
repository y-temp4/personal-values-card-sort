<template>
  <main>
    <h1 class="post-list-title">記事一覧</h1>
    <ul>
      <li v-for="post in posts" :key="post.slug" :style="{ fontSize: '20px' }">
        <nuxt-link :to="`/posts/${post.slug}`">{{ post.title }}</nuxt-link>
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { NuxtContentPost, Post } from '~/types/model'

export default Vue.extend({
  async asyncData({ $content }) {
    const posts = await $content().sortBy('publishedAt', 'desc').fetch<Post>()

    return {
      posts,
    }
  },
  data() {
    return { posts: [] as NuxtContentPost[] }
  },
  head(): MetaInfo {
    return {
      title: '記事一覧',
    }
  },
})
</script>

<style lang="scss" scoped>
main {
  max-width: 620px;
  padding: 0 4px;
  margin: 0 auto;
}

.post-list-title {
  min-height: 1em;
  margin-top: 22px;
  margin-bottom: 18px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
  color: #08131a;
  letter-spacing: 0.04em;
  pointer-events: auto;
  font-feature-settings: 'palt' 1;
}

li {
  margin: 9px 0;
}
</style>
