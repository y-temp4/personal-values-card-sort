import { getterTree, mutationTree, actionTree } from 'nuxt-typed-vuex'
import { Value } from '~/types/model'

export const state = () => ({
  editingValue: null as Value | null,
})

export const mutations = mutationTree(state, {
  setEditingValue(state, editingValue: Value | null) {
    state.editingValue = editingValue
  },
})
