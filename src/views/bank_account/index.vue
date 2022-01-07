<template>
<div>
<CCard class="mb-4">
          <CCardHeader class="bg-white">Bank List</CCardHeader>
          <CCardBody>
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
              <CTable align="middle" class="mt-3 mb-0 mt-2 border border-1" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Username</CTableHeaderCell>
                  <CTableHeaderCell class="text-center" v-show="role=='admin'">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item,index) in banks" :key="index">
                  <CTableDataCell>
                    <div>{{ item.username }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center" v-show="role=='admin'">
                    <div>
                    <router-link :to="{name:'Update Bank',params:{id:item._id}}">
                    <CBadge class="me-2 rounded" color="warning">
                      <CIcon class="text-white" name="cil-pencil"/>
                    </CBadge>
                    </router-link>
                    <CBadge color="danger" class="rounded" @click="destroy(item._id,index)">
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
  data() {
    return {
      role: window.localStorage.getItem('role')
    }
  },
  setup() {
    //reactive state
    let banks = ref([]);

    onMounted(()=> {
      // get data
      axios.get(`${process.env.VUE_APP_URL_API}/bank`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result) => {
        banks.value = result.data.data;
      }).catch((err) =>{
        console.log(err.response);
      });
    });

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

    return {
      banks,
      destroy
    }
  }
}
</script>
