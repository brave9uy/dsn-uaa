<template>
  <el-dialog
    custom-class="verfication-code-model"
    :modelValue="visible"
    @update:modelValue="onDialogVisibleChange"
    title="Update"
    draggable
  >
    <RespFormItem :label="label || ''" class="d-block">
      <el-input :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)"></el-input>
    </RespFormItem>

    <RespFormItem label="发送方式" class="d-block">
      <el-radio-group v-model="radio">
        <el-radio :label="3">Option A</el-radio>
        <el-radio :label="6">Option B</el-radio>
        <el-radio :label="9">Option C</el-radio>
      </el-radio-group>
    </RespFormItem>

    <RespFormItem label="验证码" class="d-block compositional">
      <el-input placeholder="Verification Code"></el-input>
      <el-button type="primary" @click="$emit('on-code-send')">发送验证码</el-button>
    </RespFormItem>
    <template #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

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
    }
  },
  components: {
    RespFormItem
  },
  emits: ['update:modelValue', 'update:visible', 'on-modal-close', 'on-code-send'],
  setup(props, context) {
    const onDialogVisibleChange = (visible: boolean) => {
      context.emit('update:visible', visible)
      if (!visible) {
        context.emit('on-modal-close', visible)
      }
    }
    return {
      onDialogVisibleChange
    }
  }
})
</script>
