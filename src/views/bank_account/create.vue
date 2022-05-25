<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white">Create Bank Account</CCardHeader>
      <CCardBody>
        <router-link :to="{ name: 'Bank Account' }">
          <CButton color="primary">
            <CIcon class="text-white" name="cil-arrow-left" /> Back
          </CButton>
        </router-link>

        <div class="mt-3">
          <CForm @submit.prevent="store()">
            <div class="mb-3">
              <CFormLabel for="username">username</CFormLabel>
              <CFormInput type="text" id="username" placeholder="username" v-model="bank.username" :invalid="validation.username" />
              <CFormFeedback v-if="validation.username" invalid>{{ validation.username.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="password">password</CFormLabel>
              <CFormInput type="password" id="password" placeholder="Password" v-model="bank.password" :invalid="validation.password" />
              <CFormFeedback v-if="validation.password" invalid>{{ validation.password.message }}</CFormFeedback>
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
import { reactive, ref } from 'vue'
import routers from '../../router'
import axios from 'axios'
export default {
  name: 'Create User',
  setup() {
    // data binding
    let bank = reactive({
      username: '',
      password:'',
      organization_id: window.localStorage.getItem('organization_id')
    });
    const validation = ref([]);
    let valid = ref([]);
    const router = routers
    function store() {
      axios.post(`${process.env.VUE_APP_URL_API}/bank`, bank,{
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(()=> {
        router.push({
          name:'Bank Account'
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
      bank,
      validation,
      valid,
      router,
      store
    }
  }
}
</script>
