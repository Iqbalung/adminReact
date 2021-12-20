<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Task List</CCardHeader>
    <CCardBody>

      <div class="d-flex justify-content-end">
      <!-- <div>
      <CButton color="secondary" class="text-white" @click="()=>{visibleLiveDemo=true}"><CIcon class="text-white" name="cil-clipboard"/> Tasks History</CButton>
      </div> -->
      <div class="d-flex justify-content-center align-content-center align-items-center">
        <div class="me-2">
          Total
          <button class="btn btn-primary" type="button" disabled>
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="margin-right:30px;"></span>
            <span class="sr-only">  {{ tasks.length }}</span>
        </button>
        </div>
        <div>
      <CFormSelect class="d-inline-block" style="width:140px" @change="getFilter">
          <option value="unprocess">Unprocess</option>
          <option value="processed">Processed</option>
          <option value="done">Done</option>
      </CFormSelect>
        </div>
      </div>
       </div>
       <div class="table-responsive mt-3">
                    <table class="table table-fixed">
                        <thead>
                            <tr>
                                <!-- <th scope="col" class="col-1"><CIcon name="cil-people" /></th> -->
                                <!-- <th scope="col" class="col-2">Assigned</th> -->

                                <th scope="col" class="col-5">Task Title</th>
                                <th scope="col" class="col-3">Task Ref Number</th>
                                <th scope="col" class="col-2">Status</th>
                                <th scope="col" class="col-2 text-center">Detail Task</th>
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
                                <!-- <td class="col-1">
                                  <CFormCheck id="taskchekbox" :value="item._id"/>
                                </td> -->
                                <td class="col-5">
                                  <div>
                                    {{ item.taskTittle +' '}}
                                    <!-- <button class="bg-dark btn-small m-0 p-0">
                                      <CIcon class="text-white m-0 p-0" name="cil-clipboard"/>
                                    </button> -->
                                    <CTooltip content="Copy Account Number And Amount!" placement="right">
                                      <template #toggler="{ on }">
                                    <CButton size="sm" class="rounded-full d-inline-block p-0" v-on="on" color="info" @click="copyRek(item.taskData.account_number,item.taskData.amount)">
                                      <CIcon class="text-white" name="cil-wallet"/>
                                    </CButton>
                                      </template>
                                    </CTooltip>
                                    <!-- {{ ' ' }} -->
                                    <!-- <CTooltip content="Copy Amount!" placement="right">
                                      <template #toggler="{ on }">
                                    <CBadge class="rounded-full d-inline-block p-0" v-on="on" color="dark" @click="copyAmt(item.taskData.amount)">
                                      <CIcon class="text-white" name="cil-dollar"/>
                                    </CBadge>
                                      </template>
                                    </CTooltip> -->

                                  </div>
                                </td>
                                <td class="col-3">
                                 <div>
                                   {{ item.taskRefNumber }}
                                 </div>
                                </td>
                                <td class="col-2">
                                  <div>
                                  {{ item.taskStatus }}
                                  </div>
                                </td>
                                <td class="col-2 text-center">
                                  <div v-if="item.taskStatus!='processed'" class="d-inline-block p-0 m-0">
                                    <CButton size="sm" class="me-1 rounded-full p-0" color="primary" @click="process(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus)">
                                      <CIcon class="text-white" name="cil-cloud-upload"/>
                                    </CButton>
                                    <CButton size="sm" class="rounded-full p-0" color="success" @click="showHistory(item.taskHistory)">
                                      <CIcon class="text-white" name="cil-clear-all"/>
                                    </CButton>
                                    </div>
                                    <div v-if="item.taskStatus=='processed'" class="d-inline-block p-0 m-0">
                                      <CButton class="me-1 rounded-full p-0" color="light">
                                      <CIcon class="text-dark" name="cil-cloud-upload"/>
                                      </CButton>
                                      <CButton class="rounded-full d-inline-block p-0" color="success" @click="showHistory(item.taskHistory)">
                                      <CIcon class="text-white" name="cil-clear-all"/>
                                      </CButton>
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
      <CModalTitle>Task History</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <!-- <div class="mb-0">
      <CCallout class="p-2 mb-0" color="light">
          <span>UpdatedAt: 20-juni-2020</span>
          <p class="mb-0">Data assigned by admin</p>
      </CCallout>
      </div>
      <div>
      <CCallout class="p-2" color="light">
          <span>UpdatedAt: 20-juni-2020</span>
          <p class="mb-0">Data assigned by crone</p>
      </CCallout>
      </div> -->
    <div class="timeline-area" >
      <div class="content" v-for="(item,index) in history" :key="index">
        <p>{{ item.updatedAt }}</p>
        <h5 class="fw-bold">{{ item.status }}</h5>
      </div>
      <!-- <div class="content">
        <p>Full-stack developer</p>
        <p>Google</p>
      </div>
      <div class="content">
        <p>Full-stack developer</p>
        <p>Google</p>
      </div> -->
    </div>
      </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        Close
      </CButton>
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
}

.table-fixed thead,
.table-fixed tbody,
.table-fixed tr,
.table-fixed th {
  display: block;
}

.table-fixed tbody td,
.table-fixed tbody th,
.table-fixed thead > tr > th {
  float: left;
  position: relative;
}


.table-fixed tbody th::after,
.table-fixed thead > tr > th::after {
  content: '';
  clear: both;
  display: block;
}
/* timeline */
.timeline-area {
  margin:5px auto;
  width: 360px;
  border-left: 2px solid #ccc;
  padding:0 20px 0 30px;
}
.content {
/* padding: 10px 10px; */
padding-top:5px ;
padding-left: 5px;
border: 1px solid #ccc;
position: relative;
height: 50px;
left: -10px;
margin-bottom: 20px;
}
.content::before {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #000;
  border: 3px solid #ddd;
  position: absolute;
  top: 10px;
  left: -27px;
}
.content::after {
  content:'';
  border-style: solid;
  border-color: transparent #ddd transparent transparent;
  border-width: 8px;
  position: absolute;
  top:7px;
  left: -17px;
}
.content p {
  font-size: 12px;
  margin-bottom: 0;
  margin-top:0;
}
.content h5 {
  font-size: 12px;
}

</style>

<script>
import axios from 'axios'
import router from '../../router'
import {onMounted,ref} from 'vue'
import useClipboard from 'vue-clipboard3'
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
        history: [],

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
    copyRek(norek,amount){
       let { toClipboard }=useClipboard();
       toClipboard(`Account Number : ${norek}; Amount : ${amount}`);
       console.log('copied');
    },
    copyAmt(amount) {
      let { toClipboard }=useClipboard();
       toClipboard(`Amount : ${amount}`);
       console.log('copied');
    },
    copydong() {
      // toClipboard('',{text:'aku sayang kamu'});
      let { toClipboard }=useClipboard();
      toClipboard('AKu sayang kamu');
      console.log('copyed');
    },
    showHistory(history) {
      this.visibleLiveDemo = true;
      this.history = history;
      // console.log(this.history);
      // console.log(id);
    },
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

        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${this._id}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((results)=> {
        let date = new Date();
        let taskh = results.data.taskHistory;
        taskh.push({status: `task processed by ${window.localStorage.getItem('username')}`, updatedAt:date.toISOString()})
        console.log(taskh);
    // Axios update
      axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${this._id}`,{taskStatus:'processed',taskTimeProcess:date.toISOString(),taskHistory:taskh},{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(()=> {
        //
      }).catch((err)=>{
        console.log(err);
      })

    // Axios update


      }).catch((err)=>{
        console.log(err);
      })

      this.$swal('Saved','','success');







        // Update data
        // axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${this._id}`,{taskStatus:'processed',timeProcess:Date.now},{
        // headers: {
        //   Authorization:window.localStorage.getItem('accessToken')
        // }
        // })
        //   .then(()=> {
        //     //
        //   }).catch((err)=>{
        //     console.log(err);
        // });

            // Feedback
            // router.go()
        }
      })
    },
    procs(){
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
            router.go()
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
      // console.log(tasks.value.length);
        socket.on('tasks created', (message) => {
        // console.log('New message created', message);
        if(message.taskAssigne == window.localStorage.getItem('username'))
        {
          loadTask();

        }
        //loadTask();
        // console.log(tasks);

      });
        socket.on('tasks updated', (message) => {
        // console.log('New message updated', message);
        loadTask();
        console.log('updated')
        // console.log(tasks);

      });

      var acknowledged = [];
        socket.on('tasks patched', (message) => {


        if(!~acknowledged.indexOf(message._id)){

            // add to array of acknowledged events
            acknowledged.unshift(message._id);

            // prevent array from growing to large
            if(acknowledged.length > 20){
                acknowledged.length = 20;
            }

            console.log('acknowledged',acknowledged);
            console.log('tasksbro',message);
            console.log('title',message.taskTittle);
            // alert('oke');
            if(message.taskAssigne == window.localStorage.getItem('username'))
            {
            loadTask();
            if(message.taskStatus=='done'){
                showToast('Transfer Berhasil ',message.taskTittle);
            }else{
                showToast('Task Baru ',message.taskTittle);
            }
            }

            // handle once per event
        }
        // console.log('New message patched', message);



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
          console.log(result.data)
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
          console.log(result.data)
          tasks.value = result.data;
        }).catch((err) =>{
          console.log(err.response);
        });
       }

       }

    async function getFilter(e) {
      if(e.target.options.selectedIndex > -1){
        let filter = await e.target.options[e.target.selectedIndex].value;
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
