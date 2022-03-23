<template>
  <div class="main-container">
    <Breadcrumb v-if="showBreadcrumb" class="breadcrumb" />
    <div class="main-content" :class="{ 'overflow-y-hidden': overflowYHidden }">
      <div class="page-content">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'

export default defineComponent({
  name: 'Main',
  components: {
    Breadcrumb
  },
  props: {
    showBreadcrumb: {
      type: Boolean,
      default: true
    },
    overflowYHidden: {
      type: Boolean,
      default: false
    }
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/css/theme.module.scss';
.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .breadcrumb {
    border-bottom: 1px solid #EEEEEE;
  }
  .main-content {
    background: $containerBackground;
    flex: 1;
    overflow-y: scroll;
    &.overflow-y-hidden {
      overflow-y: hidden;
      .page-content {
        height: calc(100% - 40px);
      }
    }
    .page-content {
      margin: 20px;
      position: relative;
      min-height: calc(100% - 40px);
      & {
        @media screen and (max-width: 767px) {
          margin: 20px 10px;
        }
      }
    }
  }
}
</style>
