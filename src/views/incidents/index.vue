<template>
  <div>
    <CCard class="mb-4">
      <CCardBody>
        <CFormInput type="text" id="search" v-model="filter.mutation_id" placeholder="Mutation ID"/>
      </CCardBody>
    </CCard>
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
      <CCardBody class="p-0">
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
              <CTableHeaderCell scope="col">No</CTableHeaderCell>
              <CTableHeaderCell scope="col">Created</CTableHeaderCell>
              <!-- <CTableHeaderCell scope="col" v-show="role == 'admin'"
                >Assigned</CTableHeaderCell
              > -->
              <CTableHeaderCell scope="col">Mutation Id</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date Crawl</CTableHeaderCell>
              <CTableHeaderCell scope="col">From</CTableHeaderCell>
              <CTableHeaderCell scope="col">To</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="(item, index) in incidents.data" :key="index">
              <CTableDataCell>
                {{ index + 1 }}
              </CTableDataCell>
              <CTableDataCell v-show="role == 'admin'">
                {{ item.createdAt }}
              </CTableDataCell>
              <CTableDataCell>{{ item.refNumber }}</CTableDataCell>
              <CTableDataCell v-show="role == 'admin'">{{
                item.dateCrawl
              }}</CTableDataCell>
              <CTableDataCell>
                <div class="overflow-auto">
                  {{ item.detailData.account_receiver }}
                </div>
              </CTableDataCell>
              <CTableDataCell v-show="role == 'admin'">
                <div class="overflow-auto">
                  {{ item.detailData.ib.name }}
                </div>
              </CTableDataCell>
              <CTableDataCell>
                <div class="overflow-auto">
                  {{ item.status }}
                </div>
              </CTableDataCell>
              <CTableDataCell
                ><CButton size="sm" class="text-light" color="warning"
                  >Action</CButton
                >
              </CTableDataCell>
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
                :colspan="role === 'admin' ? 8 : 6"
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
  </div>
</template>

<script>
import axios from 'axios'
import { reactive, onMounted, watch, ref } from 'vue'

export default {
  name: 'IncidentsList',
  setup() {
    const incidents = ref([])
    const perPage = ref(100)
    let currentPages= ref(1)
    const role = ref(window.localStorage.getItem('role'))

    const filter = reactive({
      mutation_id: ''
    })

    watch(() => filter.mutation_id, val => {
      loadIncidents()
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

          loadIncidents()
        }
      })

      loadIncidents()
    })

    function loadIncidents() {
      axios
        .get(`${process.env.VUE_APP_URL_API}/incidents`, {
          params: filter,
          headers: {
            Authorization: window.localStorage.getItem('accessToken'),
          },
        })
        .then((result) => {
          incidents.value = result.data
          // totalData.value = result.data.total
        })
        .catch((err) => {
          console.log(err.response)
        })
    }

    function changePg() {
      loadIncidents()
    }

    return {
      incidents,
      perPage,
      currentPages,
      changePg,
      role,
      filter
    }
  },
}
</script>

<style></style>
