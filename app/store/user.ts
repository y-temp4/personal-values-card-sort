import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex'
import { UserDocData, User } from '~/types/model'
import type firebase from 'firebase/app'

export const state = () => ({
  currentUser: null as User | null,
})

export const getters = getterTree(state, {
  currentUser(state): User | null {
    return state.currentUser
  },
})

export const mutations = mutationTree(state, {
  setCurrentUser(state, currentUser: User | null) {
    state.currentUser = currentUser
  },
})

export const actions = actionTree(
  { state, mutations },
  {
    async getCurrentUser({ commit }) {
      const getCurrentUser = () => {
        return new Promise<firebase.User | null>((resolve) => {
          this.$fire.auth.onAuthStateChanged((user) => {
            resolve(user)
          })
        })
      }
      const user = await getCurrentUser()
      console.log({ user })
      if (!user) return
      const userRef = await this.$fire.firestore
        .collection('users')
        .doc(user.uid)
        .get()
      const userData = userRef.data() as UserDocData
      commit('setCurrentUser', {
        ...userData,
        uid: user.uid,
        isAnonymous: user.isAnonymous,
      })
    },
  }
)
