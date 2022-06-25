<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white">Update Customer</CCardHeader>
      <CCardBody>
        <router-link :to="{ name: 'Customers' }">
          <CButton color="primary">
            <CIcon class="text-white" name="cil-arrow-left" /> Back
          </CButton>
        </router-link>

        <div class="mt-3">
          <CForm @submit.prevent="update()">
            <div class="mb-3">
              <CFormLabel for="code">Customer Code</CFormLabel>
              <CFormInput type="text" id="code" placeholder="Customer Code" v-model="body.customer_code" :invalid="validation.customer_code" />
              <CFormFeedback v-if="validation.customer_code" invalid>{{ validation.customer_code.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="name">Customer Name</CFormLabel>
              <CFormInput type="text" id="name" placeholder="Customer Name" v-model="body.customer_name" :invalid="validation.customer_name" />
              <CFormFeedback v-if="validation.customer_name" invalid>{{ validation.customer_name.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="phone">Customer Phone</CFormLabel>
              <CFormInput type="text" id="phone" placeholder="Customer Phone" v-model="body.customer_phone" :invalid="validation.customer_phone" />
              <CFormFeedback v-if="validation.customer_phone" invalid>{{ validation.customer_phone.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="address">Customer Address</CFormLabel>
              <CFormInput type="text" id="address" placeholder="Customer Address" v-model="body.customer_address" :invalid="validation.customer_address" />
              <CFormFeedback v-if="validation.customer_address" invalid>{{ validation.customer_address.message }}</CFormFeedback>
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
import { reactive, ref,onMounted } from 'vue'
import routers from '../../router'
import { useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Update Customer',
  setup() {
    let body = reactive({
      customer_code: '',
      customer_name: '',
      customer_phone: '',
      customer_address: '',
    });
    const validation = ref([]);
    const router = routers;
    const route = useRoute();

    onMounted(() => {
      axios.get(`${process.env.VUE_APP_URL_API}/customers/${route.params.id}`,{
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then((result) => {
        body.customer_code = result.data.customer_code;
        body.customer_name = result.data.customer_name;
        body.customer_phone = result.data.customer_phone;
        body.customer_address = result.data.customer_address;
      }).catch((err) => {
        console.log(err.response.data)
      })
    });

    function update() {
      axios.patch(`${process.env.VUE_APP_URL_API}/customers/${route.params.id}`, body, {
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        router.push({
          name: 'Customers'
        })
      }).catch((err)=>{
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
      update,
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>