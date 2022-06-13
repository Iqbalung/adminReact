<template>
  <div>
    <CCard class="mb-4">
     
      <CCardBody class="fixed-table">
        <CInputGroup class="mb-2">
          <Datepicker v-model="dateFilter" range :enableTimePicker="false" class="date-filter"></Datepicker>
          <CFormInput type="text" placeholder="Search" v-model="query.search" />
        </CInputGroup>
        <router-link :to="{ name: 'Create Invoice' }">
          <CButton class="me-2" color="primary">
            <CIcon class="text-white" name="cil-plus"/> Add Invoice
          </CButton>
        </router-link>
        <CTable class="border border-top-0" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell class="text-center nowrap">Invoice Date</CTableHeaderCell>
              <CTableHeaderCell class="text-center nowrap">Invoice Number</CTableHeaderCell>
              <CTableHeaderCell class="text-center nowrap">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody v-if="isLoading">
            <CTableRow>
              <CTableDataCell
                class="text-center"
                :colspan="3"
                >
                  <CSpinner
                    color="primary"
                  />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
          <CTableBody v-else>
            <CTableRow v-for="(item,index) in invoices.data" :key="index">
              
              <CTableDataCell class="text-center nowrap">
                <div>- {{ formatDate(item.invoice_date) }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center nowrap">
                <div>{{ item.invoice_number }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center nowrap">
                <div>
                  <a :href="`#/invoice/print/${item._id}`" target="_blank">
                    <CButton size="sm" color="primary" class="rounded me-1">
                      <CIcon class="text-white" name="cil-print"/>
                    </CButton>
                  </a>
                  <CButton size="sm" color="danger" class="rounded" @click="deleteAlert(destroy, item._id,index)">
                    <CIcon class="text-white" name="cil-trash"/>
                  </CButton>
                  <CButton size="sm" style="margin-left:5px;" color="warning" class="rounded" @click="paymentAlert(destroy, item._id,index)">
                    <CIcon class="text-white" name="cil-check"/>
                  </CButton>
                </div>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell class="text-center" colspan="3" v-show="invoices.data.length <= 0">
                No records found
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios'
import momentTz from 'moment-timezone'
import { onMounted, ref, reactive, watch } from 'vue'

export default {
  name: 'CustomerList',
  methods: {
    deleteAlert(cb, id, index) {
      this.$swal({
        title: 'Are You Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if(result.isConfirmed) {
          cb(id, index)

          this.$swal('Saved','','success');
        }
      })
    },

    paymentAlert(cb, id, index) {
      this.$swal({
        title: 'Are You Sure ?',
        icon: 'info',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, Sure',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if(result.isConfirmed) {
          cb(id, index)

          this.$swal('Saved','','success');
        }
      })
    },
  },
  
  setup() {
    const invoices = ref([]);
    const dateFilter = ref([]);
    let query = reactive({
      search: '',
      invoice_date: '',
      /* invoice_date[$gte]:invoice_date[0].toISOString().substring(0, 10) + 'T00:00:00.000Z',
      invoice_date[$lte]: invoice_date[1].toISOString().substring(0, 10) + 'T23:59:59.000Z', */
    })
    const isLoading = ref(true)

    
    function loadInvoice() {


     
      console.log(dateFilter.value[0]);
      if(dateFilter.value[0]){

        query = {
          search : query.search,
          'invoice_date[$gte]' : dateFilter.value[0].toISOString().substring(0, 10) + 'T00:00:00.000Z',
          'invoice_date[$lte]' : dateFilter.value[1].toISOString().substring(0, 10) + 'T23:59:00.000Z'
        }
      }
      axios.get(`${process.env.VUE_APP_URL_API}/invoice`, {
        params: query,
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result) => {
        invoices.value = result.data;

        stopLoading()
      }).catch((err) => {
        console.log(err.response);
      });
    }
    

    function destroy(id, index) {
      axios.delete(`${process.env.VUE_APP_URL_API}/customers/${id}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        invoices.value.data.splice(index, 1);
      }).catch((err) => {
        console.log(err.response);
      })
    }

    function startLoading() {
      isLoading.value = true
    }

    function stopLoading() {
      isLoading.value = false
    }

    function formatDate(date, utc = true) {
      const format = 'DD MMM YYYY HH:mm:ss'
      return momentTz(date).format(format)
    }

    watch(query, () => {
      startLoading()
      
      loadInvoice()
    })

    watch(dateFilter, value => {
      startLoading()
      loadInvoice()
    })

    onMounted(() => {
      loadInvoice()
      const startDate = new Date(new Date().setDate(new Date().getDate() - 1));
      const endDate = new Date();

       dateFilter.value = [startDate, endDate];
    });

    return {
      dateFilter,
      invoices,
      query,
      destroy,
      isLoading,
      formatDate,
      loadInvoice
    }
  }
}
</script>