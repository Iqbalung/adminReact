<template>
  <CCard class="mb-4">
    <CCardBody>
      <div class="row gx-2" v-if="role === 'admin'">
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
      <CButton size="sm" color="primary" @click="exportDebt(exportDebtFeedback)">Export Debt</CButton>
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
            <!-- <CTableHeaderCell scope="col" v-show="role == 'admin'"
              >Assigned</CTableHeaderCell
            > -->
            <CTableHeaderCell scope="col" v-show="role == 'admin'">Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col">From</CTableHeaderCell>
            <CTableHeaderCell scope="col" v-show="role == 'admin'">To</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Updated At</CTableHeaderCell>
            <!-- <CTableHeaderCell scope="col">Action</CTableHeaderCell> -->
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(item, index) in debt.data" :key="index">
            <CTableDataCell>
              {{ index + 1 + (currentPages - 1) * perPage }}
            </CTableDataCell>
            <CTableDataCell v-show="role == 'admin'">{{
              item.amount
            }}</CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ item.ib.name }}
              </div>
            </CTableDataCell>
            <CTableDataCell v-show="role == 'admin'">
              <div class="overflow-auto">
                {{ item.account_receiver ? item.account_receiver : '-' }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ item.status ? item.status : '-' }}
              </div>
            </CTableDataCell>
            <CTableDataCell>
              <div class="overflow-auto">
                {{ item.updatedAt ? item.updatedAt : '-' }}
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
              :colspan="role === 'admin' ? 6 : 4"
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
</template>

<script>
import axios from 'axios'
import { reactive, onMounted, watch, ref } from 'vue'
import MultiSelect from '@vueform/multiselect'
import VueSweetalert2 from 'vue-sweetalert2'
import XLSX from 'xlsx'

export default {
  name: 'DebtList',
  components: { MultiSelect },
  methods: {
    exportDebtFeedback() {
      this.$swal({
        title:'Debt Exported',
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
        ...(dateFilter.value ? { 'date[$gte]': new Date(dateFilter.value[0].toISOString().substring(0, 10) + 'T00:00:00') } : {}),
        ...(dateFilter.value ? { 'date[$lte]': new Date(dateFilter.value[1].toISOString().substring(0, 10) + 'T23:59:59') } : {}),
        ...(bankFilter.value ? { 'ib.username': bankFilter.value } : {})
      }

      console.log(params)

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
      exportDebt
    }
  },
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>