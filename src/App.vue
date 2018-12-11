<template>
  <div id="app">
    <router-view v-if="isRouterReload"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isRouterReload: true
    }
  },
  methods: {
    reload () {
      this.isRouterReload = false
      this.$nextTick(function () {
        this.isRouterReload = true
      })
    }
  },
  provide () {
    return {
      reload: this.reload
    }
  }
}
</script>

<style>
</style>
