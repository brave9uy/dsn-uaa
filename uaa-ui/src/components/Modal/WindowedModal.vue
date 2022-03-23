<template>
  <div class="modal-container">
    <div
      ref="ModalRef"
      class="modal"
      tabindex="-1"
      v-show="modelValue"
    >
      <div class="modal-dialog" :style="{ width, maxWidth, height, maxHeight }">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <FontAwesomeIcon class="btn-close" :icon="faTimes" @click="onClose"/>
          </div>
          <div class="modal-body" @scroll="onScroll">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: String,
    width: {
      type: String,
      default: '50%'
    },
    maxWidth: {
      type: String,
      default: '50%'
    },
    height: {
      type: String,
      default: '80%'
    },
    maxHeight: {
      type: String,
      default: '80%'
    }
  },
  components: {
    FontAwesomeIcon
  },
  emits: [
    'update:modelValue',
    'modal-on-open',
    'modal-on-close',
    'modal-on-scroll'
  ],
  setup(props, context) {
    const ModalRef = ref<null | HTMLElement>()
    const onClose = () => {
      context.emit('update:modelValue', false)
    }
    const left = ref<string>('0px')
    watch(() => props.modelValue, (visible) => {
      if (visible) {
        context.emit('modal-on-open')
      } else {
        context.emit('modal-on-close')
      }
    })
    // 最后一次触发滚动的时间标记
    const lastTime = ref(new Date().getTime())
    const onScroll = (e: Event) => {
      if (new Date().getTime() - lastTime.value > 10) {
        context.emit('modal-on-scroll', e)
        lastTime.value = new Date().getTime()
      }
    }
    return {
      ModalRef,
      faTimes,
      left,
      onClose,
      onScroll
    }
  }
})
</script>
<style scoped lang="scss">
.modal-container {
  position: relative;
  z-index: 1999;
  .modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #00000080;
    display: flex;
    align-items: center;
    justify-content: center;
    .modal-dialog{
      height: 80%;
      position: relative;
      margin: 0 auto;
      box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px 0px;
      box-sizing: border-box;
      background: #ffffff;
      .modal-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        .modal-header {
          padding: 20px 20px 10px;
          position: relative;
          height: 32px;
          .modal-title {
            font-size: 18px;
            color: #303133;
            font-weight: 400;
          }
          .btn-close {
            position: absolute;
            right: 20px;
            top: 20px;
            font-size: 16px;
            color: #909399;
            cursor: pointer;
            &:hover {
              color: #409EFF;
            }
          }
        }
        .modal-body {
          padding: 30px 20px;
          flex: 1;
          overflow-y: auto;
        }
        .modal-footer {
          padding: 10px 20px 20px;
          text-align: right;
        }
      }
    }
  }
}
</style>
