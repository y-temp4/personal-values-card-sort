import { IContentDocument } from '@nuxt/content/types/content'

export type Post = {
  title: string
  publishedAt: string
  thumbnail?: string
}

export type NuxtContentPost = Post & IContentDocument
