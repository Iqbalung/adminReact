<template>
<CRow>
  <CCol :xs="4">
    <CWidgetStatsC class="mb-3" :value="success" inverse color="primary" :progress="{ value: 75 }" title="Total Transfer Succeed">
      <template #icon><CIcon icon="cil-credit-card" height="36"/></template>
    </CWidgetStatsC>
  </CCol>
  <CCol :xs="4">
    <CWidgetStatsC class="mb-3" :value="failed" inverse color="warning" :progress="{ value: 75 }" title="Total Transfer Failed">
      <template #icon><CIcon icon="cil-thumb-down" height="36"/></template>
    </CWidgetStatsC>
  </CCol>
  <CCol :xs="4">
    <CWidgetStatsC class="mb-3" :value="duplicate" inverse color="danger" :progress="{ value: 75 }" title="Duplicate Transfers">
      <template #icon><CIcon icon="cil-clone" height="36"/></template>
    </CWidgetStatsC>
  </CCol>
</CRow>
</template>

<script>
export default {
name: 'WidgetsStatsA',
props: ['success','failed', 'duplicate']
}
</script>
