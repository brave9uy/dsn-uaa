<template>
  <div class="card-set-container">
    <el-card class="box-card" v-for="(row, rowIndex) in rows" :key="rowIndex">
      <el-row v-if="selectable" class="text item">
        <el-checkbox v-model="checkedArray[rowIndex]" size="large" @change="handleSelectionChange(row, $event)"></el-checkbox>
      </el-row>
      <el-row
        class="text item"
        v-for="column in displayColumns"
        :key="column.prop"
      >
        <el-col :span="10">{{ column.label }}</el-col>
        <el-col :span="14" v-if="column.prop && row[column.prop] && !column.formatter">
          {{ row[column.prop] }}
          <Sorter
            v-if="column.sortable && rowIndex === 0"
            :sort="sort"
            :prop="column.prop"
            @click="onSortClick"
          />
        </el-col>
        <el-col :span="14" v-else-if="column.formatter">
            <DynamicComponent
              :formatter="column.formatter"
              :row="row"
            />
          <Sorter
            v-if="column.sortable && rowIndex === 0"
            :sort="sort"
            :prop="column.prop"
            @click="onSortClick"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="!rows || rows?.length === 0">
      <el-empty description="No Data"></el-empty>
    </el-card>
  </div>
</template>
<script lang="ts">
import { computed, ComputedRef, defineComponent, inject, PropType, ref, watch } from 'vue'

import { Column, Sort, Sorter } from '@/components/Table'
import { DynamicComponent } from '@/components'

export default defineComponent({
  props: {
    rows: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    },
    selectable: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DynamicComponent,
    Sorter
  },
  emits: [
    'card-selection-change',
    'sort-change'
  ],
  setup(props, context) {
    const displayColumns = inject<ComputedRef<Column[]>>('displayColumns', computed(() => []))
    // 多选v-model
    const checkedArray = ref<boolean[]>([])
    // 初始化多选的v-model
    const initCheckedArray = (rows: any[]) => {
      for (let i = 0; i < rows.length; i++) {
        checkedArray.value.push(false)
      }
    }
    // 如果传入的rows有变化，取消所有多选
    watch(() => [...props.rows], (rows) => {
      checkedArray.value = []
      initCheckedArray(rows)
    })
    // 排序属性
    const sort = inject<ComputedRef<Sort>>('sort')
    const handleSelectionChange = (selectedRow: any, checked: boolean): void => {
      context.emit('card-selection-change', selectedRow, checked)
    }
    const onSortClick = (prop: string, order: string): void => {
      if (sort && sort.value) {
        if (sort.value?.prop === prop && sort.value?.order === order) {
          context.emit('sort-change', null, null)
        } else {
          context.emit('sort-change', prop, order)
        }
      }
    }
    return {
      displayColumns,
      checkedArray,
      sort,
      handleSelectionChange,
      onSortClick
    }
  }
})
</script>
<style scoped lang="scss">
.card-set-container {
  .el-card {
    .text.item + .text.item {
      margin-top: 10px;
    }
    & +  .el-card {
      margin-top: 10px;
    }
  }
}
</style>
