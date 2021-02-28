<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <template v-else>
      <div class="h2 mb-3">診断結果一覧</div>
      <v-data-table
        :headers="headers"
        :items="userValues"
        :items-per-page="10"
        class="elevation-1"
        disable-sort
      >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.detail="{ item }">
          <v-btn :to="`/values/${item.id}`" nuxt> 詳細を見る </v-btn>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase/app'
import { MetaInfo } from 'vue-meta'
import { User, ValueDocData, Value } from '~/types/model'

const headers = [
  { text: '診断日', value: 'finishedAt' },
  { text: '公開設定', value: 'isPublic' },
  { text: '詳細', value: 'detail' },
]

type UserValue = Omit<Value, 'finishedAt' | 'isPublic'> & {
  finishedAt: string
  isPublic: '公開済み' | '非公開'
}

export default Vue.extend({
  data() {
    return {
      userValues: [] as UserValue[],
      isLoading: true,
    }
  },
  async mounted() {
    await this.$accessor.user.getCurrentUser()
    if (!this.currentUser) {
      this.$nuxt.error({ statusCode: 404 })
      return
    }
    this.userValues = (
      await this.$fire.firestore
        .collection('users')
        .doc(this.currentUser.uid)
        .collection('values')
        .orderBy('createdAt', 'desc')
        .get()
    ).docs.map((doc) => {
      const valueDocData = doc.data() as ValueDocData
      const value = {
        ...valueDocData,
        id: doc.id,
        userRef: valueDocData.userRef.path,
        finishedAt: this.formatFinishedAt(valueDocData.finishedAt),
        isPublic: valueDocData.isPublic ? '公開済み' : '非公開',
      } as UserValue
      return value
    })
    this.isLoading = false
  },
  computed: {
    currentUser(): User | null {
      return this.$accessor.user.currentUser
    },
    headers: () => headers,
  },
  methods: {
    formatFinishedAt(finishedAt: firebase.firestore.Timestamp | null) {
      if (finishedAt === null) return '未完了'
      return new Intl.DateTimeFormat('ja').format(finishedAt.toDate())
    },
  },
  head(): MetaInfo {
    return {
      title: '診断結果一覧',
    }
  },
})
</script>
