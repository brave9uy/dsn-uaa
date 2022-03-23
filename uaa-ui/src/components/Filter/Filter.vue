<template>
  <div v-if="defaultSlots && defaultSlots.length > 0" ref="Filter" class="filter-container">
    <el-row>
      <component
        v-for="(slot, index) in defaultSlots"
        :key="index"
        :is="slot"
        :ref="setItemRef"
        :span="filterSpan"
        :class="{ hidden: slotHidden(index) }"
        @update="handleFilterItemUpdate"
        @trigger-search="handleSearch"
      />
      <el-col
        class="filter-item padding-item"
        :class="{ hidden: blankItemHidden(0) }"
        :span="filterSpan"
      ></el-col>
      <el-col
        class="filter-item padding-item"
        :class="{ hidden: blankItemHidden(1) }"
        :span="filterSpan"
      ></el-col>
      <el-col
        class="filter-item button-item"
        :class="{ 'column-direction': filterSpan && filterSpan > 8 }"
        :span="filterSpan"
        style="text-align: right;"
      >
        <div class="filter-item-label">
          <label></label>
        </div>
        <div class="filter-item-control">
          <el-button size="small" @click="handleReset">重置</el-button>
          <el-button size="small" type="primary" @click="handleSearch">查询</el-button>
          <a v-if="collapsible && collaspe && !collaspeBtnHidden" @click="handleCollapse">
            展开
            <FontAwesomeIcon :icon="faAngleDown" />
          </a>
          <a v-else-if="collapsible && !collaspe && !collaspeBtnHidden" @click="handleCollapse">
            收起
            <FontAwesomeIcon :icon="faAngleUp" />
          </a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, RendererElement, RendererNode, VNode, watch } from 'vue'

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { useDocumentWidthObtainment } from '@/hooks/useDocumentWidth'

export default defineComponent({
  components: {
    FontAwesomeIcon
  },
  props: {
    collapsible: {
      type: Boolean,
      default: true
    },
    span: {
      type: Number,
      require: true
    }
  },
  emits: [
    'search',
    'reset'
  ],
  setup(props, context) {
    // 整个组件
    const Filter = ref()
    const filterData = ref<{ [key: string]: any; }>({})
    // 保存插槽组件
    const itemRefs = ref<any[]>([])
    const setItemRef = (el: any) => {
      if (el && itemRefs.value.indexOf(el) === -1) {
        itemRefs.value.push(el)
      }
    }
    // 每个组件宽度占位
    const filterSpan = ref(8)
    onMounted(() => {
      if (props.span !== undefined) {
        filterSpan.value = props.span
      }
    })
    // filter组件的宽度
    const width = useDocumentWidthObtainment(Filter)
    const changeFilterSpanByWidth = (width: number) => {
      if (props.span === undefined) {
        if (width < 550) {
          filterSpan.value = 24
        } else if (width < 840) {
          filterSpan.value = 12
        } else {
          filterSpan.value = 8
        }
      }
    }
    changeFilterSpanByWidth(width.value)
    watch(() => width.value, (w) => {
      changeFilterSpanByWidth(w)
    })
    // 传入filter组件的插槽
    const defaultSlots = ref<VNode<RendererNode, RendererElement, { [key: string]: any; }>[]>()
    if (context.slots && context.slots.default) {
      defaultSlots.value = context.slots.default()
    }
    // filter组件是否展开(否)
    const collaspe = ref(true)
    const handleCollapse = (): void => {
      collaspe.value = !collaspe.value
    }
    const collaspeBtnHidden = computed<boolean>(() => {
      if (!defaultSlots.value || defaultSlots.value.length < 2) {
        return true
      } else {
        if (filterSpan.value === 8) {
          return defaultSlots.value.length === 2
        } else {
          return false
        }
      }
    })
    // filter的控件是否隐藏
    const slotHidden = (index: number): boolean => {
      if (props.collapsible && collaspe.value) {
        if (index === 0) {
          return false
        } else {
          if (filterSpan.value === 8 && index === 1) {
            return false
          } else {
            return true
          }
        }
      } else {
        return false
      }
    }
    // filter的空白控件是否隐藏，空白控件用来使按钮永远居右
    const blankItemHidden = (index: number): boolean => {
      if (!defaultSlots.value || defaultSlots.value.length === 0) {
        return true
      }
      if (collaspe.value || defaultSlots.value.length === 1) {
        return true
      } else {
        // 展开情况
        if (filterSpan.value === 8) {
          // 1. 每列3个, 只有2个控件，直接隐藏两个空白控件
          if (defaultSlots.value.length === 2) {
            return true
          }
          // 1.1 如果插槽传入的控件，能被3整除，2个都不隐藏
          if (defaultSlots.value.length % 3 === 0) {
            return false
          } else {
            if (defaultSlots.value.length % 3 === 1) {
              // 1.2 如果多处1个，隐藏第2个空白控件
              if (index > 0) {
                return true
              } else {
                return false
              }
            } else {
              // 1.3 如果多出2个，两个空白控件都隐藏
              return true
            }
          }
        } else if (filterSpan.value === 12) {
          // 2. 每列2个, 第二个空白控件必须隐藏
          if (index > 0) {
            return true
          }
          // 2.1 如果插槽传入的控件，不是偶数，那么第1个空白控件也不需要，刚好排列整齐
          if (defaultSlots.value.length % 2 !== 0) {
            return true
          } else {
            return false
          }
        } else {
          // 3. 每列1个，空白控件隐藏
          return true
        }
      }
    }
    // 组件输入更新
    const handleFilterItemUpdate = (prop: string, data: any) => {
      filterData.value[prop] = data
    }
    // 重置方法
    const handleReset = () => {
      itemRefs.value.forEach(item => {
        item.clearData()
      })
      context.emit('reset')
    }
    // 查询方法
    const handleSearch = () => {
      context.emit('search', filterData.value)
    }
    return {
      Filter,
      filterData,
      setItemRef,
      filterSpan,
      defaultSlots,
      faAngleDown,
      faAngleUp,
      collaspe,
      handleCollapse,
      slotHidden,
      blankItemHidden,
      collaspeBtnHidden,
      handleFilterItemUpdate,
      handleReset,
      handleSearch
    }
  }
})
</script>
<style scoped lang="scss">
@import "./filter.module.scss";

.filter-container {
  background: #ffffff;
  margin-bottom: 20px;
  padding: 24px 24px 0;
  .filter-item {
    &.button-item:not(.column-direction) {
      .filter-item-label {
        flex: 0;
      }
    }
    .filter-item-control {
      a {
        margin-left: 10px;
        font-size: 14px;
        padding: 9px 7px;
        color: #1890ff;
        cursor: pointer;
      }
    }
  }
}
</style>
