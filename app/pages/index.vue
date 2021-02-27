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
    <template v-if="!isLoggedIn">
      <v-btn
        color="primary"
        class="font-weight-bold"
        x-large
        @click="handleStart"
        >診断をはじめる</v-btn
      >
      <v-btn @click="loginWithGoogle"
        >Googleでログイン（すでに診断済みの方向け）</v-btn
      >
    </template>
    <template v-else>
      <template v-if="isAnonymousUser">
        <template v-if="!hasFinishedValue">
          <v-btn
            color="primary"
            class="font-weight-bold"
            x-large
            @click="handleContinue"
            >診断を続ける</v-btn
          >
        </template>
        <template v-else>
          <n-link :to="`/values/${latestValue && latestValue.id}`">
            回答を見る
          </n-link>
          <v-btn @click="loginWithGoogle"
            >Googleでログインして診断データを保存する</v-btn
          >
        </template>
      </template>
      <template v-else>
        <template v-if="latestValue !== null && !hasFinishedValue">
          <v-btn
            color="primary"
            class="font-weight-bold"
            x-large
            @click="handleContinue"
            >診断を続ける</v-btn
          >
        </template>
        <template v-else>
          <v-btn
            color="primary"
            class="font-weight-bold"
            x-large
            @click="handleStart"
            >診断をはじめる</v-btn
          >
        </template>
      </template>
    </template>
    <br />
    <br />
    <v-btn
      v-if="isLoggedIn && !isAnonymousUser"
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
import { User, Value, ValueDocData } from '~/types/model'
import { values } from '~/constants'

export default Vue.extend({
  data() {
    return {
      latestValue: null as Value | null,
    }
  },
  computed: {
    currentUser(): User | null {
      return this.$accessor.user.currentUser
    },
    isLoggedIn(): boolean {
      return !!this.currentUser
    },
    isAnonymousUser(): boolean {
      return this.isLoggedIn && this.currentUser!.isAnonymous
    },
    hasFinishedValue(): boolean {
      if (!this.latestValue) return false
      return this.latestValue.finishedAt !== null
    },
  },
  async mounted() {
    await this.$accessor.user.getCurrentUser()
    if (!this.currentUser) return
    const [valueDocSnap] = (
      await this.$fire.firestore
        .collection('users')
        .doc(this.currentUser!.uid)
        .collection('values')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()
    ).docs
    if (!valueDocSnap) return
    const valueDoc = valueDocSnap.data() as ValueDocData
    this.latestValue = {
      ...valueDoc,
      id: valueDocSnap.id,
      userRef: valueDoc.userRef.path,
    }
  },
  methods: {
    async handleStart() {
      if (!this.isLoggedIn) {
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
        }
      }
      function autoId(): string {
        const chars =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let autoId = ''
        for (var i = 0; i < 20; i++) {
          autoId += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return autoId
      }
      const userDocRef = this.$fire.firestore.doc(
        `users/${this.currentUser!.uid}`
      )
      const userRef = this.$fire.firestore
        .collection('users')
        .doc(this.currentUser!.uid)
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
      this.$router.push('/submission')
    },
    handleContinue() {
      this.$router.push('/submission')
    },
    async handleLogout() {
      await this.$fire.auth.signOut()
      location.href = '/'
    },
    async loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()
      const user = await this.$fire.auth.signInWithPopup(provider)
      if (!user.user) return
      const userDocRef = this.$fire.firestore.doc(`users/${user.user.uid}`)
      const existsUser = (await userDocRef.get()).exists
      if (!existsUser) {
        await userDocRef.set({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
      }
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
    },
  },
})
</script>
