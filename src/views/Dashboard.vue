<template>
  <div>
    <iframe src="http://128.199.233.113:5601/goto/7442e202fc72428478c410982e9eea30" height="600" width="100%"></iframe>
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
