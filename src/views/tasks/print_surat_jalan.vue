<template>
  <teleport to="body">
    <div class="print-page">
      <div v-if="finishLoad">
        <CRow :class="{ 'page-break-before': key !== 0 }" :xs="{ gutterX: 0 }" v-for="(task, key) in tasks" :key="key">
          <CCol :xs="12" class="mb-2">
            <div class="d-flex align-items-center">
              <img :src="organization.logoUrl" width="100">
              <div class="ms-4">
                <h3 class="fw-bold mb-0">{{ organization.organization_specialist }}</h3>
                <span class="me-1">{{ organization.organization_phone }}</span>
                <span>{{ organization.organization_account }}</span>
              </div>
            </div>
          </CCol>
          <CCol :xs="12" class="mb-4">
            <CRow :xs="{ gutterX: 0 }">
              <CCol :xs="3">
                <b>Ref Number</b>
              </CCol>
              <CCol :xs="1">
                :
              </CCol>
              <CCol :xs="8">
                {{ task.taskRefNumber }}
              </CCol>
            </CRow>
            <CRow :xs="{ gutterX: 0 }">
              <CCol :xs="3">
                <b>Nama Gedung</b>
              </CCol>
              <CCol :xs="1">
                :
              </CCol>
              <CCol :xs="8">
                {{ task.taskTittle }}
              </CCol>
            </CRow>
            <CRow :xs="{ gutterX: 0 }">
              <CCol :xs="3">
                <b>Dikerjakan tanggal</b>
              </CCol>
              <CCol :xs="1">
                :
              </CCol>
              <CCol :xs="8">
                {{ formatDate(task.createdAt) }}
              </CCol>
            </CRow>
          </CCol>
          <CCol :xs="12">
            <CTable class="mb-4" bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No Unit</CTableHeaderCell>
                  <CTableHeaderCell>Merk/Type</CTableHeaderCell>
                  <CTableHeaderCell>Model</CTableHeaderCell>
                  <CTableHeaderCell>Keterangan</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="key in 20" :key="key">
                  <CTableDataCell class="p-3"></CTableDataCell>
                  <CTableDataCell class="p-3"></CTableDataCell>
                  <CTableDataCell class="p-3"></CTableDataCell>
                  <CTableDataCell class="p-3"></CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>
          <CCol :xs="12">
            <CRow class="mt-2" :xs="{ gutterX: 0 }">
              <CCol class="text-center">
                <span class="d-block mb-5">Mengetahui</span>
                <span>(..................................................)</span>
              </CCol>
              <CCol class="text-center">
                <span class="d-block mb-5">Yang Mengerjakan</span>
                <span>(..................................................)</span>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </div>
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

const tasks = ref([])
const organization = ref([])
const finishLoad = ref(false)

const setTasks = async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_URL_API}/tasks`, {
      params: {
        '_id[$in]': route.query.items 
      },
      headers: {
        Authorization:window.localStorage.getItem('accessToken')
      },
    })

    if (res.data.total < 1) {
      router.push({ name: 'Tasks' })
    }

    tasks.value = res.data.data

    setTimeout(() => {
      window.print()
    }, 1000)
  } catch (err) {
    router.push({ name: 'Tasks' })
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
    router.push({ name: 'Tasks' })
  }
}

const formatDate = date => {
  const format = 'DD MMM YYYY HH:mm:ss'

  return momentTz(date).format(format)
}

const setup = async () => {
  await setTasks()
  await setOrganization()

  finishLoad.value = true
}

onMounted(() => {
  setup()  
})
</script>
