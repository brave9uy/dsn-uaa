<template>
  <div class="breadcrumb-container">
    <el-breadcrumb :separator="separator">
      <template v-for="(item, index) in matched" :key="item.name">
        <el-breadcrumb-item>
          <template v-if="item.meta.accessible && index < matched.length - 1">
            <router-link class="breadcrumb-link" :to="item.path">{{ item.meta.title }}</router-link>
          </template>
          <template v-else>{{ item.meta.title }}</template>
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { RouteLocationMatched, useRouter } from 'vue-router'

export default defineComponent({
  props: {
    separator: {
      type: String,
      default: '/'
    }
  },
  setup() {
    const router = useRouter()
    const matched =
      computed<RouteLocationMatched[]>(() =>
        router.currentRoute.value.matched.filter(m => m.name !== 'root' && m.meta && m.meta.title !== undefined))
    return {
      matched
    }
  }
})
</script>
<style scoped lang="scss">
@import "@/assets/css/theme.module.scss";
.breadcrumb-container {
  padding: 12px 15px;
  .breadcrumb-link {
    font-weight: 400;
    color: #606266;
    &:hover {
      color: $activeTextColor;
    }
  }
}
</style>
