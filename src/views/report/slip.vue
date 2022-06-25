<template>
  <CCard class="mb-3" v-if="role === 'admin'">
    <CCardBody>
      <div class="row gx-2">
        <div class="col">
          <Datepicker v-model="dateFilter" range @closed="pickDate" :enableTimePicker="false"></Datepicker>
        </div>
        <div class="col">
          <MultiSelect :options="workerOptions" placeholder="Worker" v-model="workerFilter" searchable @open="getBanks" />
        </div>
        
      </div>
    </CCardBody>
  </CCard>

  <CCard class="mb-4">
    <CCardHeader
      class="bg-white d-flex align-items-center justify-content-between"
    >
      <span>
       Slip Gaji
      </span>
      <div>
        <CButton size="sm" color="primary" class="me-2" @click="exportReport(exportReportFeedback)">Export Report</CButton>
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
    <CCardBody class="p-0 report-table">
      
        <CCol style="padding:30px;">
          <div class="mb-2">
            <h3>Pendapatan</h3>
            <div class="row gx-2">
                <div class="col">
            <div class="mb-6">
            Gaji 
            </div>
                </div>
                <div class="col">
            
                {{
                  report.gaji
                    ? 'Rp. ' +
                      report.gaji
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                    : 'Rp. -'
                }}
            </div>
          </div>
          </div>
          <div class="mb-2">
            <div class="row gx-2">
                <div class="col">
            <div class="mb-6">
            Cairan 
            </div>
                </div>
                <div class="col">
            
                {{
                  report.cairan
                    ? 'Rp. ' +
                      report.cairan
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                    : 'Rp. -'
                }}
            </div>
          </div>
          </div>
        </CCol>

        <CCol style="padding:30px;">
          <div class="mb-2">
            <h3>Potongan</h3>
            <div class="row gx-2">
                <div class="col">
            <div class="mb-6">
            BPJS 
            </div>
                </div>
                <div class="col">
            
                {{
                  report.bpjs
                    ? 'Rp. ' +
                      report.bpjs
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                    : 'Rp. -'
                }}
            </div>
          </div>
          </div>
          <div class="mb-2">
            <div class="row gx-2">
                <div class="col">
            <div class="mb-6">
            Bon 
            </div>
                </div>
                <div class="col">
            
                {{
                  report.bon
                    ? 'Rp. ' +
                      report.bon
                        .toString()
                        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                    : 'Rp. -'
                }}
            </div>
          </div>
          </div>
        </CCol>

        <CCol style="padding:30px;">
            <div class="mb-2">
            <h3>Total</h3>
                <div class="row gx-2">
                    <div class="col">
                        <div class="mb-6">
                        Total Pendapatan (Pendapatan + Potongan) 
                        </div>
                    </div>
                    <div class="col">
                        {{
                        report.gaji
                            ? 'Rp. ' +
                            (parseInt(report.gaji) + parseInt(report.cairan)) 
                                .toString()
                                .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                            : 'Rp. -'
                        }}
                    </div>
                </div>
                <div class="row gx-2">
                    <div class="col">
                        <div class="mb-6">
                        Take Home Pay (Pendapatan - Potongan) 
                        </div>
                    </div>
                    <div class="col">
                        {{
                        report.gaji
                            ? 'Rp. ' +
                            (parseInt(report.gaji) - parseInt(report.cairan)) 
                                .toString()
                                .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')
                            : 'Rp. -'
                        }}
                    </div>
                </div>
            </div>
        </CCol>
        

     
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
  name: 'CairanList',
  components: { MultiSelect },
  methods: {
    exportReportFeedback() {
      this.$swal({
        title:'Report Exported',
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
    const report = ref([])
    const perPage = ref(100)
    let currentPages = ref(1)
    const role = ref(window.localStorage.getItem('role'))
    const workerOptions = ref([]);
    const workerFilter = ref('')
    const dateFilter = ref()
    const isLoading = ref(true)
    const visibleRequestRecon = ref(false)
    const reconDate = ref(new Date)

    watch(searchFilter, value => {
      loadReport(currentPages.value, searchFilter.value)
    })

    watch(dateFilter, value => loadReport(currentPages.value, searchFilter.value))

    watch(workerFilter, value => loadReport(currentPages.value, searchFilter.value))

    onMounted(() => {
      // date
      const startDate = new Date(new Date().setDate(new Date().getDate() - 1));
      const endDate = new Date();

      dateFilter.value = [startDate, endDate];

      var acknowledgedcreate = []

      socket.on('report created', (message) => {
        if (!~acknowledgedcreate.indexOf(message._id)) {
          // add to array of acknowledged events
          acknowledgedcreate.unshift(message._id)

          // prevent array from growing to large
          if (acknowledgedcreate.length > 20) {
            acknowledgedcreate.length = 20
          }

          loadReport(currentPages.value, searchFilter.value)
        }
      })

      loadReport(currentPages.value, searchFilter.value)
    })

    function loadReport(pages, searchTitle) {
      const skip = pages > 1 ? (pages - 1) * 100 : 0

      const params = {
        '$sort[_id]': -1,
        $skip: skip,
        organization_id: window.localStorage.getItem('organization_id'),
        account_receiver: searchTitle,
        ...(dateFilter.value ? { 'date_crawl[$gte]': new Date(dateFilter.value[0].toISOString().substring(0, 10) + 'T00:00:00') } : {}),
        ...(dateFilter.value ? { 'date_crawl[$lte]': new Date(dateFilter.value[1].toISOString().substring(0, 10) + 'T23:59:59') } : {}),
        ...(workerFilter.value ? { 'account_receiver': workerFilter.value } : {})
      }

      axios
        .get(`${process.env.VUE_APP_URL_API_REPORT}/generate-report-slip`, {
          headers: {
            Accept: 'application/json',
          },
          params,
        })
        .then((result) => {
          report.value = result.data
          // totalData.value = result.data.total
          stopLoading()
        })
        .catch((err) => {
          console.log(err.response)
        })
    }

    function changePg() {
      loadReport(currentPages.value, searchFilter.value)
    }

    function getBanks() {
      axios.get(`${process.env.VUE_APP_URL_API}/users?organization_id=`+ window.localStorage.getItem('organization_id'),{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then(results => results.data.map(result => result.username)).then(results => {
        workerOptions.value = results
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    function exportReport(cb) {
      const worksheet = XLSX.utils.json_to_sheet(report.value.data)
      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      XLSX.writeFile(workbook, "report.xlsx");

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
      loadReport,
      report,
      perPage,
      currentPages,
      role,
      workerOptions,
      workerFilter,
      getBanks,
      dateFilter,
      exportReport,
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
.report-table .table-responsive {
  display: block;
  max-height: 500px;
  overflow: auto;
}
.report-table th {
  background-color: white;
  position: sticky;
  top: 0;
}
.report-table th::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  width: 100%;
  border-bottom: 2px solid currentColor;
}
.report-table tbody {
  border-top: none !important;
}
</style>