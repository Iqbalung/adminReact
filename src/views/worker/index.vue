<template>
  <div>
    <CCard class="mb-4">
        <CCardHeader>Worker List</CCardHeader>
      <CCardBody>
      <div class="flex-column">
      <CButton color="primary" class="d-inline-block me-2">
          <CIcon class="text-white" name="cil-plus"/> Add Task
      </CButton>
      <CButton color="dark" class="d-inline-block me-2">
          <CIcon class="text-white" name="cil-touch-app"/> Assign Task
      </CButton>
      <CButton color="secondary" class="d-inline-block text-white" @click="() => { visibleLiveDemo = true }"><CIcon class="text-white" name="cil-clipboard"/> Tasks History</CButton>
       <!-- <div class="mt-3 col-4">
          <CFormInput type="text" id="search" placeholder="search"/>
        </div> -->
      </div>
              <CTable align="middle" class="mt-3 mb-0 mt-2 border border-1" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center">Assigned</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Title</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Ref Number</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Sla Time</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Expired Time</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Status</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item,index) in tasks" :key="index">
                  <CTableDataCell class="text-center">
                    <div>{{ item.taskAssigne }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-left">
                    <div>{{ item.taskTittle }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.taskRefNumber }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.taskSlaTime }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                     <div>{{ item.taskExpiredTime }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>{{ item.taskStatus }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <div>
                    <CBadge class="me-2 rounded" color="light">
                      <CIcon class="text-black" name="cil-circle"/>
                    </CBadge>
                    <CBadge class="me-2 rounded" color="warning">
                      <CIcon class="text-white" name="cil-pencil"/>
                    </CBadge>
                    <CBadge color="danger" class="rounded">
                      <CIcon class="text-white" name="cil-trash"/>
                    </CBadge>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
      </CCardBody>
    </CCard>

    <!-- Modal -->
  <CModal :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
    <CModalHeader>
      <CModalTitle>Modal title</CModalTitle>
    </CModalHeader>
    <CModalBody>Woohoo, you're reading this text in a modal!</CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        Close
      </CButton>
      <CButton color="primary">Save changes</CButton>
    </CModalFooter>
  </CModal>
  </div>
</template>
<script>
import axios from 'axios'
import {onMounted,ref} from 'vue'
export default {
  name: 'TaskList',
  data() {
    return {
        visibleLiveDemo: false,
    }
  },
  setup() {
    //reactive state
    let tasks = ref([]);

    onMounted(()=> {
      // get data
      if (window.localStorage.role == 'admin') {
        axios.get('https://api-tasks-u4boz.ondigitalocean.app/tasks',{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        })
        .then((result) => {
          console.log(result.data.data)
          tasks.value = result.data.data;
        }).catch((err) =>{
          console.log(err.response);
        });

      }else{
        axios.get(`https://api-tasks-u4boz.ondigitalocean.app/tasks?taskAssigne=${window.localStorage.username}`,{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        })
        .then((result) => {
          console.log(result.data.data)
          tasks.value = result.data.data;
        }).catch((err) =>{
          console.log(err.response);
        });
      }
    });

    function destroy(id,index) {
      axios.delete(`https://api-tasks-u4boz.ondigitalocean.app/users/${id}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(()=> {
        tasks.value.splice(index,1);
        // router.push({
        //   name:'Users'
        // })
      }).catch((err)=>{
        console.log(err.response);
      })
    }

    return {
      tasks,
      destroy
    }
  }
}
</script>
