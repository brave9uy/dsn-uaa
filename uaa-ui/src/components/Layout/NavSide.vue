<template>
  <div class="nav-side-container" :class="{ collapse: isCollapse, narrow: isWidthNarrow }">
    <nav-side-brand :is-collapse="isCollapse" />
    <inf-menu
      :data="menus"
      :collapse="isCollapse"
      :router="true"
      :default-active="defaultActiveIndex"
      :menu-props="{ index: 'url' }"
      :active-text-color="styles.activeMenuTextColor"
      :background-color="styles.menuBackgroundColor"
      :text-color="styles.menuTextColor"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import InfMenu from '@/components/Menu/InfiniteMenu'
import NavSideBrand from '@/components/Layout/NavSideBrand.vue'
import styles from '@/assets/css/theme.module.scss'
import useDocumentWidth from '@/hooks/useDocumentWidth'

export default defineComponent({
  components: {
    InfMenu,
    NavSideBrand
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const menus = [
      {
        name: '首页',
        icon: 'solid.home',
        url: '/'
      },
      {
        name: '权限管理',
        icon: 'solid.user-lock',
        url: '/authorize',
        children: [
          {
            name: '用户',
            icon: 'solid.user',
            url: '/authorize/user'
          },
          {
            name: '权限',
            icon: 'solid.bars',
            url: '/authorize/permission'
          }
        ]
      },
      {
        name: '访问日志',
        icon: 'solid.book',
        url: '/log/access'
      }
    ]
    const router = useRouter()
    const defaultActiveIndex = computed<string>(() => router.currentRoute.value.fullPath)
    const isWidthNarrow = useDocumentWidth(width => width < 768)
    return {
      menus,
      defaultActiveIndex,
      styles,
      isWidthNarrow
    }
  }
})
</script>
<style scoped lang="scss">
@import "@/assets/css/theme.module.scss";
.nav-side-container {
  width: $navSideWidth;
  height: 100%;
  background: $menuBackgroundColor;
  transition: width 350ms;
  &.collapse {
    width: $navSideCollapseWidth;
    &.narrow {
      width: 0;
    }
  }
  .nav-side-brand-container {
    height: $navHeaderHeight;
    background: $menuBackgroundColor;
    border: none;
    color: $menuTextColor;
  }
  .el-menu {
    &.el-menu-infinite {
      height: calc(100% - $navHeaderHeight);
      border: none;
      &:not(.el-menu--collapse) {
        width: $navSideWidth;
      }
      &.el-menu--collapse {
        width: $navSideCollapseWidth;
        &.narrow {
          width: 0;
          :deep(.el-menu-item),
          :deep(.el-sub-menu__title) {
            padding: 0 !important;
          }
          :deep(i) {
            display: none;
          }
        }
      }
    }
  }
}
</style>
