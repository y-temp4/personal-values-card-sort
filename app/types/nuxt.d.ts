// NOTE: tsconfig.json から @nuxt/content を読み込むと型エラーになるため、自前で型を定義している。
import { contentFunc } from '@nuxt/content/types/content'
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $content: contentFunc
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $content: contentFunc
  }
  interface Context {
    $content: contentFunc
  }
}
