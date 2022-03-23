<template>
  <div class="nav-side-brand-container" :class="{ 'nav-side-brand--collapse': isCollapse }">
    <div class="brand-logo">
      <img src="@/assets/images/logo.svg" />
    </div>
    <div class="brand-text">DSN-UI</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style scoped lang="scss">
@import "@/assets/css/theme.module.scss";
.nav-side-brand-container {
  display: flex;
  position: relative;
  padding: 0 15px;
  align-items: center;
  &.nav-side-brand--collapse {
    .brand-text {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }
  .brand-logo {
    img {
      height: 28px;
    }
  }
  .brand-text {
    position: absolute;
    width: calc($navSideWidth - 75px);
    left: 60px;
    font-weight: 600;
    font-size: 18px;
    line-height: 32px;
  }
}
</style>
