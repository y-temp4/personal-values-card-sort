<template>
  <div class="wrapper">
    <main>
      <h1 class="post-title">{{ post.title }}</h1>
      <time
        v-if="!formattedEditedAt"
        :datetime="post.publishedAt"
        itemprop="datePublished"
        class="post-published-at"
      >
        {{ formattedPublishedAt }}
      </time>
      <div
        v-else
        :style="{ display: 'flex', flexDirection: 'column', gap: '2px' }"
      >
        <div class="post-published-at">
          最終更新日:
          <time :datetime="post.editedAt" itemprop="dateModified">
            {{ formattedEditedAt }}
          </time>
        </div>
        <div class="post-published-at">
          投稿日:
          <time :datetime="post.publishedAt" itemprop="datePublished">
            {{ formattedPublishedAt }}
          </time>
        </div>
      </div>
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
import remark from 'remark'
import strip from 'strip-markdown'
import { MetaInfo } from 'vue-meta'
import { NuxtContentPost, Post } from '~/types/model'

function getDescriptionByMDText(text: string) {
  const OG_DESCRIPTION_WORD_COUNT = 120
  const entryText = remark()
    .use(strip)
    .processSync(text)
    .toString()
    .replace(/\n/g, '')
  const description =
    entryText.length < OG_DESCRIPTION_WORD_COUNT
      ? entryText
      : `${entryText.substr(0, OG_DESCRIPTION_WORD_COUNT)}...`
  return description
}

export default Vue.extend({
  async asyncData({ $content, params }) {
    const post = await $content(params.slug, { text: true }).fetch<Post>()
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
      post: {} as NuxtContentPost & { text: string },
      filteredPosts: {} as NuxtContentPost,
    }
  },
  computed: {
    formattedPublishedAt(): string {
      const date = new Date(this.post.publishedAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}.${month}.${day}`
    },
    formattedEditedAt(): string {
      if (!this.post.editedAt) return ''
      const date = new Date(this.post.editedAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}.${month}.${day}`
    },
  },
  head(): MetaInfo {
    const title = this.post.title
    const description = getDescriptionByMDText(this.post.text)
    return {
      title,
      meta: [
        { hid: 'og:title', property: 'og:title', content: title },
        { hid: 'description', name: 'description', content: description },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: `https://pvcs.y-temp4.com/posts/${this.post.slug}`,
        },
      ],
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
  font-size: 15px;
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

  .post-published-at {
    font-size: 14px;
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

  & strong {
    font-weight: 700;
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

  & h4 {
    margin-top: 54px;
    margin-bottom: -18px;
    font-size: 19px;
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

    & h4 {
      font-size: 17px;
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
