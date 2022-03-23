<template>
  <el-dialog
    custom-class="account-binder-dialog"
    :modelValue="visible"
    @update:modelValue="onDialogVisibleChange"
    :title="title || ''"
    draggable
  >
    <RespFormItem :label="label || ''" class="d-block">
      <el-input :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)"></el-input>
    </RespFormItem>

    <RespFormItem label="验证码" class="d-block compositional">
      <el-input v-model="code" placeholder="Verification Code"></el-input>
      <el-button type="primary" @click="onCodeSend">发送验证码</el-button>
    </RespFormItem>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">Cancel</el-button>
      <el-button type="success" @click="$emit('on-confirm')">Confirm</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

import { RespFormItem } from '@/components/Form'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    title: {
      type: String
    }
  },
  components: {
    RespFormItem
  },
  emits: ['update:modelValue', 'update:visible', 'on-modal-close', 'on-code-send', 'on-confirm'],
  setup(props, context) {
    const code = ref('')
    const onDialogVisibleChange = (visible: boolean) => {
      context.emit('update:visible', visible)
      if (!visible) {
        context.emit('on-modal-close', visible)
      }
    }
    const onCodeSend = () => {
      context.emit('on-code-send', code.value)
    }
    return {
      onDialogVisibleChange,
      code,
      onCodeSend
    }
  }
})
</script>
