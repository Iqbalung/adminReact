<template>
  <div>

    <CCard class="mb-4">
      <CCardBody>
        <CInputGroup class="mb-2">
          <Datepicker v-model="dateFilter" range @closed="pickDate" :enableTimePicker="false"></Datepicker>
          <CFormInput type="text" id="search" v-model="searchFilter" placeholder="Worker"/>
          <b-dropdown class="filter-status" variant="light" text="Status" auto-close="outside">
            <b-dropdown-item-button v-for="(option, key) in statusFilterOptions" :key="key">
              <CFormCheck :id="option.value" :value="option.value" :label="option.label" :checked="option.checked" @change="selectStatusFilter"></CFormCheck>
            </b-dropdown-item-button>
          </b-dropdown>
          <div class="d-grid">
            <CButton color="primary" class="filter-button">Search</CButton>
          </div>
        </CInputGroup>
        <div class="d-flex justify-content-end">
          <CButton color="secondary" size="sm" @click="collapseFilter = !collapseFilter">
            <CIcon :icon="cilXCircle" v-if="collapseFilter" />
            <CIcon :icon="cilChevronCircleDownAlt" v-else />
          </CButton>
        </div>
        <CCollapse :visible="collapseFilter" :class="{ 'mt-2': collapseFilter }">
          <CInputGroup>
            <CFormInput type="text" id="search" v-model="userIdFilter" placeholder="User ID" />
            <CFormInput type="text" id="search" v-model="accountNumberFilter" placeholder="Bank" />
            <CFormInput type="text" id="search" v-model="amountFilter" placeholder="Nominal" />
            <CFormInput type="text" id="search" v-model="bankTypeFilter" placeholder="Account Bank" />
          </CInputGroup>
        </CCollapse>
      </CCardBody>
    </CCard>

    <CCard class="mb-4">
      <CCardHeader class="bg-white d-flex align-items-center justify-content-between">
        <span>
          Data Found
          <CBadge color="primary">{{ tasks.total ? tasks.total : 0 }}</CBadge>
        </span>
        <div v-if="role === 'admin'">
          <CButton size="sm" color="success" class="me-1" @click="() => { modalAssign = true }">Assign Task</CButton>
          <CButton size="sm" color="secondary" class="me-1" @click="clearAssign()">Unassign</CButton>
          <CButton size="sm" color="danger" class="me-1">Process Reject</CButton>
          <CButton size="sm" color="warning" @click="requestRejectBatch()">Request Reject</CButton>
        </div>
        <!-- <CDropdown color="light">
          <CDropdownToggle color="dark">{{ filterListActive.label }}</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem component="button" v-for="(filter, key) in filterLists" @click="filterSelect(filter)">{{ filter.label }}</CDropdownItem>
          </CDropdownMenu>
        </CDropdown> -->
      </CCardHeader>
      <CCardBody class="p-0">

        <CTable responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col" v-if="role === 'admin'">
                  <input type="checkbox" @change="e => shiftAll(e.target.checked)" v-model="shift" :disabled="filterListActive.value === 'done'" />
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">Created</CTableHeaderCell>
              <CTableHeaderCell scope="col" v-show="role=='admin'">Assigned</CTableHeaderCell>
              <CTableHeaderCell scope="col">Account Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="(item,index) in tasks.data" :key="index">
              <CTableDataCell v-show="role=='admin'">
                  <div v-if="item.taskStatus!='processed' && item.taskStatus!='done'">
                  <input type="checkbox" v-model="checkedItems" :value="item._id">
                  <!-- <CFormCheck  id="item._id" v-model="checkedItems" value="item.id"/> -->
                  </div>
                  <div v-if="item.taskStatus=='processed' || item.taskStatus=='done'">
                  <CFormCheck disabled/>
                  </div>
              </CTableDataCell>
              <CTableDataCell>{{ new Date(item.createdAt).toLocaleDateString() }}</CTableDataCell>
              <CTableDataCell v-show="role=='admin'">{{ item.taskAssigne }}</CTableDataCell>
              <CTableDataCell>
                  <div class="overflow-auto">{{ item.taskData.account_number }}
                  <CTooltip content="Copy Account Number" placement="right">
                      <template #toggler="{ on }">

                      <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copy(item.taskData.account_number)">
                          <CIcon name="cil-copy"/>
                      </CButton>
                      </template>
                  </CTooltip>
                  </div>
              </CTableDataCell>
              <CTableDataCell v-show="role=='admin'">
                  <div class="overflow-auto">{{ item.taskData.anRekening }}
                  <CTooltip content="Copy Account Name" placement="right">
                      <template #toggler="{ on }">

                      <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copy(item.taskData.anRekening)">
                          <CIcon name="cil-copy"/>
                      </CButton>
                      </template>
                  </CTooltip>
                  </div>
              </CTableDataCell>
              <CTableDataCell>
                  <div class="overflow-auto">
                  {{ rupiah(item.taskData.amount) }}
                  <CTooltip content="Copy Account Amount!" placement="right">
                      <template #toggler="{ on }">
                      <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copy(item.taskData.amount)">
                          <CIcon name="cil-copy"/>
                      </CButton>
                      </template>
                  </CTooltip>
                  </div>
              </CTableDataCell>
              <CTableDataCell :color="getCellColor(item.taskStatus)">{{ item.taskStatus }}</CTableDataCell>
              <CTableDataCell>
                  <CButton size="sm" class="text-primary" variant="ghost" color="light" :disabled="item.taskStatus === 'processed'" @click="process(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus,item.taskHistory)">
                    Detail
                  </CButton>
                  <CButton size="sm" class="text-danger" variant="ghost" color="light" @click="requestReject(item)" v-if="role !== 'admin' && item.taskStatus !== 'request_reject'">
                    Request Reject
                  </CButton>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell v-show="tasks.total < 1" class="text-center" :colspan="role === 'admin' ? 8 : 6">No records found</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
        
        <div class="d-flex justify-content-center">
          <b-pagination v-model="currentPages" :total-rows="tasks.total" :per-page="perPage" @click="changePg" />
        </div>
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
    <CModal :visible="modalAssign" @close="() => { modalAssign = false }">
      <CModalHeader>
        <CModalTitle>Modal Assignment</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="updateWorker()">
          <div class="mb-3">
            <MultiSelect :options="users" placeholder="Users" v-model="work" searchable @open="getUser">
              <template #option="props">
                <div class="d-flex justify-content-between align-items-center w-100">
                  <span>{{ props.option.label }}</span>            
                  <div v-if="props.option.status">
                    <div style="width: 16px; height: 16px;" class="rounded-circle bg-success"></div>
                  </div>
                  <div v-else>
                    <div style="width: 16px; height: 16px; background-color: #eee;" class="rounded-circle"></div>
                  </div>
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
.table > :not(caption) > * > * {
	padding: .5rem 1rem;
}

.filter-status {
  flex: 1 1 auto;
  text-align: left;
  border: 1px solid #ced4da;
}
.filter-status .dropdown-toggle {
  color: #212529;
  background-color: #fff;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.filter-status .dropdown-menu {
  width: 100%;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.dp__input {
  padding: .45rem .75rem;
  padding-left: 35px;
  border-radius: 0;
}
.multiselect {
  border-radius: 0 !important;
}
.filter-button {
  border-radius: 0;
}


</style>

<script>
import router from '../../router'
import axios from 'axios'
import { reactive, onMounted, watch, ref } from 'vue'
import { cilChevronCircleDownAlt, cilXCircle } from '@coreui/icons';
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
        modalAssign: false,
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
    copy(text){
       let { toClipboard }=useClipboard();
       toClipboard(text);
    },
    updateWorker(){
      this.checkedItems.forEach(element =>{
        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`, {
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        }).then((result)=> {
          let date = new Date();
          let taskh = result.data.taskHistory;
          
          taskh.push({
            status: `task assigned by lina ${window.localStorage.getItem('username')}`,
            updatedAt:date.toISOString()
          })
  
          // Axios update
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`, { taskAssigne:this.work, taskHistory:taskh },{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
          }).catch((err)=>{
            console.log(err);
          })

        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      })

      this.checkedItems = [];
      this.modalAssign = false;
      this.$swal('Saved','','success');
    },
     clearAssign() {
      this.$swal({
        title: 'Are Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          this.checkedItems.forEach(element => {
            axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
              headers: {
                Authorization:window.localStorage.getItem('accessToken')
              }
            }).then((results)=> {
              let taskh = results.data.taskHistory[0];
          
              // Axios update
              axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{taskAssigne:'unassigned',taskHistory:taskh},{
                headers: {
                  Authorization:window.localStorage.getItem('accessToken')
                }
              }).then(()=> {
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
     requestReject(task) {
      this.$swal({
        title: 'Are Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          // Axios update
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${task._id}`,{taskStatus: 'request_reject'},{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
          }).catch((err)=>{
            console.log(err);
          })
          
          console.log('success update');
          this.checkedItems = [];
          this.$swal('Saved','','success');
        }
      })
    },
     requestRejectBatch() {
      this.$swal({
        title: 'Are Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          this.checkedItems.forEach(element => {
            axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
              headers: {
                Authorization:window.localStorage.getItem('accessToken')
              }
            }).then((results)=> {          
              // Axios update
              axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{taskStatus: 'request_reject'},{
                headers: {
                  Authorization:window.localStorage.getItem('accessToken')
                }
              }).then(()=> {
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
    },
    shiftAll(check) {
      this.checkedItems = check ? this.tasks.data.map(task => task._id) : []
    },
    setShiftClick() {
      document.addEventListener('keydown', e => {
        if (e.shiftKey) {
          const count = this.checkedItems?.length
          
          this.checkedItems = !count ? this.tasks.data?.map(task => task._id) : []
        }
      })
    }
  },
  mounted() {
    this.setShiftClick()
  },
  setup() {
    let urlMusic = require('./pristine.mp3');
    let player =  new Audio();

    const dateFilter = ref();
    const searchFilter = ref('');
    const userIdFilter = ref('');
    const accountNumberFilter = ref('');
    const amountFilter = ref('');
    const bankTypeFilter = ref('');
    const statusFilterOptions = ref([
        { label: 'Unprocess', value: 'unprocess', checked: true },
        { label: 'Unassigned', value: 'unassigned', checked: false },
        { label: 'Processed', value: 'processed', checked: false },
        { label: 'Done', value: 'done', checked: false },
        { label: 'Request Reject', value: 'request_reject', checked: false },
    ])
    const statusFilter = ref(['unprocess'])
    const collapseFilter = ref(false)

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
    let shift = ref(true)

    watch(dateFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, 1, value[0], value[1])
    })

    watch(searchFilter, value => {
      loadTask(filterListActive.value.value, value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value[0], dateFilter.value[1]);
    })

    watch(userIdFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value[0], dateFilter.value[1]);
    })

    watch(accountNumberFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value[0], dateFilter.value[1]);
    })

    watch(amountFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, value, bankTypeFilter.value, 1, dateFilter.value[0], dateFilter.value[1]);
    })

    watch(bankTypeFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, value, 1, dateFilter.value[0], dateFilter.value[1]);
    })

    onMounted(()=> {
      // date
      const startDate = new Date(new Date().setDate(new Date().getDate() - 1));
      const endDate = new Date();

      dateFilter.value = [startDate, endDate];

      // socket
      var acknowledgedcreate = [];

      socket.on('tasks created', (message) => {
        if (!~acknowledgedcreate.indexOf(message._id)){
          // add to array of acknowledged events
          acknowledgedcreate.unshift(message._id);

          // prevent array from growing to large
          if(acknowledgedcreate.length > 20){
            acknowledgedcreate.length = 20;
          }

          loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value, dateFilter.value[0], dateFilter.value[1]);

          if (message.taskAssigne == window.localStorage.getItem('username')) {
            if(message.taskStatus=='done'){
              showToast('Transfer Berhasil ', message.taskTittle, message.createdAt);
            } else{
              showToast('Task Baru ', message.taskTittle, message.createdAt);
            }
          }
        }
      })
      
      socket.on('tasks updated', (message) => {
        loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value, dateFilter.value[0], dateFilter.value[1])
      })

      var acknowledged = [];
      
      socket.on('tasks patched', (message) => {
        if (!~acknowledged.indexOf(message._id)){
          // add to array of acknowledged events
          acknowledged.unshift(message._id);

          // prevent array from growing to large
          if (acknowledged.length > 20){
            acknowledged.length = 20;
          }

          loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value[0] ,dateFilter.value[1]);
          
          if (message.taskAssigne == window.localStorage.getItem('username')) {
            if (message.taskStatus=='done'){
              showToast('Transfer Berhasil ', message.taskTittle, message.updatedAt);
            } else {
              showToast('Task Baru ', message.taskTittle, message.updatedAt);
            }
          }
        }
      });

      // get data
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value[0] ,dateFilter.value[1]);
      // get worker
      
      getUser()
    });

    function loadTask(taskStatus, searchTitle, userId, accountNumber, amount, bankType, pages, from, to) {
      // let status = (taskStatus != '') ? taskStatus : 'unprocess';
      const taskAssigne =`${window.localStorage.getItem('username')}`;
      const skip = (pages > 1) ? (pages-1) * 100 : 0;

      const param_admin = {
        'createdAt[$gte]': from.toISOString(),
        'createdAt[$lte]':to.toISOString(),
        // taskStatus: status,
        'taskStatus[$in]': statusFilter.value, 
        userId: userId,
        'taskData.account_number': accountNumber,
        'taskData.amount': amount,
        'taskData.bank_type': bankType,
        $skip: skip,
        $search: searchTitle
      }
      const param_users = {
        'createdAt[$gte]': from.toISOString(),
        'createdAt[$lte]': to.toISOString(),
        // taskStatus: status,
        'taskStatus[$in]': statusFilter.value,
        userId: userId,
        'taskData.account_number': accountNumber,
        'taskData.amount': amount,
        'taskData.bank_type': bankType,
        $skip: skip,
        taskAssigne: taskAssigne,
        $search: searchTitle
      }

      const params = (window.localStorage.getItem('role') === 'admin') ? param_admin : param_users;

      console.log(params)
        
      axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        },
        params
      }).then((result) => {
        tasks.value = result.data;
        countData.value = result.data.data;
        
        shift.value = false
      }).catch((err) =>{
        console.log(err.response);
      });
    }

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
      if(assign != 'unassigned') {
        return 'true';
      }
    }

    function filterSelect(status){
     loadTask(status.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value[0], dateFilter.value[1])
     filterListActive.value = status
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
    loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value[0] ,dateFilter.value[1])
    }
    function pickDate() {

    loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value[0] ,dateFilter.value[1])
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

    function selectStatusFilter(e) {
      const { value, checked } = e.target
      const index = statusFilterOptions.value.findIndex(options => options.value === value)

      statusFilterOptions.value[index].checked = checked
      statusFilter.value = statusFilterOptions.value.filter(option => option.checked).map(option => option.value)

      loadTask(value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value[0], dateFilter.value[1])
    }

    function getCellColor(status) {
      const colors = {
        unprocess: 'secondary',
        unassigned: 'dark',
        done: 'success',
        processed: 'info',
        request_reject: 'warning',
        process_reject: 'danger'
      }

      return colors[status]
    }

    return {
      dateFilter,
      searchFilter,
      userIdFilter,
      accountNumberFilter,
      amountFilter,
      bankTypeFilter,
      statusFilterOptions,
      statusFilter,
      selectStatusFilter,
      collapseFilter,
      getCellColor,
      cilChevronCircleDownAlt,
      cilXCircle,
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
      countData,
      toasts,
      changePg,
      pickDate,
      playSound,
      sTs,
      tscob,
      filterLists,
      shift
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>