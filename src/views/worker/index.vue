<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Task List</CCardHeader>
    <CCardBody>
       <div class="d-flex justify-content-between">
      <CButton color="secondary" class="text-white" @click="showToast('halo')"><CIcon class="text-white" name="cil-clipboard"/> Tasks History</CButton>

      <CFormSelect style="width:140px" @change="getFilter">
          <option value="unprocess">Unprocess</option>
          <option value="processed">Processed</option>
          <option value="done">Done</option>
      </CFormSelect>
       </div>

       <div class="table-responsive mt-3">
                    <table class="table table-fixed text-center">
                        <thead>
                            <tr>
                                <!-- <th scope="col" class="col-1"><CIcon name="cil-people" /></th> -->
                                <!-- <th scope="col" class="col-2">Assigned</th> -->

                                <th scope="col" class="col-5">Task Title</th>
                                <th scope="col" class="col-3">Task Ref Number</th>
                                <th scope="col" class="col-2">Status</th>
                                <th scope="col" class="col-2">Detail Task</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tasks" :key="index" :class="'table-'+cek(item.taskStatus)">
                                <!-- <td scope="row" class="col-1">
                                  <div v-if="item.taskStatus!='processed'">
                                  <CFormCheck id="taskchekbox" :value="item._id" @change="additem"/>
                                  </div>
                                  <div v-if="item.taskStatus=='processed'">
                                    <CFormCheck disabled/>
                                  </div>
                                </td> -->
                                <!-- <td class="col-2">{{ item.taskAssigne }}</td> -->
                                <td class="col-5">{{ item.taskTittle }}</td>
                                <td class="col-3">{{ item.taskRefNumber }}</td>
                                <td class="col-2">{{ item.taskStatus }}</td>
                                <td class="col-2">
                                  <div v-if="item.taskStatus!='processed'">
                                    <CBadge class="me-2 rounded-full" color="dark" @click="process(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus)">
                                      <CIcon class="text-white" name="cil-aperture"/>
                                    </CBadge>
                                    </div>
                                    <div v-if="item.taskStatus=='processed'">
                                      <CIcon class="text-dark" name="cil-aperture"/>
                                  </div>
                              </td>
                            </tr>
                        </tbody>
                    </table>
                </div><!-- End -->
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
  <!-- Toast Task -->
   <CToaster placement="top-end">
    <CToast v-for="(toast, index) in toasts" :key="index">
      <CToastHeader closeButton>
      <span class="me-auto fw-bold">{{toast.title}}</span>
      <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
  <!-- Toast Task -->
  </div>
</template>

<style>
.table-fixed tbody {
    height: 300px;
    overflow-y: auto;
    width: 100%;
    overflow: auto;
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
</style>

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
        selectedTask : [],
        // toasts:[]
    }
  },
  // watch(){
  //       socket.on('tasks patched', (message) => {
  //       // console.log('New message patched', message);
  //       loadTask();
  //       console.log('tasksbro',message);
  //       // alert('oke');
  //       // showToast(message);
  //     showToast();

  //     });
  // },
  methods: {
    // showToast(){
    //    this.toasts.push({
    //       title: 'new toast',
    //       content: 'Lorem ipsum dolor cet emit'
    //     })
    // },
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
        axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${this._id}`,{taskStatus:'processed',timeProcess:Date.now},{
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
    },

    additem(event){
      console.log(event.target.checked);
      console.log(event.target.value);
      if(event.target.checked)
      {
        this.selectedTask.push(event.target.value);
      } else {
        this.selectedTask.pop();
      }
      console.log(this.selectedTask)
    },
  },
  setup() {
    //reactive state
    let tasks = ref([]);
    let selectedFilter = ref([]);
    let toasts = ref([]);

    onMounted(()=> {
      console.log(tasks);
        socket.on('tasks created', (message) => {
        // console.log('New message created', message);

        loadTask();
        // console.log(tasks);

      });
        socket.on('tasks updated', (message) => {
        // console.log('New message updated', message);
        loadTask();
        console.log('updated')
        // console.log(tasks);

      });
        socket.on('tasks patched', (message) => {
        // console.log('New message patched', message);
        loadTask();
        console.log('tasksbro',message);
        console.log('title',message.taskTittle);
        // alert('oke');
        showToast('Task Update',message.taskTittle);

      });
        // this.methods.showToast();
      // get data
      // this.showToast('halo');
        // showToast('kakak');
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
     function cekCheck(assign){
      if(assign != 'unassigne') {
        return 'true';
      }
    }
     function loadTask(filter) {
       if(selectedFilter.value.length === 0)
       {
        //  console.log('ora ono filter')
        axios.get(`${process.env.VUE_APP_URL_API}/tasks?taskAssigne=${window.localStorage.username}&taskStatus=unprocess`,{
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

       } else {
        //  console.log('ono filter bro');
        axios.get(`${process.env.VUE_APP_URL_API}/tasks?taskAssigne=${window.localStorage.username}&taskStatus=${filter}`,{
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

    function getFilter(e) {
      if(e.target.options.selectedIndex > -1){
        let filter = e.target.options[e.target.selectedIndex].value;
        selectedFilter.value = e.target.options[e.target.selectedIndex].value;
        // console.log(selectedTask);
        loadTask(selectedFilter.value);

    }
    }

     function showToast(title,content){
       toasts.value.push({
         title:title,
         content:content
       });
       console.log(toasts.value);
    }

    return {
      tasks,
      destroy,
      cek,
      loadTask,
      cekCheck,
      getFilter,
      toasts,
      showToast
    }
  }
}
</script>
