<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Task List</CCardHeader>
    <CCardBody>
      <CButton color="secondary" class="d-inline-block text-white" @click="() => { visibleLiveDemo = true }"><CIcon class="text-white" name="cil-clipboard"/> Tasks History</CButton>
       <!-- <div class="mt-3 col-4">
          <CFormInput type="text" id="search" placeholder="search"/>
        </div> -->
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
                <CTableRow v-for="(item,index) in tasks" :key="index" :color="cek(item.taskStatus)">
                  <CTableDataCell class="text-center">
                    <div>{{ item.taskAssigne }}</div>
                  </CTableDataCell>
                  <CTableDataCell class="text-left">
                    <div>{{ item.taskStatus != 'processed' ? item.taskTittle.split(',')[0] + " " + item.taskTittle.split(',')[1] + " ********" : item.taskTittle }}</div>
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
                    <div v-if="item.taskStatus!='processed'">
                    <CBadge class="me-2 rounded-full" color="dark" @click="process(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus)">
                      <CIcon class="text-white" name="cil-aperture"/>
                    </CBadge>
                    </div>
                    <div v-if="item.taskStatus=='processed'">
                      <CIcon class="text-dark" name="cil-aperture"/>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
      </CCardBody>
</CCard>


  <!-- Modal Detail Task -->
  <CModal :visible="modalDetail" @close="() => { modalDetail = false }">
    <CModalHeader :close-button="false">
      <CModalTitle>Task Detail</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="d-flex justify-content-between">
      <div class="">
      <p class="mb-0 fw-bold">Task Title :</p>
      <p>{{ taskTittle }}</p>
      <p class="mb-0 fw-bold">Task Assigne :</p>
      <p>{{ taskAssigne }}</p>
      <p class="mb-0 fw-bold">Task Ref Number :</p>
      <p>{{ taskRefNumber }}</p>
      <p class="mb-0 fw-bold">Task Sla Time :</p>
      <p>{{ taskSlaTime }}</p>
      <p class="mb-0 fw-bold">Task Expired Time :</p>
      <p>{{ taskExpiredTime }}</p>
      <p class="mb-0 fw-bold">Task Status :</p>
      <p>{{ taskStatus }}</p>
      </div>
      <div>
      <p class="mb-0 fw-bold">Account Number :</p>
      <p>{{ account_number }}</p>
      <p class="mb-0 fw-bold">Card Holder :</p>
      <p>{{ anRekening }}</p>
      <p class="mb-0 fw-bold">Bank Type :</p>
      <p>{{ bank_type }}</p>
      <p class="mb-0 fw-bold">Task Created By :</p>
      <p>{{ taskCreatedBy }}</p>
      <p class="mb-0 fw-bold">Amount :</p>
      <p>{{ amount }}</p>
      <p class="mb-0 fw-bold">Mutation ID :</p>
      <p>{{ mutation_id }}</p>
      </div>
    </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { modalDetail = false }">
        Cancel
      </CButton>
      <CButton color="primary" @click="proc()">Process</CButton>
    </CModalFooter>
  </CModal>
  <!-- Modal Detail Task -->



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
  <!-- Modal -->
  </div>
</template>
<script>
import axios from 'axios'
import router from '../../router'
import {onMounted,ref} from 'vue'
export default {
  name: 'TaskList',
  data() {
    return {
        visibleLiveDemo: false,
        modalDetail:false,
        account_number: '',
        anRekening: '',
        amount: '',
        mutation_id: '',
        bank_type: '',
        _id:'',
        taskTitle:'',
        taskRefNumber:'',
        taskAssigne:'',
        taskSlaTime:'',
        taskExpiredTime:'',
        taskStatus:'',
        taskCreatedBy:'',
    }
  },
  methods: {
    process(account_number,anRekening,amount,mutation_id,bank_type,_id,taskAssigne,taskTittle,taskRefNumber,taskExpiredTime,taskCreatedBy,taskStatus)
    {
      this.modalDetail = true;
      this.account_number = account_number;
      this.anRekening = anRekening;
      this.amount = amount;
      this.mutation_id = mutation_id;
      this.bank_type = bank_type;
      this._id = _id;
      this.taskAssigne=taskAssigne;
      this.taskTittle=taskTittle;
      this.taskRefNumber=taskRefNumber;
      this.taskExpiredTime=taskExpiredTime;
      this.taskCreatedBy=taskCreatedBy;
      this.taskStatus = taskStatus;
    },
    proc(){
      this.$swal({title:'Are you sure ?',icon:'info',showCancelButton:true,focusConfirm:false,confirmButtonText:'Process',cancelButtonText:'Cancel'})
      .then((result)=>{
        if(result.isConfirmed) {
        // Update data
        axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${this._id}`,{taskStatus:'processed'},{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
        })
          .then(()=> {
            //
          }).catch((err)=>{
            console.log(err);
        });

            // Feedback
            this.$swal('Saved','','success');
            // router.go()
        }
      })
    }
  },
  setup() {
    //reactive state
    let tasks = ref([]);

    onMounted(()=> {

        socket.on('tasks created', (message) => {
        // console.log('New message created', message);
        loadTask();
        // console.log(tasks);

      });
        socket.on('tasks updated', (message) => {
        // console.log('New message updated', message);
        loadTask();
        // console.log(tasks);

      });
        socket.on('tasks patched', (message) => {
        // console.log('New message patched', message);
        loadTask();
        // console.log(tasks);

      });
      // get data
      loadTask()
    });

    function destroy(id,index) {
      axios.delete(`${process.env.VUE_APP_URL_API}/users/${id}`,{
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

    function cek(status) {
      if(status == 'processed')
      {
        return 'danger';
      } else {
        return 'light';
      }
    }
     function loadTask() {
    if (window.localStorage.role == 'admin') {
        axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
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
        axios.get(`${process.env.VUE_APP_URL_API}/tasks?taskAssigne=${window.localStorage.username}`,{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        })
        .then((result) => {
          console.log(result.data.data)
          tasks.value = result.data;
        }).catch((err) =>{
          console.log(err.response);
        });
      }
    }

    return {
      tasks,
      destroy,
      cek,
      loadTask
    }
  }
}
</script>
