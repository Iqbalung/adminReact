<template>
<div>
<CCard class="mb-4">
          <CCardHeader class="bg-white">Bank List</CCardHeader>
          <CCardBody class="bank-table">
            <router-link  :to="{name:'Create Bank'}" v-show="role=='admin'">
              <CButton color="primary">
              <CIcon class="text-white" name="cil-plus"/> Add Bank
              </CButton>
            </router-link>
            <router-link :to="{name:'Import Excel'}" v-show="role=='admin'">
              <CButton class="ms-2" color="success">
              <CIcon class="text-white" name="cil-plus"/> Import Excel
              </CButton>
            </router-link>
              <CTable align="middle" class="border border-top-0" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Username</CTableHeaderCell>
                  <CTableHeaderCell v-show="role=='admin'">Status</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" v-show="role=='admin'">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody v-if="isLoading">
                <CTableRow>
                  <CTableDataCell
                    align="middle"
                    class="text-center"
                    :colspan="3"
                    >
                      <CSpinner
                        color="primary"
                      />
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
              <CTableBody v-else>
                <CTableRow v-for="(item,index) in banks" :key="index">
                  <CTableDataCell>
                    <div>{{ item.username }}</div>
                  </CTableDataCell>
                  <CTableDataCell v-show="role=='admin'">
                    <CFormSwitch :label="item.status ? 'Active' : 'Nonactive'" :id="'switch-' + index" :checked="item.status" v-on:change="updateStatus(item, index)" />
                  </CTableDataCell>
                  <CTableDataCell class="text-center" v-show="role=='admin'">
                    <div>
                    <router-link :to="{name:'Update Bank',params:{id:item._id}}">
                    <CBadge class="me-2 rounded" color="warning">
                      <CIcon class="text-white" name="cil-pencil"/>
                    </CBadge>
                    </router-link>
                    <CBadge color="danger" class="rounded" @click="deleteAlert(destroy, item._id, index)">
                      <CIcon class="text-white" name="cil-trash"/>
                    </CBadge>
                    </div>
                  </CTableDataCell>
                </CTableRow>
                <CTableRow v-show="banks.length == 0">
                  <CTableDataCell colspan="2">No records found</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
</CCard>

</div>
</template>
<script>
import axios from 'axios'
import {onMounted,ref} from 'vue'
export default {
  name:'BankList',
  methods: {
    deleteAlert(cb, id, index) {
      this.$swal({
        title: 'Are You Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          cb(id, index)

          this.$swal('Saved','','success');
        }
      })
    },
  },
  data() {
    return {
      role: window.localStorage.getItem('role')
    }
  },
  setup() {
    //reactive state
    let banks = ref([]);

    const isLoading = ref(true)

    onMounted(()=> {
      // get data
      loadBank()
    });

    async function loadBank() {
      axios.get(`${process.env.VUE_APP_URL_API}/bank`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result) => {
        banks.value = result.data.data;

        stopLoading()
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    function destroy(id,index) {
      axios.delete(`${process.env.VUE_APP_URL_API}/bank/${id}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(()=> {
        banks.value.splice(index,1);
        // router.push({
        //   name:'Banks'
        // })
      }).catch((err)=>{
        console.log(err.response);
      })
    }

    function startLoading() {
      isLoading.value = true
    }

    function stopLoading() {
      isLoading.value = false
    }

    async function updateStatus(item, index) {
      axios.patch(`${process.env.VUE_APP_URL_API}/bank/${item._id}`, {
        status: !item.status
      }, {
        headers: {
          Authorization: window.localStorage.getItem('accessToken')
        }
      }).then(() => {
        banks.value[index].status = !item.status
      }).catch(err => {
        console.log(err.response)
      })
    }

    return {
      banks,
      destroy,
      updateStatus,
      isLoading
    }
  }
}
</script>

<style>
.bank-table .table-responsive {
  display: block;
  max-height: 500px;
  overflow: auto;
  margin-top: 1rem!important;
}
.bank-table th {
  background-color: white;
  position: sticky;
  top: 0;
}
.bank-table th::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  height: 1px;
  width: 100%;
  border-bottom: 1px solid #dee2e6!important;
}
.bank-table th::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  width: 100%;
  border-bottom: 2px solid currentColor;
}
.bank-table tbody {
  border-top: none !important;
}
</style>