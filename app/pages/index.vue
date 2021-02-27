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
    <br />
    <br />
    <v-btn
      v-if="isLoggedIn"
      color="info"
      class="font-weight-bold"
      x-large
      @click="handleLogout"
      >ログアウト</v-btn
    >
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase/app'
import { User, ValueDocData } from '~/types/model'

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
          const userRef = this.$fire.firestore
            .collection('users')
            .doc(user.user.uid)
          const userDataBase = (await userRef.get()).data
          const userData = {
            ...userDataBase,
            uid: user.user.uid,
            isAnonymous: user.user.isAnonymous,
          } as User
          this.$accessor.user.setCurrentUser({
            ...userData,
          })
          function autoId(): string {
            const chars =
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            let autoId = ''
            for (var i = 0; i < 20; i++) {
              autoId += chars.charAt(Math.floor(Math.random() * chars.length))
            }
            return autoId
          }
          const valueId = autoId()
          const valueDocRef = userDocRef.collection('values').doc(valueId)
          await valueDocRef.set({
            id: valueId,
            step1: [],
            step2: [],
            step3: [],
            userRef,
            isPublic: false,
            finishedAt: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          const valudId = (await valueDocRef.get()).id
          const value = (await valueDocRef.get()).data() as ValueDocData
          console.log({ value })
          this.$accessor.value.setEditingValue({
            ...value,
            id: valudId,
            userRef: value.userRef.path,
          })
        }
      }
      this.$router.push('/submission')
    },
    handleContinue() {
      this.$router.push('/submission')
    },
    async handleLogout() {
      await this.$fire.auth.signOut()
      location.href = '/'
    },
  },
})
</script>
