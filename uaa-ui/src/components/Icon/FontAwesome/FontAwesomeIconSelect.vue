<template>
  <div class="icon-name-contanier">
    <div class="icon-style">
      <el-input
        :value="currentIcon?.label"
        disabled
      />
      <span class="dot">·</span>
    </div>
    <el-input
      class="icon-name"
      :value="currentIcon?.name"
      disabled
    />
  </div>
  <div class="icon-button-contanier">
    <el-button
      v-if="!currentIcon"
      type="primary"
      @click="onCurrIconClick"
    >
      选择
    </el-button>
    <div v-else class="btn-remove" @click="onRemoveCurrIcon">
      <FontAwesomeIcon :icon="faTimesCircle" />
    </div>
    <el-card v-if="currentIcon" class="current-icon-box" @click="onCurrIconClick">
      <FontAwesomeIcon v-if="currentIcon" :icon="currentIcon.icon" size="4x" />
    </el-card>
  </div>
  <modal
    v-model="visible"
    width="100%"
    max-width="650px"
    height="630px"
    max-height="630px"
    @modal-on-open="onOpen"
    @modal-on-scroll="onScroll"
  >
    <SvgIconSelect
      ref="IconSelectRef"
      :module-map="moduleMap"
      :icon-formatter="iconFormatter"
      :icon-key-getter="iconKeyGetter"
      :icon-name-getter="iconNameGetter"
      checked
    />
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="success" @click="onConfirm">确认</el-button>
    </template>
  </modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { SvgIconSelect, ISvgIcon } from '@/components/Icon'
import { IconDefinition, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import * as SolidIcons from '@fortawesome/free-solid-svg-icons'
import * as RegularIcons from '@fortawesome/free-regular-svg-icons'
import * as BrandsIcons from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { spinalCaseToCamelCase, Message } from '@/utils/helper'
import { WindowedModal } from '@/components/Modal'

export default defineComponent({
  props: {
    modelValue: {
      type: String
    }
  },
  emits: ['update:modelValue'],
  components: {
    FontAwesomeIcon,
    SvgIconSelect,
    Modal: WindowedModal
  },
  setup(props, context) {
    const visible = ref(false)
    const filterModule = (module: any): { [key: string]: IconDefinition } => {
      const tmpModule: { [key: string]: IconDefinition } = {}
      Object.keys(module).filter(key => {
        if (key !== 'prefix' && key !== module.prefix) {
          tmpModule[key] = module[key]
        }
      })
      return tmpModule
    }
    const moduleMap: { [label: string]: { [key: string]: IconDefinition } } = {
      solid: filterModule(SolidIcons),
      regular: filterModule(RegularIcons),
      brands: filterModule(BrandsIcons)
    }
    const iconFormatter = ({ iconAttrs }: any) => {
      return {
        is: FontAwesomeIcon,
        attrs: {
          icon: iconAttrs.icon
        }
      }
    }
    const iconKeyGetter = (icon: IconDefinition): string => {
      return `fa${spinalCaseToCamelCase(icon.iconName)}`
    }
    const iconNameGetter = (icon: IconDefinition): string => {
      return icon.iconName
    }
    const onConfirm = () => {
      if (IconSelectRef.value && IconSelectRef.value.getCurrentIcon()) {
        currentIcon.value = IconSelectRef.value.getCurrentIcon()
        context.emit('update:modelValue', `${currentIcon.value?.label}.${currentIcon.value?.name}`)
        visible.value = false
      } else {
        Message.error('请选择图标')
      }
    }
    const onCurrIconClick = () => {
      visible.value = true
    }
    const onRemoveCurrIcon = () => {
      currentIcon.value = undefined
      context.emit('update:modelValue', undefined)
    }
    const IconSelectRef = ref<InstanceType<typeof SvgIconSelect>>()
    const currentIcon = ref<ISvgIcon>()
    const iconNameToIcon = (iconName: string): ISvgIcon => {
      const [style, name] = iconName.split('.')
      const key = `fa${spinalCaseToCamelCase(name)}`
      return {
        key,
        label: style,
        name,
        icon: moduleMap[style][key]
      }
    }
    // 根据iconName导入icon，因为是异步，所以需要watch
    watch(() => props.modelValue, () => {
      if (typeof props.modelValue === 'string' && props.modelValue.trim().length > 0) {
        currentIcon.value = iconNameToIcon(props.modelValue)
      }
    })
    const onOpen = () => {
      if (IconSelectRef.value) {
        IconSelectRef.value.setCurrentIcon(currentIcon.value)
      }
    }
    const onScroll = (e: Event) => {
      const modalBody = e.target as HTMLDivElement
      if (modalBody.scrollTop + 457 >=
      modalBody.children[0].clientHeight + modalBody.children[1].clientHeight) {
        IconSelectRef.value && IconSelectRef.value.nextPage()
      }
    }
    return {
      FontAwesomeIcon,
      moduleMap,
      faTimesCircle,
      visible,
      iconFormatter,
      iconKeyGetter,
      iconNameGetter,
      onConfirm,
      onCurrIconClick,
      onRemoveCurrIcon,
      IconSelectRef,
      currentIcon,
      onOpen,
      onScroll
    }
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/css/theme.module.scss';
.icon-name-contanier {
  width: 100%;
  display: flex;
  .icon-style {
    display: inline-block;
    .el-input {
      width: 80px;
      :deep(.el-input__inner) {
        text-align: center;
      }
    }
    .dot {
      display: inline-block;
      width: 15px;
      text-align: center;
    }
  }
  .icon-name {
    flex: 1;
    max-width: 300px;
  }
  .el-input {
    :deep(.el-input__inner) {
      cursor: default;
      background: #ffffff;
      color: #606266;
    }
  }
}
.icon-button-contanier {
  position: relative;
  padding: 15px 7px 0 0;
  .btn-remove {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
  }
  .current-icon-box {
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      color: $activeTextColor;
    }
  }
}
.modal-container {
  :deep(.modal) {
    .modal-dialog {
      .modal-content{
        .modal-body {
          padding-top: 0;
        }
      }
    }
  }
}
</style>
