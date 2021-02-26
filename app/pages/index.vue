<template>
  <main>
    <h1>自己省察テスト</h1>
    <div>Personal Values Card Sort</div>
    <p>
      あなたが大切に思う価値観を整理してみましょう。この診断は時間制限などありませんので、ゆっくり進めていただいて大丈夫です。
    </p>
    <h2>診断の流れ</h2>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>ステップ 1</v-list-item-title>
        <v-list-item-subtitle
          >自分が重要にしている価値観を選択して下さい。数は複数選択可能です。</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>ステップ 2</v-list-item-title>
        <v-list-item-subtitle
          >選んだ価値観を 10 個に絞って下さい。</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>ステップ 3</v-list-item-title>
        <v-list-item-subtitle
          >10 個の価値観の順位付けをして下さい。</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
    <v-btn
      v-if="!isLoggedIn"
      color="primary"
      class="font-weight-bold"
      x-large
      @click="handleStart"
      >診断をはじめる</v-btn
    >
    <v-btn
      v-else
      color="primary"
      class="font-weight-bold"
      x-large
      @click="handleContinue"
      >診断を続ける</v-btn
    >
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase/app'
import { User, Value } from '~/types/model'

export default Vue.extend({
  computed: {
    currentUser(): User | null {
      return this.$accessor.user.currentUser
    },
    isLoggedIn(): boolean {
      return !!this.currentUser
    },
  },
  async mounted() {
    await this.$accessor.user.getCurrentUser()
  },
  methods: {
    async handleStart() {
      if (!this.currentUser) {
        const user = await this.$fire.auth.signInAnonymously()
        if (!user.user) return

        const userDocRef = this.$fire.firestore.doc(`users/${user.user.uid}`)
        const existsUser = (await userDocRef.get()).exists
        if (!existsUser) {
          await userDocRef.set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          const userDataBase = (
            await this.$fire.firestore
              .collection(`users`)
              .doc(user.user.uid)
              .get()
          ).data
          const userData = { ...userDataBase, uid: user.user.uid } as User
          this.$accessor.user.setCurrentUser({
            ...userData,
          })
          const valueDocRef = await userDocRef.collection('values').add({
            step1: [],
            step2: [],
            step3: [],
            isPublic: false,
            finishedAt: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          // window.valueDocRef = valueDocRef
          const valudId = (await valueDocRef.get()).id
          const value = (await valueDocRef.get()).data() as Value
          console.log({ value })
          this.$accessor.value.setEditingValue({ ...value, id: valudId })
        }
      }
      this.$router.push('/submission')
    },
    handleContinue() {
      this.$router.push('/submission')
    },
  },
})
</script>
