<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Create User</CCardHeader>
      <CCardBody>
        <router-link :to="{ name: 'Users' }">
          <CButton color="primary">
            <CIcon class="text-white" name="cil-arrow-left" /> Back
          </CButton>
        </router-link>

        <div class="mt-3">
          <CForm @submit.prevent="store()">
            <div class="mb-3">
              <CFormLabel for="email">Email address</CFormLabel>
              <CFormInput type="email" id="email" placeholder="User email" v-model="user.email"/>
              <div v-if="validation.email" class="text-danger">{{ validation.email.message }}</div>
              <div v-if="valid" class="text-danger">{{ valid.message }}</div>
            </div>
            <div class="mb-3">
              <CFormLabel for="name">Full name</CFormLabel>
              <CFormInput type="text" id="name" placeholder="Full name" v-model="user.name"/>
              <div v-if="validation.name" class="text-danger">{{ validation.name.message }}</div>
            </div>
            <div class="mb-3">
              <CFormLabel for="username">Username</CFormLabel>
              <CFormInput type="text" id="username" placeholder="Username" v-model="user.username"/>
              <div v-if="validation.username" class="text-danger">{{ validation.username.message }}</div>
            </div>
            <div class="mb-3">
              <CFormLabel for="password">Password</CFormLabel>
              <CFormInput
                type="password"
                id="password"
                placeholder="Password"
                v-model="user.password"
              />
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
    const user = reactive({
      email: '',
      username:'',
      name:'',
      password:'',
      role:'worker',
      mistake:'',
    });
    const validation = ref([]);
    let valid = ref([]);
    const router = routers
    function store() {
      axios.post(`${process.env.VUE_APP_URL_API}/users`, user,{
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(()=> {
        router.push({
          name:'Users'
        })
      }).catch((err)=>{
        validation.value = err.response.data.errors
        valid.value = err.response.data;
      })
    }
    return {
      user,
      validation,
      valid,
      router,
      store
    }
  }
}
</script>
