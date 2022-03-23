<template>
  <el-table
    ref="ScrollTableRef"
    :key="tableKey"
    :data="rows"
    :default-sort="sort"
    :cell-style="{ height: `${rowHeight}px` }"
    :height="tableHeight"
    @selection-change="handleSelectionChange"
    @select-all="handleSelecttAll"
    @sort-change="handleSortChange"
  >
    <template #empty>
      <el-empty description="No Data"></el-empty>
    </template>
    <template #append>
      <div v-if="showBottom" style="text-align: center; padding: 15px">No more data</div>
    </template>
    <el-table-column v-if="selectable" type="selection" :width="selectionWidth" align="center" />
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
        <template
          v-if="column.prop && scope.row[column?.prop] && !column.formatter"
        >{{ scope.row[column.prop] }}</template>
        <template v-else-if="column.formatter">
          <DynamicComponent :formatter="column.formatter" :row="scope.row" />
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, nextTick, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

import { Column, Sort } from '@/components/Table'
import { DynamicComponent } from '@/components'
import { ElTable } from 'element-plus'

export default defineComponent({
  props: {
    rows: {
      type: Array as PropType<any[]>,
      require: true,
      default: () => {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    },
    rowHeight: {
      type: Number,
      default: 60
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
    'table-all-selected',
    'sort-change',
    'scroll-to-bottom'
  ],
  setup(props, context) {
    const ScrollTableRef = ref<InstanceType<typeof ElTable>>()
    const tableHeight = ref('100%')
    const rowHeight = ref<number | undefined>(undefined)
    const scrollWrap = ref<HTMLElement | null>(null)
    const scrollWrapHeight = ref(0)
    const showBottom = computed(() => props.rows.length > 0 && props.rows.length === props.total)
    onMounted(() => {
      watch(() => props.rows.length, (length) => {
        if (ScrollTableRef.value) {
          if (scrollWrap.value === null) {
            // 1. 寻找表体元素
            scrollWrap.value = (ScrollTableRef.value.$refs.bodyWrapper as HTMLElement).querySelector('.el-scrollbar__wrap')
            if (scrollWrap.value) {
              // 2. 监听标题滚动事件
              scrollWrap.value.addEventListener('scroll', handleScroll)
            }
          }
          if (scrollWrap.value) {
            // 3. 如果表体没有高度，赋值
            if (scrollWrapHeight.value === 0) {
              scrollWrapHeight.value = scrollWrap.value.clientHeight
            }
            // 4. 计算表体高度
            if (props.rowHeight * length < scrollWrapHeight.value) {
              if (length === 0) {
                tableHeight.value = '375px'
              } else {
                if (length === props.total) {
                  tableHeight.value = `${props.rowHeight * length + 89}px`
                } else {
                  tableHeight.value = `${props.rowHeight * length + 40}px`
                }
              }
            } else {
              tableHeight.value = '100%'
            }
          }
        }
      })
    })
    onUnmounted(() => {
      if (scrollWrap.value) {
        scrollWrap.value.removeEventListener('scroll', handleScroll)
      }
    })
    const handleScroll = (e: Event) => {
      // 1. 监听的div
      const target = e.target as HTMLElement
      // 2. 获取此次滚去的高度(距离)
      const scrollTop = target.scrollTop
      // 3. 滚去的高度 === 表体真正的高度(行数 * 行高) - 监听div的高度
      if (!rowHeight.value) {
        rowHeight.value = target.querySelector('tbody')?.querySelector('tr')?.clientHeight || props.rowHeight
      }
      if (scrollTop === props.rows.length * rowHeight.value - target.clientHeight) {
        context.emit('scroll-to-bottom')
      }
    }
    const scrollToTop = () => {
      if (scrollWrap.value) {
        scrollWrap.value.scrollTop = 0
      }
    }
    const tableKey = ref<number>(new Date().getTime())
    // 要展示的列
    const displayColumns = inject<ComputedRef<Column[]>>('displayColumns', computed(() => []))
    // 展示的列变化就要重新渲染表格
    watch(() => [...displayColumns.value], () => {
      // 更新table的key强制重新渲染表格
      tableKey.value = new Date().getTime()
      rowHeight.value = undefined
    })
    // 排序属性
    const sort = inject<ComputedRef<Sort>>('sort')
    const handleSelectionChange = (selectedRows: []): void => {
      context.emit('table-selection-change', selectedRows)
    }
    const handleSelecttAll = (selectedRows: []) => {
      if (selectedRows.length > 0) {
        context.emit('table-all-selected', selectedRows)
      }
    }
    const handleSortChange = (sort: { column: TableColumnCtx<any>; prop: string | null; order: string | null; }): void => {
      if (scrollWrap.value) {
        scrollWrap.value.scrollTop = 0
      }
      context.emit('sort-change', sort.prop, sort.order)
    }
    const toggleRowSelection = (row: any, selected: boolean) => {
      ScrollTableRef.value && ScrollTableRef.value.toggleRowSelection(row, selected)
    }
    return {
      showBottom,
      ScrollTableRef,
      tableHeight,
      tableKey,
      displayColumns,
      sort,
      handleSelectionChange,
      handleSortChange,
      handleSelecttAll,
      handleScroll,
      scrollToTop,
      toggleRowSelection
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
