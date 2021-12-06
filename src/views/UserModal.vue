<template>
  <CModal>
    <CModalHeader>
      <CModalTitle>Modal title</CModalTitle>
    </CModalHeader>
    <CModalBody>Woohoo, you're reading this text in a modal!</CModalBody>
    <CModalFooter>
      <CButton @click="close">Close</CButton>
      <CButton color="primary">Save changes</CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
export default {
  name: 'UserModal',
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>
