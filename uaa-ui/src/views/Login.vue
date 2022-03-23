<template>
  <div class="login-page">
    <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
      <div class="login-logo">
        <img src="@/assets/images/logo-for-login.svg" />
      </div>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" size="large" placeholder="用户名">
          <template #prefix>
            <FontAwesomeIcon :icon="faUser" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-if="passwordPlain"
          v-model="loginForm.password"
          class="password"
          size="large"
          placeholder="密码"
        >
          <template #prefix>
            <FontAwesomeIcon :icon="faUnlock" />
          </template>
          <template #suffix>
            <div class="btn-plain-text" @click="onPasswordExpose(false)">
              <FontAwesomeIcon :icon="faEye" />
            </div>
          </template>
        </el-input>
        <el-input
          v-else
          v-model="loginForm.password"
          type="password"
          class="password"
          size="large"
          placeholder="密码"
        >
          <template #prefix>
            <FontAwesomeIcon :icon="faUnlock" />
          </template>
          <template #suffix>
            <div class="btn-plain-text" @click="onPasswordExpose(true)">
              <FontAwesomeIcon :icon="faEyeSlash" />
            </div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-login" type="success" @click="onLogin(loginFormRef)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'

import { ElForm } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUnlock, faUser } from '@fortawesome/free-solid-svg-icons'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

import useGlobalStore from '@/stores/global'
import { LoginProp } from '@/types/authorize'

type FormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  components: {
    FontAwesomeIcon
  },
  setup() {
    const passwordPlain = ref(false)
    const loginFormRef = ref<FormInstance>()
    const loginForm = reactive<LoginProp>({
      username: 'admin',
      password: '123456'
    })
    const globalStore = useGlobalStore()
    const validateUsername = (rule: any, value: any, callback: any) => {
      if (!value || value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule: any, value: any, callback: any) => {
      if (!value || value === '') {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const rules = reactive({
      username: [
        { validator: validateUsername, trigger: 'blur' }
      ],
      password: [
        { validator: validatePassword, trigger: 'blur' }
      ]
    })
    const onPasswordExpose = (plain: boolean) => {
      passwordPlain.value = plain
    }
    const onLogin = (form: FormInstance | undefined) => {
      if (!form) {
        return
      }
      form.validate((valid) => {
        if (valid) {
          globalStore.claimToken(loginForm).then(() => {
            location.href = '/'
          })
        }
      })
    }
    return {
      faEye,
      faEyeSlash,
      faUnlock,
      faUser,
      passwordPlain,
      loginFormRef,
      loginForm,
      rules,
      onPasswordExpose,
      onLogin
    }
  }
})
</script>
<style scoped lang="scss">
.login-page {
  background: #545c64;
  overflow: hidden;
  height: 100%;
  .login-form {
    max-width: 375px;
    width: 90%;
    margin: 160px auto;
    .login-logo {
      margin-bottom: 60px;
      img {
        display: block;
        margin: 0 auto;
        width: 33%;
      }
    }
    .el-input {
      :deep(.el-input__inner) {
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        color: #ffffff;
        padding: 12px 5px 12px 40px;
        font-size: 14px;
      }
      &.password {
        :deep(.el-input__inner) {
          padding: 12px 40px 12px 40px;
        }
        :deep(.el-input__suffix) {
          right: 0;
          .btn-plain-text {
            width: 40px;
            cursor: pointer;
          }
        }
      }
      .el-input__prefix-inner {
        line-height: 40px;
        svg {
          margin-top: 13px;
        }
      }
      & + .el-input {
        margin-top: 20px;
      }
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
