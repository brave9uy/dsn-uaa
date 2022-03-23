<template>
  <div class="tree-table-kit-container">
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
      <TreeTable
        ref="TableRef"
        :rows="rows"
        :nodes="nodes"
        :tree-props="treeSettings"
        :selectable="selectable"
        :selectionWidth="selectionWidth"
        @selection-change="handleSelectionChange"
      />
      <div class="row-count">
        Total {{ rowCount }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, provide, ref, watch } from 'vue'

import { TreeTable, PartialITreeProps, ITreeProps } from '.'
import { Column, ITabularResult } from '@/components/Table'
import ToolBar from '@/components/Table/ToolBar'
import useDocumentWidth from '@/hooks/useDocumentWidth'
import { arrToTree } from '@/utils/tree'

export default defineComponent({
  name: 'tree-table-kit',
  components: {
    TreeTable,
    ToolBar
  },
  props: {
    // 请求rows
    dataMethod: {
      type: Function as PropType<(params: { [key: string]: any }) => Promise<ITabularResult>>,
      require: true
    },
    treeProps: {
      type: Object as PropType<PartialITreeProps>
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
    // 是否有多选
    selectable: {
      type: Boolean,
      default: true
    },
    // 多选列宽
    selectionWidth: {
      type: Number,
      default: 38
    },
    // 展开列的keys
    defaultExpandKeys: {
      type: Array as PropType<number[] | string []>
    }
  },
  setup(props) {
    const TableRef = ref()
    const ToolBarRef = ref<InstanceType<typeof ToolBar>>()
    // 传出columns和displayColumns
    const tableColumns = ref(props.columns)
    const displayColumns = ref(props.columns ? props.columns.filter(c => c.visible) : [])
    provide('columns', computed(() => tableColumns.value))
    provide('displayColumns', computed(() => displayColumns.value))
    if (displayColumns.value.length > 0) {
      displayColumns.value[0].alwaysVisible = true
      displayColumns.value[0].visible = true
      displayColumns.value[0].draggable = false
    }
    // 管理列展示
    const handleColumnDisplayChange = () => {
      displayColumns.value = tableColumns.value ? tableColumns.value.filter(c => c.visible) : []
    }
    // 数据
    const rows = ref<any[]>([])
    // 节点
    const nodes = ref<any[]>([])
    // 数据总数
    const rowCount = ref(0)
    // 当前请求参数
    const currentParams = ref<{ [key: string]: any }>({})
    // 节点相关配置
    const treeSettings = computed<ITreeProps>(() => Object.assign({
      keyProp: 'id',
      parentProp: 'parent',
      childrenProp: 'children',
      rootKey: 0
    }, props.treeProps))
    // 请求数据方法
    const getRows = (): Promise<{ rows: any[]; nodes: any[]; total: number; }> => {
      // 发送请求
      return props.dataMethod ? props.dataMethod(currentParams.value).then(res => {
        const nodes = arrToTree(
          JSON.parse(JSON.stringify(res.rows)),
          treeSettings.value.rootKey,
          treeSettings.value.keyProp,
          treeSettings.value.parentProp,
          treeSettings.value.childrenProp
        )[treeSettings.value.childrenProp]
        if (!props.defaultExpandKeys) {
          TableRef.value && TableRef.value.setExpandKeys(nodes.map((node: any) => String(node[treeSettings.value.keyProp])))
        } else {
          if (TableRef.value && props.defaultExpandKeys.length > 0) {
            if (typeof props.defaultExpandKeys[0] === 'number') {
              TableRef.value.setExpandKeys((props.defaultExpandKeys as number[]).map(k => String(k)))
            } else {
              TableRef.value.setExpandKeys(props.defaultExpandKeys)
            }
          }
        }
        return Promise.resolve({
          rows: res.rows,
          nodes: nodes,
          total: res.total
        })
      }) : Promise.resolve({ rows: [], nodes: [], total: 0 })
    }
    // 刷新表格，不传入页数参数，就直接本页
    const refresh = (): Promise<{ rows: any[]; nodes: any[]; total: number; }> => {
      ToolBarRef.value && ToolBarRef.value.closeFilter()
      return getRows().then(res => {
        selection.value = []
        rows.value = res.rows
        nodes.value = res.nodes
        rowCount.value = res.total
        return Promise.resolve(res)
      })
    }
    // 查询
    const search = (filterData: { [key: string]: any }) => {
      currentParams.value = filterData
      refresh()
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
    const isWidthNarrow = useDocumentWidth(width => width < 768)
    changeDisplayColumnsByViewWidth()
    watch(() => isWidthNarrow.value, () => {
      changeDisplayColumnsByViewWidth()
    })
    // 选中的选项
    const selection = ref<any[]>([])
    // 处理表格视图中，选项变化
    const handleSelectionChange = (selectedRows: []): void => {
      selection.value = selectedRows
    }
    // 返回选中的选项
    const getSelection = (): [] => {
      return JSON.parse(JSON.stringify(selection.value))
    }
    return {
      ToolBarRef,
      TableRef,
      handleColumnDisplayChange,
      rows,
      nodes,
      rowCount,
      treeSettings,
      refresh,
      search,
      isWidthNarrow,
      handleSelectionChange,
      getSelection
    }
  }
})
</script>
<style scoped lang="scss">
.tree-table-kit-container {
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
    .row-count {
      padding: 10px 5px;
      color: #606266
    }
  }
}
</style>
