<template>
  <router-view />
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
</style>

<script>
  export default {
    methods: {
      logout() {
        console.log('logout')
      }
    },
    mounted() {
      window.addEventListener('beforeunload', this.logout)
    }
  }
</script>