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
            自分が重要にしている価値観を
            <b>10個以上</b> 選択して下さい。数は複数選択可能です。
          </p>
          <v-row>
            <v-col v-for="value in values" :key="value.id" :cols="cardSize">
              <v-card
                :color="`${
                  step1SelectedValueIds.includes(value.id) ? 'blue' : 'grey'
                } lighten-2`"
                hover
                @click="handleClickStep1Card(value.id)"
              >
                <v-card-title> {{ value.label }} </v-card-title>
                <v-card-text> {{ value.description }} </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-btn
            color="primary"
            @click="handleMoveToStep2"
            :disabled="step1SelectedValueIds.length < 10"
            >次に進む</v-btn
          >
        </v-stepper-content>
        <v-stepper-content step="2">
          <p>選んだ価値観を 10 個に絞って下さい。</p>
          <v-card
            v-for="value in filteredValuesByStep1"
            :key="value.id"
            class="mb-12"
            :color="`${
              step2SelectedValueIds.includes(value.id) ? 'blue' : 'grey'
            } lighten-2`"
            hover
            @click="handleClickStep2Card(value.id)"
          >
            <v-card-title> {{ value.label }} </v-card-title>
            <v-card-text> {{ value.description }} </v-card-text>
          </v-card>
          <v-btn
            color="primary"
            @click="handleMoveToStep3"
            :disabled="step2SelectedValueIds.length !== 10"
            >次に進む</v-btn
          >
          <v-btn @click="step = 1">ステップ1に戻る</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <p>10 個の価値観の順位付けをして下さい。</p>

          <client-only>
            <draggable
              :value="step3SelectedValueIds"
              @input="handleClickStep3Card"
              :animation="200"
              ghost-class="moving-card"
            >
              <v-card
                v-for="value in filteredValuesByStep2"
                :key="value.id"
                class="mb-12"
                :color="`${
                  step2SelectedValueIds.includes(value.id) ? 'blue' : 'grey'
                } lighten-2`"
                hover
              >
                <v-card-title> {{ value.label }} </v-card-title>
                <v-card-text> {{ value.description }} </v-card-text>
              </v-card>
            </draggable>
          </client-only>
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
import draggable from 'vuedraggable'
import { values } from '~/constants'
import { User, Value } from '~/types/model'
import firebase from 'firebase/app'

type Values = typeof values

export default Vue.extend({
  components: {
    draggable,
  },
  data() {
    return {
      cardSize: 6,
      step: 1,
      step1SelectedValueIds: [] as number[],
      step2SelectedValueIds: [] as number[],
      step3SelectedValueIds: [] as number[],
    }
  },
  computed: {
    values: () => values,
    filteredValuesByStep1(): Values {
      return this.values.filter((v) =>
        this.step1SelectedValueIds.includes(v.id)
      )
    },
    filteredValuesByStep2(): Values {
      return this.values.filter((v) =>
        this.step2SelectedValueIds.includes(v.id)
      )
    },
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
      this.step1SelectedValueIds = value.step1
      this.step2SelectedValueIds = value.step2
      this.step3SelectedValueIds = value.step3
      if (this.step2SelectedValueIds.length) this.step = 2
      if (this.step3SelectedValueIds.length) this.step = 3
    }
  },
  methods: {
    async handleClickStep1Card(id: number) {
      try {
        if (!this.step1SelectedValueIds.includes(id)) {
          this.step1SelectedValueIds.push(id)
        } else {
          this.step1SelectedValueIds = this.step1SelectedValueIds.filter(
            (i) => i !== id
          )
        }
        await this.$fire.firestore
          .collection('users')
          .doc(this.currentUser!.uid)
          .collection('values')
          .doc(this.editingValue!.id)
          .update({
            step1: this.step1SelectedValueIds,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
      } catch (error) {
        console.error(error)
      }
    },
    handleMoveToStep2() {
      this.step = 2
      // TODO: このUXでいいか確認
      this.step2SelectedValueIds = this.step1SelectedValueIds
    },
    async handleClickStep2Card(id: number) {
      try {
        if (!this.step2SelectedValueIds.includes(id)) {
          this.step2SelectedValueIds.push(id)
        } else {
          this.step2SelectedValueIds = this.step2SelectedValueIds.filter(
            (i) => i !== id
          )
        }
        await this.$fire.firestore
          .collection('users')
          .doc(this.currentUser!.uid)
          .collection('values')
          .doc(this.editingValue!.id)
          .update({
            step2: this.step2SelectedValueIds,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
      } catch (error) {
        console.error(error)
      }
    },
    handleMoveToStep3() {
      this.step = 3
      this.step3SelectedValueIds = this.step2SelectedValueIds
    },
    async handleClickStep3Card() {
      try {
        await this.$fire.firestore
          .collection('users')
          .doc(this.currentUser!.uid)
          .collection('values')
          .doc(this.editingValue!.id)
          .update({
            step3: this.step3SelectedValueIds,
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
.moving-card {
  visibility: hidden;
}
</style>
