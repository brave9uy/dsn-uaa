<template>
  <el-button
    v-if="button?.name || button?.icon"
    :type="button?.type"
    :plain="button.plain === true ? true : false"
    :size="button.size === undefined ? 'default' : button.size"
    @click="handleButtonClick"
  >
    <FontAwesomeIcon v-if="typeof button?.icon === 'object'" :icon="button?.icon" />
    <FaIcon v-if="typeof button?.icon === 'string'" :icon="button.icon" />
    <span v-if="button?.name" class="button-name">{{ button?.name }}</span>
  </el-button>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { IButton } from './'
import { FaIcon } from '@/components/Icon'

export default defineComponent({
  components: { FontAwesomeIcon, FaIcon },
  emits: ['click'],
  props: {
    button: {
      type: Object as PropType<IButton>,
      require: true
    }
  },
  setup(props, context) {
    const handleButtonClick = () => {
      props.button && props.button.click && props.button.click(undefined)
      context.emit('click')
    }
    return {
      handleButtonClick
    }
  }
})
</script>
<style scoped lang="scss">
.button-name {
  margin-left: 5px;
}
</style>
