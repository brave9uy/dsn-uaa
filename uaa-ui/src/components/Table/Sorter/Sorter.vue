<template>
  <div class="sorter-container">
    <FontAwesomeIcon
      :class="{ active: sort?.order === 'ascending' && sort.prop === prop }"
      :icon="faSortUp"
      viewBox="0 0 320 256"
      @click="onSortBtnClick('ascending')"
    />
    <FontAwesomeIcon
      :class="{ active: sort?.order === 'descending' && sort.prop === prop }"
      :icon="faSortDown"
      viewBox="0 256 320 256"
      @click="onSortBtnClick('descending')"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Sort } from './'

export default defineComponent({
  props: {
    sort: {
      type: Object as PropType<Sort>,
      require: true
    },
    prop: {
      type: String,
      require: true
    }
  },
  components: {
    FontAwesomeIcon
  },
  emits: ['click'],
  setup(props, context) {
    const onSortBtnClick = (order: string): void => {
      if (props.prop) {
        context.emit('click', props.prop, order)
      }
    }
    return {
      faSortDown,
      faSortUp,
      onSortBtnClick
    }
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/css/theme.module.scss';
.sorter-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 10px;
  height: 16px;
  right: 0;
  top: 3px;
  > * {
    cursor: pointer;
    color: #c0c4cc;
    &.active {
      color: $activeTextColor;
    }
  }
}
</style>
