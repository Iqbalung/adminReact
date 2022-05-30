<template>
  <CCard class="mb-3" v-if="role === 'admin'">
    <CCardBody>
      <div class="row gx-2">
        <div class="col">
          <Datepicker v-model="dateFilter" range @closed="pickDate" :enableTimePicker="false"></Datepicker>
        </div>
        <div class="col">
          <MultiSelect :options="bankOptions" placeholder="Bank" v-model="bankFilter" searchable @open="getBanks" />
        </div>
        <div class="col">
          <CFormInput
            type="text"
            id="search"
            v-model="searchFilter"
            placeholder="Receiver"
          />
        </div>
      </div>
    </CCardBody>
  </CCard>

  <CCard class="mb-4">
    <CCardHeader
      class="bg-white d-flex align-items-center justify-content-between"
    >
      <span>
        Data Found
        <CBadge color="primary">{{
          debt.total ? debt.total : 0
        }}</CBadge>
      </span>
      <div>
        <CButton size="sm" color="primary" class="me-2" @click="exportDebt(exportDebtFeedback)">Export Debt</CButton>
        <CButton size="sm" color="success" @click="openRequestRecon">Request Recon</CButton>
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
    <CCardBody class="p-0 debt-table">
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
            <!-- <CTableHeaderCell class="nowrap" scope="col" v-show="role == 'admin'"
              >Assigned</CTableHeaderCell
            > -->
            <CTableHeaderCell class="nowrap" scope="col" v-show="role == 'admin'">Amount</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">From</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col" v-show="role == 'admin'">To</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">Trx Type</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">Saldo</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">User Id Task</CTableHeaderCell>
            <CTableHeaderCell class="nowrap" scope="col">Updated At</CTableHeaderCell>
            <!-- <CTableHeaderCell scope="col">Action</CTableHeaderCell> -->
          </CTableRow>
        </CTableHead>
        <CTableBody v-if="isLoading">
          <CTableRow>
            <CTableDataCell
              align="middle"
              class="text-center"
              :colspan="role === 'admin' ? 9 : 7"
              >
                <CSpinner
                  color="primary"
                />
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
        <CTableBody v-else>
          <CTableRow
            v-for="(item, index) in debt.data"
            :key="index"
            :color="
              item.trxType == 'CR' ? 'warning' : !item.status ? 'danger' : ''
            "
          >
            <CTableDataCell>
              {{ index + 1 + (currentPages - 1) * perPage }}
            </CTableDataCell>
            <CTableDataCell v-show="role == 'admin'">
              <div class="nowrap">
                {{
                  item.amount
                    ? 'Rp. ' +
                      item.amount
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                    : 'Rp. -'
                }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="nowrap">
                {{ item.ib.name }}
              </div>
            </CTableDataCell>
            <CTableDataCell v-show="role == 'admin'">
              <div class="nowrap">
                {{ item.account_receiver ? item.account_receiver : '-' }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ item.trxType ? item.trxType : '-' }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="nowrap">
                {{
                  item.latestBalance
                    ? 'Rp. ' +
                      item.latestBalance
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                    : 'Rp. -'
                }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ item.status ? item.status : '-' }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              {{ item.idUser?.substring(0, item.idUser.indexOf('\n')) }}
            </CTableDataCell>
            <CTableDataCell>
              <div class="nowrap">
                {{ item.date_crawl ? formatDate(item.date_crawl) : '-' }}
              </div>
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
              v-show="debt.total < 1"
              class="text-center"
              :colspan="role === 'admin' ? 9 : 7"
              >No records found</CTableDataCell
            >
          </CTableRow>
        </CTableBody>
      </CTable>

      <div class="d-flex justify-content-center">
        <b-pagination
          v-model="currentPages"
          :total-rows="debt.total"
          :per-page="perPage"
          @click="changePg"
        />
      </div>
    </CCardBody>
  </CCard>

  <CModal :visible="visibleRequestRecon" @close="() => { visibleRequestRecon = false }">
    <CModalHeader>
      <CModalTitle>Request Reconciliation</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <form v-on:submit.prevent="requestRecon(requestReconFeedback)">
        <div class="mb-3">
          <label class="form-label">Reconciliation Date</label>
          <Datepicker placeholder="Reconciliation Date" :enableTimePicker="false" v-model="reconDate" />
        </div>
        <CButton color="primary">Request Recon</CButton>
      </form>
    </CModalBody>
  </CModal>
</template>

<script>
import axios from 'axios'
import { reactive, onMounted, watch, ref } from 'vue'
import MultiSelect from '@vueform/multiselect'
import VueSweetalert2 from 'vue-sweetalert2'
import XLSX from 'xlsx'
import momentTz from 'moment-timezone'

export default {
  name: 'DebtList',
  components: { MultiSelect },
  methods: {
    exportDebtFeedback() {
      this.$swal({
        title:'Debt Exported',
        icon:'success'
      })
    },
    requestReconFeedback() {
      this.$swal({
        title:'Request Recon Created',
        icon:'success'
      })
    }
  },
  setup() {
    let searchFilter = ref('')
    const debt = ref([])
    const perPage = ref(100)
    let currentPages = ref(1)
    const role = ref(window.localStorage.getItem('role'))
    const bankOptions = ref([]);
    const bankFilter = ref('')
    const dateFilter = ref()
    const isLoading = ref(true)
    const visibleRequestRecon = ref(false)
    const reconDate = ref(new Date)

    watch(searchFilter, value => {
      loadDebt(currentPages.value, searchFilter.value)
    })

    watch(dateFilter, value => loadDebt(currentPages.value, searchFilter.value))

    watch(bankFilter, value => loadDebt(currentPages.value, searchFilter.value))

    onMounted(() => {
      // date
      const startDate = new Date(new Date().setDate(new Date().getDate() - 1));
      const endDate = new Date();

      dateFilter.value = [startDate, endDate];

      var acknowledgedcreate = []

      socket.on('debt created', (message) => {
        if (!~acknowledgedcreate.indexOf(message._id)) {
          // add to array of acknowledged events
          acknowledgedcreate.unshift(message._id)

          // prevent array from growing to large
          if (acknowledgedcreate.length > 20) {
            acknowledgedcreate.length = 20
          }

          loadDebt(currentPages.value, searchFilter.value)
        }
      })

      loadDebt(currentPages.value, searchFilter.value)
    })

    function loadDebt(pages, searchTitle) {
      const skip = pages > 1 ? (pages - 1) * 100 : 0

      const params = {
        '$sort[_id]': -1,
        $skip: skip,
        account_receiver: searchTitle,
        ...(dateFilter.value ? { 'date_crawl[$gte]': new Date(dateFilter.value[0].toISOString().substring(0, 10) + 'T00:00:00') } : {}),
        ...(dateFilter.value ? { 'date_crawl[$lte]': new Date(dateFilter.value[1].toISOString().substring(0, 10) + 'T23:59:59') } : {}),
        ...(bankFilter.value ? { 'ib.username': bankFilter.value } : {})
      }

      axios
        .get(`${process.env.VUE_APP_URL_API}/debt`, {
          headers: {
            Authorization: window.localStorage.getItem('accessToken'),
          },
          params,
        })
        .then((result) => {
          debt.value = result.data
          // totalData.value = result.data.total
          stopLoading()
        })
        .catch((err) => {
          console.log(err.response)
        })
    }

    function changePg() {
      loadDebt(currentPages.value, searchFilter.value)
    }

    function getBanks() {
      axios.get(`${process.env.VUE_APP_URL_API}/bank`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then(results => results.data.data.map(result => result.username)).then(results => {
        bankOptions.value = results
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    function exportDebt(cb) {
      const worksheet = XLSX.utils.json_to_sheet(debt.value.data)
      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(workbook, worksheet, "Debt");

      XLSX.writeFile(workbook, "debt.xlsx");

      cb()
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

    function openRequestRecon() {
      visibleRequestRecon.value = true
    }

    async function requestRecon(cb) {
      try {
        await axios.post(`${process.env.VUE_APP_URL_API}/jobrecon`, {
          date: momentTz(reconDate.value).format('YYYY-MM-DD')
        }, {
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        })

        visibleRequestRecon.value = false
        cb()
      } catch (err) {
        console.log(err)
      }
    }

    return {
      searchFilter,
      changePg,
      loadDebt,
      debt,
      perPage,
      currentPages,
      role,
      bankOptions,
      bankFilter,
      getBanks,
      dateFilter,
      exportDebt,
      formatDate,
      isLoading,
      requestRecon,
      openRequestRecon,
      visibleRequestRecon,
      reconDate,
    }
  },
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>
.nowrap {
  white-space: nowrap;
}
.debt-table .table-responsive {
  display: block;
  max-height: 500px;
  overflow: auto;
}
.debt-table th {
  background-color: white;
  position: sticky;
  top: 0;
}
.debt-table th::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  width: 100%;
  border-bottom: 2px solid currentColor;
}
.debt-table tbody {
  border-top: none !important;
}
</style>