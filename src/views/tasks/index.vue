<template>
  <div>

    <CCard class="mb-4">
      <CCardBody>
        <CInputGroup class="mb-2">
          <Datepicker v-model="dateFilter" range @closed="pickDate" :enableTimePicker="false" class="date-filter"></Datepicker>
          <CFormInput type="text" id="search" v-model="searchFilter" placeholder="Worker" class="search-filter" />
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
            <CFormInput type="text" id="search" v-model="bankTypeFilter" placeholder="Bank" />
            <CFormInput type="text" id="search" v-model="amountFilter" placeholder="Nominal" />
            <CFormInput type="text" id="search" v-model="accountNameFilter" placeholder="Name Account" />
            <CFormInput type="text" id="search" v-model="accountNumberFilter" placeholder="Account Bank" />
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
          <CButton size="sm" color="secondary" class="me-1" @click="showClearAssign(clearAssign)">Unassign</CButton>
          <CButton size="sm" color="danger" class="me-1" @click="showRequestReject(processRejectBatch)">Process Reject</CButton>
          <CButton size="sm" color="warning" @click="showRequestReject(requestRejectBatch)">Request Reject</CButton>
        </div>
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
              <CTableHeaderCell scope="col">UserId</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="(item,index) in tasks.data" :key="index" :data-key="item._id" class="selectable">
              <CTableDataCell v-show="role=='admin'" class="checkitems" :data-key="item._id">
                  <div v-if="item.taskStatus!='processed' && item.taskStatus!='done' && (item.taskAssigne === 'unassigned' || item.taskAssigne === '')">
                  <input type="checkbox" v-model="checkedItems" :value="item._id" class="checkboxitems">
                  <!-- <CFormCheck  id="item._id" v-model="checkedItems" :value="item.id"/> -->
                  </div>
                  <div v-if="(item.taskAssigne !== '' && item.taskAssigne !== 'unassigned') || item.taskStatus=='processed' || item.taskStatus=='done'">
                  <input type="checkbox" disabled/>
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
              <CTableDataCell>
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
              <CTableDataCell>
                  <div class="overflow-auto">
                  {{ item.taskData.userId }}
                  <CTooltip content="Copy Account Amount!" placement="right">
                      <template #toggler="{ on }">
                      <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copy(item.taskData.userId)">
                          <CIcon name="cil-copy"/>
                      </CButton>
                      </template>
                  </CTooltip>
                  </div>
              </CTableDataCell>
              <CTableDataCell :color="getCellColor(item.taskStatus)">{{ item.taskStatus }}</CTableDataCell>
              <CTableDataCell>
                  <CButton size="sm" class="text-primary" variant="ghost" color="light" :disabled="item.taskStatus === 'processed'" @click="processTask(item.taskData.account_number,item.taskData.anRekening,item.taskData.amount,item.taskData.mutation_id,item.taskData.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus,item.taskHistory)">
                    Detail
                  </CButton>
                  <CButton size="sm" class="text-danger" variant="ghost" color="light" @click="showRequestReject(requestReject, item)" v-if="role !== 'admin' && item.taskStatus !== 'request_reject'">
                    Request Reject
                  </CButton>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell v-show="tasks.total < 1" class="text-center" :colspan="role === 'admin' ? 8 : 7">No records found</CTableDataCell>
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
        <CForm @submit.prevent="updateWorker($swal('Saved','','success'))">
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
      <CButton color="primary" @click="showProc(proc)">Process</CButton>
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
.selection > .selected {
  background: #5f9efc;
}
.selection-area {
  background: #4f90f22d;
  border: 1px solid #4f90f2;
}
.date-filter {
  width: 40%;
}
.search-filter {
  width: 20% !important;
}
</style>

<script>
import router from '../../router'
import axios from 'axios'
import { reactive, onMounted, watch, ref } from 'vue'
import { cilChevronCircleDownAlt, cilXCircle } from '@coreui/icons';
import useClipboard from 'vue-clipboard3'
import MultiSelect from '@vueform/multiselect'
import VueSweetalert2 from 'vue-sweetalert2';

export default {
  name: 'TaskList',
  components: { MultiSelect },
  methods: {
    showClearAssign(cb) {
      this.$swal({
        title: 'Are Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          cb()

          this.$swal('Saved','','success');
        }
      })
    },
    showRequestReject(cb, task) {
      this.$swal({
        title: 'Are Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          cb(task)

          this.$swal('Saved','','success');
        }
      })
    },
    showProc(cb) {
      this.$swal({
        title:'Are you sure ?',
        icon:'info',
        showCancelButton:true,
        focusConfirm:false,
        confirmButtonText:'Process',
        cancelButtonText:'Cancel'})
      .then((result)=>{
        if(result.isConfirmed) {
          cb()

          this.$swal('Saved','','success');
        }
      })
    }
  },
  setup() {
    let urlMusic = require('./pristine.mp3');
    let player =  new Audio();

    const dateFilter = ref();
    const searchFilter = ref('');
    const userIdFilter = ref('');
    const accountNameFilter = ref('');
    const accountNumberFilter = ref('');
    const amountFilter = ref('');
    const bankTypeFilter = ref('');
    const statusFilterOptions = ref([
        { label: 'Unprocess', value: 'unprocess', checked: true },
        { label: 'Unassigned', value: 'unassigned', checked: false },
        { label: 'Processed', value: 'processed', checked: false },
        { label: 'Done', value: 'done', checked: false },
        { label: 'Request Reject', value: 'request_reject', checked: false },
        { label: 'Reject', value: 'reject', checked: false },
    ])
    const statusFilter = ref(['unprocess'])
    const collapseFilter = ref(false)

    const tasks = ref([]);

    const visibleLiveDemo = ref(false)
    const modalAdd = ref(false)
    const modalAssign = ref(false)
    const modalDetail = ref(false)

    const account_number = ref('')
    const anRekening = ref('')
    const amount = ref('')
    const mutation_id = ref('')
    const bank_type = ref('')
    const task_id = ref('')
    const taskTittle = ref('')
    const taskRefNumber = ref('')
    const taskAssigne = ref('')
    const taskSlaTime = ref('')
    const taskExpiredTime = ref('')
    const taskStatus = ref('')
    const taskCreatedBy = ref('')
    const taskHistory = ref()

    const work = ref('')

    const checkedItems = ref(new Set)
    const perPage = ref(100)
    const role = ref(window.localStorage.getItem('role'))

    let currentPages= ref(1);
    let toasts = ref([]);
    let tscob = ref([]);
    let taskStats = ref([]);

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
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, value ? value[0] : '', value ? value[1] : '')
    })

    watch(searchFilter, value => {
      loadTask(filterListActive.value.value, value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    })

    watch(userIdFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    })

    watch(accountNumberFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    })

    watch(accountNameFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    })

    watch(amountFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    })

    watch(bankTypeFilter, value => {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    })

    onMounted(()=> {
      setShiftClick()
      
      // date
      const startDate = new Date(new Date().setDate(new Date().getDate() - 1));
      const endDate = new Date();

      dateFilter.value = [startDate, endDate];

      // socket
      var acknowledgedcreate = [] ;

      // socket.on('incidents connected', (message) => {
      //   console.log(message, 'iconnected')
      // })

      // socket.on('incidents created', (message) => {
      //   console.log(message, 'icreated')
      // })

      socket.on('tasks created', (message) => {
        if (!~acknowledgedcreate.indexOf(message._id)){
          // add to array of acknowledged events
          acknowledgedcreate.unshift(message._id);

          // prevent array from growing to large
          if(acknowledgedcreate.length > 20){
            acknowledgedcreate.length = 20;
          }

          loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');

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
        loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '')
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

          loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');

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
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
      // get worker

      getUser()
    });

    function loadTask(taskStatus, searchTitle, userId, accountNumber, accountName, amount, bankType, pages, from, to) {
      // let status = (taskStatus != '') ? taskStatus : 'unprocess';
      const taskAssigne =`${window.localStorage.getItem('username')}`;
      const skip = (pages > 1) ? (pages-1) * 100 : 0;

      const param_admin = {
        ...(from ? { 'createdAt[$gte]': new Date(from.toISOString().substring(0, 10) + 'T00:00:00').toISOString() } : {}),
        ...(to ? { 'createdAt[$lte]': new Date(to.toISOString().substring(0, 10) + 'T23:59:59').toISOString() } : {}),
        // taskStatus: status,
        'taskStatus[$in]': statusFilter.value,
        userId: userId,
        'taskData.account_number': accountNumber,
        'taskData.anRekening': accountName,
        'taskData.amount': amount,
        'taskData.bank_type': bankType,
        $skip: skip,
        '$sort[createdAt]':-1,
        'taskAssigne': searchTitle
      }

      const param_users = {
        ...(from ? { 'createdAt[$gte]': new Date(from.toISOString().substring(0, 10) + 'T00:00:00').toISOString() } : {}),
        ...(to ? { 'createdAt[$lte]': new Date(to.toISOString().substring(0, 10) + 'T23:59:59').toISOString() } : {}),
        // taskStatus: status,
        'taskStatus[$in]': statusFilter.value,
        userId: userId,
        'taskData.account_number': accountNumber,
        'taskData.anRekening': accountName,
        'taskData.amount': amount,
        'taskData.bank_type': bankType,
        $skip: skip,
        '$sort[createdAt]':-1,
        taskAssigne: taskAssigne
      }

      const params = (window.localStorage.getItem('role') === 'admin') ? param_admin : param_users;

      // console.log("where",params,taskAssigne)

      axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        },
        params
      }).then((result) => {
        checkedItems.value.clear();

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

    function updateWorker(cb){
      checkedItems.value.forEach(element =>{
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
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`, { taskAssigne:work.value, taskHistory:taskh },{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
            loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })

        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      })

      checkedItems.value.clear();
      modalAssign.value = false;

      cb()
    }

    function clearAssign() {
      checkedItems.value.forEach(element => {
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
            loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })
        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      });

      console.log('success update');
      checkedItems.value.clear();
    }

    function requestReject(task) {
      axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${task._id}`,{_id:task._id,taskStatus: 'request_reject'},{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then(()=> {
        loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
      }).catch((err)=>{
        console.log(err);
      })

      console.log('success update');
      checkedItems.value.clear();
    }

    function requestRejectBatch() {
      checkedItems.value.forEach(element => {
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
            loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })
        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      });

      console.log('success update');
      checkedItems.value.clear();
    }

    function processRejectBatch() {
      checkedItems.value.forEach(element => {
        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        }).then((results)=> {
          // Axios update
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{_id:`${element}`,taskStatus: 'reject'},{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
            loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })
        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      });

      console.log('success update');
      checkedItems.value.clear();
    }

    function processTask(account_numberParam, anRekeningParam, amountParam, mutation_idParam, bank_typeParam, _idParam, taskAssigneParam, taskTittleParam, taskRefNumberParam, taskExpiredTimeParam, taskCreatedByParam, taskStatusParam, taskHistoryParam)
    {
      modalDetail.value  = true;
      account_number.value  = account_numberParam;
      anRekening.value  = anRekeningParam;
      amount.value  = amountParam;
      mutation_id.value  = mutation_idParam;
      bank_type.value  = bank_typeParam;
      task_id.value  = _idParam;
      taskAssigne.value =taskAssigneParam;
      taskTittle.value =taskTittleParam;
      taskRefNumber.value =taskRefNumberParam;
      taskExpiredTime.value =taskExpiredTimeParam;
      taskCreatedBy.value =taskCreatedByParam;
      taskStatus.value  = taskStatusParam;
      taskHistory.value  = taskHistoryParam;
    }

    function proc(){
      axios.get(`${process.env.VUE_APP_URL_API}/tasks/${task_id.value}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((results)=> {
        let date = new Date();
        let taskh = results.data.taskHistory;
        taskh.push({status: `task processed by ${window.localStorage.getItem('username')}`, updatedAt:date.toISOString()})

        // Axios update
        axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${task_id.value}`,{taskStatus:'processed',taskTimeProcess:date.toISOString(),taskHistory:taskh},{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        })
        .then(()=> {
          loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
        }).catch((err)=>{
          console.log(err);
        })

      }).catch((err)=>{
        console.log(err);
      })
    }

    function shiftAll(check) {
      if (check) {
        tasks.value.data.forEach(task => checkedItems.value.add(task._id))
      } else {
        checkedItems.value.clear()
      }
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
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '')
    }

    function pickDate() {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '')
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

      loadTask(value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '')
    }

    function getCellColor(status) {
      const colors = {
        unprocess: 'secondary',
        unassigned: 'dark',
        done: 'success',
        processed: 'info',
        request_reject: 'warning',
        reject: 'danger'
      }

      return colors[status]
    }

    function rupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
        }).format(number);
    }

    function copy(text){
        let { toClipboard }=useClipboard();
        toClipboard(text);
    }

    function extractIds(els) {
        return els.map(v => v.getAttribute('data-key'))
    }

    function onStart({event, selection}) {
        if (!event?.ctrlKey && !event?.metaKey) {
            selection.clearSelection();
            checkedItems.value.clear();
        }
    }

    function onMove({store: { changed: { added, removed } }, selection}) {
        extractIds(added).forEach(id => checkedItems.value.add(id));
        extractIds(removed).forEach(id => checkedItems.value.delete(id));
    }

    const shifting = reactive({
      active: false,
      start: 0,
      end: 0
    })

    function getShiftArea(start, end) {
      let getting = false

      tasks.value.data.forEach(task => {
        if (task._id === start) getting = true

        if (getting) {
          checkedItems.value.add(task._id)
        }

        if (task._id === end) getting = false
      })
    }

    function setShiftClick() {
      document.addEventListener('click', e => {
        const isCheck = e.target.classList.contains('checkboxitems')

        if (e.shiftKey && isCheck) {
          if (shifting.active) {
            shifting.end = e.target.value

            getShiftArea(shifting.start, shifting.end)
          } else {
            shifting.start = e.target.value

            checkedItems.value.clear()
            checkedItems.value.add(e.target.value)
          }

          shifting.active = !shifting.active
        }
      })
    }

    return {
      dateFilter,
      searchFilter,
      userIdFilter,
      accountNumberFilter,
      accountNameFilter,
      amountFilter,
      bankTypeFilter,
      statusFilterOptions,
      statusFilter,
      selectStatusFilter,
      collapseFilter,
      filterListActive,
      filterLists,

      getCellColor,

      cilChevronCircleDownAlt,
      cilXCircle,

      tasks,
      currentPages,

      visibleLiveDemo,
      modalAdd,
      modalAssign,
      modalDetail,

      account_number,
      anRekening,
      amount,
      mutation_id,
      bank_type,
      task_id,
      taskTittle,
      taskRefNumber,
      taskAssigne,
      taskSlaTime,
      taskExpiredTime,
      taskStatus,
      taskCreatedBy,
      taskHistory,
      work,

      checkedItems,
      perPage,
      role,

      selected,
      users,
      worker,
      tsk,
      cekCheck,
      taskStats,
      toasts,

      countData,

      cek,

      destroy,
      loadTask,
      getUser,
      changePg,

      updateWorker,
      clearAssign,
      requestReject,
      requestRejectBatch,
      processRejectBatch,
      processTask,
      proc,
      shiftAll,

      pickDate,
      playSound,

      sTs,
      tscob,
      shift,
      rupiah,
      copy,

      extractIds,
      onStart,
      onMove
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
