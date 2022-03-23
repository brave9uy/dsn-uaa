<template>
  <div class="header-container">
    <div class="btn-collapse-group" @click="toggleCollapse">
      <FontAwesomeIcon v-if="isCollapse" class="btn-expand" :icon="faIndent" />
      <FontAwesomeIcon v-else class="btn-fold" :icon="faOutdent" />
    </div>
    <div class="header-content">
      <!-- <LangSelect :size="26" /> -->
      <ProfileDropDown :size="40" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { faIndent, faOutdent } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import LangSelect from '@/components/LanguageSelect.vue'
import ProfileDropDown from '@/views/authorize/user/ProfileDropDown.vue'

export default defineComponent({
  components: {
    // LangSelect,
    ProfileDropDown,
    FontAwesomeIcon
  },
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-collapse'],
  setup(props, context) {
    const toggleCollapse = (): void => {
      context.emit('toggle-collapse', !props.isCollapse)
    }
    return {
      faIndent,
      faOutdent,
      toggleCollapse
    }
  }
})
</script>
<style scoped lang="scss">
@import "@/assets/css/theme.module.scss";
.header-container {
  display: flex;
  width: 100%;
  .btn-collapse-group {
    color: $menuBackgroundColor;
    .btn-expand,
    .btn-fold {
      margin: 10px;
      padding: 5px;
      cursor: pointer;
    }
  }
  .header-content {
    padding: 0 15px;
    flex-grow: 1;
    display: flex;
    text-align: right;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
