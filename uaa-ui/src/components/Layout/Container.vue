<template>
  <el-container>
    <el-aside ref="ElAside" width="auto">
      <NavSide :is-collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header>
        <NavHeader :is-collapse="isCollapse" @toggle-collapse="toggleCollapse" />
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import NavSide from '@/components/Layout/NavSide.vue'
import NavHeader from '@/components/Layout/NavHeader.vue'
import styles from '@/assets/css/theme.module.scss'

export default defineComponent({
  components: {
    NavSide,
    NavHeader
  },
  setup() {
    const isCollapse = ref(false)
    if (document.documentElement.clientWidth < 768) {
      isCollapse.value = true
    }
    const toggleCollapse = (toggle: boolean): void => {
      isCollapse.value = toggle
    }
    const ElAside = ref()
    let timer = -1
    const collapseWidth = 64
    watch(() => isCollapse.value, () => {
      timer = setInterval(() => {
        // 不停循环，获取aside宽度，只有完全收起(64px)和展开(navSideWidth)后，才出发window.resize
        if (ElAside.value.$el.clientWidth === collapseWidth ||
            ElAside.value.$el.clientWidth === Number(styles.navSideWidth.substring(0, styles.navSideWidth.length - 2))) {
          clearInterval(timer)
          const resizeEvent = new Event('resize')
          window.dispatchEvent(resizeEvent)
        }
      }, 50)
    })
    return {
      isCollapse,
      toggleCollapse,
      ElAside
    }
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/css/theme.module.scss';
.el-container {
  height: 100%;
  .el-aside {
    overflow-x: hidden;
  }
  .el-container {
    .el-header {
      padding: 0;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      height: $navHeaderHeight
    }
    .el-main {
      padding: 0;
    }
  }
}

</style>
