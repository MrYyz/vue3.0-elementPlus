<template>
  <div class="login-form">
    <!-- 已登录 -->
    <template v-if="isLogin">
      <div class="login-panel-head">
        <div class="logo">
          <el-icon>
            <Avatar />
          </el-icon>
        </div>
        <div class="name">{{ form.username || '游客' }}</div>
      </div>
      <div class="login-panel-links">
        <span @click="logout">注销登录</span>
      </div>
      <div class="login-panel-tool">
        <el-button type="primary" @click="go2workspace">进入工作台</el-button>
      </div>
    </template>
    <!-- 未登录 -->
    <template v-else>
      <h2 class="title">供应商登录</h2>
      <div class="tip" v-show="showTip">
        <el-icon>
          <InfoFilled />
        </el-icon>
        用户名或密码不正确，请重试或联系管理员
      </div>
      <div class="space" v-show="!showTip"></div>
      <el-form :model="form" :rules="rules" ref="loginFormRef" :disabled="loading" @keyup.enter="loginFn">
        <el-form-item prop="username">
          <el-icon>
            <Avatar />
          </el-icon>
          <el-input v-model.trim="form.username" size="medium" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-icon>
            <Lock />
          </el-icon>
          <el-input v-model.trim="form.password" show-password size="medium" clearable />
        </el-form-item>
      </el-form>
      <div class="tools">
        <el-checkbox class="remenber" v-model="remenberAccount" :disabled="loading">记住账号</el-checkbox>
        <el-link class="forget" :underline="false" @click="go2Forget">忘记密码</el-link>
      </div>
      <el-button-group class="btn">
        <el-button type="primary" :loading="loading" :disabled="loading" @click="loginFn">登录</el-button>
        <el-button :disabled="loading" @click="register">注册</el-button>
      </el-button-group>
    </template>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Avatar, Lock, InfoFilled } from '@element-plus/icons'
import { ElMessage } from 'element-plus'

import { useStore } from '@/store/index'
import { useRouter, useRoute } from 'vue-router'

import { doLogin, doLogout, getSuppierDetailInfo /*, getCaptcha*/ } from '@/apis/auth'
import Base64 from 'base-64'
import Cookies from 'js-cookie'

export default defineComponent({
  name: 'login-form',
  components: { Avatar, Lock, InfoFilled },
  setup() {
    const loginFormRef = ref()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: ' ', trigger: ['blur'] }],
        password: [{ required: true, message: ' ', trigger: ['blur'] }]
      },
      remenberAccount: false,
      showTip: false,
      loading: false,
      isLogin: false
    })

    watch(
      () => state.remenberAccount,
      (n) => {
        if (!n) {
          localStorage.removeItem('username')
          localStorage.removeItem('password')
          localStorage.setItem('remenberAccount', 0)
        }
      }
    )

    onMounted(() => {
      const rember = Number(localStorage.getItem('remenberAccount') || 0)
      const name = localStorage.getItem('username')
      const pwd = localStorage.getItem('password')
      if (rember) {
        state.remenberAccount = true
        state.form.username = name || ''
        state.form.password = pwd ? Base64.decode(pwd) : ''
      }
      // 只有账号密码存在的前提下，才需要检验登录信息（避免：如用户删除了localStorage信息）
      if (name && pwd) {
        // 判断用户登录状态。是否仍在有效期内
        store.dispatch('authModule/checkLoginStatus').then((res) => {
          state.isLogin = res
        })

        window.addEventListener('visibilitychange', () => {
          state.isLogin = Cookies.get('auth')
        })
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('visibilitychange', () => {})
    })

    const methods = class {
      constructor() {
        this.loginFn = () => {
          loginFormRef.value
            .validate()
            .then(() => {
              state.showTip = false
              state.loading = true
              const params = {
                username: state.form.username.trim(),
                password: Base64.encode(state.form.password.trim())
              }
              doLogin(params)
                .then(({ code, data, message }) => {
                  if (code === 'E000') {
                    ElMessage({ type: 'success', message: '登录成功' })
                    store.dispatch('authModule/login', data)

                    getSuppierDetailInfo(data.supplierId).then(({ data }) => {
                      store.dispatch('authModule/setSupplierInfo', data)
                    })
                    state.isLogin = true
                    if (state.remenberAccount) {
                      localStorage.setItem('username', params.username)
                      localStorage.setItem('password', params.password)
                      localStorage.setItem('remenberAccount', '1')
                    }
                    const redirect = route.query.redirect
                    if (redirect) {
                      router.push({ path: redirect })
                    }
                  } else {
                    ElMessage({ type: 'error', center: true, message: message || '登录失败' })
                  }
                })
                .finally(() => {
                  state.loading = false
                })
            })
            .catch(() => {
              state.showTip = true
            })
        }
        this.go2Forget = () => {
          router.push('/forgetPassword')
        }
        this.go2workspace = function () {
          window.open(location.origin + '#/platform')
        }
        this.logout = function () {
          state.loading = true
          doLogout()
            .then(({ code, message }) => {
              if (code !== 'E000') {
                ElMessage({ type: 'warning', message })
              } else {
                store.dispatch('authModule/logout').then(() => {
                  ElMessage({ type: 'success', message: '当前账号已注销' })
                  state.isLogin = false
                })
              }
            })
            .finally(() => {
              state.loading = false
            })
        }
        this.register = function () {
          router.push('/register')
        }
      }
    }
    return {
      ...toRefs(state),
      loginFormRef,
      ...new methods()
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.login-form {
  padding: 42px 30px;
  background: #fff;
  border-radius: 4px;
  width: 340px;
  height: 360px;
  // 已登录
  .login-panel-head {
    .logo {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: $themeColor;
      margin: 0 auto 20px;
      .el-icon {
        font-size: 80px;
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
      }
    }
    .name {
      text-align: center;
      font-size: 24px;
      color: #000;
      margin-bottom: 38px;
    }
  }
  .login-panel-links {
    margin: 0 auto;
    line-height: 40px;
    height: 40px;
    font-size: 13px;
    color: #000;
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    span {
      &:hover {
        cursor: pointer;
      }
    }
  }
  .login-panel-tool {
    padding-bottom: 30px;
    text-align: center;
    .el-button {
      width: 100%;
      height: 40px;
      font-size: 14px;
    }
  }

  // 未登录
  h2.title {
    font-size: 24px;
    padding-bottom: 20px;
  }
  .tip {
    color: #f25555;
    font-size: 12px;
    background: #fdeded;
    border: 1px solid #f57171;
    border-radius: 2px;
    height: 30px;
    margin-bottom: 10px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    .el-icon {
      font-size: 14px;
      margin-right: 4px;
    }
  }
  .space {
    padding: 10px;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 10px;
      ::v-deep(.el-form-item__content) {
        position: relative;
        .el-icon {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 30px;
          height: 36px;
          line-height: 40px;
          color: #c0c7cd;
          &::after {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            right: 3px;
            height: 1em;
            transform: translateY(-50%);
            width: 1px;
            background: #ccc;
          }
        }
        .el-input {
          .el-input__inner {
            border-radius: 0;
            padding-left: 30px;
            background: transparent;
          }
        }
      }
    }
  }
  .tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .btn {
    width: 100%;
    .el-button {
      min-height: 40px;
      width: 50%;
      font-size: 14px;
    }
  }
}
</style>