<template>
  <div ref="PageableTableRef" class="pageable-table-container">
    <div class="top-bar" :class="{ narrow: isWidthNarrow }">
      <div class="button-bar">
        <slot name="top-bar"/>
      </div>
      <ToolBar
        ref="ToolBarRef"
        class="tool-bar"
        :filter="filter"
        @refresh="refresh"
        @column-display-change="handleColumnDisplayChange"
      >
        <template #top-bar-filter>
          <slot name="top-bar-filter"/>
        </template>
      </ToolBar>
    </div>
    <div class="table-container">
      <CardSet
        v-if="isWidthNarrow && showCardView"
        :rows="rows"
        :selectable="selectable"
        @card-selection-change="handleCardSelectionChange"
        @sort-change="handleSortChange"
      />
      <Table
        v-else
        :rows="rows"
        :selectable="selectable"
        :selectionWidth="selectionWidth"
        @table-selection-change="handleTableSelectionChange"
        @sort-change="handleSortChange"
      />
    </div>
    <div v-if="pageSetting.pageable" class="pagination">
      <el-card v-if="isWidthNarrow" class="box-card pagination-card">
        <Pagination
          :current-page="currentPage"
          :page-size="pageSetting.pageSize"
          :total-count="rowCount"
          @change="handlePageChange"
        />
      </el-card>
      <Pagination
        v-else
        :current-page="currentPage"
        :page-size="pageSetting.pageSize"
        :total-count="rowCount"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, provide, ref, watch } from 'vue'

import {
  Table,
  CardSet,
  Pagination,
  PaginationSetting
} from '.'
import { Column, Sort, SortSetting, ITabularResult } from '@/components/Table'
import ToolBar from '@/components/Table/ToolBar'
import useDocumentWidth from '@/hooks/useDocumentWidth'
import { scrollElMainToTop } from '@/utils/helper'

export default defineComponent({
  name: 'pageable-table',
  components: {
    Table,
    CardSet,
    Pagination,
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
    // 窄视距时是否出现卡片试图
    showCardView: {
      type: Boolean,
      default: true
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
    const PageableTableRef = ref()
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
      pageSize: 10,
      pageProp: 'page',
      pageSizeProp: 'size'
    }, props.pagination))
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
        refresh(1)
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
    const refresh = (page: number | undefined = undefined): Promise<ITabularResult> => {
      ToolBarRef.value && ToolBarRef.value.closeFilter()
      return getRows(page || currentPage.value).then(res => {
        selection.value = []
        rows.value = res.rows
        rowCount.value = res.total
        if (page) {
          currentPage.value = page
        }
        return Promise.resolve(res)
      })
    }
    // 查询
    const search = (filterData: { [key: string]: any }) => {
      currentParams.value = filterData
      refresh(1)
    }
    // 页数变化
    const handlePageChange = (page: number) => {
      refresh(page).then(() => {
        scrollElMainToTop()
      })
    }
    // 容器小于648像素宽度，切换到卡片视图
    const isWidthNarrow = useDocumentWidth(width => width < 768, PageableTableRef)
    watch(() => isWidthNarrow.value, () => {
      selection.value = []
    })
    // 选中的选项
    const selection = ref<any[]>([])
    // 处理卡片视图中，选项变化
    const handleCardSelectionChange = (selectedRow: any, checked: boolean): void => {
      const index = selection.value.indexOf(selectedRow)
      if (checked) {
        // 选中
        if (index === -1) {
          //  元素不存在，可添加
          selection.value.push(selectedRow)
        }
      } else {
        // 反选
        if (index !== -1) {
          // 元素存在，可删除
          selection.value.splice(index, 1)
        }
      }
    }
    // 处理表格视图中，选项变化
    const handleTableSelectionChange = (selectedRows: []): void => {
      selection.value = selectedRows
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
    return {
      PageableTableRef,
      ToolBarRef,
      handleColumnDisplayChange,
      rows,
      rowCount,
      pageSetting,
      currentPage,
      refresh,
      search,
      handlePageChange,
      isWidthNarrow,
      handleCardSelectionChange,
      handleTableSelectionChange,
      getSelection,
      handleSortChange
    }
  }
})
</script>
<style scoped lang="scss">
.pageable-table-container {
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
  .pagination {
    .pagination-card {
      margin-top: 10px;
      :deep(.el-card__body) {
        padding: 0;
      }
    }
  }
}
</style>
