<template>
  <div class="button-group-container">
    <template v-for="(button, index) in buttons" :key="index">
      <Button
        :button="button"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { IButton } from '.'
import Button from './Button.vue'

export default defineComponent({
  components: { Button },
  props: {
    buttons: {
      type: Array as PropType<IButton[]>,
      require: true
    }
  }
})
</script>
<style scoped lang="scss">
.button-group-container {
  :deep(.el-button) {
    cursor: pointer;
  }
}
</style>
