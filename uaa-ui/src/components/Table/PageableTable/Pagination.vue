<template>
  <div class="pagination-container">
    <ul class="left">
      <li class="page-button">
        <el-button :disabled="currentPage === 1" @click="handlePrevPage">
          <FontAwesomeIcon :icon="faAngleLeft" />
        </el-button>
      </li>
      <li class="page-number">
        <span class="current">{{ currentPage }}</span>
        <span class="separator">/</span>
        <span>{{ pageCount }}</span>
      </li>
      <li  class="page-button">
        <el-button :disabled="currentPage === pageCount" @click="handleNextPage">
          <FontAwesomeIcon :icon="faAngleRight" />
        </el-button>
      </li>
    </ul>
    <ul class="right">
      <li>Page</li>
      <li class="page-text"><el-input v-model="currentPageText" /></li>
      <li class="page-jump"><el-button @click="handlePageJump">Go</el-button></li>
      <li><span>Total {{ totalCount }}</span></li>
    </ul>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default defineComponent({
  components: {
    FontAwesomeIcon
  },
  props: {
    // 当前页数
    currentPage: {
      type: Number,
      default: 1
    },
    // 每页记录数
    pageSize: {
      type: Number,
      require: true
    },
    // 总记录数
    totalCount: {
      type: Number,
      require: true
    }
  },
  emits: [
    'change'
  ],
  setup(props, context) {
    // 当前页数输入
    const currentPageText = ref(props.currentPage)
    // 总页数
    const pageCount = computed(() =>
      props.pageSize && props.totalCount ? Math.floor((props.totalCount + props.pageSize - 1) / props.pageSize) : 1)
    const handlePrevPage = (): void => {
      if (props.currentPage > 1) {
        context.emit('change', props.currentPage - 1)
      }
    }
    const handleNextPage = (): void => {
      if (props.currentPage < pageCount.value) {
        context.emit('change', props.currentPage + 1)
      }
    }
    const handlePageJump = (): void => {
      if (currentPageText.value <= 0) {
        currentPageText.value = 1
      }
      if (currentPageText.value > pageCount.value) {
        currentPageText.value = pageCount.value
      }
      context.emit('change', Number(currentPageText.value))
    }
    watch(() => props.currentPage, (currentPage) => {
      currentPageText.value = currentPage
    })
    return {
      faAngleLeft,
      faAngleRight,
      pageCount,
      currentPageText,
      handlePrevPage,
      handleNextPage,
      handlePageJump
    }
  }
})
</script>
<style scoped lang="scss">
@import '@/assets/css/theme.module.scss';
.pagination-container {
  color: #777;
  background-color: #ffffff;
  overflow-y: hidden;
  ul {
    list-style: none;
    display: inline-block;
    padding-left: 0;
    margin: 10px 0;
    li {
      display: inline;
    }
  }
  .left {
    float: left;
    .el-button {
      border: none;
    }
    .page-number {
      padding: 6px 12px;
      .current {
        color: $activeTextColor;
      }
      .separator {
        margin: 0 5px;
      }
    }
  }
  .right {
    float: right;
    padding: 0 20px;
    .page-text {
      display: inline-block;
      padding-left: 3px;
      padding-right: 3px;
      width: 45px;
      text-align: center;
    }
    .page-jump {
      margin-right: 5px;
      .el-button {
        padding: 6px 12px;
      }
    }
  }
}
</style>
