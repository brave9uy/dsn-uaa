<template>
  <FontAwesomeIcon v-if="faIcon" :icon="faIcon" v-bind="attrs"/>
</template>
<script lang="ts">
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { defineComponent, ref, useAttrs } from 'vue'

import { spinalCaseToCamelCase } from '@/utils/helper'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  components: {
    FontAwesomeIcon
  },
  setup(props) {
    const attrs = useAttrs()
    const faIcon = ref<IconDefinition>()
    const [style, iconName] = props.icon.split('.')
    import(`@fortawesome/free-${style}-svg-icons`).then(module => {
      if (iconName.substring(0, 2) !== 'fa') {
        faIcon.value = module[`fa${spinalCaseToCamelCase(iconName)}`]
      } else {
        faIcon.value = module[iconName]
      }
    })
    return {
      faIcon,
      attrs
    }
  }
})
</script>
