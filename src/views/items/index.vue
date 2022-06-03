<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white d-flex align-items-center justify-content-between">
        Items List
        <div>
          <CFormInput type="text" placeholder="Search" v-model="query.search" />
        </div>
      </CCardHeader>
      <CCardBody class="fixed-table">
        <router-link :to="{ name: 'Create Items' }">
          <CButton class="me-2" color="primary">
            <CIcon class="text-white" name="cil-plus"/> Add Item
          </CButton>
        </router-link>
        <CTable class="border border-top-0" hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell class="text-center">Code</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Name</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Price</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Stock</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Type</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Supplier</CTableHeaderCell>
              <CTableHeaderCell class="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody v-if="isLoading">
            <CTableRow>
              <CTableDataCell
                class="text-center"
                :colspan="7"
                >
                  <CSpinner
                    color="primary"
                  />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
          <CTableBody v-else>
            <CTableRow v-for="(item,index) in items.data" :key="index">
              <CTableDataCell class="text-center">
                <div>{{ item.product_code }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.product_name }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.product_price }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.product_stock }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.product_type }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>{{ item.product_supplier }}</div>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <div>
                  <router-link :to="{ name: 'Update Items', params: { id: item._id } }">
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
              <CTableDataCell class="text-center" colspan="7" v-show="items.data.length <= 0">
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
  name: 'ItemList',
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
    const items = ref([]);
    const query = reactive({
      search: ''
    })
    const isLoading = ref(true)

    function loadItems() {
      axios.get(`${process.env.VUE_APP_URL_API}/items`, {
        params: query,
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result) => {
        items.value = result.data;

        stopLoading()
      }).catch((err) => {
        console.log(err.response);
      });
    }

    function destroy(id, index) {
      axios.delete(`${process.env.VUE_APP_URL_API}/items/${id}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        items.value.data.splice(index, 1);
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
      
      loadItems()
    })

    onMounted(() => {
      loadItems()
    });

    return {
      items,
      query,
      destroy,
      isLoading,
    }
  }
}
</script>