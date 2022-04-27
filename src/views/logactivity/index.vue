<template>
  <CCard class="mb-4">
    <CCardHeader
      class="bg-white d-flex align-items-center justify-content-between"
    >
      <span>
        Data Found
        <CBadge color="primary">{{
          logactivities.total ? logactivities.total : 0
        }}</CBadge>
      </span>
      <div class="d-flex align-items-center">
        <div>
          <CFormSelect
            :options="['All Process', ...filterTypeOptions]" v-model="filter.process_name">
          </CFormSelect>
        </div>
        <div>
          <CButton @click="refresh" color="primary" class="ms-1">Refresh</CButton>
        </div>
      </div>
    </CCardHeader>
    <CCardBody class="p-0">
      <CTable responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Process Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Message</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody v-if="isLoading">
          <CTableRow>
            <CTableDataCell
              align="middle"
              class="text-center"
              :colspan="4"
              >
                <CSpinner
                  color="primary"
                />
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
        <CTableBody v-else>
          <CTableRow v-for="(item, index) in logactivities.data" :key="index">
            <CTableDataCell>
              {{ index + 1 + (currentPages - 1) * perPage }}
            </CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ formatDate(item.date, false) }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ item.process_name ? item.process_name : '-' }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ item.message }}
              </div>
            </CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableDataCell
              v-show="logactivities.total < 1"
              class="text-center"
              :colspan="role === 'admin' ? 4 : 4"
              >No records found</CTableDataCell
            >
          </CTableRow>
        </CTableBody>
      </CTable>

      <div class="d-flex justify-content-center">
        <b-pagination
          v-model="currentPages"
          :total-rows="logactivities.total"
          :per-page="perPage"
          @click="changePg"
        />
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import axios from 'axios'
import momentTz from 'moment-timezone'
import { reactive, onMounted, watch, ref } from 'vue'

export default {
  name: 'DebtList',
  setup() {
    const logactivities = ref([])
    const perPage = ref(100)
    let currentPages = ref(1)
    const role = ref(window.localStorage.getItem('role'))
    const filter = reactive({
      process_name: ''
    })
    const filterTypeOptions = ref([
      { label: 'Cron Engine', value: 'Cron Engine' },
      { label: 'Process Mutation', value: 'Process Mutation' }
    ])
    const isLoading = ref(true)

    watch(filter, () => {
      startLoading()
      loadLogActivity()
    })

    onMounted(() => {

      var acknowledgedcreate = []

      socket.on('logactivity created', (message) => {
        if (!~acknowledgedcreate.indexOf(message._id)) {
          // add to array of acknowledged events
          acknowledgedcreate.unshift(message._id)

          // prevent array from growing to large
          if (acknowledgedcreate.length > 20) {
            acknowledgedcreate.length = 20
          }

          loadLogActivity(currentPages.value)
        }
      })

      // setInterval(() => loadLogActivity(currentPages.value), 5000)

      loadLogActivity(currentPages.value)
    })

    function loadLogActivity(pages) {
      const skip = pages > 1 ? (pages - 1) * 100 : 0
      const process_name = filterTypeOptions.value.some(options => options.value === filter.process_name) ? filter.process_name : ''

      const params = {
        ...(process_name ? { 'process_name': process_name } : {}),
        '$sort[_id]': -1,
        $skip: skip
      }

      axios
        .get(`${process.env.VUE_APP_URL_API}/logactivity`, {
          headers: {
            Authorization: window.localStorage.getItem('accessToken'),
          },
          params,
        })
        .then((result) => {
          logactivities.value = result.data
          // totalData.value = result.data.total
          stopLoading()
        })
        .catch((err) => {
          console.log(err.response)
        })
    }

    function changePg() {
      startLoading()
      loadLogActivity(currentPages.value)
    }

    function refresh() {
      startLoading()
      loadLogActivity(currentPages.value)
    }

    function startLoading() {
      isLoading.value = true
    }

    function stopLoading() {
      isLoading.value = false
    }

    function formatDate(date, utc = true) {
      const format = 'DD MMM YYYY HH:mm:ss'
      return utc ? momentTz(date).utc().format(format) : momentTz(date).tz('Asia/Jakarta').format(format)
    }

    return {
      changePg,
      loadLogActivity,
      logactivities,
      perPage,
      currentPages,
      role,
      filter,
      filterTypeOptions,
      refresh,
      isLoading,
      formatDate
    }
  },
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>