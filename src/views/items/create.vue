<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white">Create Item</CCardHeader>
      <CCardBody>
        <router-link :to="{ name: 'Items' }">
          <CButton color="primary">
            <CIcon class="text-white" name="cil-arrow-left" /> Back
          </CButton>
        </router-link>

        <div class="mt-3">
          <CForm @submit.prevent="store()">
            <div class="mb-3">
              <CFormLabel for="code">Item Type</CFormLabel>
              <CFormSelect
                :options="[
                  { label: 'Services', value: 'services' },
                  { label: 'Products', value: 'products' },
                ]" v-model="body.item_type" :invalid="validation.item_type">
              </CFormSelect>
              <CFormFeedback v-if="validation.item_type" invalid>{{ validation.item_type.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="code">Product Code</CFormLabel>
              <CFormInput type="text" id="code" placeholder="Product Code" v-model="body.product_code" :invalid="validation.product_code" />
              <CFormFeedback v-if="validation.product_code" invalid>{{ validation.product_code.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="name">Product Name</CFormLabel>
              <CFormInput type="text" id="name" placeholder="Product Name" v-model="body.product_name" :invalid="validation.product_name" />
              <CFormFeedback v-if="validation.product_name" invalid>{{ validation.product_name.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="price">Product Price</CFormLabel>
              <CFormInput type="number" id="price" placeholder="Product Price" v-model="body.product_price" :invalid="validation.product_price" />
              <CFormFeedback v-if="validation.product_price" invalid>{{ validation.product_price.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="decsription">Product Decsription</CFormLabel>
              <CFormTextarea id="decsription" placeholder="Product Decsription" v-model="body.product_description" :invalid="validation.product_description" />
              <CFormFeedback v-if="validation.product_description" invalid>{{ validation.product_description.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="stock">Product Stock</CFormLabel>
              <CFormInput type="number" id="stock" placeholder="Product Stock" v-model="body.product_stock" :invalid="validation.product_stock" />
              <CFormFeedback v-if="validation.product_stock" invalid>{{ validation.product_stock.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="type">Product Type</CFormLabel>
              <CFormInput type="text" id="type" placeholder="Product Type" v-model="body.product_type" :invalid="validation.product_type" />
              <CFormFeedback v-if="validation.product_type" invalid>{{ validation.product_type.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="supplier">Product Supplier</CFormLabel>
              <CFormInput type="text" id="supplier" placeholder="Product Supplier" v-model="body.product_supplier" :invalid="validation.product_supplier" />
              <CFormFeedback v-if="validation.product_supplier" invalid>{{ validation.product_supplier.message }}</CFormFeedback>
            </div>
            <div class="mb-3" v-for="(items, index) in custom_field" :key="index">
              <CFormLabel for="supplier"> {{ items.label }}</CFormLabel>
              <CFormInput :id="items.key" :key="items.key" v-model="body.custom_field[items.key]" type="text"  :name="items.key" />
            </div>
            <div class="mb-3">
              <CButton color="primary" class="rounded">Save</CButton>
            </div>

          </CForm>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import routers from '../../router'

export default {
  name: 'Create Item',
  data() {
    return {
      custom_field: JSON.parse(window.localStorage.getItem('organization')).custom_field.items
    }
  },
  setup() {
    const body = reactive({
      product_code: '',
      product_name: '',
      product_price: '',
      product_description: '',
      product_stock: '',
      product_type: '',
      product_supplier: '',
      item_type: 'services',
      custom_field : {}
    });
    const validation = ref([]);
    const router = routers

    function store() {
      axios.post(`${process.env.VUE_APP_URL_API}/items`, body, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        router.push({
          name: 'Items'
        })
      }).catch((err) => {
        if (err.response.status === 409) {
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

    return {
      body,
      validation,
      store,
    }
  }
}
</script>