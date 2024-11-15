<template>
  <div class="wrapper">
    <main>
      <h1 class="post-title">{{ post.title }}</h1>
      <time
        :datetime="post.publishedAt"
        itemprop="datePublished"
        class="post-published-at"
      >
        {{ formattedPublishedAt }}
      </time>
      <nuxt-content :document="post" />
    </main>
    <div
      :style="{
        borderTop: '1px solid #bbb',
        marginTop: '40px',
        paddingTop: '30px',
      }"
    >
      <div :style="{ fontWeight: 700, marginBottom: '20px' }">最新記事</div>
      <ul class="recent-posts-wrapper">
        <li v-for="post in filteredPosts" :key="post.slug" class="recent-post">
          <nuxt-link :to="`/posts/${post.slug}`">{{ post.title }}</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { NuxtContentPost, Post } from '~/types/model'

export default Vue.extend({
  async asyncData({ $content, params }) {
    const post = await $content(params.slug).fetch<Post>()
    const posts = await $content().sortBy('publishedAt', 'desc').fetch<Post>()
    const filteredPosts = posts.filter(
      (p: NuxtContentPost) => p.slug !== params.slug
    )

    return {
      post,
      filteredPosts,
    }
  },
  data() {
    return {
      post: {} as NuxtContentPost,
      filteredPosts: {} as NuxtContentPost,
    }
  },
  computed: {
    formattedPublishedAt(): string {
      return new Date(this.post.publishedAt).toLocaleDateString()
    },
  },
  head(): MetaInfo {
    return {
      title: this.post.title,
    }
  },
})
</script>

<style lang="scss" scoped>
.wrapper {
  max-width: 620px;
  margin: 0 auto;
  padding: 0 4px;
}

.post-title {
  min-height: 1em;
  margin-top: 72px;
  margin-bottom: 18px;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.5;
  color: #08131a;
  letter-spacing: 0.04em;
  pointer-events: auto;
  font-feature-settings: 'palt' 1;
}

.post-published-at {
  color: rgba(8, 19, 26, 0.6588235294117647);
}

.recent-posts-wrapper {
  padding-left: 0;
  list-style-type: none;
}

.recent-post {
  margin: 9px 0;
}

/* SP */
@media (max-width: 480px) {
  .post-title {
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 20px;
  }
}
</style>

<style lang="scss">
.nuxt-content {
  color: #08131a;

  & p {
    font-size: 18px;
    line-height: 2;
    margin: 36px 0;
  }

  & h2 {
    margin-top: 54px;
    margin-bottom: -18px;
    font-size: 28px;
    font-weight: 700;
    font-feature-settings: 'palt' 1;
    letter-spacing: 0.04em;
  }

  & h3 {
    margin-top: 54px;
    margin-bottom: -18px;
    font-size: 20px;
    font-weight: 700;
    font-feature-settings: 'palt' 1;
    letter-spacing: 0.04em;
  }

  > ul {
    padding-left: 24px;
    margin: 36px 0;
    list-style-type: none;

    > li {
      list-style-type: disc;
    }

    & li {
      margin: 9px 0;
      overflow: initial;
      font-size: 18px;
      line-height: 2;
    }
  }

  > ol {
    padding-left: 24px;
    margin: 36px 0;
    list-style-type: none;

    > li {
      list-style-type: decimal;
    }

    & li {
      margin: 9px 0;
      overflow: initial;
      font-size: 18px;
      line-height: 2;
    }
  }

  table {
    margin: 36px 0;
    border-collapse: collapse;
    width: 100%;
    overflow: hidden;

    th {
      background-color: #f5f5f5;
      font-weight: 700;
    }

    th,
    td {
      border: 1px solid #dfe2e5;
      padding: 12px;
    }
  }
}

/* SP */
@media (max-width: 480px) {
  .nuxt-content {
    & p {
      font-size: 16px;
      margin: 30px 0;
    }

    & h2 {
      margin-top: 45px;
      font-size: 20px;
    }

    & h3 {
      font-size: 18px;
    }

    & ul {
      padding-left: 20px;

      & li {
        font-size: 16px;
      }
    }
  }
}
</style>
