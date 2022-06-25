<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white d-flex align-items-center justify-content-between">
        Customers List
        <div>
          <CFormInput type="text" placeholder="Search" v-model="query.search" />
        </div>
      </CCardHeader>
      <CCardBody class="fixed-table">
        <router-link :to="{ name: 'Create Customers' }">
          <CButton class="me-2" color="primary">
            <CIcon class="text-white" name="cil-plus"/> Add Config Cairan
          </CButton>
        </router-link>
        <CTable class="border border-top-0" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell class="text-center">Teknisi</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Asisten</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Upah Teknisi</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Upah Asisten</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody v-if="isLoading">
            <CTableRow>
              <CTableDataCell
                class="text-center"
                :colspan="5"
                >
                  <CSpinner
                    color="primary"
                  />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
          <CTableBody v-else>
            <CTableRow v-for="(item,index) in customers.data" :key="index">
              <CTableDataCell class="text-center">
                <div>{{ item.teknisi }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.asisten }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.upah_teknisi }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.upah_asisten_teknisi }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>
                  <router-link :to="{ name: 'Update Customers', params: { id: item._id } }">
                    <CBadge class="me-2 rounded" color="warning">
                      <CIcon class="text-white" name="cil-pencil"/>
                    </CBadge>
                  </router-link>
                  <CBadge color="danger" class="rounded" @click="deleteAlert(destroy, item._id,index)">
                    <CIcon class="text-white" name="cil-trash"/>
                  </CBadge>
                </div>
              </CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell class="text-center" colspan="5" v-show="customers.data.length <= 0">
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
    const customers = ref([]);
    const query = reactive({
      search: ''
    })
    const isLoading = ref(true)

    function loadCustomer() {
      axios.get(`${process.env.VUE_APP_URL_API}/cairans`, {
        params: query,
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result) => {
        customers.value = result.data;

        stopLoading()
      }).catch((err) => {
        console.log(err.response);
      });
    }

    function destroy(id, index) {
      axios.delete(`${process.env.VUE_APP_URL_API}/cairans/${id}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        customers.value.data.splice(index, 1);
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
      
      loadCustomer()
    })

    onMounted(() => {
      loadCustomer()
    });

    return {
      customers,
      query,
      destroy,
      isLoading,
    }
  }
}
</script>