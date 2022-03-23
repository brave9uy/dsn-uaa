<template>
  <div class="form-item">
    <label class="form-label">{{ label || '' }}</label>
    <div class="form-control">
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    label: {
      type: String,
      require: true
    },
    prop: {
      type: String,
      require: true
    }
  },
  name: 'resp-form-item'
})
</script>
<style scoped lang="scss">
.form-item {
  .form-label {
    width: 100%;
    display: block;
    margin-bottom: 5px;
  }
  .form-control {
    width: 100%;
  }
  & + .form-item {
    margin-top: 20px;
  }
  &:not(.d-block) {
    .form-label {
      @media screen and (min-width: 768px) {
        display: inline-block;
        width: 150px;
        text-align: right;
        margin-bottom: 0;
      }
    }
    .form-control {
      @media screen and (min-width: 768px) {
        display: inline-block;
        width: calc(100% - 166px);
        padding: 0 8px;
      }
    }
  }
  &.compositional {
    .form-control {
      display: inline-flex;
    }
  }
}
</style>
