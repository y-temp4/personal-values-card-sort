<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else>
      <v-card
        v-for="(value, index) in answeredValues"
        :key="value.id"
        class="mb-2"
        :color="`blue lighten-2`"
      >
        <v-card-title> {{ `${index + 1}位: ${value.label}` }} </v-card-title>
        <v-card-text> {{ value.description }} </v-card-text>
      </v-card>
      <v-btn
        v-if="currentUser && currentUser.isAnonymous"
        @click="linkWithGoogle"
        >Googleで認証してデータを保存する</v-btn
      >
      <v-btn v-if="isAnsweredUser" @click="changePublicStatus"
        >{{ !isPublic ? '公開する' : '非公開にする' }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import firebase from 'firebase/app'
import { User, ValueDocData, Value } from '~/types/model'
import { values } from '~/constants'

type Values = typeof values

export default Vue.extend({
  data() {
    return {
      isLoading: true,
      value: null as Value | null,
    }
  },
  computed: {
    currentUser(): User | null {
      return this.$accessor.user.currentUser
    },
    values: () => values,
    answeredValues(): Values {
      return values.filter((v) => this.value?.step3.includes(v.id))
    },
    isPublic(): boolean {
      return this.value?.isPublic ?? false
    },
    isAnsweredUser(): boolean {
      return this.currentUser?.uid === this.value?.userRef.split('/')[1]
    },
  },
  async fetch() {
    if (this.$accessor.value.editingValue) {
      this.value = this.$accessor.value.editingValue
      this.isLoading = false
      console.log(
        'this.$accessor.value.editingValue',
        this.$accessor.value.editingValue
      )
      console.log('this.value', this.value)
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
        userRef: valueDocData.userRef.path,
      }
      this.isLoading = false
    }
  },
  async mounted() {
    if (this.$accessor.value.editingValue || this.value) {
      return
    }
    await this.$accessor.user.getCurrentUser()
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
      userRef: valueDocData.userRef.path,
    }
    this.isLoading = false
    console.log({ valueDocData })
  },
  methods: {
    async linkWithGoogle() {
      const getGoogleUser = async () => {
        if (process.env.NODE_ENV === 'development') {
          const id = Math.random().toString(32).substring(2).slice(0, 6)
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
      const user = await getGoogleUser()
      if (!user.user) return
      this.$accessor.user.setCurrentUser({
        ...this.currentUser!,
        isAnonymous: user.user.isAnonymous,
      })
      alert('Googleアカウントで認証しました。')
    },
    async changePublicStatus() {
      await this.$fire.firestore
        .collection('users')
        .doc(this.currentUser!.uid)
        .collection('values')
        .doc(this.value!.id)
        .update({
          isPublic: !this.isPublic,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
      this.value = { ...this.value!, isPublic: !this.isPublic }
    },
  },
})
</script>

<style lang="scss" scoped>
</style>
