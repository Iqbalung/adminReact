<template>
  <div>
    <CCard class="mb-4">
        <CCardHeader>Task List</CCardHeader>
      <CCardBody>
      <div class="flex-column">
      <CButton color="primary" class="d-inline-block me-2">
          <CIcon class="text-white" name="cil-plus"/> Add Task
      </CButton>
      <CButton color="danger" class="text-white d-inline-block me-2" @click="clearAssign()">
          <CIcon class="text-white" name="cil-trash"/> Unnasigned
      </CButton>
      <CButton color="dark" class="d-inline-block me-2" @click="() => { modalAssign=true}">
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
                  <CTableHeaderCell class="text-center">
                    <CIcon name="cil-people" />
                    <!-- <CFormCheck/> -->
                  </CTableHeaderCell>
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
                    <div><CFormCheck id="task{{ index }}" :value="item._id" @change="additem"/></div>
                  </CTableDataCell>
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

    <!-- Modal Assigment -->
    <CModal  :visible="modalAssign" @close="() => { modalAssign = false }">
    <CModalHeader>
      <CModalTitle>Modal Assignment</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm @submit.prevent="updateWorker()">
      <div class="mb-3">
      <CFormSelect v-model="work" aria-label="Default select example">
        <option>Unassigned</option>
        <option v-for="(user,index) in users" :key="index" :value="user.username">{{ user.username }}</option>
      </CFormSelect>
      </div>
      <CButton color="primary">Save changes</CButton>
    </CForm>
    </CModalBody>
  </CModal>
    <!-- Modal Assigment -->

    <!-- Modal History -->
  <CModal  :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
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
  <!-- Modal History -->
  </div>
</template>
<script>
import router from '../../router'
import axios from 'axios'
import {reactive,onMounted,ref} from 'vue'
export default {
  name: 'TaskList',
  data() {
    return {
        visibleLiveDemo: false,
        modalAssign:false,
        sel: [],
        work:'',
    }
  },
  methods: {
    additem(event){
      console.log(event.target.checked);
      console.log(event.target.value);
      if(event.target.checked)
      {
        this.sel.push(event.target.value);
      } else {
        this.sel.pop();
      }
    },
    updateWorker(){
      console.log(this.sel);
      this.sel.forEach(element => {
        axios.patch(`https://api-tasks-u4boz.ondigitalocean.app/tasks/${element}`,{taskAssigne:this.work},{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(()=> {
       //
      }).catch((err)=>{
        console.log(err);
      })
      });
      alert('success');

    },
    clearAssign() {
      confirm('Are you sure ?');
    }
  },
  setup() {
    //reactive state
    let tasks = ref([]);
    let selected = ref([]);
    let users = ref({});
    let worker = reactive({
      username:'',
    });


    onMounted(()=> {
      // get data
      axios.get('https://api-tasks-u4boz.ondigitalocean.app/tasks',{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result) => {
        // console.log(result.data.data)
        tasks.value = result.data.data;
      }).catch((err) =>{
        console.log(err.response);
      });

      // get worker
      axios.get('https://api-tasks-u4boz.ondigitalocean.app/users?role=worker',{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then((result)=> {
        console.log(result.data);
        users.value = result.data;
      }).catch((err) =>{
        console.log(err.response);
      });
    });
    //delete
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

    // select function
    function getSelect(event) {
      // console.log(event.target.checked);
      // if(event.target.checked == false){
      //   selected.value.splice(1)
      // }
        this.sel.push(event.target.value)
      // selected.value.push(event.target.value);
    }
    //assigning function
    function assigning() {
      console.log(worker.username);

     for(let i in this.sel){
       console.log(this.sel[i]);
      // axios.patch(`https://api-tasks-u4boz.ondigitalocean.app/tasks/${selected[i]}`,{taskAssigne:worker.username},{
      //   headers: {
      //     Authorization:window.localStorage.getItem('accessToken')
      //   }
      // })
      // .then(()=> {
      //   router.push({
      //     name:'Tasks'
      //   })
      // }).catch((err)=>{
      //   console.log(err);
      // })
     }
    }
    return {
      tasks,
      destroy,
      getSelect,
      selected,
      users,
      assigning,
      worker
    }
  }
}
</script>
