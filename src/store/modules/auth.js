const authModule = {
  namespace: true, // 配合module使用【true-调用action方法时，路径：文件名/actions下面得方法名】
  state: {
    loginInfo: {}, // 登录信息
    token: ''
  },
  getters: {
    userInfo: (state) => state.loginInfo.userInfo || {}
  },
  mutations: {
    SAVE_LOGININFO: (state, data) => {
      state.loginInfo = data
    },
    REMOVE_LOGININFO: (state) => {
      state.loginInfo = {}
    }
  },
  actions: {
    saveLoginInfo: ({ commit }, data) => {
      commit('SAVE_LOGININFO', data)
    },
    removeLoginInfo: ({ commit }) => {
      commit('REMOVE_LOGININFO')
    }
  }
}

export default authModule