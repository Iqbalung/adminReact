<template>
  <CRow class="gx-3">
    <CCol xs="12">
      <CCard class="mb-3">
        <CCardHeader class="bg-white">Task</CCardHeader>
        <CCardBody>
          <div>
            <CFormLabel for="code">Task</CFormLabel>
            <v-select class="select-control" placeholder="Task" :filterable="false" :options="taskOptions" @search="setTaskOptions" v-model="selectedTask"></v-select>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol>
      <CCard class="mb-3">
        <CCardHeader class="bg-white">Create New Invoice</CCardHeader>
        <CCardBody>
          <div class="mb-3">
            <CFormLabel for="code">Bill From</CFormLabel>
            <CFormInput placeholder="Bill From" v-model="body.invoice_bill_from" :invalid="!!validation.invoice_bill_from" />
            <CFormFeedback v-if="validation.invoice_bill_from" invalid>{{ validation.invoice_bill_from.message }}</CFormFeedback>
          </div>
          <div>
            <CFormLabel for="code">Bill To</CFormLabel>
            <MultiSelect :options="customerOptions" placeholder="Bill To" v-model="body.invoice_bill_to" searchable object class="multiselect-control" :class="{ 'invalid': validation.invoice_bill_to }" />
            <CFormFeedback v-if="validation.invoice_bill_to" class="d-block" invalid>{{ validation.invoice_bill_to.message }}</CFormFeedback>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol>
      <CCard class="mb-3">
        <CCardHeader class="bg-white">Invoice Details</CCardHeader>
        <CCardBody>
          <div class="mb-3">
            <CFormLabel for="time">Invoice Date</CFormLabel>
            <Datepicker :enableTimePicker="false" placeholder="Invoice Date" v-model="body.invoice_date" class="datepicker-control" :class="{ 'invalid': validation.invoice_date }" />
            <CFormFeedback v-if="validation.invoice_date" class="d-block" invalid>{{ validation.invoice_date.message }}</CFormFeedback>
          </div>
          <div>
            <CFormLabel for="time">Invoice Number</CFormLabel>
            <CFormInput placeholder="Invoice Number" v-model="body.invoice_number" :invalid="!!validation.invoice_number" />
            <CFormFeedback v-if="validation.invoice_number" invalid>{{ validation.invoice_number.message }}</CFormFeedback>
          </div>
           <div>
             <br>
            <CFormLabel for="code">Payment Type</CFormLabel>
            <MultiSelect :options="options" placeholder="Payment Type" v-model="body.payment_type" searchable object class="multiselect-control" :class="{ 'invalid': validation.invoice_bill_to }" />
           
          </div>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol xs="12">
      <CCard class="mb-3">
        <CCardHeader class="bg-white d-flex align-items-center justify-content-between">
          Items
          <CButton color="primary" size="sm" @click="addItem">Add Item</CButton>
        </CCardHeader>
        <CCardBody>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Item Type</CTableHeaderCell>
                <CTableHeaderCell>Price</CTableHeaderCell>
                <CTableHeaderCell style="width: 15%;">Quantity</CTableHeaderCell>
                <CTableHeaderCell>Subtotal</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(item, key) in body.invoice_items" :key="key">
                <CTableDataCell align="middle">{{ key + 1 }}</CTableDataCell>
                <CTableDataCell align="middle">
                  <MultiSelect placeholder="Item Type" :options="itemOptions" v-model="body.invoice_items[key].product" searchable object />
                </CTableDataCell>
                <CTableDataCell align="middle">{{ body.invoice_items[key].item_price ? formatPrice(body.invoice_items[key].item_price) : 0 }}</CTableDataCell>
                <CTableDataCell align="middle">
                  <input type="text" class="form-control" placeholder="Quantity" v-model="body.invoice_items[key].item_qty">
                </CTableDataCell>
                <CTableDataCell align="middle">{{ body.invoice_items[key].item_subtotal }}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol xs="4">
      <CCard class="mb-3">
        <CCardHeader class="bg-white">
          Total
        </CCardHeader>
        <CCardBody>
          <div class="d-flex align-items-center justify-content-between">
            <h3 class="fw-bold m-0">Total:</h3>
            <h3 class="fw-bold m-0">{{ formatPrice(body.invoice_total) }}</h3>
          </div>
        </CCardBody>
        <CCardFooter class="py-3">
          <CButton color="primary" class="me-1" v-on:click="saveInvoice">Save Invoice</CButton>
          <router-link :to="{ name: 'Invoice' }">
            <CButton color="secondary">Cancel</CButton>
          </router-link>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { reactive, ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import routers from '../../router'
import MultiSelect from '@vueform/multiselect'
import VSelect from 'vue-select'

export default {
  name: 'Create Customer',
  components: {
    MultiSelect,
    VSelect
  },
  data () {
    return {
      value: '',
      options: ['cash', 'piutang']
    }
  },
  setup() {
    const body = reactive({
      invoice_bill_from: '',
      invoice_bill_to: '',
      invoice_date: '',
      invoice_number: '',
      invoice_total: 0,
      payment_type: '', 
      invoice_items: [
        {
          item_name: '',
          item_qty: '',
          item_price: 0,
          item_subtotal: 0,
          product: {}
        }
      ]
    })
    const validation = ref([])
    const router = routers

    const customerOptions = ref([])
    const itemOptions = ref([])
    const taskOptions = ref([])
    let paymentOptions = []

    const selectedTask = ref()

    const setCustomerOptions = () => {
      axios.get(`${process.env.VUE_APP_URL_API}/customers`, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
        .then(res => {
          customerOptions.value = res.data.data.map(customer => {
            
            return {
              label: customer.customer_name,
              value: customer._id,
            }
          })
        })
        .catch(err => {
          console.log(err)
        })

        console.log("why",customerOptions)
    }

    const setPaymentOptions = () => {
      return {
        value: [
          { name: 'Vue.js', language: 'JavaScript' },
          { name: 'Rails', language: 'Ruby' },
          { name: 'Sinatra', language: 'Ruby' },
          { name: 'Laravel', language: 'PHP', $isDisabled: true },
          { name: 'Phoenix', language: 'Elixir' }
        ]
      }
    }

    const setItemOptions = () => {
      axios.get(`${process.env.VUE_APP_URL_API}/items`, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
        .then(res => {
          itemOptions.value = res.data.data.map(product => {
            return {
              label: product.product_name,
              value: product._id,
              price: product.product_price,
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }

    const setTaskOptions = (query, loading) => {
      if (loading) {
        loading(true)
      }

      axios.get(`${process.env.VUE_APP_URL_API}/tasks`, {
        params: {
          taskRefNumber: query,
          $limit: 10
        },
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
        .then(res => {
          taskOptions.value = res.data.data.map(task => {
            return {
              label: task.taskRefNumber,
              value: task._id,
              task,
            }
          })

          if (loading) {
            loading(false)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }

    const setForm = () => {
      const task = selectedTask.value?.task

      if (task) {
        body.invoice_bill_from = task.taskCreatedBy
        body.invoice_bill_to = {
          label: task.userVar.customer_name,
          value: task.userVar.customer_id,
        }
        body.invoice_date = task.taskStartTime
        body.invoice_number = task.taskRefNumber
        body.taskId = task._id
      }
    }

    const setItemData = () => {
      body.invoice_items.forEach((item, key) => {
        const productData = body.invoice_items[key].product
        
        if (productData) {
          body.invoice_items[key].item_name = productData.label
          body.invoice_items[key].item_price = productData.price
          body.invoice_items[key].item_subtotal = productData.price * body.invoice_items[key].item_qty 
        }
      })
    }

    const addItem = () => {
      body.invoice_items.push({
        item_name: '',
        item_qty: '',
        item_price: 0,
        item_subtotal: 0,
        product: {
          price: 0
        }
      })
    }

    const countTotal = () => {
      body.invoice_total = body.invoice_items.reduce((total, item) => {
        total += item.item_subtotal

        return total
      }, 0)
    }

    const formatPrice = price => price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1\.')

    const saveInvoice = () => {
      let invoice_bill_to = ''

      if (body.invoice_bill_to) {
        invoice_bill_to = customerOptions.value.find(option => option.value === body.invoice_bill_to.value).label
      }

      body.payment_type = body.payment_type.value

      axios.post(`${process.env.VUE_APP_URL_API}/invoice`, {
        ...body,
        invoice_bill_to,
        invoice_items: body.invoice_items.map(item => ({
          item_name: item.item_name,
          item_price: item.item_price,
          item_qty: item.item_qty,
          item_subtotal: item.item_subtotal
        }))
      }, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        window.location.href = "/invoice#/invoice"
        
      }).catch((err) => {
        if (err.response.status === 409 || err.response.status === 400) {
          const [key] = Object.keys(err.response.data.errors)

          validation.value = {
            [key]: {
              message: err.response.data.message
            }
          }

         
        } else {
          validation.value = err.response.data.errors
        }
      })
    }

    watch(() => body.invoice_items, () => {
      setItemData()
      countTotal()
    }, { deep: true })

    watch(selectedTask, () => setForm())

    onMounted(() => {
      setCustomerOptions()
      setItemOptions()
      //setTaskOptions()
      setPaymentOptions()
    })

    return {
      body,
      validation,
      customerOptions,
      itemOptions,
      taskOptions,
      formatPrice,
      setTaskOptions,
      selectedTask,
      addItem,
      saveInvoice,
      paymentOptions
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>