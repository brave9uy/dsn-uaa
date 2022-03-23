<template>
  <el-dropdown @command="selectLanguage" trigger="click">
    <a class="lang-select-container el-dropdown-link" :style="{ height: `${size}px` }">
      <FontAwesomeIcon :icon="faLanguage" :color="styles.backgroundColor" :style="{ fontSize: `${size}px`}" />
    </a>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="SCN">简体中文</el-dropdown-item>
        <el-dropdown-item command="TCN">繁体中文</el-dropdown-item>
        <el-dropdown-item command="EN">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import styles from '@/assets/css/theme.module.scss'

export default defineComponent({
  props: {
    size: {
      type: Number,
      required: true
    }
  },
  components: {
    FontAwesomeIcon
  },
  setup() {
    const selectLanguage = (language: string) => {
      console.log(language)
    }
    return {
      faLanguage,
      styles,
      selectLanguage
    }
  }
})
</script>
<style scoped lang="scss">
.lang-select-container {
  display: flex;
  :deep(.fa-language) {
    cursor: pointer;
  }
}
</style>
