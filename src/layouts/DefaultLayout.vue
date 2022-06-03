<template>
  <div class="hide-print">
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100 bg-light">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer fluid>
          <router-view />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
<style>
body::-webkit-scrollbar {
  width: 14px;
  /* width of the entire scrollbar */
}

body::-webkit-scrollbar-track {
  background: white;
  /* color of the tracking area */
}

body::-webkit-scrollbar-thumb {
  background-color: black;
  /* color of the scroll thumb */
  border-radius: 20px;
  /* roundness of the scroll thumb */
  border: 3px solid white;
  /* creates padding around scroll thumb */
}
</style>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppFooter,
    AppHeader,
    AppSidebar,
    CContainer,
  },
}
</script>
