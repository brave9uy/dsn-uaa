<template>
  <el-col class="filter-item" :class="{ 'column-direction': filterSpan && filterSpan > 8 }" :span="span">
    <div v-if="label" class="filter-item-label">
      <label>{{ label }}</label>
    </div>
    <div class="filter-item-control">
      <el-input v-model="data" :placeholder="placeholder" :onkeydown="onEnterKeyDown" />
    </div>
  </el-col>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    // 请求配置
    span: {
      type: Number
    },
    label: {
      type: String
    },
    prop: {
      type: String
    },
    placeholder: {
      type: String
    }
  },
  emits: ['update', 'trigger-search'],
  setup(props, context) {
    const filterSpan = computed(() => props.span)
    const data = ref('')
    watch(() => data.value, d => {
      if (props.prop) {
        context.emit('update', props.prop, d)
      }
    })
    const clearData = () => {
      data.value = ''
    }
    const onEnterKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        context.emit('trigger-search')
      }
    }
    return {
      filterSpan,
      data,
      clearData,
      onEnterKeyDown
    }
  }
})
</script>
<style scoped lang="scss">
@import './filter.module.scss';
</style>
