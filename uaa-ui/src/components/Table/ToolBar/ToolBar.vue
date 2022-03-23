<template>
  <div class="tool-bar-container">
    <FontAwesomeIcon v-if="filter" :icon="faFilter" @click="filterVisible = true" />
    <FontAwesomeIcon :icon="faSync" @click="onRefresh" />
    <ColumnDisplay @change="onColumnDisplayChange">
      <template #refer>
        <div class="column-display-button">
          <FontAwesomeIcon :icon="faCog" />
        </div>
      </template>
    </ColumnDisplay>
    <el-drawer
      v-model="filterVisible"
      direction="rtl"
      :size="filterWidth"
    >
      <slot name="top-bar-filter"/>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCog, faFilter, faSync } from '@fortawesome/free-solid-svg-icons'

import ColumnDisplay from './ColumnDisplay.vue'
import { useDocumentWidthObtainment } from '@/hooks/useDocumentWidth'

export default defineComponent({
  props: {
    filter: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FontAwesomeIcon,
    ColumnDisplay
  },
  emits: ['refresh', 'column-display-change', 'column-drag'],
  setup(props, context) {
    const filterVisible = ref(false)
    const windowWidth = useDocumentWidthObtainment()
    const filterWidth = computed(() => windowWidth.value * 0.8 < 450 ? windowWidth.value * 0.8 : 450)
    const onRefresh = () => {
      context.emit('refresh')
    }
    const onColumnDisplayChange = () => {
      context.emit('column-display-change')
    }
    const closeFilter = () => {
      filterVisible.value = false
    }
    return {
      faCog,
      faSync,
      faFilter,
      onRefresh,
      onColumnDisplayChange,
      filterVisible,
      filterWidth,
      closeFilter
    }
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/css/theme.module.scss';
.tool-bar-container {
  float: right;
  line-height: 40px;
  font-size: 18px;
  color: #606266;
  svg {
    cursor: pointer;
    &:hover {
      color: $activeTextColor;
    }
  }
  > * + * {
    margin-left: 10px;
  }
}
</style>
