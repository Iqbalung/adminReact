<template>
  <div>
    <WidgetsStatsA />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardBody>
            <CRow>
              <CCol :sm="5">
                <h4 id="traffic" class="card-title mb-0">Traffic</h4>
                <div class="small text-medium-emphasis">January 2021</div>
              </CCol>
              <CCol :sm="7" class="d-none d-md-block">
                <CButton color="primary" class="float-end">
                  <CIcon icon="cil-cloud-download" />
                </CButton>
                <CButtonGroup
                  class="float-end me-3"
                  role="group"
                  aria-label="Basic outlined example"
                >
                  <CButton color="secondary" variant="outline">Day</CButton>
                  <CButton color="secondary" variant="outline" active
                    >Month</CButton
                  >
                  <CButton color="secondary" variant="outline">Year</CButton>
                </CButtonGroup>
              </CCol>
            </CRow>
            <CRow>
              <MainChartExample
                style="height: 300px; max-height: 300px; margin-top: 40px"
              />
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow :xs="{ cols: 1 }" :md="{ cols: 5 }" class="text-center">
              <CCol class="mb-sm-2 mb-0">
                <div class="text-medium-emphasis">Visits</div>
                <strong>29.703 Users (40%)</strong>
                <CProgress
                  class="mt-2"
                  color="success"
                  thin
                  :precision="1"
                  :value="40"
                />
              </CCol>
              <CCol class="mb-sm-2 mb-0 d-md-down-none">
                <div class="text-medium-emphasis">Unique</div>
                <strong>24.093 Users (20%)</strong>
                <CProgress
                  class="mt-2"
                  color="info"
                  thin
                  :precision="1"
                  :value="20"
                />
              </CCol>
              <CCol class="mb-sm-2 mb-0">
                <div class="text-medium-emphasis">Pageviews</div>
                <strong>78.706 Views (60%)</strong>
                <CProgress
                  class="mt-2"
                  color="warning"
                  thin
                  :precision="1"
                  :value="60"
                />
              </CCol>
              <CCol class="mb-sm-2 mb-0">
                <div class="text-medium-emphasis">New Users</div>
                <strong>22.123 Users (80%)</strong>
                <CProgress
                  class="mt-2"
                  color="danger"
                  thin
                  :precision="1"
                  :value="80"
                />
              </CCol>
              <CCol class="mb-sm-2 mb-0 d-md-down-none">
                <div class="text-medium-emphasis">Bounce Rate</div>
                <strong>Average Rate (40.15%)</strong>
                <CProgress class="mt-2" :value="40" thin :precision="1" />
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
    <WidgetsStatsD />
    <CRow>
      <CCol :md="12">
        <CCard class="mb-4">
          <CCardHeader> Traffic &amp; Sales </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol :sm="12" :lg="6">
                <CRow>
                  <CCol :sm="6">
                    <div
                      class="
                        border-start border-start-4 border-start-info
                        py-1
                        px-3
                        mb-3
                      "
                    >
                      <div class="text-medium-emphasis small">New Clients</div>
                      <div class="fs-5 fw-semibold">9,123</div>
                    </div>
                  </CCol>
                  <CCol :sm="6">
                    <div
                      class="
                        border-start border-start-4 border-start-danger
                        py-1
                        px-3
                        mb-3
                      "
                    >
                      <div class="text-medium-emphasis small">
                        Recurring Clients
                      </div>
                      <div class="fs-5 fw-semibold">22,643</div>
                    </div>
                  </CCol>
                </CRow>
                <hr class="mt-0" />
                <div
                  v-for="item in progressGroupExample1"
                  :key="item.title"
                  class="progress-group mb-4"
                >
                  <div class="progress-group-prepend">
                    <span class="text-medium-emphasis small">{{
                      item.title
                    }}</span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress thin color="info" :value="item.value1" />
                    <CProgress thin color="danger" :value="item.value2" />
                  </div>
                </div>
              </CCol>
              <CCol :sm="12" :lg="6">
                <CRow>
                  <CCol :sm="6">
                    <div
                      class="
                        border-start border-start-4 border-start-warning
                        py-1
                        px-3
                        mb-3
                      "
                    >
                      <div class="text-medium-emphasis small">Pageviews</div>
                      <div class="fs-5 fw-semibold">78,623</div>
                    </div>
                  </CCol>
                  <CCol :sm="6">
                    <div
                      class="
                        border-start border-start-4 border-start-success
                        py-1
                        px-3
                        mb-3
                      "
                    >
                      <div class="text-medium-emphasis small">Organic</div>
                      <div class="fs-5 fw-semibold">49,123</div>
                    </div>
                  </CCol>
                </CRow>
                <hr class="mt-0" />
                <div
                  v-for="item in progressGroupExample2"
                  :key="item.title"
                  class="progress-group"
                >
                  <div class="progress-group-header">
                    <CIcon :icon="item.icon" class="me-2" size="lg" />
                    <span class="title">{{ item.title }}</span>
                    <span class="ms-auto fw-semibold">{{ item.value }}%</span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress thin :value="item.value" color="warning" />
                  </div>
                </div>

                <div class="mb-5"></div>

                <div
                  v-for="item in progressGroupExample3"
                  :key="item.title"
                  class="progress-group"
                >
                  <div class="progress-group-header">
                    <CIcon :icon="item.icon" class="me-2" size="lg" />
                    <span class="title">Organic Search</span>
                    <span class="ms-auto fw-semibold">
                      {{ item.value }}
                      <span class="text-medium-emphasis small"
                        >({{ item.percent }}%)</span
                      >
                    </span>
                  </div>
                  <div class="progress-group-bars">
                    <CProgress thin :value="item.percent" color="success" />
                  </div>
                </div>
              </CCol>
            </CRow>
            <br />
            <CButton @click="shm" class="me-2" color="primary"
              ><CIcon class="text-white" name="cil-plus"
            /></CButton>
            <Ramodal v-bind:isVisible="isModalVisible">
              <template v-slot:body>
                <CForm>
                  <div class="mb-3">
                    <CFormLabel for="name">Full Name</CFormLabel>
                    <CFormInput
                      v-model="this.form.name"
                      type="text"
                      id="name"
                      placeholder="Full name"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="email">Email</CFormLabel>
                    <CFormInput
                      v-model="this.form.email"
                      type="email"
                      id="email"
                      placeholder="Email"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="username">Username</CFormLabel>
                    <CFormInput
                      v-model="this.form.username"
                      type="text"
                      id="username"
                      placeholder="Username"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="password">password</CFormLabel>
                    <CFormInput
                      v-model="this.form.password"
                      type="password"
                      id="password"
                      placeholder="password"
                    />
                  </div>
                  <div class="mb-3">
                    <CFormLabel for="mistake">Mistake</CFormLabel>
                    <CFormInput
                      v-model="this.form.mistake"
                      type="text"
                      id="mistake"
                      placeholder="mistake"
                    />
                  </div>
                  <div class="col-auto">
                    <CButton
                      @click="saveData"
                      type="submit"
                      color="primary"
                      class="mb-3"
                      >Save data</CButton
                    >
                  </div>
                </CForm>
              </template>
            </Ramodal>
            <br class="mb-2" />
            <CTable align="middle" class="mb-0 mt-2 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell class="text-center">
                    <CIcon name="cil-people" />
                  </CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell class="text-center"
                    >Username</CTableHeaderCell
                  >
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell class="text-center">Role</CTableHeaderCell>
                  <CTableHeaderCell>Mistake</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="item in info" :key="item.name">
                  <CTableDataCell class="text-center">
                    <CAvatar size="md" :src="item.avatar" />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{{ item.name }}</div>
                    <!-- <div class="small text-medium-emphasis">
                      <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                      {{ item.user.registered }}
                    </div> -->
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{{ item.username }}</div>
                    <!-- <div class="small text-medium-emphasis">
                      <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                      {{ item.user.registered }}
                    </div> -->
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{{ item.email }}</div>
                    <!-- <div class="small text-medium-emphasis">
                      <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                      {{ item.user.registered }}
                    </div> -->
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{{ item.role }}</div>
                    <!-- <div class="small text-medium-emphasis">
                      <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                      {{ item.user.registered }}
                    </div> -->
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>{{ item.mistake }}</div>
                    <!-- <div class="small text-medium-emphasis">
                      <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                      {{ item.user.registered }}
                    </div> -->
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      <CButton class="me-2" color="warning"
                        ><CIcon class="text-white" name="cil-pencil"
                      /></CButton>
                      <CButton @click="delete(item._id)" color="danger"
                        ><CIcon class="text-white" name="cil-trash"
                      /></CButton>
                    </div>
                    <!-- <div class="small text-medium-emphasis">
                      <span>{{ item.user.new ? 'New' : 'Recurring' }}</span> |
                      {{ item.user.registered }}
                    </div> -->
                  </CTableDataCell>
                  <!-- <CTableDataCell class="text-center">
                    <CIcon
                      size="xl"
                      :name="item.country.flag"
                      :title="item.country.name"
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div class="clearfix">
                      <div class="float-start">
                        <strong>{{ item.usage.value }}%</strong>
                      </div>
                      <div class="float-end">
                        <small class="text-medium-emphasis">
                          {{ item.usage.period }}
                        </small>
                      </div>
                    </div>
                    <CProgress
                      thin
                      :color="item.usage.color"
                      :value="item.usage.value"
                    />
                  </CTableDataCell>
                  <CTableDataCell class="text-center">
                    <CIcon size="xl" :name="item.payment.icon" />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div class="small text-medium-emphasis">Last login</div>
                    <strong>{{ item.activity }}</strong>
                  </CTableDataCell> -->
                </CTableRow>
                <CTableRow> </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <!-- <CModal v-show="isModalVisible">
      <CModalHeader>
        <CModalTitle>Modal title</CModalTitle>
      </CModalHeader>
      <CModalBody>Woohoo, you're reading this text in a modal!</CModalBody>
      <CModalFooter>
        <CButton @click="close">Close</CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal> -->
  </div>
</template>

<script>
import avatar1 from '@/assets/images/avatars/1.jpg'
import avatar2 from '@/assets/images/avatars/2.jpg'
import avatar3 from '@/assets/images/avatars/3.jpg'
import avatar4 from '@/assets/images/avatars/4.jpg'
import avatar5 from '@/assets/images/avatars/5.jpg'
import avatar6 from '@/assets/images/avatars/6.jpg'
import MainChartExample from './charts/MainChartExample'
import WidgetsStatsA from './widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from './widgets/WidgetsStatsTypeD.vue'
import axios from 'axios'
import Ramodal from './widgets/Ramodal.vue'
import { ref } from 'vue'
import { CForm } from '@coreui/vue'
export default {
  name: 'Dashboard',
  mounted() {
    this.getUser()
  },
  components: {
    Ramodal,
    MainChartExample,
    WidgetsStatsA,
    WidgetsStatsD,
  },
  data() {
    return {
      info: null,
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        mistake: '',
      },
    }
  },
  methods: {
    getUser: async function () {
      await axios
        .get('http://localhost:3030/users', {
          headers: {
            Authorization: localStorage.getItem('accessToken'),
          },
        })
        .then((res) => (this.info = res.data.data))
    },
    dataprint: function () {
      console.log(this.info)
    },
    showModal: function () {
      this.isModalVisible = true
    },
    closeModal: function () {
      this.isModalVisible = false
    },
    saveData: async function () {
      await axios
        .post('http://localhost:3030/users', {
          email: this.form.email,
          name: this.form.name,
          username: this.form.username,
          password: this.form.password,
          role: 'user',
          mistake: this.form.mistake,
        })
        .then(function () {
          this.form.email = ''
          this.form.name = ''
          this.form.username = ''
          this.form.password = ''
          this.form.mistake = ''
          router.push({ path: '/dashboard', redirect: true })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    delete: async function (id) {
      await axios
        .delete(`http://localhost:3030/users/${id}`, {
          headers: {
            Authorization: localStorage.getItem('accessToken'),
          },
        })
        .then(function () {
          router.push({ path: '/dashboard', redirect: true })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
  setup() {
    const isModalVisible = ref(false)
    const shm = () => {
      isModalVisible.value = !isModalVisible.value
    }
    const progressGroupExample1 = [
      { title: 'Monday', value1: 34, value2: 78 },
      { title: 'Tuesday', value1: 56, value2: 94 },
      { title: 'Wednesday', value1: 12, value2: 67 },
      { title: 'Thursday', value1: 43, value2: 91 },
      { title: 'Friday', value1: 22, value2: 73 },
      { title: 'Saturday', value1: 53, value2: 82 },
      { title: 'Sunday', value1: 9, value2: 69 },
    ]
    const progressGroupExample2 = [
      { title: 'Male', icon: 'cil-user', value: 53 },
      { title: 'Female', icon: 'cil-user-female', value: 43 },
    ]
    const progressGroupExample3 = [
      {
        title: 'Organic Search',
        icon: 'cib-google',
        percent: 56,
        value: '191,235',
      },
      { title: 'Facebook', icon: 'cib-facebook', percent: 15, value: '51,223' },
      { title: 'Twitter', icon: 'cib-twitter', percent: 11, value: '37,564' },
      { title: 'LinkedIn', icon: 'cib-linkedin', percent: 8, value: '27,319' },
    ]
    const tableExample = [
      {
        avatar: { src: avatar1, status: 'success' },
        user: {
          name: 'Yiorgos Avraamu',
          new: true,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'USA', flag: 'cif-us' },
        usage: {
          value: 50,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'success',
        },
        payment: { name: 'Mastercard', icon: 'cib-cc-mastercard' },
        activity: '10 sec ago',
      },
      {
        avatar: { src: avatar2, status: 'danger' },
        user: {
          name: 'Avram Tarasios',
          new: false,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'Brazil', flag: 'cif-br' },
        usage: {
          value: 22,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'info',
        },
        payment: { name: 'Visa', icon: 'cib-cc-visa' },
        activity: '5 minutes ago',
      },
      {
        avatar: { src: avatar3, status: 'warning' },
        user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
        country: { name: 'India', flag: 'cif-in' },
        usage: {
          value: 74,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'warning',
        },
        payment: { name: 'Stripe', icon: 'cib-cc-stripe' },
        activity: '1 hour ago',
      },
      {
        avatar: { src: avatar4, status: 'secondary' },
        user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2021' },
        country: { name: 'France', flag: 'cif-fr' },
        usage: {
          value: 98,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'danger',
        },
        payment: { name: 'PayPal', icon: 'cib-cc-paypal' },
        activity: 'Last month',
      },
      {
        avatar: { src: avatar5, status: 'success' },
        user: {
          name: 'Agapetus Tadeáš',
          new: true,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'Spain', flag: 'cif-es' },
        usage: {
          value: 22,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'primary',
        },
        payment: { name: 'Google Wallet', icon: 'cib-cc-apple-pay' },
        activity: 'Last week',
      },
      {
        avatar: { src: avatar6, status: 'danger' },
        user: {
          name: 'Friderik Dávid',
          new: true,
          registered: 'Jan 1, 2021',
        },
        country: { name: 'Poland', flag: 'cif-pl' },
        usage: {
          value: 43,
          period: 'Jun 11, 2021 - Jul 10, 2021',
          color: 'success',
        },
        payment: { name: 'Amex', icon: 'cib-cc-amex' },
        activity: 'Last week',
      },
    ]

    return {
      isModalVisible,
      shm,
      tableExample,
      progressGroupExample1,
      progressGroupExample2,
      progressGroupExample3,
    }
  },
}
</script>
