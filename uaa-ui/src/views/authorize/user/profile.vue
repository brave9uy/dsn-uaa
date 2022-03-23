<template>
  <Main class="user-profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <a class="profile-avatar">
          <el-avatar :src="avatarPNG" :size="90"></el-avatar>
          <div class="avatar-mask">
            <span>点击上传</span>
          </div>
        </a>
        <span class="username">Dickson</span>
      </div>
      <div class="profile-form">
        <RespFormItem label="用户名" class="compositional">
          <el-input disabled placeholder="Username"></el-input>
        </RespFormItem>

        <RespFormItem label="昵称" class="compositional">
          <el-input v-if="isNicknameEdit" class="nickname" placeholder="Nickname"></el-input>
          <el-input
            v-else
            class="nickname-readonly default-disabled"
            placeholder="Nickname Readonly"
            disabled
          ></el-input>
          <el-button-group v-if="isNicknameEdit" class="ml-4">
            <el-button type="success">
              <FontAwesomeIcon :icon="faCheck" />
            </el-button>
            <el-button type="danger" @click="cancelNicknameUpdate">
              <FontAwesomeIcon :icon="faTimes" />
            </el-button>
          </el-button-group>
          <el-button v-else type="primary" @click="onNicknameUpdate">
            <FontAwesomeIcon :icon="faEdit" />
          </el-button>
        </RespFormItem>

        <RespFormItem label="密码" class="compositional">
          <el-input class="default-disabled" disabled placeholder="Password"></el-input>
          <el-button type="primary">
            <FontAwesomeIcon :icon="faEdit" />
          </el-button>
        </RespFormItem>

        <RespFormItem label="邮箱" class="compositional">
          <el-input class="default-disabled" disabled placeholder="Email"></el-input>
          <el-button type="primary" @click="emailVisible = true">
            <FontAwesomeIcon :icon="faEdit" />
          </el-button>
        </RespFormItem>

        <RespFormItem label="手机" class="compositional">
          <el-input class="default-disabled" disabled placeholder="Mobile"></el-input>
          <el-button type="primary" @click="mobileVisible = true">
            <FontAwesomeIcon :icon="faEdit" />
          </el-button>
        </RespFormItem>
      </div>
    </div>
    <AccountBinderDialog
      v-model="email"
      v-model:visible="emailVisible"
      title="修改邮箱"
      label="新邮箱"
      @on-modal-close="email = ''"
    />
    <AccountBinderDialog
      v-model="mobile"
      v-model:visible="mobileVisible"
      title="修改手机"
      label="新手机"
      @on-modal-close="mobile = ''"
    />
  </Main>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import avatarPNG from '@/assets/images/avatar.png'
import { faCheck, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AccountBinderDialog from './AccountBinderDialog.vue'
import { RespFormItem } from '@/components/Form'

export default defineComponent({
  components: {
    FontAwesomeIcon,
    AccountBinderDialog,
    RespFormItem
  },
  setup() {
    const isNicknameEdit = ref(false)
    const onNicknameUpdate = () => {
      isNicknameEdit.value = true
    }
    const cancelNicknameUpdate = () => {
      isNicknameEdit.value = false
    }
    const emailVisible = ref(false)
    const email = ref('')
    const mobileVisible = ref(false)
    const mobile = ref('')
    return {
      avatarPNG,
      faCheck,
      faEdit,
      faTimes,
      isNicknameEdit,
      onNicknameUpdate,
      cancelNicknameUpdate,
      emailVisible,
      email,
      mobileVisible,
      mobile
    }
  }
})
</script>
<style scoped lang="scss">
.profile-container {
  background: #ffffff;
  max-width: 650px;
  margin: 0 auto;
  padding: 30px 15px;
  min-height: 550px;
  .profile-header {
    display: flex;
    flex-direction: column;
    text-align: center;
    color: #333333;
    font-size: 21px;
    .profile-avatar {
      display: inline-block;
      position: relative;
      margin: 0 auto 7px;
      cursor: pointer;
      font-size: 0;
      .avatar-mask {
        position: absolute;
        display: none;
        align-items: center;
        justify-content: center;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: 50%;
        opacity: 0.4;
        background: #333333;
        color: #ffffff;
        span {
          font-size: 1rem;
        }
      }
      &:hover {
        .avatar-mask {
          display: flex;
        }
      }
    }
  }
  .profile-form {
    margin-top: 20px;
  }
}
</style>
