<template>
  <Filter :span="12" @search="onSearch" @reset="onSearch({})">
    <Name prop="iconName" placeholder="Icon Name"/>
  </Filter>
  <el-tabs
    v-if="labels.length > 1"
    v-model="activePane"
    class="font-tabs"
    type="border-card"
  >
    <el-tab-pane v-for="label in labels" :key="label" :label="label" :name="label">
      <SvgIconSet
        :label="label"
        :icons="displayModuleMap[label]"
        :icon-formatter="iconFormatter"
        :icon-key-getter="iconKeyGetter"
        :icon-name-getter="iconNameGetter"
        :checked="checked"
        :checked-icon="currentIcon"
        @icon-click="onIconClick"
      />
    </el-tab-pane>
  </el-tabs>
  <SvgIconSet v-if="labels.length === 1"
    :label="labels[0]"
    :icons="displayModuleMap[labels[0]]"
    :icon-formatter="iconFormatter"
    :icon-key-getter="iconKeyGetter"
    :icon-name-getter="iconNameGetter"
    :checked="checked"
    :checked-icon="currentIcon"
    @icon-click="onIconClick"
  />
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue'
import SvgIconSet from './SvgIconSet.vue'
import Filter, { Name } from '@/components/Filter'
import { IComponent } from '@/components'
import { ISvgIcon } from '.'

export default defineComponent({
  components: {
    SvgIconSet,
    Filter,
    Name
  },
  props: {
    moduleMap: {
      type: Object as PropType<{ [label: string]: any }>,
      default: () => {
        return {}
      }
    },
    iconFormatter: {
      type: Function as PropType<(attrs: Record<string, any>) => IComponent | undefined>,
      requried: true
    },
    iconKeyGetter: {
      type: Function as PropType<(icon: any) => string>,
      requried: true
    },
    iconNameGetter: {
      type: Function as PropType<(icon: any) => string>,
      requried: true
    },
    pageSize: {
      type: Number,
      default: 42
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  emits: ['icon-click'],
  setup(props, context) {
    const moduleIndexMap = ref<{ [label: string]: string[] }>({})
    const labels = computed<string[]>(() => Object.keys(props.moduleMap))
    const initModuleIndexMap = () => {
      labels.value.forEach(label => {
        moduleIndexMap.value[label] = Object.keys(props.moduleMap[label])
      })
    }
    const filterModuleMap = (iconName: string) => {
      const pattern = RegExp(iconName, 'i')
      labels.value.forEach(label => {
        displayModuleMap.value[label] = []
        moduleIndexMap.value[label] = Object.keys(props.moduleMap[label]).filter(key => pattern.test(key))
        currentPageMap.value[label] = 1
        refreshPage(label)
      })
    }
    const displayModuleMap = ref<{ [label: string]: any }>({})
    const currentPageMap = ref<{ [label: string]: number }>({})
    const activePane = ref('')
    const nextPage = (label: string | undefined = undefined) => {
      if (label === undefined) {
        label = activePane.value
      }
      const startIndex = (currentPageMap.value[label] - 1) * props.pageSize
      if (startIndex < moduleIndexMap.value[label].length) {
        currentPageMap.value[label]++
        refreshPage(label)
      }
    }
    const refreshPage = (label: string) => {
      const module = props.moduleMap[label]
      const iconKeys = moduleIndexMap.value[label]
      const startIndex = (currentPageMap.value[label] - 1) * props.pageSize
      for (let i = startIndex; i < startIndex + props.pageSize && i < iconKeys.length; i++) {
        if (!Array.isArray(displayModuleMap.value[label])) {
          displayModuleMap.value[label] = []
        }
        displayModuleMap.value[label].push(module[iconKeys[i]])
      }
    }
    onMounted(() => {
      initModuleIndexMap()
      labels.value.forEach(label => {
        currentPageMap.value[label] = 1
        refreshPage(label)
      })
      activePane.value = labels.value[0]
    })
    const onSearch = (filterData: { [key: string]: any }) => {
      if (filterData && filterData.iconName) {
        filterModuleMap(filterData.iconName)
      } else {
        filterModuleMap('')
      }
    }
    const currentIcon = ref<ISvgIcon>()
    const setCurrentIcon = (icon: ISvgIcon | undefined) => {
      currentIcon.value = icon
    }
    const getCurrentIcon = (): ISvgIcon | undefined => {
      return currentIcon.value
    }
    const onIconClick = (icon: ISvgIcon) => {
      currentIcon.value = icon
      context.emit('icon-click', icon)
    }
    return {
      activePane,
      labels,
      displayModuleMap,
      onSearch,
      onIconClick,
      currentIcon,
      setCurrentIcon,
      getCurrentIcon,
      nextPage
    }
  }
})
</script>
