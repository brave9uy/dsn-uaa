<template>
  <component
    v-if="c"
    :is="c.is"
    v-bind="attributes"
  />
</template>
<script lang="ts">
import { defineComponent, PropType, useAttrs } from 'vue'
import { IComponent } from '.'

export default defineComponent({
  props: {
    formatter: {
      type: Function as PropType<(attrs: Record<string, any>) => IComponent | undefined>,
      required: true
    }
  },
  setup(props) {
    const attrs = useAttrs()
    const c = props.formatter(attrs)
    let attributes = null
    if (c) {
      if (c.attrs && attrs) {
        attributes = Object.assign(c.attrs, attrs)
      } else {
        attributes = c.attrs
      }
    }
    return {
      c,
      attributes
    }
  }
})
</script>
