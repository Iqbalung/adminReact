<template>
<CRow>
  <CCol :xs="4">
    <CWidgetStatsF color="primary" :padding="false" title="Transaction Success" value="$1.999,50">
      <template #icon>
        <CIcon icon="cil-settings" size="xl"/>
      </template>
    </CWidgetStatsF>
  </CCol>
  <CCol :xs="4">
    <CWidgetStatsF color="info" :padding="false" title="Average Sla" value="$1.999,50">
      <template #icon>
        <CIcon icon="cil-settings" size="xl"/>
      </template>
    </CWidgetStatsF>
  </CCol>
  <CCol :xs="4">
    <CWidgetStatsF color="warning" :padding="false" title="Worker" value="$1.999,50">
      <template #icon>
        <CIcon icon="cil-settings" size="xl"/>
      </template>
    </CWidgetStatsF>
  </CCol>
</CRow>
</template>

<script>
export default {
name: 'WidgetsStatsA',
}
</script>

<style>

</style>
