<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>

<style lang="scss">
@import "@/assets/css/theme.module.scss";
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  height: 100%;
}
</style>
