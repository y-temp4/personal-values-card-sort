<template>
  <div>
    <h2>価値観ランキング</h2>
    <p>
      診断時に最も選ばれた価値観の一覧です。公開された診断結果を元に作成しています。
    </p>
    <v-row>
      <v-col v-for="(value, index) in valueRanking" :key="value.id" :cols="6">
        <ValueCard
          :value="value"
          selected
          :label="`${index + 1}位: ${value.label}（${value.selectedCount}回）`"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import { ValueDocData, ValueId } from '~/types/model'
import { values } from '~/constants'

type Values = typeof values
type ValueRanking = Values[number] & { selectedCount: number }

export default Vue.extend({
  async fetch() {
    const selectedValueIds = (
      await this.$fire.firestore
        .collectionGroup('values')
        .where('isPublic', '==', true)
        .get()
    ).docs.flatMap((doc) => {
      const valueDocData = doc.data() as ValueDocData
      return valueDocData.step3
    })
    this.selectedValueIds = selectedValueIds
  },
  data() {
    return {
      selectedValueIds: [] as ValueId[],
    }
  },
  computed: {
    valueRanking(): ValueRanking[] {
      const valueRanking = values
        .map((value) => {
          const selectedCount = [...this.selectedValueIds].filter(
            (vid) => vid === value.id
          ).length
          return {
            ...value,
            selectedCount,
          }
        })
        .sort((a, b) => b.selectedCount - a.selectedCount)
      return valueRanking
    },
  },
  head(): MetaInfo {
    return {
      title: '価値観ランキング',
    }
  },
})
</script>
