<template>
  <main>
    <h1 class="post-list-title">記事一覧</h1>
    <div class="post-list">
      <nuxt-link
        v-for="post in posts"
        :key="post.slug"
        :to="`/posts/${post.slug}`"
        class="post"
      >
        <div class="post-left">
          <div class="post-title">
            {{ post.title }}
          </div>
          <div class="post-published-at">
            {{ formatPublishedAt(post.publishedAt) }}
          </div>
        </div>
      </nuxt-link>
    </div>
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
  methods: {
    formatPublishedAt(publishedAt: string): string {
      const date = new Date(publishedAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}.${month}.${day}`
    },
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

.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post {
  padding: 16px;
  border: 1px solid #e1e4e8;
  border-radius: 4px;
  text-decoration: none;
  color: #08131a;
  transition: background-color 0.2s;
  display: flex;
  gap: 8px;

  &:hover {
    background-color: #f6f8fa;
  }
}

.post-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
}

.post-published-at {
  color: rgba(8, 19, 26, 0.6588235294117647);
  font-size: 14px;
}

/* .post-thumbnail {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 2px;
} */
</style>
