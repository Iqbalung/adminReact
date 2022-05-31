<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white d-flex align-items-center justify-content-between">
        Invoice
        <div>
          <CFormInput type="text" placeholder="Search" v-model="query.search" />
        </div>
      </CCardHeader>
      <CCardBody class="fixed-table">
        <CTable class="border border-top-0" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell class="text-center">No Invoice</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Customer Code</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Item</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody v-if="isLoading">
            <CTableRow>
              <CTableDataCell
                class="text-center"
                :colspan="4"
                >
                  <CSpinner
                    color="primary"
                  />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
          <CTableBody v-else>
            <CTableRow v-for="(item,index) in invoices.data" :key="index">
              <CTableDataCell class="text-center">
                <div>{{ item.invoice_no }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.customer_code }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.item }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>
                  <CBadge color="danger" class="rounded" @click="deleteAlert(destroy, item._id,index)">
                    <CIcon class="text-white" name="cil-trash"/>
                  </CBadge>
                </div>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell class="text-center" colspan="4" v-show="invoices.data.length <= 0">
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
  },
  setup() {
    const invoices = ref([]);
    const query = reactive({
      search: ''
    })
    const isLoading = ref(true)

    function loadInvoice() {
      invoices.value = {
        data: [
          {
            _id: 1,
            invoice_no: 123,
            customer_code: 123,
            item: 'Laptop'
          }
        ]
      }

      stopLoading()
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

    watch(query, () => {
      startLoading()
      
      loadInvoice()
    })

    onMounted(() => {
      loadInvoice()
    });

    return {
      invoices,
      query,
      destroy,
      isLoading,
    }
  }
}
</script>