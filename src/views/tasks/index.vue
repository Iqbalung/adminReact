<template>
  <div>

    <CCard class="mb-3">
      <CCardBody>
        <CInputGroup class="mb-2">
          <Datepicker v-model="dateFilter" range :enableTimePicker="false" class="date-filter"></Datepicker>
          <CFormInput type="text" id="search" v-model="searchFilter" placeholder="Worker" class="search-filter" />
          <b-dropdown class="filter-status" variant="light" text="Status" auto-close="outside">
            <b-dropdown-item-button v-for="(option, key) in statusFilterOptions" :key="key">
              <CFormCheck :id="option.value" :value="option.value" :label="option.label" :checked="option.checked" @change="selectStatusFilter"></CFormCheck>
            </b-dropdown-item-button>
          </b-dropdown>
        </CInputGroup>
        <div class="d-flex justify-content-end">
          <CButton color="secondary" size="sm" @click="collapseFilter = !collapseFilter">
            <CIcon :icon="cilXCircle" v-if="collapseFilter" />
            <CIcon :icon="cilChevronCircleDownAlt" v-else />
          </CButton>
        </div>
        <form @submit.prevent="search">
          <CCollapse :visible="collapseFilter" :class="{ 'mt-2': collapseFilter }">
            <CInputGroup>
              <CFormInput type="text" id="search" v-model="userIdFilter" placeholder="User ID" />
              <CFormInput type="text" id="search" v-model="bankTypeFilter" placeholder="Bank" />
              <CFormInput type="text" id="search" :value="amountFilter" v-on:input="amountFilter = formatNumber($event.target.value)" placeholder="Nominal" />
              <CFormInput type="text" id="search" v-model="accountNameFilter" placeholder="Name Account" />
              <CFormInput type="text" id="search" v-model="accountNumberFilter" placeholder="Account Bank" />
            </CInputGroup>
            <CButton color="primary" class="mt-2">Search</CButton>
          </CCollapse>
        </form>
      </CCardBody>
    </CCard>

    <CCard class="mb-4">
      <CCardHeader class="bg-white d-flex align-items-center justify-content-between">
        <span>
          Data Found
          <CBadge color="primary">{{ tasks.total ? tasks.total : 0 }}</CBadge>
        </span>
        <div v-if="role === 'admin'">
          <CButton size="sm" color="success" class="me-1" @click="openModalAssign(checkedItems)" :disabled="checkedItems.size < 1">Assign Task</CButton>
          <CButton size="sm" color="success" @click="openModalShare(checkedItems)" :disabled="checkedItems.size < 1" class="me-1">Share Task</CButton>
          <CButton size="sm" color="secondary" class="me-1" @click="showClearAssign(clearAssign, [...checkedItems])" :disabled="checkedItems.size < 1">Unassign</CButton>
          <CButton size="sm" color="danger" class="me-1" @click="showProcessRejectBatch(processRejectBatch, [...checkedItems])" :disabled="checkedItems.size < 1">Process Reject</CButton>
          <CButton size="sm" color="warning" @click="showRequestRejectBatch(requestRejectBatch, [...checkedItems])" :disabled="checkedItems.size < 1">Request Reject</CButton>
          <CButton size="sm" color="info" @click="exportTasks(exportTasksFeedback)" class="ms-1">Export Tasks</CButton>
          <CDropdown variant="btn-group" class="ms-1">
            <CDropdownToggle color="info" size="sm">Print</CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem :disabled="checkedItems.size < 1" v-on:click="printSuratJalan(checkedItems)">Print Surat Jalan</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CButton size="sm" color="primary" @click="openAddTaskModal" class="ms-1">Create Tasks</CButton>
        </div>
      </CCardHeader>
      <CCardBody class="p-0 task-table">
        <CTable responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell class="nowrap" v-if="role === 'admin'">
                  <input type="checkbox" @change="e => shiftAll(e.target.checked)" v-model="shift" :disabled="checkStatusFilterActive('done')" />
              </CTableHeaderCell>
              <CTableHeaderCell class="nowrap">Created</CTableHeaderCell>
              <CTableHeaderCell class="nowrap" v-show="role=='admin' && checkStatusFilterActive('reject')">Updated At</CTableHeaderCell>
              <CTableHeaderCell class="nowrap" v-show="role=='admin'">Assigned</CTableHeaderCell>
              <CTableHeaderCell class="nowrap">Account Number</CTableHeaderCell>
              <CTableHeaderCell class="nowrap">Name</CTableHeaderCell>
              <CTableHeaderCell class="nowrap">Amount</CTableHeaderCell>
              <CTableHeaderCell class="nowrap">UserId</CTableHeaderCell>
              <CTableHeaderCell class="nowrap">Description</CTableHeaderCell>
              <CTableHeaderCell class="nowrap">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody v-if="isLoading">
            <CTableRow>
              <CTableDataCell
                align="middle"
                class="text-center"
                :colspan="role === 'admin' ? (checkStatusFilterActive('reject') ? 10 : 9) : 7"
                >
                  <CSpinner
                    color="primary"
                  />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
          <CTableBody v-else>
            <CTableRow v-for="(item,index) in tasks.data" :key="index" :data-key="item._id" class="selectable" :color="checkIsCopied(item.isCopied) ? 'danger' : null">
              <CTableDataCell v-show="role=='admin'" class="checkitems" :data-key="item._id">
                  <div v-if="item.taskStatus!='processed' && item.taskStatus!='done'">
                  <input type="checkbox" v-model="checkedItems" :value="item._id" class="checkboxitems">
                  <!-- <CFormCheck  id="item._id" v-model="checkedItems" :value="item.id"/> -->
                  </div>
                  <div v-if="item.taskStatus=='processed' || item.taskStatus=='done'">
                  <input type="checkbox" disabled/>
                  </div>
              </CTableDataCell>
              <CTableDataCell class="nowrap">{{ formatDate(item.createdAt) }}</CTableDataCell>
              <CTableDataCell v-show="role=='admin' && checkStatusFilterActive('reject')">
                {{ item.updatedAt ? item.updatedAt : '-' }}</CTableDataCell>
              <CTableDataCell v-show="role=='admin'">{{ item.taskSharedTo }}</CTableDataCell>
               <CTableDataCell v-show="role=='admin'">{{ item.userVar.customer_code }}</CTableDataCell>
               <CTableDataCell v-show="role=='admin'">{{ item.taskTittle }}</CTableDataCell>
              <CTableDataCell>
                  <div class="d-flex flex-nowrap nowrap">
                  {{ rupiah(item.taskData?.amount ?? 0) }}
                  <CTooltip content="Copy Account Amount!" placement="right" v-if="!item.isCopied?.amount">
                      <template #toggler="{ on }">
                      <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copy(item.taskData.amount, item._id, 'amount')">
                          <CIcon name="cil-copy"/>
                      </CButton>
                      </template>
                  </CTooltip>
                  </div>
              </CTableDataCell>
              <CTableDataCell>
                  <div class="d-flex flex-nowrap nowrap">
                  {{ item.taskData?.userId.substring(0, item.taskData?.userId.indexOf('\n')) }}
                  <CTooltip content="Copy Account User ID!" placement="right" v-if="!item.isCopied?.userId">
                      <template #toggler="{ on }">
                      <CButton size="sm" class="rounded d-inline-block p-0" v-on="on" color="secondary" variant="ghost" @click="copy(item.taskData?.userId, item._id, 'userId')">
                          <CIcon name="cil-copy"/>
                      </CButton>
                      </template>
                  </CTooltip>
                  </div>
              </CTableDataCell>
              <CTableDataCell v-show="role=='admin'">{{ item.taskDescription }}</CTableDataCell>
              <CTableDataCell>
                  <CButton size="sm" class="text-primary" variant="ghost" color="light" :disabled="item.taskStatus === 'processed'" @click="processTask(item.taskData?.account_number,item.taskData?.anRekening,item.taskData?.amount,item.taskData?.mutation_id,item.taskData?.bank_type,item._id,item.taskAssigne,item.taskTittle,item.taskRefNumber,item.taskExpiredTime,item.taskCreatedBy,item.taskStatus,item.taskHistory)">
                    Detail
                  </CButton>
                  <CButton size="sm" class="text-danger" variant="ghost" color="light" @click="showRequestReject(requestReject, item)" v-if="role !== 'admin' && item.taskStatus !== 'request_reject'">
                    Request Reject
                  </CButton>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell v-show="tasks.total < 1" class="text-center" :colspan="role === 'admin' ? (checkStatusFilterActive('reject') ? 10 : 9) : 7">No records found</CTableDataCell>
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
      <CForm @submit.prevent="store(storeTaskFeedback)">
        <div class="mb-3">
          <CFormLabel for="title">Task Title</CFormLabel>
          <CInputGroup>
            <MultiSelect :options="addTask.customerOptions" placeholder="Task Title" @open="setCustomerOptions" class="multiselect-control" :class="{ 'invalid': addTask.validation.taskTittle }" v-model="addTask.body.taskTittle" searchable />
            <CButton color="primary" @click="openModalCustomer" type="button">+</CButton>
          </CInputGroup>
          <CFormFeedback v-if="addTask.validation.taskTittle" class="d-block" invalid>{{ addTask.validation.taskTittle.message }}</CFormFeedback>
        </div>
        <div class="mb-3">
          <CFormLabel for="ref">Task Ref Number</CFormLabel>
          <CFormInput type="text" id="ref" placeholder="Task Ref Number" v-model="addTask.body.taskRefNumber" :invalid="addTask.validation.taskRefNumber" />
          <CFormFeedback v-if="addTask.validation.taskRefNumber" invalid>{{ addTask.validation.taskRefNumber.message }}</CFormFeedback>
        </div>
        <div class="mb-3">
          <CFormLabel for="decsription">Task Description</CFormLabel>
          <CFormTextarea id="decsription" placeholder="Task Description" v-model="addTask.body.taskDescription" :invalid="addTask.validation.taskDescription" />
          <CFormFeedback v-if="addTask.validation.taskDescription" invalid>{{ addTask.validation.taskDescription.message }}</CFormFeedback>
        </div>
        <div class="mb-3">
          <CFormLabel for="time">Task Start Time</CFormLabel>
          <Datepicker v-model="addTask.body.taskStartTime" :enableTimePicker="false" placeholder="Task Start Time" class="datepicker-control" :class="{ 'invalid': addTask.validation.taskStartTime }" />
          <CFormFeedback v-if="addTask.validation.taskStartTime" class="d-block" invalid>{{ addTask.validation.taskStartTime.message }}</CFormFeedback>
        </div>
        <div class="mb-3">
          <CFormLabel for="time">Task Expired Time</CFormLabel>
          <Datepicker v-model="addTask.body.taskExpiredTime" :enableTimePicker="false" placeholder="Task Expired Time" class="datepicker-control" :class="{ 'invalid': addTask.validation.taskExpiredTime }" />
          <CFormFeedback v-if="addTask.validation.taskExpiredTime" class="d-block" invalid>{{ addTask.validation.taskExpiredTime.message }}</CFormFeedback>
        </div>
            <div class="mb-3">
              <CButton color="primary" class="rounded">Save</CButton>
            </div>
          </CForm>

    </CModalBody>
  </CModal>

    <CModal :visible="modalCustomer" @close="closeModalCustomer">
      <CModalHeader>
        <CModalTitle>Add Customer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="saveCustomer">
          <div class="mb-3">
            <CFormLabel for="code">Customer Code</CFormLabel>
            <CFormInput type="text" id="code" placeholder="Customer Code" v-model="customer.body.customer_code" :invalid="customer.validation.customer_code" />
            <CFormFeedback v-if="customer.validation.customer_code" invalid>{{ customer.validation.customer_code.message }}</CFormFeedback>
          </div>
          <div class="mb-3">
            <CFormLabel for="name">Customer Name</CFormLabel>
            <CFormInput type="text" id="name" placeholder="Customer Name" v-model="customer.body.customer_name" :invalid="customer.validation.customer_name" />
            <CFormFeedback v-if="customer.validation.customer_name" invalid>{{ customer.validation.customer_name.message }}</CFormFeedback>
          </div>
          <div class="mb-3">
            <CFormLabel for="phone">Customer Phone</CFormLabel>
            <CFormInput type="text" id="phone" placeholder="Customer Phone" v-model="customer.body.customer_phone" :invalid="customer.validation.customer_phone" />
            <CFormFeedback v-if="customer.validation.customer_phone" invalid>{{ customer.validation.customer_phone.message }}</CFormFeedback>
          </div>
          <div class="mb-3">
            <CFormLabel for="address">Customer Address</CFormLabel>
            <CFormInput type="text" id="address" placeholder="Customer Address" v-model="customer.body.customer_address" :invalid="customer.validation.customer_address" />
            <CFormFeedback v-if="customer.validation.customer_address" invalid>{{ customer.validation.customer_address.message }}</CFormFeedback>
          </div>
          <div class="mb-3">
            <CButton color="primary" class="rounded">Save</CButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>

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
          <CButton color="primary" :disabled="!work">Save changes</CButton>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Modal Assigment -->

    <!-- Modal Share -->
    <CModal :visible="modalShare" @close="() => { modalShare = false }">
      <CModalHeader>
        <CModalTitle>Share Task</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm @submit.prevent="saveShareTask(saveShareTaskFeedback)">
          <div class="mb-3">
            <MultiSelect :options="users" placeholder="Users" v-model="sharedUsers" searchable @open="getUser" mode="tags"></MultiSelect>
          </div>
          <CButton color="primary" :disabled="!sharedUsers.length">Share Task</CButton>
        </CForm>
      </CModalBody>
    </CModal>
    <!-- Modal Share -->

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
        <p>{{ formatDate(taskExpiredTime, false) }}</p>
        <p class="mb-0 fw-bold">Task Status :</p>
        <p>{{ taskStatus }}</p>
        <p class="mb-0 fw-bold">Task History :</p>
        <div class="timeline">
          <div class="tl-item" v-for="(item,index) in taskHistory" :key="index">
              <div class="tl-dot b-primary"></div>
              <div class="tl-content">
                  <div class="">{{ item.status }}</div>
                  <div class="tl-date text-muted mt-1">{{ formatDate(item.updatedAt, false) }}</div>
              </div>
          </div>
        </div>
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
import { reactive, onBeforeMount, onMounted, watch, ref } from 'vue'
import { cilChevronCircleDownAlt, cilXCircle } from '@coreui/icons';
import useClipboard from 'vue-clipboard3'
import MultiSelect from '@vueform/multiselect'
import VueSweetalert2 from 'vue-sweetalert2'
import XLSX from 'xlsx'
import momentTz from 'moment-timezone'
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';
import './timeline.css'

export default {
  name: 'TaskList',
  components: { MultiSelect },
  methods: {
    showClearAssign(cb, items) {
      this.$swal({
        title: 'Are You Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          cb(items)

          this.$swal('Saved','','success');
        }
      })
    },
    showRequestReject(cb, task) {
      this.$swal({
        title: 'Are You Sure ?',
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
    showRequestRejectBatch(cb, items) {
      this.$swal({
        title: 'Are You Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          cb(items)

          this.$swal('Saved','','success');
        }
      })
    },
    showProcessRejectBatch(cb, items) {
      this.$swal({
        title: 'Are You Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result)=> {
        if(result.isConfirmed) {
          cb(items)

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
    },
    exportTasksFeedback() {
      this.$swal({
        title:'Tasks Exported',
        icon:'success'
      })
    },
    storeTaskFeedback() {
      this.$swal({
        title:'Tasks Created',
        icon:'success'
      })
    },
    saveShareTaskFeedback() {
      this.$swal({
        title:'Tasks Shared',
        icon:'success'
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
        { label: 'Assigned', value: 'assigned', checked: false },
        { label: 'Processed', value: 'processed', checked: false },
        { label: 'Done', value: 'done', checked: false },
        { label: 'Request Reject', value: 'request_reject', checked: false },
        { label: 'Reject', value: 'reject', checked: false },
    ])
    const statusFilter = ref([window.localStorage.getItem('role') === 'admin' ? 'unprocess' : 'assigned'])
    const collapseFilter = ref(false)

    const tasks = ref([]);

    const visibleLiveDemo = ref(false)
    const modalAdd = ref(false)
    const modalCustomer = ref(false)
    const modalAssign = ref(false)
    const modalShare = ref(false)
    const modalDetail = ref(false)

    const modalAssignItems = ref([])
    const modalShareItems = ref([])
    const sharedUsers = ref([])

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

    const addTask = reactive({
      body: {
        taskTittle: '',
        taskDescription: '',
        taskExpiredTime: '',
        taskStartTime: '',
        taskRefNumber: '',
        userVar: '',
        taskStatus: 'unprocess',
        taskCreatedBy: window.localStorage.getItem('username'),
        organization_id: window.localStorage.getItem('organization_id')
      },
      validation: [],
      customerOptions: []
    })

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

    const copied = ref(new Set)
    const isLoading = ref(true)

    const customer = reactive({
      body: {
        customer_code: '',
        customer_name: '',
        customer_phone: '',
        customer_address: '',
      },
      validation: []
    })

    watch(dateFilter, value => {
      startLoading()
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, value ? value[0] : '', value ? value[1] : '')
    })

    watch(searchFilter, value => {
      startLoading()
      loadTask(filterListActive.value.value, value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    })

    // watch(userIdFilter, value => {
    //   loadTask(filterListActive.value.value, searchFilter.value, value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    // })

    // watch(accountNumberFilter, value => {
    //   loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    // })

    // watch(accountNameFilter, value => {
    //   loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    // })

    // watch(amountFilter, value => {      
    //   loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    // })

    // watch(bankTypeFilter, value => {
    //   loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    // })

    const handleSocketCreated = message => {
      if (message.hasOwnProperty('taskTittle')) {
        loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');

        if (message.taskAssigne == window.localStorage.getItem('username')) {
          if(message.taskStatus=='done'){
            showToast('Transfer Berhasil ', message.taskTittle, message.createdAt);
          } else{
            showToast('Task Baru ', message.taskTittle, message.createdAt);
          }
        }
      }
    }

    const handleSocketUpdated = message => {
      if (message.hasOwnProperty('taskTittle')) {
        loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '')
      }
    }

    const handleSocketPatched = message => {
      if (message.hasOwnProperty('taskTittle')) {
        loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
      }

      if (message.taskAssigne == window.localStorage.getItem('username')) {
        if (message.taskStatus=='done'){
          showToast('Transfer Berhasil ', message.taskTittle, message.updatedAt);
        } else if (message.taskStatus === 'assigned') {
          showToast('Task Baru ', message.taskTittle, message.updatedAt);
        }
      }

      if (role.value === 'admin' && message.taskStatus === 'request_reject') {
        showToast('Task Request Reject', message.taskTittle, message.updatedAt)
      }
    }

    onMounted(()=> {
      setShiftClick()
      setSocket()

      if (role.value !== 'admin') {
        statusFilterOptions.value[0].checked = false
        statusFilterOptions.value[1].checked = true
      }
      
      // date
      const startDate = new Date(new Date().setDate(new Date().getDate() - 1));
      const endDate = new Date();

      dateFilter.value = [startDate, endDate];

      // socket

      // socket.on('tasks created', (message) => {
      //   handleSocketCreated(message)
      // })

      // socket.on('tasks updated', (message) => {
      //   handleSocketUpdated(message)
      // })

      // socket.on('tasks patched', (message) => {
      //   handleSocketPatched(message)
      // });

      // get data
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
      // get worker

      getUser()
    });

    function clearCheckedItems(data) {
      const filteredCheckedItems = data.filter(task => checkedItems.value.has(task._id)).map(task => task._id)

      checkedItems.value.clear()
      
      if (filteredCheckedItems.length) {
        checkedItems.value = new Set(filteredCheckedItems)
      }
    }

    function search() {
      startLoading()

      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '');
    }

    function loadTask(taskStatus, searchTitle, userId, accountNumber, accountName, amount, bankType, pages, from, to) {
      // let status = (taskStatus != '') ? taskStatus : 'unprocess';
      const taskAssigne =`${window.localStorage.getItem('username')}`;
      const skip = (pages > 1) ? (pages-1) * 100 : 0;


      const param_admin = {
        ...(from ? { 'taskStartTime[$gte]': new Date(from.toISOString().substring(0, 10) + 'T00:00:00') } : {}),
        ...(to
          ? { 'taskStartTime[$lte]': new Date(to.toISOString().substring(0, 10) + 'T23:59:59') }
          : from
            ? { 'taskStartTime[$lte]': new Date(from.toISOString().substring(0, 10) + 'T23:59:59') }
            : {}),
        // taskStatus: status,
        'taskStatus[$in]': statusFilter.value,
        userId: userId,
        'taskData.account_number': accountNumber,
        'taskData.anRekening': accountName,
        'taskData.amount': amount.replace(/\W/gi, ''),
        'taskData.bank_type': bankType,
        $skip: skip,
        '$sort[taskStartTime]':-1,
        'organization_id': window.localStorage.getItem('organization_id'),
        'taskAssigne': searchTitle
      }

      const param_users = {
        ...(from ? { 'taskStartTime[$gte]': new Date(from.toISOString().substring(0, 10) + 'T00:00:00') } : {}),
        ...(to
          ? { 'taskStartTime[$lte]': new Date(to.toISOString().substring(0, 10) + 'T23:59:59') }
          : from
            ? { 'taskStartTime[$lte]': new Date(from.toISOString().substring(0, 10) + 'T23:59:59') }
            : {}),
        // taskStatus: status,
        'taskStatus[$in]': statusFilter.value,
        userId: userId,
        'taskData.account_number': accountNumber,
        'taskData.anRekening': accountName,
        'taskData.amount': amount.replace(/\W/gi, ''),
        'taskData.bank_type': bankType,
        $skip: skip,
        '$sort[taskStartTime]':-1,
        'organization_id': window.localStorage.getItem('organization_id'),
        taskAssigne: taskAssigne
      }

      const params = (window.localStorage.getItem('role') === 'admin') ? param_admin : param_users;

      axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        },
        params
      }).then((result) => {
        clearCheckedItems(result.data.data)

        tasks.value = result.data;
        countData.value = result.data.data;

        shift.value = false

        stopLoading()
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    function openAddTaskModal() {
      addTask.body = {
        taskTittle: '',
        taskDescription: '',
        taskExpiredTime: '',
        taskStartTime: '',
        taskRefNumber: '',
        userVar: '',
        taskCreatedBy: window.localStorage.getItem('username'),
        organization_id: window.localStorage.getItem('organization_id')
      }
      addTask.validation = []
      modalAdd.value = true
    }

    function store(cb) {
      let userVar = '', taskTittle = ''

      if (addTask.body.taskTittl) {
        const customer = addTask.customerOptions.find(option => option.value === addTask.body.taskTittle).customer
        taskDescription = addTask.taskDescription;
        taskTittle = customer.customer_name

        userVar = {
          customer_id: customer._id,
          customer_code: customer.customer_code,
          customer_name: customer.customer_name
        }
      }

      axios.post(`${process.env.VUE_APP_URL_API}/tasks`, {
        ...addTask.body,
        taskTittle,
        userVar
      }, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        cb()

        modalAdd.value = false
      }).catch((err) => {
        if (err.response.status === 409) {
          const [key] = Object.keys(err.response.data.errors)

          addTask.validation = {
            [key]: {
              message: err.response.data.message
            }
          }
        } else {
          addTask.validation = err.response.data.errors
        }
      })
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
      modalAssignItems.value.forEach(element =>{
        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`, {
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        }).then((result)=> {
          let date = new Date();
          let taskh = result.data.taskHistory;

          taskh.push({
            status: `task assigned by ${window.localStorage.getItem('username')}`,
            updatedAt:date.toISOString()
          })

          // Axios update
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`, {
            taskAssigne:work.value,
            taskHistory:taskh,
            taskStatus: 'assigned'
          },{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
            // loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })

        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      })

      checkedItems.value.clear();
      modalAssignItems.value = [];
      modalAssign.value = false;

      // cb()
    }

    function saveShareTask(cb){
      modalShareItems.value.forEach(element =>{
        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`, {
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        }).then((result)=> {
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`, {
            taskSharedTo: sharedUsers.value
          },{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {

          }).catch((err)=>{
            console.log(err);
          })
        }).catch((err)=>{
          console.log(err);
        })
      })

      checkedItems.value.clear();
      modalShareItems.value = [];
      modalShare.value = false;

      cb()
    }

    function clearAssign(items) {
      items.forEach(element => {
        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        }).then((results)=> {
          let taskh = results.data.taskHistory[0];

          // Axios update
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
            taskStatus: 'unprocess',
            taskAssigne:'unassigned',
            taskHistory:taskh
          },{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
            // loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })
        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      });

      checkedItems.value.clear();
    }

    function requestReject(task) {
      let date = new Date();
      let taskh = task.taskHistory;

      taskh.push({
        status: `task requested reject by ${window.localStorage.getItem('username')}`,
        updatedAt:date.toISOString()
      })

      axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${task._id}`,{_id:task._id,taskStatus: 'request_reject',taskHistory:taskh},{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then(()=> {
        // loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
      }).catch((err)=>{
        console.log(err);
      })

      checkedItems.value.clear();
    }

    function requestRejectBatch(items) {
      items.forEach(element => {
        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        }).then((task)=> {
          let date = new Date();
          let taskh = task.data.taskHistory;

          taskh.push({
            status: `task requested reject by ${window.localStorage.getItem('username')}`,
            updatedAt:date.toISOString()
          })

          // Axios update
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{taskStatus: 'request_reject',taskHistory:taskh},{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
            // loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })
        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      });

      checkedItems.value.clear();
    }

    function processRejectBatch(items) {
      items.forEach(element => {
        axios.get(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{
          headers: {
            Authorization:window.localStorage.getItem('accessToken')
          }
        }).then((task)=> {
          let date = new Date();
          let taskh = task.data.taskHistory;

          taskh.push({
            status: `task rejected by ${window.localStorage.getItem('username')}`,
            updatedAt:date.toISOString()
          })

          // Axios update
          axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${element}`,{_id:`${element}`,taskStatus: 'reject',taskHistory:taskh},{
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          }).then(()=> {
            // loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
          }).catch((err)=>{
            console.log(err);
          })
        // Axios update
        }).catch((err)=>{
          console.log(err);
        })
      });

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
          // loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
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
    }

    function changePg() {
      loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '')
    }

    function pickDate() {
      startLoading()
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

      startLoading()
      loadTask(value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, 1, dateFilter.value ? dateFilter.value[0] : '', dateFilter.value ? dateFilter.value[1] : '')
    }

    function getCellColor(status) {
      const colors = {
        unprocess: 'secondary',
        assigned: 'secondary',
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

    async function copy(text, id, key){
        let { toClipboard }=useClipboard();
        toClipboard(text);

        try {
          await axios.patch(`${process.env.VUE_APP_URL_API}/tasks/${id}`, {
            [`isCopied.${key}`]: true 
          }, {
            headers: {
              Authorization:window.localStorage.getItem('accessToken')
            }
          })

          // loadTask(filterListActive.value.value, searchFilter.value, userIdFilter.value, accountNumberFilter.value, accountNameFilter.value, amountFilter.value, bankTypeFilter.value, currentPages.value ,dateFilter.value ? dateFilter.value[0] : '' ,dateFilter.value ? dateFilter.value[1] : '');
        } catch (err) {
          console.log(err)
        }
    }

    const shifting = reactive({
      active: false,
      start: 0,
      end: 0
    })

    function getShiftArea(startId, endId) {
      let getting = false
      let start = startId
      let end = endId

      const startIndex = tasks.value.data.findIndex(task => task._id === start)
      const endIndex = tasks.value.data.findIndex(task => task._id === end)

      if (endIndex < startIndex) {
        start = endId
        end = startId
      }

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

    function exportTasks(cb) {
      const worksheet = XLSX.utils.json_to_sheet(tasks.value.data)
      const workbook = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

      XLSX.writeFile(workbook, "tasks.xlsx");

      cb()
    }

    function checkStatusFilterActive(status) {
      return statusFilter.value.length ? statusFilter.value.every(filter => filter === status) : false
    }

    function checkIsCopied(isCopied) {
      return isCopied && isCopied.hasOwnProperty('accountNumber') && isCopied.hasOwnProperty('amount')
    }
    
    function openModalAssign(items) {
      modalAssign.value = true

      modalAssignItems.value = [...items]
    }
    
    function openModalShare(items) {
      modalShare.value = true

      modalShareItems.value = [...items]
    }
    
    function openModalCustomer() {
      customer.body = {
        customer_code: '',
        customer_name: '',
        customer_phone: '',
        customer_address: '',
      }
      customer.validation = []

      modalCustomer.value = true
      modalAdd.value = false
    }
    
    function closeModalCustomer() {
      modalCustomer.value = false
      modalAdd.value = true
    }

    function saveCustomer() {
      axios.post(`${process.env.VUE_APP_URL_API}/customers`, customer.body, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        closeModalCustomer()
      }).catch((err) => {
        if (err.response.status === 409) {
          const [key] = Object.keys(err.response.data.errors)

          customer.validation = {
            [key]: {
              message: err.response.data.message
            }
          }
        } else {
          customer.validation = err.response.data.errors
        }
        console.log(customer.validation)
      })
    }

    function printSuratJalan(items) {
      window.open(router.resolve({ name: 'Print Surat Jalan', query: { items: [...items] } }).href, '_blank')
    }

    function formatDate(date, utc = true) {
      const format = 'DD MMM YYYY HH:mm:ss'
      return utc ? momentTz(date).utc().format(format) : momentTz(date).tz('Asia/Jakarta').format(format)
    }

    function formatNumber(number) {
      return number !== '' ? new Intl.NumberFormat().format(number.replace(/\D/gi, '')) : ''
    }

    function startLoading() {
      isLoading.value = true
    }

    function stopLoading() {
      isLoading.value = false
    }

    function setSocket() {
      const client = io(process.env.VUE_APP_URL_API, {
        extraHeaders: {
          Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
        }
      });
      const app = feathers();

      app.configure(socketio(client));

      client.on('connect', async () => {
        // console.log('connected')
        client.emit('create', 'authentication', {
          strategy: 'jwt',
          accessToken: window.localStorage.getItem('accessToken')
        }, function(error, newAuthResult) {
          // console.log('auth success')

          app.service('tasks')
            .on('created', message => {
              // console.log('created task from socet')
              handleSocketCreated(message)
            });
          app.service('tasks')
            .on('patched', message => {
              // console.log('patched task from socet')
              handleSocketPatched(message)
            });
          app.service('tasks')
            .on('updated', message => {
              // console.log('updated task from socet')
              handleSocketUpdated(message)
            });
        });

      });
    }

    function setCustomerOptions() {
      axios.get(`${process.env.VUE_APP_URL_API}/customers`, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
        .then(res => {
          addTask.customerOptions = res.data.data.map(customer => {
            return {
              label: customer.customer_name,
              value: customer._id,
              customer
            }
          })
        })
        .catch(err => {
          console.log(err)
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
      checkStatusFilterActive,
      checkIsCopied,

      getCellColor,

      cilChevronCircleDownAlt,
      cilXCircle,

      tasks,
      currentPages,

      visibleLiveDemo,
      modalAdd,
      modalAssign,
      modalAssignItems,
      modalShare,
      modalShareItems,
      modalDetail,
      modalCustomer,

      customer,

      sharedUsers,

      openModalAssign,
      openModalShare,
      openModalCustomer,
      
      closeModalCustomer,
      saveCustomer,

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
      saveShareTask,
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
      
      exportTasks,
      copied,
      formatDate,
      formatNumber,
      isLoading,
      search,

      openAddTaskModal,
      addTask,
      store,
      setCustomerOptions,
      printSuratJalan
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>


<style>
.task-table .table-responsive {
  display: block;
  max-height: 500px;
  overflow: auto;
}
.task-table th {
  background-color: white;
  position: sticky;
  top: 0;
}
.task-table th::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  height: 1px;
  width: 100%;
  border-bottom: 2px solid currentColor;
}
.task-table tbody {
  border-top: none !important;
}
</style>
