<template>
  <div class="icon-set-container">
    <ul v-if="iconFormatter">
      <li
        v-for="(key, i) in keys"
        :key="key"
      >
        <el-card
          :class="{ checked: checked && checkedIcon.label === label && checkedIcon.key === key }"
          @click="onClick(key, icons[i])"
        >
          <DynamicComponent
            v-if="icons[i]"
            :formatter="iconFormatter"
            :iconAttrs="{ icon: icons[i] }"
          />
          <span class="icon-name" @mouseenter="onMouseEnter($event, iconNameGetter(icons[i]))" @mouseleave="onMouseLeave">
            {{ iconNameGetter(icons[i]) }}
          </span>
        </el-card>
      </li>
      <li class="empty-box" v-for="i in 7" :key="i"></li>
    </ul>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue'
import DynamicComponent from '@/components/DynamicComponent.vue'

import { camelCaseToSpinalCase } from '@/utils/helper'
import { IComponent } from '@/components'
import { ISvgIcon } from '.'

export default defineComponent({
  props: {
    label: {
      type: String
    },
    icons: {
      type: Array as PropType<any>,
      default: () => {
        return []
      }
    },
    iconFormatter: {
      type: Function as PropType<(attrs: Record<string, any>) => IComponent | undefined>,
      requried: true
    },
    iconKeyGetter: {
      type: Function as PropType<(icon: any) => string>,
      default: () => {
        return 'undefined'
      }
    },
    iconNameGetter: {
      type: Function as PropType<(icon: any) => string>,
      default: () => {
        return ''
      }
    },
    checked: {
      type: Boolean,
      default: false
    },
    checkedIcon: {
      type: Object as PropType<ISvgIcon>,
      default: () => {
        return {
          label: '',
          iconName: ''
        }
      }
    }
  },
  components: {
    DynamicComponent
  },
  emits: ['icon-click'],
  setup(props, context) {
    const keys = computed<string[]>(() => props.icons.map((icon: any) => props.iconKeyGetter(icon)))
    const onClick = (iconKey: string, icon: any) => {
      context.emit('icon-click', { label: props.label, key: iconKey, name: props.iconNameGetter(icon), icon: icon })
    }
    const tooltip = ref<HTMLElement>()
    const onMouseEnter = (e: MouseEvent, iconName: string) => {
      const iconNameElement = e.target as HTMLElement
      if (iconNameElement.scrollWidth > iconNameElement.clientWidth) {
        tooltip.value = document.createElement('div')
        tooltip.value.className = 'icon-tool-tip'
        tooltip.value.innerHTML = iconName
        tooltip.value.style.setProperty('position', 'absolute')
        tooltip.value.style.setProperty('z-index', '9999')
        tooltip.value.style.setProperty('color', '#ffffff')
        tooltip.value.style.setProperty('background', '#303133')
        tooltip.value.style.setProperty('padding', '8px 15px')
        tooltip.value.style.setProperty('border-radius', '3px')
        tooltip.value.style.setProperty('top', `${iconNameElement.getBoundingClientRect().top - 40}px`)
        tooltip.value.style.setProperty('left', `${iconNameElement.getBoundingClientRect().left - 40}px`)
        document.body.appendChild(tooltip.value)
      }
    }
    const onMouseLeave = () => {
      if (tooltip.value && document.body.contains(tooltip.value)) {
        document.body.removeChild(tooltip.value)
      }
    }
    return {
      keys,
      camelCaseToSpinalCase,
      onClick,
      onMouseEnter,
      onMouseLeave
    }
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/css/theme.module.scss';
.icon-set-container {
  ul {
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    li {
      display: inline-block;
      margin: 10px 5px;
      width: 68px;
      height: 75px;
      cursor: pointer;
      &.empty-box {
        background: red;
        height: 0;
        margin: 0 5px;
      }
      .el-card {
        height: 100%;
        :deep(.el-card__body) {
          height: 100%;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items:center;
          justify-content:center;
        }
        &:hover,
        &.checked {
          color: $activeTextColor;
        }
        &.checked {
          border-color: $activeTextColor;
        }
        .icon-name {
          position: relative;
          margin-top: 8px;
          display: block;
          width: 50px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 6px;
        }
      }
    }
  }
}
</style>
