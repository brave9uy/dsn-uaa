<template>
  <Main class="access-log-page" overflow-y-hidden>
    <ScrollableTable ref="table" :columns="columns" filter :data-method="getLogs">
      <template #top-bar-filter>
        <Filter :collapsible="false" @search="onSearch" @reset="onSearch({})">
          <Name label="用户名:" prop="username" placeholder="username" />
        </Filter>
      </template>
    </ScrollableTable>
  </Main>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

import {
  initColumns,
  ScrollableTable
} from '@/components/Table'
import {
  Button,
  makeBtn
} from '@/components/Button'
import Filter, { Name } from '@/components/Filter'
import { getLogs } from '@/api/log/access'

export default defineComponent({
  components: {
    ScrollableTable,
    Filter,
    Name
  },
  setup() {
    const columns = initColumns([
      {
        prop: 'username',
        label: '用户名',
        align: 'center',
        defaultToShow: true
      },
      {
        prop: 'ip',
        label: 'IP'
      },
      {
        prop: 'operationName',
        label: '操作',
        align: 'center'
      },
      {
        prop: 'operationTime',
        label: '操作时间',
        align: 'center'
      },
      {
        prop: 'operation',
        label: '详情',
        align: 'center',
        defaultToShow: true,
        formatter: ({ row }) => {
          return {
            is: Button,
            attrs: {
              button: {
                type: 'success',
                size: 'small',
                icon: 'regular.eye',
                click: () => {
                  alert('详情')
                }
              }
            }
          }
        }
      }
    ])
    const table = ref<InstanceType<typeof ScrollableTable>>()
    const selection = computed<[] | undefined>(() => table.value?.getSelection())
    onMounted(() => {
      table.value && table.value.refresh()
    })
    const onSearch = (filterData: { [key: string]: any }) => {
      table.value && table.value.search(filterData)
    }
    const handleAdd = () => {
      console.log('hahaha')
    }
    const handleDel = () => {
      console.log(selection.value)
    }
    return {
      getLogs,
      columns,
      table,
      selection,
      makeBtn,
      onSearch,
      handleAdd,
      handleDel
    }
  }
})
</script>
<style>
</style>
