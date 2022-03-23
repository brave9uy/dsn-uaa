<template>
  <Main class="authorize-permission-update-page">
    <el-card>
      <el-form :model="form" label-position="top" label-width="120px">
        <el-form-item label="DisplayName">
          <el-input v-model="form.displayName"></el-input>
        </el-form-item>
        <el-form-item label="Authority">
          <el-input v-model="form.authority"></el-input>
        </el-form-item>
        <el-form-item label="Parent">
          <SingleSelectTree
            ref="ParentRef"
            v-model="form.parent"
            :tree-props="{ label: 'displayName' }"
            :rows="permissions"
            @on-node-click="onParentClick"
          />
        </el-form-item>
        <el-form-item label="Url">
          <el-input v-model="form.uri"></el-input>
        </el-form-item>
        <el-form-item label="PermissionLevel">
          <el-checkbox-group v-model="levels" @change="onPermissionLevelChange">
            <el-checkbox :label="1">接口</el-checkbox>
            <el-checkbox :label="3">菜单</el-checkbox>
            <el-checkbox :label="5">页面</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Icon">
          <FontAwesomeIconSelect v-model="form.icon" />
        </el-form-item>
        <el-form-item label="Enabled">
          <el-switch v-model="form.enabled" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSubmit">{{ paramId ? 'Update' : 'Create' }}</el-button>
          <el-button>Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </Main>
</template>
<script lang="ts">
import { getPermission } from '@/api/authorize/permission'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

import { FontAwesomeIconSelect } from '@/components/Icon'
import { SingleSelectTree } from '@/components/Tree'
import Message from '@/utils/message'

export default defineComponent({
  components: {
    FontAwesomeIconSelect,
    SingleSelectTree
  },
  setup() {
    const route = useRoute()
    const form = reactive({
      id: 0,
      displayName: '',
      authority: '',
      parent: 0,
      uri: '',
      permissionLevel: 0,
      icon: '',
      enabled: true
    })
    const levels = ref<number[]>([])
    const permissions = ref<any[]>([])
    const paramId = ref(route.params.id as string)
    onMounted(() => {
      if (paramId.value) {
        getPermission(route.params.id as string).then(res => {
          console.log(res)
          if (res.data && res.data.id) {
            form.id = res.data.id
            form.displayName = res.data.displayName
            form.authority = res.data.authority
            form.parent = res.data.parent
            form.uri = res.data.uri
            form.permissionLevel = res.data.permissionLevel
            splitPermissionLevel(res.data.permissionLevel)
            form.icon = res.data.icon
            form.enabled = res.data.enabled
            permissions.value = res.data.permissions
          }
        })
      }
    })
    const ParentRef = ref<InstanceType<typeof SingleSelectTree>>()
    const onParentClick = (node: any) => {
      if (node.id !== form.id) {
        ParentRef.value && ParentRef.value.setCurrentNode(node)
      } else {
        ParentRef.value && ParentRef.value.setCurrentKey(form.parent)
        Message.warning('不能选择自己作为自己的父节点')
      }
    }
    const splitPermissionLevel = (level: number) => {
      if (level === 1) {
        levels.value = [1]
      } else if (level === 3) {
        levels.value = [3]
      } else if (level === 4) {
        levels.value = [1, 3]
      } else if (level === 5) {
        levels.value = [5]
      } else if (level === 6) {
        levels.value = [1, 5]
      } else if (level === 8) {
        levels.value = [3, 5]
      } else if (level === 9) {
        levels.value = [1, 3, 5]
      }
    }
    const onPermissionLevelChange = (payload: Event) => {
      const arr: number[] = (payload as unknown) as number[]
      if (arr.length === 0) {
        form.permissionLevel = 0
      } else {
        form.permissionLevel = arr.reduce((prev: number, current: number) => {
          prev += current
          return prev
        })
      }
    }
    const onSubmit = () => {
      console.log(form)
    }
    return {
      paramId,
      form,
      ParentRef,
      levels,
      permissions,
      onParentClick,
      onPermissionLevelChange,
      onSubmit
    }
  }
})
</script>
<style scoped lang="scss">
.authorize-permission-update-page {
  .el-card {
    max-width: 650px;
    margin: 0 auto;
    .el-form {
      margin: 10px auto;
    }
  }
}
</style>
