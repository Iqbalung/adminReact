<template>
  <div>
    <CCard class="mb-4 overflow-auto">
        <CCardHeader class="bg-white">Task List</CCardHeader>
      <CCardBody>
      <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex">
    <div class="me-2" v-show="role=='admin'">
    <CDropdown color="secondary">
      <CDropdownToggle color="dark"> <CIcon class="text-white" name="cil-touch-app"/> Assignment</CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem component="button" @click="() => { modalAssign=true}"><CIcon class="text-dark" name="cil-touch-app"/> Assign Task</CDropdownItem>
        <CDropdownItem component="button" @click="clearAssign()"><CIcon class="text-dark" name="cil-trash"/> Unnasign</CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
    </div>
      <!-- <CButton v-show="role=='admin'" color="danger" class="text-white me-2" @click="clearAssign()">
          <CIcon class="text-white" name="cil-trash"/> Unnasigned
      </CButton>

      <CButton v-show="role=='admin'" color="dark" class="me-2" @click="() => { modalAssign=true}">
          <CIcon class="text-white" name="cil-touch-app"/> Assign Task
      </CButton> -->
        <div class="w-full">
          <Datepicker v-model="date" range @closed="pickDate" style="width:250px;" :enableTimePicker="false"></Datepicker>
        </div>
      </div>
    <div class="d-flex align-items-center">
      <!-- <div class="me-1">
          Total
          <CBadge class="d-inline-block rounded-circle" color="dark">{{ countData.length }}</CBadge>
        </div> -->
        <div class="me-2">
          <button class="btn btn-primary" type="button" disabled>
            <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true" style="margin-right:30px;"></span>
            <span class="sr-only">  {{ tasks.total }}</span>
        </button>
        </div>
      <div class="me-1">
      <CFormInput type="text" id="search" @keypress="searchTitle" placeholder="search"/>
      </div>
    <div class="me-1">
      <CDropdown color="light">
        <CDropdownToggle color="dark">{{ filterListActive.label }}</CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem component="button" v-for="(filter, key) in filterLists" @click="filterSelect(filter)">{{ filter.label }}</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </div>
    </div>
      </div>
            <div class="table-responsive mt-3">
                    <table class="table table-fixed">
                        <thead>
                            <tr>
                                <th v-show="role=='admin'" scope="col" class="col-1 px-1"><CIcon name="cil-people" /></th>
                                <th v-show="role=='admin'" scope="col" class="col-2 px-0">Created</th>
                                <th v-show="role=='admin'" scope="col" class="col-2 px-0">Assigned</th>
                                <th v-show="role=='admin'" scope="col" class="col-3 px-0">Task Title</th>
                                <th v-show="role!='admin'" scope="col" class="col-2">Created</th>
                                <th v-show="role!='admin'" scope="col" class="col-4">Task Title</th>
                                <th scope="col" class="col-2">Amount</th>
                                <th v-show="role=='admin'" scope="col" class="col-1">Status</th>
                                <th v-show="role!='admin'" scope="col" class="col-2">Status</th>
                                <th v-show="role!='admin'" scope="col" class="col-2 text-center">Detail</th>
                                <th v-show="role=='admin'" scope="col" class="col-1 text-center">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item,index) in tasks.data" :key="index" :class="'table-responsive '+'table-'+cek(item.taskStatus)">
                                <td v-show="role=='admin'" class="col-1 p-2">
                                  <div v-if="item.taskStatus!='processed'">
                                    <input type="checkbox" v-model="checkedItems" :value="item._id">
                                  <!-- <CFormCheck  id="item._id" v-model="checkedItems" value="item.id"/> -->
                                  </div>
                                  <div v-if="item.taskStatus=='processed'">
                                    <CFormCheck disabled/>
                                  </div>
                                </td>
                                <td v-show="role=='admin'" class="col-2">{{ new Date(item.createdAt).toLocaleDateString() }}</td>
                                <td v-show="role=='admin'" class="col-2">{{ item.taskAssigne }}</td>
                                <td v-show="role=='admin'" class="col-3 overflow-auto">
                                  <div class="overflow-auto">{{ item.taskTittle.substring(0,23) }}
                                  <CTooltip content="Copy Account Number And Amount!" placement="right">
                                    <template #toggler="{ on }">

                                    <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copyRek(item.taskData.account_number,item.taskData.amount)">
                                      <CIcon name="cil-copy"/>
                                    </CButton>
                                      </template>
                                    </CTooltip>
                                  </div>
                                </td>
                                <td v-show="role!='admin'" class="col-2">
                                  <div>
                                     {{ new Date(item.createdAt).toLocaleDateString() }}
                                     <!--  + ':' + new Date(item.createdAt).toLocaleTimeString('en-GB') -->
                                  </div>
                                </td>
                                <td v-show="role!='admin'" class="col-4 overflow-auto">
                                  <div class="overflow-auto">
                                    {{ item.taskTittle.substring(0,35) }}
                                    <CTooltip content="Copy Account Number And Amount!" placement="right">
                                    <template #toggler="{ on }">
                                    <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copyRek(item.taskData.account_number,item.taskData.amount)">
                                      <CIcon name="cil-copy"/>
                                    </CButton>
                                      </template>
                                    </CTooltip>
                                  </div>
                                </td>
                                <td class="col-2">{{ rupiah(item.taskData.amount) }}</td>
                                <td v-show="role=='admin'" class="col-1">{{ item.taskStatus }}</td>
                                <td v-show="role!='admin'" class="col-2">{{ item.taskStatus }}</td>
                                <td v-show="role!='admin'" class="col-2 text-center">
                                  <div v-if="item.taskStatus!='processed'">
                                    <!-- <CButton size="sm" class="rounded-full d-inline-block p-0" color="dark" @click="process(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus,item.taskHistory)">
                                      <CIcon class="text-white" name="cil-aperture"/>
                                    </CButton> -->
                                    <CButton size="sm" class="text-primary" variant="ghost" color="light" @click="process(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus,item.taskHistory)">
                                      <!-- <CIcon class="text-white" name="cil-library"/> -->
                                      detail
                                    </CButton>
                                    </div>
                                    <div v-if="item.taskStatus=='processed'">
                                      <!-- <CIcon class="text-dark" name="cil-aperture"/> -->
                                      detail
                                  </div>
                              </td>
                                <td v-show="role=='admin'" class="col-1 p-1">
                                  <div v-if="item.taskStatus!='processed'">
                                    <CButton size="sm" class="text-primary" variant="ghost" color="light" @click="process(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus,item.taskHistory)">
                                      <!-- <CIcon class="text-white" name="cil-library"/> -->
                                      detail
                                    </CButton>
                                    </div>
                                    <div v-if="item.taskStatus=='processed'">
                                      <!-- <CIcon class="text-dark" name="cil-library"/> -->
                                      detail
                                  </div>
                              </td>
                            </tr>
                            <tr v-show="tasks.total==0" class="border-0">
                              <td class="col-12 py-3">No records found</td>
                            </tr>
                        </tbody>
                    </table>

                </div><!-- End -->
      <!-- </div> -->
          <!-- <CPagination size="sm" aria-label="Page navigation example">
              <CPaginationItem @click="previousPage">Previous</CPaginationItem>
              <CPaginationItem :active="checkPagination(item)" v-for="(item,index) in getPaginate" :key="index" @click="getPage">
              {{ item }}
              </CPaginationItem>
              <CPaginationItem @click="nextPage">Next</CPaginationItem>
          </CPagination>
          <br> -->
      <b-pagination
      size="sm"
      v-model="currentPages"
      :total-rows="tasks.total"
      :per-page="perPage"
      aria-controls=""
      @click="changePg"
    ></b-pagination>
      </CCardBody>
    </CCard>

    <!-- Modal Add Tasks -->
  <CModal  :visible="modalAdd" @close="() => { modalAdd = false }">
    <CModalHeader>
      <CModalTitle>Add Task</CModalTitle>
    </CModalHeader>
    <CModalBody>
     <CForm @submit.prevent="store()">
            <div class="mb-3">
              <CFormLabel for="taskTittle">Task Title</CFormLabel>
              <CFormInput type="text" v-model="tsk.taskTittle" id="taskTittle" placeholder="Task title"/>
              <!-- <div class="text-danger">Task Title Required</div> -->
            </div>
            <div class="mb-3">
              <CFormLabel for="taskRefNumber">Ref Number</CFormLabel>
              <CFormInput type="text" v-model="tsk.taskRefNumber" id="taskRefNumber" placeholder="Task Ref Number"/>
              <!-- <div class="text-danger">Task Ref Number Required</div> -->
            </div>
            <div class="mb-3">
              <CFormLabel for="taskSlaTime">Sla Time</CFormLabel>
              <CFormInput type="date" id="taskSlaTime" v-model="tsk.taskSlaTime" placeholder="Task Sla Time"/>
              <!-- <div class="text-danger">Task Sla Time Required</div> -->
            </div>
            <div class="mb-3">
              <CFormLabel for="taskExpiredTime">Expired Time</CFormLabel>
              <CFormInput type="date" id="taskExpiredTime" v-model="tsk.taskExpiredTime" placeholder="Task Expired Time"/>
              <!-- <div class="text-danger">Task Expired Time Required</div> -->
            </div>
            <div class="mb-3">
              <CButton color="primary" class="rounded">Save</CButton>
            </div>
          </CForm>

    </CModalBody>
  </CModal>
    <!-- Toast Confirm -->

    <!-- Modal Assigment -->
    <CModal  :visible="modalAssign" @close="() => { modalAssign = false }">
    <CModalHeader>
      <CModalTitle>Modal Assignment</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm @submit.prevent="updateWorker()">
      <div class="mb-3">
      <MultiSelect :options="users" placeholder="Users" v-model="work" searchable @open="getUser">
        <template #option="props">
          <div class="d-flex justify-content-between w-100">
            <span>{{ props.option.label }}</span>
            <CBadge color="success" shape="rounded-pill" v-if="props.option.status">Online</CBadge>
          </div>
        </template>
      </MultiSelect>
      </div>
      <CButton color="primary">Save changes</CButton>
    </CForm>
    </CModalBody>
  </CModal>
    <!-- Modal Assigment -->

    <!-- Modal History -->
  <CModal  :visible="visibleLiveDemo" @close="() => { visibleLiveDemo = false }">
    <CModalHeader>
      <CModalTitle>Task History</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="mb-0">
      <CCallout class="p-2 mb-0" color="light">
          <span>UpdatedAt: 20-juni-2020</span>
          <p class="mb-0">Task Updated by Lina</p>
      </CCallout>
      </div>
      <div>
      <CCallout class="p-2" color="light">
          <span>UpdatedAt: 20-juni-2020</span>
          <p class="mb-0">Task Updated by Lina</p>
      </CCallout>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        Close
      </CButton>
      <CButton color="primary">Save changes</CButton>
    </CModalFooter>
  </CModal>
  <!-- Modal History -->

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
      <p class="mb-0 fw-bold">Task History :</p>
      <p v-for="(item,index) in taskHistory" :key="index">
        {{ item.updatedAt  }}
        <br/>
        {{ item.status }}
      </p>
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
   <!-- Toast Task -->
   <CToaster placement="top-end">
    <CToast v-for="(toast, index) in toasts" :key="index">
      <CToastHeader closeButton>
      <span class="me-auto fw-bold">{{toast.title}}</span>
      <small>{{ toast.time }}</small>
      </CToastHeader>
      <CToastBody>
        {{ toast.content }}
      </CToastBody>
    </CToast>
  </CToaster>
  <!-- Toast Task -->
  <!-- Tester toast -->
  <!-- <CButton color="danger" @click.prevent="sTs">Show</CButton>
  <CToaster placement="top-end">
    <CToast v-for="(ts, index) in tscob" :key="index">
      <CToastHeader closeButton>
      <span class="me-auto fw-bold">{{ts.title}}</span>
      <small>{{ ts.time }}</small>
      </CToastHeader>
      <CToastBody>
        {{ ts.content }}
      </CToastBody>
    </CToast>
  </CToaster> -->

  </div>
</template>

<style>
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
.table-fixed td {
  height: 60px;
  /* overflow: hidden; */
  padding: 0px;
  /* align-items: center; */
}
.table-fixed td div {
  /* margin: auto; */
}
.table-fixed th {
  padding: 0;
  /* margin:0; */
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
import router from '../../router'
import axios from 'axios'
import {reactive,onMounted,watch,ref} from 'vue'
import useClipboard from 'vue-clipboard3'
import MultiSelect from '@vueform/multiselect'
export default {
  name: 'TaskList',
  components: { MultiSelect },
  data() {
    return {
      tasks: [],
        visibleLiveDemo: false,
        modalAdd: false,
        modalAssign:false,
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
        taskHistory : [],
        sel: [],
        work:'',
        taskStat:'',
        statFilter:'all',
        checkedItems: [],
        tskHistory: {},
        perPage: 100,
        role : window.localStorage.getItem('role'),
        currentPage:1,

    }
  },
  computed: {
    getPaginate(){
      return Math.ceil(this.tasks.total/this.perPage)
    },
    calculDate(before){
      let last = new Date(before).getTime();
      let now = new Date().getTime();
      let date = now - last;
      return new Date(date).getMinutes();
    }
  },
  methods: {
    // calculateDate(){


    // },
    rupiah(number) {
      return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
    },
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
    updateWorker(){
      this.checkedItems.forEach(element =>{
      axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result)=> {
      let date = new Date();
        let taskh = result.data.taskHistory;
        taskh.push({status: `task assigned by lina ${window.localStorage.getItem('username')}`, updatedAt:date.toISOString()})
        console.log(taskh);
    // Axios update
      axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{taskAssigne:this.work,taskHistory:taskh},{
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

      })
        console.log('success update');
        this.checkedItems = [];
        this.modalAssign = false;
        this.$swal('Saved','','success');
        // loadTask(taskStats.value)
    },
     clearAssign() {
      this.$swal({title:'Are Sure ?',icon:'info',showCancelButton:true,focusConfirm:false,confirmButtonText:'Yes, Sure',cancelButtonText:'Cancel'})
      .then((result)=> {
        if(result.isConfirmed) {
        this.checkedItems.forEach(element => {

        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((results)=> {
        console.log('datane ',results.data);
        let taskh = results.data.taskHistory[0];
        // taskh.push({status: `assigned by lina ${window.localStorage.getItem('username')}}`, updatedAt:Date.now})
        console.log(taskh);
    // Axios update
      axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{taskAssigne:'unassigned',taskHistory:taskh},{
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


      });
        console.log('success update');
        this.checkedItems = [];
        this.$swal('Saved','','success');
        }
      })
    },
    clearAssigns() {
      this.$swal({title:'Are Sure ?',icon:'info',showCancelButton:true,focusConfirm:false,confirmButtonText:'Yes, Sure',cancelButtonText:'Cancel'})
      .then((result)=> {
        if(result.isConfirmed) {
        this.sel.forEach(element => {
        axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{taskAssigne:'unassigned',taskStatus:'unprocess'},{
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
          this.$swal('Saved','','success');
          router.go()
            document.querySelectorAll('input[type="checkbox]').forEach((item)=>{
              item.checked = false;
            });
        }
      })
    },
    process(account_number,anRekening,amount,mutation_id,bank_type,_id,taskAssigne,taskTittle,taskRefNumber,taskExpiredTime,taskCreatedBy,taskStatus,taskHistory)
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
      this.taskHistory = taskHistory;
      console.log(this.taskHistory);
      console.log(this.mutation_id);
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
        let taskh = results.data.data.taskHistory;
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
        }
      })
    }
  },
  setup() {
    let urlMusic = require('./pristine.mp3');
    let player =  new Audio();
    let date = ref();
    let searchTitt = ref([]);
    let currentPages= ref(1);
    let toasts = ref([]);
    let tscob = ref([]);
    let taskStats = ref([]);
    let tasks = ref([]);
    let selected = ref([]);
    let users = ref({});
    let countData = ref([]);
    let filterLists = ref([
        { label: 'Unprocess', value: 'unprocess' },
        { label: 'Unassigned', value: 'unassigned' },
        { label: 'Processed', value: 'processed' },
        { label: 'Done', value: 'done' },
    ])
    let filterListActive = ref(filterLists.value[0])
    let worker = reactive({
      username:''
    });
    let tsk = reactive({
      taskTittle:'',
      taskCreatedBy:window.localStorage.getItem('username'),
      taskRefNumber:'',
      taskSlaTime:'',
      taskExpiredTime:'',
      taskStatus:'Unassigned',
    });

    watch(date, value => {
      loadTask(filterListActive.value, '', 1, value[0], value[1])
    })

    onMounted(()=> {

      // date
      const startDate = new Date().setDate(new Date().getDate() - 1);
      const endDate = new Date();
      date.value = [startDate, endDate];

      // socket
    var acknowledgedcreate = [];

        socket.on('tasks created', (message) => {
         if(!~acknowledgedcreate.indexOf(message._id)){

            // add to array of acknowledged events
            acknowledgedcreate.unshift(message._id);

            // prevent array from growing to large
            if(acknowledgedcreate.length > 20){
                acknowledgedcreate.length = 20;
            }

            // console.log('acknowledged',acknowledgedcreate);
            // console.log('tasksbro',message);
            // console.log('title',message.taskTittle);
            // alert('oke');
            loadTask(taskStats.value,searchTitt.value,currentPages.value,date.value[0],date.value[1]);
            // console.log('role user',message.taskAssigne)
          if(message.taskAssigne == window.localStorage.getItem('username'))
            {
              if(message.taskStatus=='done'){
                showToast('Transfer Berhasil ',message.taskTittle,message.createdAt);
            // loadTask(taskStats.value,searchTitt.value,page.value);

            }else{
              showToast('Task Baru ',message.taskTittle,message.createdAt);
            // loadTask(taskStats.value,searchTitt.value,page.value);

            }
            }
        }
      });
        socket.on('tasks updated', (message) => {
             loadTask(taskStats.value,searchTitt.value,currentPages.value,date.value[0],date.value[1])
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

            // console.log('acknowledged',acknowledged);
            // console.log('tasksbro',message);
            // console.log('title',message.taskTittle);
            // alert('oke');
              loadTask(taskStats.value,searchTitt.value,currentPages.value,date.value[0],date.value[1]);
            if(message.taskAssigne == window.localStorage.getItem('username'))
            {
              console.log('task statusnya',message.taskStatus);
              if(message.taskStatus=='done'){
                console.log('donge dadi');
                showToast('Transfer Berhasil ',message.taskTittle,message.updatedAt);
            }else{
              showToast('Task Baru ',message.taskTittle,message.updatedAt);
            }
            }
        }
      });
      // get data
      loadTask(taskStats.value,searchTitt.value,currentPages.value,date.value[0],date.value[1]);
      // get worker
      
      getUser()

    });

    // Get User
    function getUser() {
      axios.get(`${process.env.VUE_APP_URL_API}/users?role=worker`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then(res => {
        users.value = res.data.map(user => {
          return {
            label: user.username,
            value: user.username,
            status: user.login_status
          }
        })
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    //delete
    function destroy(id,index) {
      axios.delete(`${process.env.VUE_APP_URL_API}/users/${id}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(()=> {
        tasks.value.splice(index,1);
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
    function loadTask(taskStat,searchTit,pages,from, to) {
      let status = (taskStat != '') ? taskStat : 'unprocess';
      let taskAssigne =`${window.localStorage.getItem('username')}`;
      let skip = (pages > 1) ? (pages-1) * 100 : 0;
      let param_admin = {
        'createdAt[$gte]' : from,
        'createdAt[$lte]' :to,
        taskStatus:status,
        $skip:skip,
        $search: searchTit
      }
      let param_users = {
          'createdAt[$gte]' : from,
          'createdAt[$lte]' :to,
          taskStatus:status,
          $skip:skip,
          taskAssigne:taskAssigne,
          $search: searchTit

      }
      let params = (window.localStorage.getItem('role')=='admin') ? param_admin : param_users;
        axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        },
        params: params
      })
      .then((result) => {
        console.log("hasil",result)
        tasks.value = result.data;
        countData.value = result.data.data;
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    function filterSelect(status){
     loadTask(status.value, '', 1, date.value[0], date.value[1])
     filterListActive.value = status
    }
    function searchTitle(e) {
      searchTitt.value = e.target.value
      console.log(searchTitt.value);
      // console.log(searchTit.value);
      loadTask(taskStats.value,searchTitt.value,currentPages.value,date.value[0],date.value[1]);

    }
     function showToast(title,content,time){
      let last = new Date(time).getTime();
      let now = new Date().getTime();
      let date = now - last;
      let second = new Date(date).getSeconds() + ' seconds ago';
      let minute = new Date(date).getSeconds() + ' minutes agoe';
      let dt = (minute > 0 ) ? minute : second;
       toasts.value.push({
         title:title,
         content:content,
         time: dt
       });
       playSound();
       console.log(toasts.value);
       console.log(dt);
    }
    function changePg() {
    loadTask(taskStats.value,searchTitt.value,currentPages.value,date.value[0],date.value[1])
    }
    function pickDate() {
    console.log(date.value);
    loadTask(taskStats.value,searchTitt.value,currentPages.value,date.value[0],date.value[1])
      // let from = date.value[0];
      // let to = date.value[1];
      // axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
      //   headers: {
      //     Authorization:window.localStorage.getItem('accessToken')
      //   },
      //   params: {
      //       'createdAt[$gte]' : from,
      //       'createdAt[$lte]' :to

      //   }
      //   // query: {
      //   //   createdAt : {
      //   //     $gte:date.value[0],
      //   //     $lte:date.value[1]
      //   //   }
      //   // }
      // })
      // .then((result) => {
      //   console.log("hasil cari tanggal",result)
      //   // tasks.value = result.data;
      //   // countData.value = result.data.data;
      // }).catch((err) =>{
      //   console.log(err.response);
      // });

    }
    function playSound(){
      player.src = urlMusic;
      player.play();
    }
    function sTs(){
       tscob.value.push({
         title:"tesbro",
         content:"hanya test",
         time: "7 min ago"
       });
       playSound();
    }

    return {
      date,
      tasks,
      currentPages,
      destroy,
      selected,
      users,
      worker,
      tsk,
      cek,
      loadTask,
      getUser,
      cekCheck,
      taskStats,
      filterSelect,
      filterListActive,
      searchTitle,
      countData,
      toasts,
      changePg,
      pickDate,
      playSound,
      sTs,
      tscob,
      filterLists
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>