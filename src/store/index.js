import { createStore, useStore as baseUseStore } from 'vuex'
import modules from './modules/index'

export const store = createStore({
  state: {
    count: 0
  },
  getters: {
    double: (state) => state.count * 2
  },
  mutations: {
    ADD_COUNT: (state, data = 10) => {
      state.count += data
    }
  },
  actions: {
    addCount ({ commit }, data) {
      commit('ADD_COUNT', data)
    }
  },
  modules
})

export const key = Symbol('y-store')

export function useStore () {
  return baseUseStore(key)
}