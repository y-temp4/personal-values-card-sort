<template>
  <main>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          ステップ1
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2">
          ステップ2
        </v-stepper-step>
        <v-divider />
        <v-stepper-step step="3"> ステップ3 </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <p>
            自分が重要にしている価値観を選択して下さい。数は複数選択可能です。
          </p>

          <v-card
            v-for="value in values"
            :key="value.id"
            class="mb-12"
            :color="`${
              selectedValueIds.includes(value.id) ? 'blue' : 'grey'
            } lighten-2`"
            hover
            @click="handleClickCard(value.id)"
          >
            <v-card-title>
              {{ value.label }}
            </v-card-title>
            <v-card-text>
              {{ value.description }}
            </v-card-text>
          </v-card>

          <v-btn color="primary" @click="step = 2">次に進む</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <v-btn color="primary" @click="step = 3">次に進む</v-btn>
          <v-btn @click="step = 1">ステップ1に戻る</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

          <v-btn color="primary" @click="step = 1">完了する</v-btn>
          <v-btn @click="step = 2">ステップ2に戻る</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { values } from '~/constants'
import { User, Value } from '~/types/model'
import firebase from 'firebase/app'

export default Vue.extend({
  data() {
    return {
      step: 1,
      selectedValueIds: [] as number[],
    }
  },
  computed: {
    values: () => values,
    currentUser(): User | null {
      return this.$accessor.user.currentUser
    },
    editingValue(): Value | null {
      return this.$accessor.value.editingValue
    },
  },
  async mounted() {
    await this.$accessor.user.getCurrentUser()
    if (!this.currentUser) {
      this.$router.push('/')
      return
    }
    if (!this.editingValue) {
      const [valueDocSnap] = (
        await this.$fire.firestore
          .collection('users')
          .doc(this.currentUser.uid)
          .collection('values')
          .where('finishedAt', '==', null)
          .limit(1)
          .get()
      ).docs
      if (!valueDocSnap) throw new Error('valueDocSnap not found.')
      const valueId = valueDocSnap.id
      const value = valueDocSnap.data() as Value
      this.$accessor.value.setEditingValue({ ...value, id: valueId })
      this.selectedValueIds = value.step1
    }
  },
  methods: {
    async handleClickCard(id: number) {
      try {
        if (!this.selectedValueIds.includes(id)) {
          this.selectedValueIds.push(id)
        } else {
          this.selectedValueIds = this.selectedValueIds.filter((i) => i !== id)
        }
        await this.$fire.firestore
          .collection('users')
          .doc(this.currentUser!.uid)
          .collection('values')
          .doc(this.editingValue!.id)
          .update({
            step1: this.selectedValueIds,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
      } catch (error) {
        console.error(error)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
</style>
