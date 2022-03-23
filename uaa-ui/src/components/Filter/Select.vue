<template>
  <el-col class="filter-item" :class="{ 'column-direction': filterSpan && filterSpan > 8 }" :span="span">
    <div class="filter-item-label">
      <label>{{ label }}</label>
    </div>
    <div class="filter-item-control">
      <el-select v-model="data" :placeholder="placeholder">
        <el-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </el-col>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'

interface ISelectOption {
  value: string | number | boolean | undefined;
  label: string;
  selected: boolean | undefined;
}

interface SelectOption {
  value?: string | number | boolean;
  label: string;
  selected?: boolean;
}

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
    },
    options: {
      type: Array as PropType<SelectOption[]>,
      default: () => {
        return []
      }
    }
  },
  emits: ['update'],
  setup(props, context) {
    const filterSpan = computed(() => props.span)
    const selectOptions = computed<ISelectOption[]>(() => {
      return props.options.map(o => {
        return {
          value: o.value === undefined ? '' : o.value,
          label: o.label,
          selected: o.selected === undefined ? undefined : o.selected
        }
      })
    })
    const data = ref<string | number | boolean>()
    const defaultData = ref<string | number | boolean>()
    if (selectOptions.value.length > 0) {
      const defaultValueOptions = selectOptions.value.filter(o => o.value === '')
      if (defaultValueOptions.length > 1) {
        throw new Error('只允许一个option不设置value')
      }
      const selected = selectOptions.value.filter(o => o.selected)
      if (selected.length > 0) {
        defaultData.value = selected[0].value
        data.value = defaultData.value
      } else {
        defaultData.value = selectOptions.value.filter((o, i) => i === 0)[0].value
        data.value = defaultData.value
      }
    }
    watch(() => data.value, d => {
      if (props.prop) {
        context.emit('update', props.prop, d)
      }
    })
    const clearData = () => {
      data.value = defaultData.value
    }
    return {
      filterSpan,
      selectOptions,
      data,
      clearData
    }
  }
})
</script>
<style scoped lang="scss">
@import './filter.module.scss';

.filter-item {
  .el-select {
    width: 100%;
  }
}
</style>
