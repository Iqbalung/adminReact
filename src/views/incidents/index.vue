<template>
  <CCard class="mb-4">
    <CCardHeader
      class="bg-white d-flex align-items-center justify-content-between"
    >
      <span>
        Data Found
        <CBadge color="primary">{{
          incidents.total ? incidents.total : 0
        }}</CBadge>
      </span>
      <div v-if="role === 'admin'">
        <CFormInput
          type="text"
          id="search"
          v-model="searchFilter"
          placeholder="Receiver"
        />
        <!-- <CButton
          size="sm"
          color="success"
          class="me-1"
          @click="
            () => {
              modalAssign = true
            }
          "
          >Assign Task</CButton
        >
        <CButton
          size="sm"
          color="secondary"
          class="me-1"
          @click="showClearAssign(clearAssign)"
          >Unassign</CButton
        >
        <CButton size="sm" color="danger" class="me-1">Process Reject</CButton>
        <CButton
          size="sm"
          color="warning"
          @click="showRequestReject(requestRejectBatch)"
          >Request Reject</CButton
        > -->
      </div>
      <!-- <CDropdown color="light">
        <CDropdownToggle color="dark">{{
          filterListActive.label
        }}</CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem
            component="button"
            v-for="(filter, key) in filterLists"
            @click="filterSelect(filter)"
            >{{ filter.label }}</CDropdownItem
          >
        </CDropdownMenu>
      </CDropdown> -->
    </CCardHeader>
    <CCardBody class="p-0 incident-table">
      <CTable responsive>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell scope="col" v-if="role === 'admin'">
              <input
                type="checkbox"
                @change="(e) => shiftAll(e.target.checked)"
                v-model="shift"
                :disabled="filterListActive.value === 'done'"
              />
            </CTableHeaderCell> -->
            <CTableHeaderCell class="nowrap" scope="col">No</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col" v-show="role == 'admin'">Created</CTableHeaderCell>
            <!-- <CTableHeaderCell class="nowrap" scope="col" v-show="role == 'admin'"
              >Assigned</CTableHeaderCell
            > -->
            <CTableHeaderCell class="nowrap" scope="col">RefNumber</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col" v-show="role == 'admin'">Date Crawl</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">From</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col" v-show="role == 'admin'">To</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">Status</CTableHeaderCell>
            <!-- <CTableHeaderCell scope="col">Action</CTableHeaderCell> -->
          </CTableRow>
        </CTableHead>
        <CTableBody v-if="isLoading">
          <CTableRow>
            <CTableDataCell
              align="middle"
              class="text-center"
              :colspan="role === 'admin' ? 7 : 4"
              >
                <CSpinner
                  color="primary"
                />
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
        <CTableBody v-else>
          <CTableRow v-for="(item, index) in incidents.data" :key="index">
            <CTableDataCell classs="nowrap">
              {{ index + 1 + (currentPages - 1) * perPage }}
            </CTableDataCell>
            <CTableDataCell classs="nowrap" v-show="role == 'admin'">
              {{ formatDate(item.createdAt) }}
            </CTableDataCell>
            <CTableDataCell classs="nowrap">{{ item.refNumber }}</CTableDataCell>
            <CTableDataCell classs="nowrap" v-show="role == 'admin'">
              {{ formatDate(item.dateCrawl) }}
            </CTableDataCell>
            <CTableDataCell classs="nowrap">
              {{ item.detailData.ib.name }}
            </CTableDataCell>
            <CTableDataCell classs="nowrap" v-show="role == 'admin'">
              {{ item.detailData.account_receiver }}
            </CTableDataCell>
            <CTableDataCell classs="nowrap">
              {{ item.status }}
            </CTableDataCell>
            <!-- <CTableDataCell
              ><CButton size="sm" class="text-light" color="warning"
                >Action</CButton
              >
            </CTableDataCell> -->
            <!-- <CTableDataCell>
              <CButton
                size="sm"
                class="text-primary"
                variant="ghost"
                color="light"
                :disabled="item.taskStatus === 'processed'"
                @click="
                  processTask(
                    item.taskData.account_number,
                    item.taskData.anRekening,
                    item.taskData.amount,
                    item.taskData.mutation_id,
                    item.taskData.bank_type,
                    item._id,
                    item.taskAssigne,
                    item.taskTittle,
                    item.taskRefNumber,
                    item.taskExpiredTime,
                    item.taskCreatedBy,
                    item.taskStatus,
                    item.taskHistory,
                  )
                "
              >
                Detail
              </CButton>
              <CButton
                size="sm"
                class="text-danger"
                variant="ghost"
                color="light"
                @click="showRequestReject(requestReject, item)"
                v-if="role !== 'admin' && item.status !== 'request_reject'"
              >
                Request Reject
              </CButton>
            </CTableDataCell> -->
          </CTableRow>
          <CTableRow>
            <CTableDataCell
              v-show="incidents.total < 1"
              class="text-center"
              :colspan="role === 'admin' ? 7 : 4"
              >No records found</CTableDataCell
            >
          </CTableRow>
        </CTableBody>
      </CTable>

      <div class="d-flex justify-content-center">
        <b-pagination
          v-model="currentPages"
          :total-rows="incidents.total"
          :per-page="perPage"
          @click="changePg"
        />
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import axios from 'axios'
import { reactive, onMounted, watch, ref } from 'vue'
import momentTz from 'moment-timezone'

export default {
  name: 'IncidentsList',
  setup() {
    let searchFilter = ref('')
    const incidents = ref([])
    const perPage = ref(100)
    let currentPages = ref(1)
    const role = ref(window.localStorage.getItem('role'))
    const isLoading = ref(true)

    watch(searchFilter, value => {
      loadIncidents(currentPages.value, searchFilter.value)
    })

    onMounted(() => {
      var acknowledgedcreate = []

      socket.on('incidents created', (message) => {
        if (!~acknowledgedcreate.indexOf(message._id)) {
          // add to array of acknowledged events
          acknowledgedcreate.unshift(message._id)

          // prevent array from growing to large
          if (acknowledgedcreate.length > 20) {
            acknowledgedcreate.length = 20
          }

          loadIncidents(currentPages.value, searchFilter.value)
        }
      })

      loadIncidents(currentPages.value, searchFilter.value)
    })

    function loadIncidents(pages, searchTitle) {
      const skip = pages > 1 ? (pages - 1) * 100 : 0

      const params = {
        '$sort[_id]': -1,
        $skip: skip,
        'detailData.account_receiver': searchTitle,
      }

      console.log(params)

      axios
        .get(`${process.env.VUE_APP_URL_API}/incidents`, {
          params: {
            organization_id: window.localStorage.getItem('organization_id')
          },
          headers: {
            Authorization: window.localStorage.getItem('accessToken'),
          },
          params,
        })
        .then((result) => {
          incidents.value = result.data

          stopLoading()
          // totalData.value = result.data.total
        })
        .catch((err) => {
          console.log(err.response)
        })
    }

    function changePg() {
      loadIncidents(currentPages.value, searchFilter.value)
    }

    function formatDate(date) {
      return momentTz(date).tz('Asia/Jakarta').format('DD MMM YYYY HH:mm:ss')
    }

    function startLoading() {
      isLoading.value = true
    }

    function stopLoading() {
      isLoading.value = false
    }

    return {
      searchFilter,
      changePg,
      loadIncidents,
      incidents,
      perPage,
      currentPages,
      role,
      formatDate,
      isLoading
    }
  },
}
</script>

<style>
.incident-table .table-responsive {
  display: block;
  max-height: 500px;
  overflow: auto;
}
.incident-table th {
  background-color: white;
  position: sticky;
  top: 0;
}
.incident-table th::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  width: 100%;
  border-bottom: 2px solid currentColor;
}
.incident-table tbody {
  border-top: none !important;
}
</style>