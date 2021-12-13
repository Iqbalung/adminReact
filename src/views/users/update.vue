<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader>Update User</CCardHeader>
      <CCardBody>
        <router-link :to="{ name: 'Users' }">
          <CButton color="primary">
            <CIcon class="text-white" name="cil-arrow-left" /> Back
          </CButton>
        </router-link>

        <div class="mt-3">
          <CForm @submit.prevent="update()">
            <div class="mb-3">
              <CFormLabel for="email">Email address</CFormLabel>
              <CFormInput type="email" id="email" placeholder="User email" v-model="user.email"/>
              <div v-if="validation.email" class="text-danger">{{ validation.email.message }}</div>
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
import {useRoute} from 'vue-router'
import axios from 'axios'
export default {
  name: 'Update User',
  setup() {
    // data binding
    let user = reactive({
      email: '',
      username:'',
      name:'',
      role:'worker',
    });
    const validation = ref([]);
    const router = routers;
    const route = useRoute();

    onMounted(()=>{
      // console.log(route.params.id);
      axios.get(`${process.env.VUE_APP_URL_API}/users/${route.params.id}`,{
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then((result)=>{
        user.email = result.data.email;
        user.username = result.data.username;
        user.name = result.data.name;
      }).catch((err)=>{
        console.log(err.response.data)
      })
    });

    function update() {
      axios.patch(`${process.env.VUE_APP_URL_API}/users/${route.params.id}`,user,{
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
      })
    }
    return {
      user,
      validation,
      router,
      update
    }
  }
}
</script>
