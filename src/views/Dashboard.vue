<template>
  <div>
    <WidgetTask :success="totalSuccess" :failed="300" :duplicate="100"/>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <h4 class="text-dark">SLA Table</h4>
             <div class="table-responsive mt-3">
                    <table class="table table-fixed">
                        <thead>
                            <tr>
                                <th scope="col" class="col-2"><CIcon name="cil-people" /></th>
                                <th scope="col" class="col-5">Total Done</th>
                                <th scope="col" class="col-5">Total Unprocess</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in slaTable" :key="index">
                                <td class="col-2">
                                  <div>
                                    {{ item.id }}
                                  </div>
                                </td>
                                <td class="col-5">
                                  <div>
                                    {{ item.totalDone }}
                                  </div>
                                </td>
                                <td class="col-5">
                                  <div>
                                    {{ item.totalUnprocess }}
                                  </div>
                                </td>
                            </tr>

                            <tr v-show="slaTable.length==0" class="border-0">
                              <td class="col-12 py-3">No records found</td>
                            </tr>
                        </tbody>
                    </table>
             </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
        <CRow class="mt-3">
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0">Traffic</h4>
                <div class="small text-medium-emphasis">January 2021</div>
              </CCol>
              <CCol :sm="7" class="d-none d-md-block">
                <CButton color="primary" class="float-end">
                  <CIcon icon="cil-cloud-download" />
                </CButton>
                <CButtonGroup
                  class="float-end me-3"
                  role="group"
                  aria-label="Basic outlined example"
                >
                  <CButton color="secondary" variant="outline">Day</CButton>
                  <CButton color="secondary" variant="outline" active
                    >Month</CButton
                  >
                  <CButton color="secondary" variant="outline">Year</CButton>
                </CButtonGroup>
              </CCol>
            </CRow>
            <CRow>
              <MainChartExample
                style="height: 300px; max-height: 300px; margin-top: 40px"
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
             <div class="table-responsive mt-3">
                    <table class="table table-fixed">
                        <thead>
                            <tr>
                                <th scope="col" class="col-3">User</th>
                                <th scope="col" class="col-3">Total Assignee</th>
                                <th scope="col" class="col-3">Total Done</th>
                                <th scope="col" class="col-3">AVG SLA</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in userTable" :key="index">
                                <td class="col-3">
                                  <div>
                                    {{ item.name }}
                                  </div>
                                </td>
                                <td class="col-3">
                                  <div>
                                    {{ item.totalAssigne }}
                                  </div>
                                </td>
                                <td class="col-3">
                                  <div>
                                    {{ item.totalDone }}
                                  </div>
                                </td>
                                <td class="col-3">
                                  <div>
                                    {{ item.avgSla }}
                                  </div>
                                </td>
                            </tr>

                            <tr v-show="slaTable.length==0" class="border-0">
                              <td class="col-12 py-3">No records found</td>
                            </tr>
                        </tbody>
                    </table>
             </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
<style>
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');
body {
  font-family: 'Poppins', sans-serif;
} */

.table-wrapper {
  max-height: 350px;
  overflow: auto;
}
.status {
  max-width: 130px;
}
.table-fixed tbody {
    height: 300px;
    overflow-y: auto;
    /* overflow: auto; */
}
.table-fixed thead {
  width: 100%;
  overflow: auto;
}

.table-fixed thead,
.table-fixed tbody,
.table-fixed tr,
.table-fixed td,
.table-fixed th {
    display: block;
}
.table-fixed tbody td,
.table-fixed tbody th,
.table-fixed thead > tr > th {
    float: left;
    position: relative;
}
.table-fixed thead > tr > th ::after {
   content: '';
        clear: both;
        display: block;
}

.table-fixed tbody::-webkit-scrollbar {
  width: 8px;
  /* width of the entire scrollbar */
}

.table-fixed tbody::-webkit-scrollbar-track {
  background: white;
  /* color of the tracking area */
}

.table-fixed tbody::-webkit-scrollbar-thumb {
  background-color: black;
  /* color of the scroll thumb */
  border-radius: 20px;
  /* roundness of the scroll thumb */
  border: 1px solid white;
  /* creates padding around scroll thumb */
}
</style>

<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsStatsA from './widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from './widgets/WidgetsStatsTypeD.vue'
import WidgetTask from './widgets/WidgetStat.vue'
import axios from 'axios'
import {onMounted,ref} from 'vue'

export default {
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsStatsA,
    WidgetsStatsD,
    WidgetTask
  },
  setup() {
    // total Success
    let totalSuccess = ref([]);
    let userTable = ref([]);
    let slaTable = ref([]);
    onMounted(()=>{
      getTotalSuccess();
      getUserTable();
      getSlaTable();
    });
    // Total Success
    function getTotalSuccess(){

      axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        },
        params: {
          taskStatus : 'done'
        }
      })
      .then((result) => {
        totalSuccess.value = result.data.total;
      }).catch((err) =>{
        console.log(err.response);
      });

    }
    // Table Users
    function getUserTable() {
      axios.get(`${process.env.VUE_APP_URL_USER}`)
      .then((result) => {
        userTable.value = result.data;
        console.log(userTable.value);
      }).catch((err) =>{
        console.log(err.response);
      });
    }
    // Table SLA
    function getSlaTable() {
      axios.get(`${process.env.VUE_APP_URL_SLA}`)
      .then((result) => {
        slaTable.value = result.data;
        console.log(slaTable.value);
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    return {
      // data
      totalSuccess,
      userTable,
      slaTable,
      // methods
      getTotalSuccess,
      getUserTable,
      getSlaTable
    }
  },
}
</script>
