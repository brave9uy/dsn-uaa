<template>
  <div class="tree-select-container">
    <el-tree
      ref="TreeRef"
      :data="nodes"
      :node-key="treePropsSettings.key"
      :default-expanded-keys="[modelValue]"
      :props="treePropsSettings"
      :expand-on-click-node="expandOnClickNode"
      @node-click="handleNodeClick"
    />
  </div>
</template>
<script lang="ts">
import { arrToTree, breadthFirstExecuteUpwards } from '@/utils/tree'
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElTree } from 'element-plus'

interface ITreeProps {
  label: string;
  parentKey: number;
  key: string;
  parent: string;
  children: string;
  class: (data: any, node: Node) => string | null
}

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number]
    },
    treeProps: {
      type: Object as PropType<Partial<ITreeProps>>
    },
    rows: {
      type: Array as PropType<any[]>,
      default: () => {
        return []
      }
    },
    expandOnClickNode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'on-node-click'],
  setup(props, context) {
    const treePropsSettings = computed<ITreeProps>(() => Object.assign({
      label: 'label',
      parentKey: 0,
      key: 'id',
      parent: 'parent',
      children: 'children',
      class: isNodeCurrent
    }, props.treeProps))
    const nodes = ref<any>([])
    const TreeRef = ref<InstanceType<typeof ElTree>>()
    watch(() => [...props.rows], (rows) => {
      const root = arrToTree(rows, treePropsSettings.value.parentKey,
        treePropsSettings.value.key, treePropsSettings.value.parent, treePropsSettings.value.children)
      root[treePropsSettings.value.label] = '无'
      nodes.value = [root]
    })
    const isNodeCurrent = (data: any, node: Node) => {
      if (data[treePropsSettings.value.key] === props.modelValue) {
        return 'current'
      }
      return null
    }
    const handleNodeClick = (node: any) => {
      context.emit('on-node-click', node)
    }
    const setCurrentNode = (node: any) => {
      const key = node[treePropsSettings.value.key]
      reOpenTree(key, node[treePropsSettings.value.parent])
      context.emit('update:modelValue', key)
    }
    const setCurrentKey = (key: string | number) => {
      reOpenTree(key, getNodeByKey(key).data[treePropsSettings.value.parent])
      context.emit('update:modelValue', key)
    }
    const reOpenTree = (key: string | number, parentKey: string | number) => {
      const expandKeys = [key]
      if (key === treePropsSettings.value.parentKey) {
        openTreeByKeys(expandKeys)
      } else {
        breadthFirstExecuteUpwards(nodes.value, treePropsSettings.value.key, parentKey, (node, resolve) => {
          expandKeys.push(node[treePropsSettings.value.key])
          if (node && node[treePropsSettings.value.key] === treePropsSettings.value.parentKey) {
            openTreeByKeys(expandKeys)
          }
          resolve(node)
        }, treePropsSettings.value.parent, treePropsSettings.value.children)
      }
    }
    const openTreeByKeys = (keys: Array<string | number>) => {
      if (TreeRef.value) {
        const treeNodes = TreeRef.value.store._getAllNodes()
        for (let i = 0; i < treeNodes.length; i++) {
          const treeNode = treeNodes[i]
          if (keys.indexOf(treeNode.data[treePropsSettings.value.key]) > -1) {
            treeNode.expanded = true
          } else {
            treeNode.expanded = false
          }
        }
      }
    }
    const getNodeByKey = (key: string | number): any => {
      if (TreeRef.value) {
        const treeNodes = TreeRef.value.store._getAllNodes()
        for (let i = 0; i < treeNodes.length; i++) {
          if (treeNodes[i].data[treePropsSettings.value.key] === key) {
            return treeNodes[i]
          }
        }
      }
      return null
    }
    return {
      treePropsSettings,
      nodes,
      TreeRef,
      handleNodeClick,
      setCurrentNode,
      setCurrentKey
    }
  }
})
</script>
<style scoped lang="scss">
@import "@/assets/css/theme.module.scss";
.tree-select-container {
  width: 100%;
  :deep(.current) {
    > .el-tree-node__content {
      color: $activeTextColor;
    }
  }
}
</style>
