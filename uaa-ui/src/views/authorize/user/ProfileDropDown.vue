<template>
  <el-popover placement="bottom" :width="200" :show-arrow="false" trigger="click">
    <div class="profile-popover-container">
      <div class="big-avatar-container">
        <el-avatar :size="90" :src="avatarPNG"></el-avatar>
        <span class="username">Dickson</span>
      </div>
      <div class="btn-group">
        <el-button @click="onProfileClick">详情</el-button>
        <el-button type="danger" @click="onLogOut">退出</el-button>
      </div>
    </div>
    <template #reference>
      <a class="profile-avatar-container" :style="{ height: `${size}px` }">
        <el-avatar :size="size" :src="avatarPNG"></el-avatar>
      </a>
    </template>
  </el-popover>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import avatarPNG from '@/assets/images/avatar.png'
import { useRouter } from 'vue-router'
import useGlobalStore from '@/stores/global'

export default defineComponent({
  props: {
    size: {
      type: Number,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    const onProfileClick = () => {
      router.push('/authorize/user/profile')
    }
    const onLogOut = () => {
      const globalStore = useGlobalStore()
      globalStore.logout().then(() => {
        location.href = '/login'
      })
    }
    return {
      avatarPNG,
      onProfileClick,
      onLogOut
    }
  }
})
</script>
<style scoped lang="scss">
@import "@/assets/css/theme.module.scss";
.profile-popover-container {
  margin: -15px;
  .big-avatar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
    background: $menuBackgroundColor;
    color: $menuTextColor;
    .username {
      margin-top: 5px;
    }
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
  }
}
.profile-avatar-container {
  cursor: pointer;
  margin-left: 30px;
}
</style>
