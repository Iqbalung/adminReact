<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Create Bank Account</CCardHeader>
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
              <CFormInput type="text" id="username" placeholder="username" v-model="bank.username"/>
              <div v-if="validation.username" class="text-danger">{{ validation.username.message }}</div>
            </div>
            <div class="mb-3">
              <CFormLabel for="password">password</CFormLabel>
              <CFormInput type="password" id="password" placeholder="Password" v-model="bank.password"/>
              <div v-if="validation.password" class="text-danger">{{ validation.password.message }}</div>
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
        validation.value = err.response.data.errors
        valid.value = err.response.data;
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
