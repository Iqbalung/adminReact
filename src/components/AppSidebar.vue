<template>
  <CSidebar
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="
      (event) =>
        $store.commit({
          type: 'updateSidebarVisible',
          value: event,
        })">
    <CSidebarBrand>
      <!-- <CIcon
        custom-class-name="sidebar-brand-full"
        :icon="logoNegative"
        :height="35"
      /> -->
      <span class="sidebar-logo">
        Admin Withdraw
      </span>
      <CIcon
        custom-class-name="sidebar-brand-narrow"
        :icon="sygnet"
        :height="35"
      />
    </CSidebarBrand>
    <AppSidebarNav />
    <!-- <CSidebarToggler
      class="d-none d-lg-flex"
      @click="$store.commit('toggleUnfoldable')"
    /> -->
  </CSidebar>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from '@/assets/brand/logo-negative'
import { sygnet } from '@/assets/brand/sygnet'
export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  setup() {
    const store = useStore()
    return {
      logoNegative,
      sygnet,
      sidebarUnfoldable: computed(() => store.state.sidebarUnfoldable),
      sidebarVisible: computed(() => store.state.sidebarVisible),
    }
  },
}
</script>

<style>
html:not([dir="rtl"]) .sidebar.hide:not(.sidebar-end) {
  --cui-sidebar-width: 5rem;
  margin-left: 0;
}
.sidebar.hide:not(.sidebar-end) ~ * {
  --cui-sidebar-occupy-start: 5rem;
}
.sidebar.hide:not(.sidebar-end) .nav-link {
  justify-content: center;
  text-align: center;
}
.sidebar.hide:not(.sidebar-end) .nav-icon {
  margin: 0 !important;
}
.sidebar.hide:not(.sidebar-end) .sidebar-logo, .sidebar.hide:not(.sidebar-end) .nav-name {
  display: none;
}
</style>