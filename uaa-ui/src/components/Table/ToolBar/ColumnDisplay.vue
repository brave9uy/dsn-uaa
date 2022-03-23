<template>
  <div class="column-display-container">
    <el-popover placement="bottom-end" :width="200" :show-arrow="false" trigger="click">
      <template #reference>
        <slot name="refer" />
      </template>
      <div class="column-display-popover-container">
        <div class="column-display-head">
          <el-checkbox
            label="全部"
            v-model="checkAll"
            :indeterminate="allIndeterminate"
            @change="handleAllDisplayColumnsChange"
          />
        </div>
        <div class="column-display-body">
          <Draggable
            v-if="draggable"
            :list="columns"
            draggable=".draggable"
            @change="handleColumnDrag"
          >
            <transition-group>
              <div
                v-for="column in columns"
                :key="column.prop"
                class="column"
                :class="{ 'draggable': column.draggable }"
              >
                <el-checkbox
                  v-model="checkedMap[column.prop]"
                  :label="column.prop"
                  :disabled="column.alwaysVisible === true ? true : false"
                  @change="handleDisplayColumnsChange(column, $event)"
                >{{ column.label }}</el-checkbox>
              </div>
            </transition-group>
          </Draggable>
          <div v-else>
            <div class="column" v-for="column in columns" :key="column.prop">
              <el-checkbox
                v-model="checkedMap[column.prop]"
                :label="column.prop"
                :disabled="column.alwaysVisible === true ? true : false"
                @change="handleDisplayColumnsChange(column, $event)"
              >{{ column.label }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, onMounted, ref, watch } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import { Column } from '@/components/Table'

export interface MovedEventObject<T> {
  element: T;
  newIndex: number;
  oldIndex: number
}

export default defineComponent({
  props: {
    // 列是否可以拖拽
    draggable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Draggable: VueDraggableNext
  },
  emits: ['change'],
  setup(props, context) {
    const columns = inject<ComputedRef<Column[]>>('columns', computed(() => []))
    const displayColumns = inject<ComputedRef<Column[]>>('displayColumns', computed(() => []))
    // 是否全选所有列
    const checkAll = ref(true)
    // 全选checkbox控件是否不确定(半选)状态
    const allIndeterminate = ref(false)
    // columns选项的v-model
    const checkedMap = ref<{ [key in string | number]: boolean }>({})
    // 初始化展示的列
    const refreshColumnDisplay = () => {
      for (let i = 0; i < columns.value.length; i++) {
        checkedMap.value[columns.value[i].prop] = columns.value[i].visible
      }
      isIndeterminate(getCheckedKeys())
    }
    onMounted(() => {
      refreshColumnDisplay()
    })
    watch(() => [...displayColumns.value], () => {
      refreshColumnDisplay()
    })
    // 获取选中的所有key
    const getCheckedKeys = (): string[] => {
      return Object.keys(checkedMap.value).filter(key => checkedMap.value[key])
    }
    // 获取选中的所有列
    const getCheckedColumns = (checkedKeys: string[]): Column[] => {
      return columns.value.filter(c => checkedKeys.indexOf(c.prop))
    }
    // 改变所有列的显示状态
    const changeAllDisplayColumns = (visible: boolean): void => {
      if (visible) {
        columns.value && columns.value.forEach(c => {
          c.visible = true
          checkedMap.value[c.prop] = true
        })
      } else {
        columns.value && columns.value.forEach(c => {
          if (!c.alwaysVisible) {
            c.visible = false
            if (checkedMap.value[c.prop]) {
              checkedMap.value[c.prop] = false
            }
          }
        })
      }
    }
    // 处理全选的全选或者半选状态
    const isIndeterminate = (checkedKeys: string[]): void => {
      checkAll.value = columns.value.length === checkedKeys.length
      if (checkedKeys.length > 0 && checkedKeys.length < columns.value.length) {
        allIndeterminate.value = true
        checkAll.value = false
      } else {
        allIndeterminate.value = false
        if (checkedKeys.length === 0) {
          checkAll.value = false
        }
        if (checkedKeys.length === columns.value.length) {
          checkAll.value = true
        }
      }
    }
    // 全选checkbox被点击事件
    const handleAllDisplayColumnsChange = (val: boolean) => {
      if (val) {
        allIndeterminate.value = false
        changeAllDisplayColumns(true)
      } else {
        changeAllDisplayColumns(false)
        if (getCheckedKeys().length === 0) {
          allIndeterminate.value = false
        } else {
          allIndeterminate.value = true
        }
      }
      context.emit('change', getCheckedColumns(getCheckedKeys()).map(c => c.prop))
    }
    // 某列checkbox被点击事件
    const handleDisplayColumnsChange = (column: Column, checked: boolean) => {
      const checkedKeys = getCheckedKeys()
      isIndeterminate(checkedKeys)
      columns.value && columns.value.forEach(c => {
        if (c.prop === column.prop) {
          c.visible = checked
        }
      })
      context.emit('change', getCheckedColumns(checkedKeys).map(c => c.prop))
    }
    const handleColumnDrag = (event: { [key: string]: MovedEventObject<Column> }) => {
      context.emit('change', event.moved)
    }
    return {
      columns,
      checkAll,
      allIndeterminate,
      checkedMap,
      handleAllDisplayColumnsChange,
      handleDisplayColumnsChange,
      handleColumnDrag
    }
  }
})
</script>
<style scoped lang="scss">
.column-display-container {
  display: inline-block;
}
.column-display-popover-container {
  margin: -12px;
  > * {
    padding: 0 12px;
  }
  .column-display-head {
    display: flex;
    align-items: center;
  }
  .column-display-body {
    border-top: 1px #e5e7eb solid;
    .column {
      label.el-checkbox {
        display: flex;
      }
    }
  }
}
</style>
