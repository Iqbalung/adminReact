<template>
  <teleport to="body">
    <div class="print-page">
      <CRow :xs="{ gutterX: 0 }" v-if="finishLoad">
        <CCol :xs="12" class="mb-2">
          <div class="d-flex align-items-center">
            <img :src="organization.logoUrl" width="100">
            <div class="ms-4">
              <h3 class="fw-bold mb-0">{{ organization.organization_specialist }}</h3>
              <span class="me-1">Tpl. {{ organization.organization_phone }}</span>
              <span>Rek {{ organization.organization_account }}</span>
            </div>
          </div>
        </CCol>
        <CCol>
          <div class="mb-2">
            <b>Bill From</b><br>
            {{ invoice.invoice_bill_from }}
          </div>
          <div class="mb-2">
            <b>Bill To</b><br>
            {{ invoice.invoice_bill_to }}
          </div>
        </CCol>
        <CCol>
          <div class="mb-2">
            <b>Invoice Date</b><br>
            {{ formatDate(invoice.invoice_date) }}
          </div>
          <div class="mb-2">
            <b>Invoice Number</b><br>
            {{ invoice.invoice_number }}
          </div>
        </CCol>
        <CCol :xs="12">
          <CTable class="mb-4">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Item Type</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell>Quantity</CTableHeaderCell>
                <CTableHeaderCell>Subtotal</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(item, key) in invoice.invoice_items" :key="key">
                <CTableDataCell>{{ key + 1 }}</CTableDataCell>
                <CTableDataCell>{{ item.item_name }}</CTableDataCell>
                <CTableDataCell>{{ formatPrice(item.item_price) }}</CTableDataCell>
                <CTableDataCell>{{ item.item_qty }}</CTableDataCell>
                <CTableDataCell>{{ formatPrice(item.item_subtotal) }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCol>
        <CCol :xs="3">
          <div class="d-flex align-items-center justify-content-between">
            <h3 class="fw-bold me-5">Total:</h3>
            <h3 class="fw-bold">{{ formatPrice(invoice.invoice_total) }}</h3>
          </div>
        </CCol>
      </CRow>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import momentTz from 'moment-timezone'

const route = useRoute()
const router = useRouter()
const invoice = ref()
const organization = ref()
const finishLoad = ref(false)

const setInvoice = async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_URL_API}/invoice/${route.params.id}`, {
      headers: {
        Authorization:window.localStorage.getItem('accessToken')
      }
    })

    invoice.value = res.data

    setTimeout(() => {
      window.print()
    }, 1000)

  } catch (err) {
    router.push({ name: 'Invoice' })
  }
}

const setOrganization = async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_URL_API}/organization/${window.localStorage.getItem('organization_id')}`, {
      headers: {
        Authorization:window.localStorage.getItem('accessToken')
      },
    })

    organization.value = res.data
    organization.value.logoUrl = `${process.env.VUE_APP_URL_API}/organization_logo/${organization.value.organization_logo}`
  } catch (err) {
    router.push({ name: 'Invoice' })
  }
}

const formatDate = date => {
  const format = 'DD MMM YYYY HH:mm:ss'

  return momentTz(date).format(format)
}

const formatPrice = price => price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')

const setup = async () => {
  await setInvoice()
  await setOrganization()

  finishLoad.value = true
}

onMounted(() => {
  setup()
})

</script>