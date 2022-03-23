<template>
  <Main class="authorize-user-page">
    <Filter @search="onSearch" @reset="onSearch({})">
      <Name label="用户名:" prop="username" placeholder="username" />
      <Select
        label="状态:"
        prop="enabled"
        placeholder="enabled"
        :options="[
          { label: '全部' },
          { label: '可用', value: 1 },
          { label: '禁用', value: 0 }
        ]"
      />
    </Filter>
    <PageableTable ref="table" :columns="columns" :data-method="getUsers">
      <template #top-bar>
        <Button :button="makeBtn('add')" @click="handleAdd" />
        <Button :button="makeBtn('delete')" :disabled="selection?.length === 0" @click="handleDel" />
      </template>
    </PageableTable>
  </Main>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

import {
  initColumns,
  PageableTable
} from '@/components/Table'
import {
  Button,
  btnGroupComponent,
  makeBtn,
  makeBtnGroup
} from '@/components/Button'
import Filter, { Name, Select } from '@/components/Filter'
import { throttle } from '@/utils/helper'
import { getUsers } from '@/api/authorize/user'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: {
    PageableTable,
    Button,
    Filter,
    Name,
    Select
  },
  setup() {
    const router = useRouter()
    const columns = initColumns([
      {
        prop: 'id',
        label: 'ID',
        align: 'center',
        sortable: true
      },
      {
        prop: 'username',
        label: '用户名',
        align: 'center'
      },
      {
        prop: 'mobile',
        label: '手机',
        showOverflowTooltip: true,
        sortable: true,
        visible: false
      },
      {
        prop: 'operation',
        label: '操作',
        align: 'center',
        formatter: ({ row }) => {
          return {
            is: btnGroupComponent(),
            attrs: {
              buttons: makeBtnGroup([
                {
                  name: 'edit',
                  click: () => {
                    // console.log(row.username)
                    router.push('/test2')
                  }
                },
                {
                  name: 'delete',
                  click: throttle(() => {
                    console.log(row)
                  }, 3000)
                }
              ])
            }
          }
        }
      }
    ])
    const table = ref<InstanceType<typeof PageableTable>>()
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
      getUsers,
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
