import { getAccessorType } from 'typed-vuex'
import * as user from '~/store/user'
import * as value from '~/store/value'

export const accessorType = getAccessorType({
  modules: {
    user,
    value,
  },
})
