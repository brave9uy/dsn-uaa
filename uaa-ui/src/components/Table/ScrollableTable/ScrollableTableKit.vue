<template>
  <div ref="ScrollableTableKitRef" class="scrollable-table-container">
    <div class="top-bar" :class="{ narrow: isWidthNarrow }">
      <div class="button-bar">
        <slot name="top-bar" />
      </div>
      <ToolBar
        ref="ToolBarRef"
        class="tool-bar"
        :filter="filter"
        @refresh="refresh"
        @column-display-change="handleColumnDisplayChange"
      >
        <template #top-bar-filter>
          <slot name="top-bar-filter" />
        </template>
      </ToolBar>
    </div>
    <div class="table-container">
      <ScrollableTable
        ref="ScrollableTableRef"
        :rows="rows"
        :total="rowCount"
        :selectable="selectable"
        :selectionWidth="selectionWidth"
        @table-selection-change="handleTableSelectionChange"
        @table-all-selected="handleTableAllSelected"
        @sort-change="handleSortChange"
        @scroll-to-bottom="handleScrollToBottom"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, provide, ref, watch } from 'vue'

import {
  ScrollableTable
} from '.'
import { Column, Sort, SortSetting, PaginationSetting, ITabularResult } from '@/components/Table'
import ToolBar from '@/components/Table/ToolBar'
import useDocumentWidth from '@/hooks/useDocumentWidth'
import { throttle } from '@/utils/helper'

export default defineComponent({
  name: 'scrollable-table-kit',
  components: {
    ScrollableTable,
    ToolBar
  },
  props: {
    // 请求rows
    dataMethod: {
      type: Function as PropType<(params: { [key: string]: any }) => Promise<ITabularResult>>,
      require: true
    },
    // 列配置
    columns: {
      type: Array as PropType<Column[]>,
      require: true
    },
    // 是否启用侧边抽屉栏用来放置筛选条件
    filter: {
      type: Boolean,
      default: false
    },
    // 分页配置
    pagination: {
      type: Object as PropType<Partial<PaginationSetting>>
    },
    // 翻页响应频率，默认500毫秒，防止极速下滑造成的翻页，调节成50毫秒或者0可以极速滑动加载
    pagingFrequency: {
      type: Number,
      default: 500
    },
    // 排序配置
    sorts: {
      type: Object as PropType<Partial<SortSetting>>
    },
    // 是否有多选
    selectable: {
      type: Boolean,
      default: true
    },
    // 多选列宽
    selectionWidth: {
      type: Number,
      default: 55
    }
  },
  setup(props) {
    const ScrollableTableKitRef = ref()
    const ScrollableTableRef = ref<InstanceType<typeof ScrollableTable>>()
    const ToolBarRef = ref<InstanceType<typeof ToolBar>>()
    // 传出columns和displayColumns
    const tableColumns = ref(props.columns)
    const displayColumns = ref(props.columns ? props.columns.filter(c => c.visible) : [])
    provide('columns', computed(() => tableColumns.value))
    provide('displayColumns', computed(() => displayColumns.value))
    // 管理列展示
    const handleColumnDisplayChange = () => {
      displayColumns.value = tableColumns.value ? tableColumns.value.filter(c => c.visible) : []
    }
    // 数据
    const rows = ref<any[]>([])
    // 数据总数
    const rowCount = ref(0)
    // 当前页数
    const currentPage = ref(1)
    // 分页设置
    const pageSetting = computed<PaginationSetting>(() => Object.assign({
      pageable: true,
      pageSize: 18,
      pageProp: 'page',
      pageSizeProp: 'size'
    }, props.pagination))
    // 总页数
    const pageCount = computed(() =>
      pageSetting.value.pageSize && rowCount.value ? Math.floor((rowCount.value + pageSetting.value.pageSize - 1) / pageSetting.value.pageSize) : 1)
    // 当前请求参数
    const currentParams = ref<{ [key: string]: any }>()
    // 排序属性
    const sort = ref<Sort>({ prop: null, order: null })
    provide('sort', computed(() => sort.value))
    // 排序设置
    const sortSetting = computed<SortSetting>(() => Object.assign({
      sortProp: 'sortColumn',
      orderProp: 'orderBy',
      ascending: 'asc',
      descending: 'desc',
      sortMethod: () => {
        refresh()
      }
    }, props.sorts))
    // 请求数据方法
    const getRows = (page: number): Promise<ITabularResult> => {
      // 分页配置
      const pageConfig = !pageSetting.value.pageable ? {} : {
        [pageSetting.value.pageProp]: page,
        [pageSetting.value.pageSizeProp]: pageSetting.value.pageSize
      }
      // 构建请求参数
      const params = Object.assign(pageConfig, currentParams.value)
      if (sort.value && sort.value.prop && sort.value.order) {
        // 如果有排序，就将排序加入请求
        params[sortSetting.value.sortProp] = sort.value.prop
        if (sort.value.order === 'ascending') {
          params[sortSetting.value.orderProp] = sortSetting.value.ascending
        } else if (sort.value.order === 'descending') {
          params[sortSetting.value.orderProp] = sortSetting.value.descending
        }
      }
      // 发送请求
      return props.dataMethod ? props.dataMethod(params) : Promise.resolve({ rows: [], total: 0 })
    }
    // 刷新表格，不传入页数参数，就直接本页
    const refresh = (): Promise<ITabularResult> => {
      currentPage.value = 1
      ToolBarRef.value && ToolBarRef.value.closeFilter()
      return getRows(currentPage.value).then(res => {
        selection.value = []
        ScrollableTableRef.value && ScrollableTableRef.value.scrollToTop()
        rows.value = res.rows
        rowCount.value = res.total
        return Promise.resolve(res)
      })
    }
    // 查询
    const search = (filterData: { [key: string]: any }) => {
      currentParams.value = filterData
      refresh()
    }
    // 翻页
    const nextPage = () => {
      if (currentPage.value < pageCount.value) {
        currentPage.value++
        return getRows(currentPage.value).then(res => {
          res.rows.forEach(row => {
            rows.value.push(row)
            if (allSelected.value) {
              ScrollableTableRef.value && ScrollableTableRef.value.toggleRowSelection(row, true)
            }
          })
          rowCount.value = res.total
          return Promise.resolve(res)
        })
      }
    }
    // 根据屏幕宽度调整显示的列
    const changeDisplayColumnsByViewWidth = () => {
      if (tableColumns.value && tableColumns.value.length > 0) {
        if (isWidthNarrow.value) {
          for (let i = 0; i < tableColumns.value.length; i++) {
            const c = tableColumns.value[i]
            if (!c.defaultToShow && !c.alwaysVisible) {
              c.visible = false
            }
          }
        } else {
          for (let i = 0; i < tableColumns.value.length; i++) {
            const c = tableColumns.value[i]
            c.visible = true
          }
        }
        handleColumnDisplayChange()
      }
    }
    // 容器小于648像素宽度，切换到卡片视图
    const isWidthNarrow = useDocumentWidth(width => width < 768, ScrollableTableKitRef)
    changeDisplayColumnsByViewWidth()
    watch(() => isWidthNarrow.value, () => {
      changeDisplayColumnsByViewWidth()
    })
    // 选中的选项
    const selection = ref<any[]>([])
    // 处理表格视图中，选项变化
    const handleTableSelectionChange = (selectedRows: []): void => {
      if (selectedRows.length < selection.value.length) {
        allSelected.value = false
      }
      selection.value = selectedRows
    }
    const allSelected = ref(false)
    const handleTableAllSelected = () => {
      allSelected.value = true
    }
    // 返回选中的选项
    const getSelection = (): [] => {
      return JSON.parse(JSON.stringify(selection.value))
    }
    // 处理排序变化
    const handleSortChange = (prop: string | null, order: string | null): void => {
      sort.value = { prop, order }
      sortSetting.value.sortMethod(sort.value)
    }
    // 处理滚动条滚到底
    let handleScrollToBottom: (args: any) => void
    if (props.pagingFrequency > 0) {
      handleScrollToBottom = throttle(() => {
        nextPage()
      }, props.pagingFrequency)
    } else {
      handleScrollToBottom = () => {
        return nextPage()
      }
    }
    const isAllSelected = (): boolean => {
      return allSelected.value
    }
    return {
      ScrollableTableKitRef,
      ScrollableTableRef,
      ToolBarRef,
      handleColumnDisplayChange,
      rows,
      rowCount,
      pageSetting,
      currentPage,
      refresh,
      search,
      isWidthNarrow,
      handleTableSelectionChange,
      handleTableAllSelected,
      getSelection,
      handleSortChange,
      handleScrollToBottom,
      isAllSelected
    }
  }
})
</script>
<style scoped lang="scss">
.scrollable-table-container {
  height: calc(100%);
  overflow: hidden;
  .top-bar {
    padding: 0 0 15px 0;
    overflow-y: hidden;
    &:not(.narrow) {
      padding: 15px;
      background-color: #ffffff;
    }
    :deep(.el-button) {
      padding: 12px;
    }
    .button-bar {
      float: left;
    }
  }
  .table-container {
    height: calc(100% - 70px);
  }
}
</style>
