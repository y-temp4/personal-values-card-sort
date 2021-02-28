<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else>
      <p class="h3 mt-3">
        診断日: <time>{{ formattedFinishedAt }}</time>
      </p>
      <v-row>
        <v-col
          v-for="(value, index) in answeredValues"
          :key="value.id"
          :cols="6"
        >
          <ValueCard
            :value="value"
            selected
            :label="`${index + 1}位: ${value.label}`"
          />
        </v-col>
      </v-row>
      <v-btn
        v-if="currentUser && currentUser.isAnonymous"
        class="mt-4"
        @click="linkWithGoogle"
        >Googleで認証してデータを保存する</v-btn
      >
      <v-btn
        v-if="isAnsweredUser"
        @click="changePublicStatus"
        :color="!isPublic ? 'primary' : null"
        class="mt-4"
        >{{ !isPublic ? '公開する' : '非公開にする' }}
      </v-btn>
      <br />
      <br />
      <p v-if="!isPublic">
        公開された診断結果は、URLを知っている人であれば誰でも閲覧できます。
      </p>
      <br />
      <n-link to="/values" v-if="isAnsweredUser">診断結果一覧に戻る</n-link>
      <v-snackbar v-model="isShowSnapbar" :timeout="2000">
        {{
          isPublic ? '診断結果を公開しました！' : '診断結果を非公開にしました。'
        }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="isShowSnapbar = false"
          >
            閉じる
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase/app'
import { MetaInfo } from 'vue-meta'
import { User, ValueDocData, Value } from '~/types/model'
import { values } from '~/constants'

type Values = typeof values

export default Vue.extend({
  data() {
    return {
      isLoading: true,
      value: null as Value | null,
      isShowSnapbar: false
    }
  },
  computed: {
    currentUser(): User | null {
      return this.$accessor.user.currentUser
    },
    values: () => values,
    answeredValues(): Values {
      return values.filter(v => this.value?.step3.includes(v.id))
    },
    isPublic(): boolean {
      return this.value?.isPublic ?? false
    },
    isAnsweredUser(): boolean {
      return this.currentUser?.uid === this.value?.userRef.split('/')[1]
    },
    formattedFinishedAt(): string {
      const seconds = this.value?.finishedAt?.seconds
      if (!seconds) return ''
      const formattedFinishedAt = new Intl.DateTimeFormat('ja').format(
        seconds * 1000
      )
      return formattedFinishedAt
    }
  },
  async fetch() {
    if (this.$accessor.value.editingValue) {
      this.value = {
        ...this.$accessor.value.editingValue,
        // FIXME: finishedAtが取得できないので
        // @ts-expect-error
        finishedAt: { seconds: Math.floor(Date.now() / 1000) }
      }
      this.isLoading = false
      return
    }
    const valueId = this.$route.params.valueId
    const [valueDocSnap] = (
      await this.$fire.firestore
        .collectionGroup('values')
        .where('id', '==', valueId)
        .where('isPublic', '==', true)
        .limit(1)
        .get()
    ).docs
    if (valueDocSnap) {
      const valueDocData = valueDocSnap.data() as ValueDocData
      this.value = {
        ...valueDocData,
        id: valueId,
        userRef: valueDocData.userRef.path
      }
      this.isLoading = false
    }
  },
  async mounted() {
    await this.$accessor.user.getCurrentUser()
    if (this.$accessor.value.editingValue || this.value) {
      return
    }
    const valueId = this.$route.params.valueId
    if (!this.currentUser) {
      this.$nuxt.error({ statusCode: 404 })
      return
    }
    const valueDocSnap = await this.$fire.firestore
      .collection('users')
      .doc(this.currentUser.uid)
      .collection('values')
      .doc(valueId)
      .get()
    if (!valueDocSnap.exists) {
      this.$nuxt.error({ statusCode: 404 })
      return
    }
    const valueDocData = valueDocSnap.data() as ValueDocData
    this.value = {
      ...valueDocData,
      id: valueId,
      userRef: valueDocData.userRef.path
    }
    this.isLoading = false
  },
  methods: {
    async linkWithGoogle() {
      const getGoogleUser = async () => {
        if (process.env.NODE_ENV === 'development') {
          const id = Math.random()
            .toString(32)
            .substring(2)
            .slice(0, 6)
          const credential = firebase.auth.GoogleAuthProvider.credential(
            `{"sub": "${id}", "email": "${id}@example.com", "email_verified": true}`
          )
          const user = await this.$fire.auth.currentUser!.linkWithCredential(
            credential
          )
          return user
        } else {
          const provider = new firebase.auth.GoogleAuthProvider()
          const user = await this.$fire.auth.currentUser!.linkWithPopup(
            provider
          )
          return user
        }
      }
      const { user } = await getGoogleUser()
      if (!user) return
      this.$accessor.user.setCurrentUser({
        ...this.currentUser!,
        isAnonymous: user.isAnonymous
      })
      alert('Googleアカウントで認証しました。')
    },
    async changePublicStatus() {
      this.isShowSnapbar = false
      await this.$fire.firestore
        .collection('users')
        .doc(this.currentUser!.uid)
        .collection('values')
        .doc(this.value!.id)
        .update({
          isPublic: !this.isPublic,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      this.value = { ...this.value!, isPublic: !this.isPublic }
      this.isShowSnapbar = true
    }
  },
  head(): MetaInfo {
    return {
      title: `診断結果（${this.formattedFinishedAt}）`
    }
  }
})
</script>
