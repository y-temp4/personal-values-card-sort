<template>
  <main class="wrapper-main">
    <v-alert type="success" border="left" class="font-weight-bold mt-2">
      <p>自己省察テストをしてみましょう！</p>
      <p class="mb-0">
        この機会に、あなたが大切に思う価値観を整理してみましょう。この診断に時間制限はありませんので、ゆっくり進めていただいて大丈夫です。
      </p>
    </v-alert>
    <div class="text-right">
      by
      <a
        href="https://motivationalinterviewing.org/personal-values-card-sort-instructions"
        target="_blank"
        rel="noopener noreferrer"
      >
        Personal Values Card Sort
      </a>
      （<a
        href="https://tazimi.up.seesaa.net/image/E887AAE5B7B1E79C81E5AF9F.pdf"
        target="_blank"
        rel="noopener noreferrer"
        >日本語</a
      >）
    </div>
    <h2 class="mt-5">診断の流れ</h2>
    <v-list>
      <v-list-item v-for="step in steps" :key="step.title">
        <v-list-item-icon>
          <v-icon color="primary">{{ step.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ step.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ step.description }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <p class="mt-5 mx-2 text-body-2">
      ※自分が重要にしている価値観を定めるのが難しい場合は、<n-link
        to="/self-aware-questions"
        target="_blank"
        >こちらの質問リスト</n-link
      >
      を参考にしてみてください。
    </p>
    <v-progress-circular v-if="isLoading" indeterminate color="primary" />
    <template v-else>
      <template v-if="!isLoggedIn">
        <v-btn
          color="primary"
          class="font-weight-bold ma-2"
          x-large
          @click="handleStart"
          >診断をはじめる</v-btn
        >
        <v-btn class="font-weight-bold ma-2" @click="loginWithGoogle" x-large
          >Googleでログイン</v-btn
        >
      </template>
      <template v-else>
        <template v-if="isAnonymousUser">
          <template v-if="!hasFinishedValue">
            <v-btn
              color="primary"
              class="font-weight-bold ma-2"
              x-large
              @click="handleContinue"
              >診断を続ける</v-btn
            >
          </template>
          <template v-else>
            <n-link :to="`/values/${latestValue && latestValue.id}`">
              回答を見る
            </n-link>
            <v-btn
              class="font-weight-bold ma-2"
              @click="loginWithGoogle"
              x-large
              >Googleでログインして診断データを保存する</v-btn
            >
          </template>
        </template>
        <template v-else>
          <v-btn to="/values" nuxt class="font-weight-bold ma-2" x-large
            >過去の診断を確認する</v-btn
          >
          <template v-if="latestValue !== null && !hasFinishedValue">
            <v-btn
              color="primary"
              class="font-weight-bold ma-2"
              x-large
              @click="handleContinue"
              >診断を続ける</v-btn
            >
          </template>
          <template v-else>
            <v-btn
              color="primary"
              class="font-weight-bold ma-2"
              x-large
              @click="handleStart"
              >新しい診断をはじめる</v-btn
            >
          </template>
        </template>
      </template>
    </template>

    <br />
    <br />
    <v-btn
      v-if="isLoggedIn && !isAnonymousUser"
      color="info"
      class="font-weight-bold ma-2"
      x-large
      @click="handleLogout"
      >ログアウト</v-btn
    >
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'
import firebase from 'firebase/app'
import { User, Value, ValueDocData } from '~/types/model'

export default Vue.extend({
  data() {
    return {
      latestValue: null as Value | null,
      isLoading: true
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
    steps(): { title: string; icon: string; description: string }[] {
      return [
        {
          title: 'ステップ1',
          icon: 'mdi-check-bold',
          description:
            '自分が重要にしている価値観を選択して下さい。数は複数選択可能です。'
        },
        {
          title: 'ステップ2',
          icon: 'mdi-delete',
          description: '選んだ価値観を 10 個に絞って下さい。'
        },
        {
          title: 'ステップ3',
          icon: 'mdi-crown',
          description: '10 個の価値観の順位付けをして下さい。'
        }
      ]
    }
  },
  async mounted() {
    await this.$accessor.user.getCurrentUser()
    if (!this.currentUser) {
      this.isLoading = false
      return
    }
    await this.setLatestValueByUserUid(this.currentUser.uid)
    this.isLoading = false
  },
  methods: {
    async setLatestValueByUserUid(uid: string) {
      const [valueDocSnap] = (
        await this.$fire.firestore
          .collection('users')
          .doc(uid)
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
        userRef: valueDoc.userRef.path
      }
    },
    async handleStart() {
      if (!this.isLoggedIn) {
        const user = await this.$fire.auth.signInAnonymously()
        if (!user.user) return
        const userDocRef = this.$fire.firestore.doc(`users/${user.user.uid}`)
        const existsUser = (await userDocRef.get()).exists
        if (!existsUser) {
          await userDocRef.set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          const userRef = this.$fire.firestore
            .collection('users')
            .doc(user.user.uid)
          const userDataBase = (await userRef.get()).data
          const userData = {
            ...userDataBase,
            uid: user.user.uid,
            isAnonymous: user.user.isAnonymous
          } as User
          this.$accessor.user.setCurrentUser({
            ...userData
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
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      const valudId = (await valueDocRef.get()).id
      const value = (await valueDocRef.get()).data() as ValueDocData
      this.$accessor.value.setEditingValue({
        ...value,
        id: valudId,
        userRef: value.userRef.path
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
      const { user } = await this.$fire.auth.signInWithPopup(provider)
      if (!user) return
      const uid = user.uid
      const userDocRef = this.$fire.firestore.doc(`users/${uid}`)
      const existsUser = (await userDocRef.get()).exists
      if (!existsUser) {
        await userDocRef.set({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      }
      const userRef = this.$fire.firestore.collection('users').doc(uid)
      const userDataBase = (await userRef.get()).data
      const userData = {
        ...userDataBase,
        uid,
        isAnonymous: user.isAnonymous
      } as User
      this.$accessor.user.setCurrentUser({ ...userData })
      await this.setLatestValueByUserUid(uid)
    }
  },
  head(): MetaInfo {
    return {
      titleTemplate: ''
    }
  }
})
</script>

<style scoped>
.wrapper-main {
  max-width: 900px;
  margin: 0 auto;
}
</style>
