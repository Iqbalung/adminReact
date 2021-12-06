<template>
  <div>
    <CModal
      class="show d-block position-static"
      :backdrop="false"
      :keyboard="false"
      :visible="isVisible"
    >
      <CModalHeader :close-button="false"> </CModalHeader>
      <CModalBody><slot name="body" /></CModalBody>
    </CModal>
  </div>
</template>

<script>
import { CModal } from '@coreui/vue'
export default {
  name: 'Ramodal',
  props: ['isVisible'],
  components: {
    CModal,
  },
}
</script>

<style>
</style>
