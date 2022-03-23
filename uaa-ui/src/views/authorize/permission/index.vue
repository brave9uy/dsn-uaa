<template>
  <Main class="authorize-permission-page">
    <TreeTable
      ref="table"
      :columns="columns"
      :data-method="getPermissions"
      :default-expand-keys="[1, 35]"
    >
      <template #top-bar>
        <Button :button="makeBtn('add')" @click="handleAdd" />
        <Button :button="makeBtn('delete')" :disabled="selection?.length === 0" @click="handleDel" />
      </template>
    </TreeTable>
  </Main>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'

import {
  initColumns,
  TreeTable
} from '@/components/Table'
import {
  Button,
  btnGroupComponent,
  makeBtn,
  makeBtnGroup
} from '@/components/Button'
import { useRouter } from 'vue-router'
import { getPermissions } from '@/api/authorize/permission'
import { FaIcon } from '@/components/Icon'

export default defineComponent({
  components: {
    TreeTable,
    Button
  },
  setup() {
    const router = useRouter()
    const columns = initColumns([
      {
        prop: 'displayName',
        label: '显示名'
      },
      {
        prop: 'uri',
        label: '路由地址'
      },
      {
        prop: 'icon',
        label: '图标',
        align: 'center',
        formatter: ({ row }) => {
          return !row.icon || row.icon.trim() === '' ? undefined : {
            is: FaIcon,
            attrs: {
              icon: row.icon
            }
          }
        }
      },
      {
        prop: 'enabled',
        label: '是否可用',
        align: 'center',
        formatter: ({ row }) => {
          if (row.enabled) {
            return {
              is: FaIcon,
              attrs: {
                icon: 'solid.check',
                color: '#009688'
              }
            }
          } else {
            return {
              is: FaIcon,
              attrs: {
                icon: 'solid.times',
                color: '#F56C6C'
              }
            }
          }
        }
      },
      {
        prop: 'operation',
        label: '操作',
        align: 'center',
        defaultToShow: true,
        formatter: ({ row }) => {
          return {
            is: btnGroupComponent(),
            attrs: {
              buttons: makeBtnGroup([{
                name: 'edit',
                click: () => {
                  router.push(`/authorize/permission/update/${row.id}`)
                  // router.push('/test')
                }
              }])
            }
          }
        }
      }
    ])
    const table = ref<InstanceType<typeof TreeTable>>()
    const selection = computed<[] | undefined>(() => table.value?.getSelection())
    onMounted(() => {
      table.value && table.value.refresh()
    })
    const handleAdd = () => {
      router.push('/authorize/permission/create')
    }
    const handleDel = () => {
      console.log(selection.value)
    }
    return {
      getPermissions,
      columns,
      table,
      selection,
      makeBtn,
      handleAdd,
      handleDel
    }
  }
})
</script>
<style>
</style>
