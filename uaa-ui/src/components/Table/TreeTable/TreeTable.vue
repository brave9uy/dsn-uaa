<template>
  <el-table
    :key="tableKey"
    :data="nodes"
    :row-key="treeProps?.keyProp"
    :select-on-indeterminate="false"
    :tree-props="{ children: treeProps?.childrenProp }"
    :expand-row-keys="expandKeys"
  >
    <template #empty>
      <el-empty description="No Data"></el-empty>
    </template>
    <el-table-column
      v-if="selectable"
      type="index"
      :width="selectionWidth"
      align="center"
    >
      <template #header>
        <el-checkbox
          v-model="allChecked"
          size="large"
          :indeterminate="allIndeterminate"
          @change="handleAllSelectionChange"
        >
        </el-checkbox>
      </template>
      <template #default="scope">
        <el-checkbox
          v-model="checkedMap[scope.row[treeSettings.keyProp]]"
          size="large"
          :indeterminate="indeterminateMap[scope.row[treeSettings.keyProp]] === true ? true : false"
          @change="handleCSelectionChange(scope.row, $event)"
        >
        </el-checkbox>
      </template>
    </el-table-column>
    <el-table-column
      v-for="column in displayColumns"
      :key="column.prop"
      :label="column.label"
      :prop="column.prop"
      :width="column.width"
      :align="column.align"
      :show-overflow-tooltip="column.showOverflowTooltip"
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

import { Column } from '@/components/Table'
import { ITreeProps } from '.'
import { DynamicComponent } from '@/components'
import { breadthFirstExecuteUpwards, depthFirstExecute } from '@/utils/tree'

type SelectionStatus = 'unchecked' | 'indeterminate' | 'checked'

export default defineComponent({
  props: {
    treeProps: {
      type: Object as PropType<ITreeProps>
    },
    rows: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    },
    nodes: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    },
    selectable: {
      type: Boolean,
      default: true
    },
    selectionWidth: {
      type: Number,
      default: 38
    }
  },
  components: {
    DynamicComponent
  },
  emits: ['selection-change'],
  setup(props, context) {
    // 节点相关配置
    const treeSettings = computed<ITreeProps>(() => Object.assign({
      keyProp: 'id',
      parentProp: 'parent',
      childrenProp: 'children',
      rootKey: 0
    }, props.treeProps))
    const tableKey = ref<number>(new Date().getTime())
    // 多选v-model
    const checkedMap = ref<{ [key in string | number]: boolean }>({})
    // 是否半选v-model
    const indeterminateMap = ref<{ [key in string | number]: boolean }>({})
    // 初始化多选的v-model
    const initCheckBoxMap = (rows: any[]) => {
      for (let i = 0; i < rows.length; i++) {
        checkedMap.value[rows[i][treeSettings.value.keyProp]] = false
        indeterminateMap.value[rows[i][treeSettings.value.keyProp]] = false
      }
    }
    // 如果传入的rows有变化，取消所有多选
    watch(() => [...props.rows], (rows) => {
      checkedMap.value = {}
      indeterminateMap.value = {}
      initCheckBoxMap(rows)
    })
    // 要展示的列
    const displayColumns = inject<ComputedRef<Column[]>>('displayColumns', computed(() => []))
    // 展示的列变化就要重新渲染表格
    watch(() => [...displayColumns.value], () => {
      // 更新table的key强制重新渲染表格
      tableKey.value = new Date().getTime()
    })
    // 全部是否半选
    const allIndeterminate = ref(false)
    // 是否全选
    const allChecked = ref(false)
    // 只有最接近根节点的第1层节点，才会执行方法
    const executeAsTopNode = (node: any, func: () => boolean | undefined | void): boolean | undefined | void => {
      if (node[treeSettings.value.parentProp] === treeSettings.value.rootKey) {
        return func()
      } else {
        return undefined
      }
    }
    const isAllIndeterminate = () : SelectionStatus => {
      // 1. 获取最接近根节点的第1层节点的选中以及半选状态
      const firstLevelNodeKeys = props.nodes.map(e => String(e[treeSettings.value.keyProp]))
      const checkedArray = Object.keys(checkedMap.value)
        .filter(key => firstLevelNodeKeys.indexOf(key) > -1).map(key => checkedMap.value[key])
      const indeterminateArray = Object.keys(indeterminateMap.value)
        .filter(key => firstLevelNodeKeys.indexOf(key) > -1).map(key => indeterminateMap.value[key])
      if (checkedArray.indexOf(true) === -1) {
        // 2. 如果没有选中
        if (indeterminateArray.indexOf(true) === -1) {
          // 2.1 没有选中，也没有半选状态，全选框则取消半选状态
          allIndeterminate.value = false
          allChecked.value = false
          return 'unchecked'
        } else {
          // 2.1 没有选中，有半选状态，全选框设置为半选状态
          allIndeterminate.value = true
          allChecked.value = false
          return 'indeterminate'
        }
      } else {
        if (checkedArray.indexOf(false) === -1) {
          // 3. 全部选中, 全选框为全选状态
          allIndeterminate.value = false
          allChecked.value = true
          return 'checked'
        } else {
          // 4. 部分选中, 全选框为半选状态
          allIndeterminate.value = true
          allChecked.value = false
          return 'indeterminate'
        }
      }
    }
    // 此行是否半选
    const isRowIndeterminate = (row: any) => {
      if (indeterminateMap.value[row[treeSettings.value.keyProp]] !== undefined) {
        let indeterminate = false
        const indeterminateArray = new Array<number | string>()
        const unCheckedArray = new Array<number | string>()
        for (let i = 0; i < row[treeSettings.value.childrenProp].length; i++) {
          if (!checkedMap.value[row[treeSettings.value.childrenProp][i][treeSettings.value.keyProp]]) {
            unCheckedArray.push(row[treeSettings.value.childrenProp][i][treeSettings.value.keyProp])
          }
          if (indeterminateMap.value[row[treeSettings.value.childrenProp][i][treeSettings.value.keyProp]]) {
            indeterminateArray.push(row[treeSettings.value.childrenProp][i][treeSettings.value.keyProp])
          }
        }
        if (unCheckedArray.length === 0) {
          // 1. children全选中
          indeterminate = false
          checkedMap.value[row[treeSettings.value.keyProp]] = true
        } else {
          if (unCheckedArray.length < row[treeSettings.value.childrenProp].length) {
            // 2. children部分选中
            indeterminate = true
          } else {
            // 3. children无选中
            if (indeterminateArray.length > 0) {
              // 3.1 虽然children无选中，但有indeterminate
              indeterminate = true
            } else {
              indeterminate = false
            }
          }
          checkedMap.value[row[treeSettings.value.keyProp]] = false
        }
        indeterminateMap.value[row[treeSettings.value.keyProp]] = indeterminate
      }
    }
    // 处理全选点击改变
    const handleAllSelectionChange = (): void => {
      // 1. 在半选状态
      if (allIndeterminate.value) {
        // 1.1 取消全选框半选状态
        allIndeterminate.value = false
        // 1.2 把剩下的其余节点设置为全选
        props.nodes.forEach(n => {
          handleSelectionChange(n, true)
        })
      } else {
        // 2. 不在半选状态
        if (allChecked.value) {
          props.nodes.forEach(n => {
            handleSelectionChange(n, true)
          })
        } else {
          props.nodes.forEach(n => {
            handleSelectionChange(n, false)
          })
        }
      }
    }
    // 处理行前多选框点击改变
    const handleSelectionChange = (selectedRow: any, checked: boolean): void => {
      // 1. 根据点击的节点，找出它以及包含的所有子节点的checkBox全部设置成选中
      depthFirstExecute(selectedRow, (node) => {
        checkedMap.value[node[treeSettings.value.keyProp]] = checked
        indeterminateMap.value[node[treeSettings.value.keyProp]] = false
      }, treeSettings.value.childrenProp)
      // 2. 向父节点方向遍历，判断遍历出来的节点是否半选或者全选或者取消选择
      executeAsTopNode(selectedRow, () => {
        isAllIndeterminate()
        context.emit('selection-change', getSelection())
      })
      breadthFirstExecuteUpwards(props.nodes, treeSettings.value.keyProp, selectedRow[treeSettings.value.parentProp], (node, resolve) => {
        isRowIndeterminate(node)
        // 3. 遍历到顶，要改变一下全选框的状态
        executeAsTopNode(node, () => {
          isAllIndeterminate()
          context.emit('selection-change', getSelection())
        })
        resolve(node)
      }, treeSettings.value.parentProp, treeSettings.value.childrenProp)
    }
    const handleCSelectionChange = (row: any, e: Event) => {
      if (e) {
        handleSelectionChange(row, true)
      } else {
        handleSelectionChange(row, false)
      }
    }
    // 获取选中的行
    const getSelection = (): any[] => {
      const selectedRows = Object.keys(checkedMap.value)
        .filter(key => checkedMap.value[key])
        .map(key => props.rows.find(e => String(e[treeSettings.value.keyProp]) === String(key)))
      return JSON.parse(JSON.stringify(selectedRows))
    }
    const expandKeys = ref<string[]>([])
    const setExpandKeys = (keys: string[]) => {
      expandKeys.value = keys
    }
    return {
      checkedMap,
      indeterminateMap,
      treeSettings,
      tableKey,
      displayColumns,
      allIndeterminate,
      allChecked,
      handleAllSelectionChange,
      handleSelectionChange,
      handleCSelectionChange,
      expandKeys,
      setExpandKeys
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
