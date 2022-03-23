<template>
  <el-table
    :key="tableKey"
    :data="rows"
    :default-sort="sort"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <template #empty>
      <el-empty description="No Data"></el-empty>
    </template>
    <el-table-column
      v-if="selectable"
      type="selection"
      :width="selectionWidth"
      align="center"
    />
    <el-table-column
      v-for="column in displayColumns"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
      :width="column.width"
      :align="column.align"
      :show-overflow-tooltip="column.showOverflowTooltip"
      :sortable="column.sortable ? 'custom' : false"
    >
      <template #default="scope">
        <template v-if="column.prop && scope.row[column?.prop] && !column.formatter">
          {{ scope.row[column.prop] }}
        </template>
        <template v-else-if="column.formatter">
          <DynamicComponent
            :formatter="column.formatter"
            :row="scope.row"
          />
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, PropType, ref, watch } from 'vue'
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

import { Column, Sort } from '@/components/Table'
import { DynamicComponent } from '@/components'

export default defineComponent({
  props: {
    rows: {
      type: Array as PropType<any[]>,
      require: true
    },
    selectable: {
      type: Boolean,
      default: true
    },
    selectionWidth: {
      type: Number,
      default: 55
    }
  },
  components: {
    DynamicComponent
  },
  emits: [
    'table-selection-change',
    'sort-change'
  ],
  setup(props, context) {
    const tableKey = ref<number>(new Date().getTime())
    // 要展示的列
    const displayColumns = inject<ComputedRef<Column[]>>('displayColumns', computed(() => []))
    // 展示的列变化就要重新渲染表格
    watch(() => [...displayColumns.value], () => {
      // 更新table的key强制重新渲染表格
      tableKey.value = new Date().getTime()
    })
    // 排序属性
    const sort = inject<ComputedRef<Sort>>('sort')
    const handleSelectionChange = (selectedRows: []): void => {
      context.emit('table-selection-change', selectedRows)
    }
    const handleSortChange = (sort: {column: TableColumnCtx<any>; prop: string | null; order: string | null;}): void => {
      context.emit('sort-change', sort.prop, sort.order)
    }
    return {
      tableKey,
      displayColumns,
      sort,
      handleSelectionChange,
      handleSortChange
    }
  }
})
</script>
<style scoped lang="scss">
:deep(.el-table) {
  .el-scrollbar__view {
    overflow-x: hidden;
  }
}
</style>
