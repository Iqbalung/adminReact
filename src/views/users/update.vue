<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white">Update User</CCardHeader>
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
              <CFormInput type="email" id="email" placeholder="User email" v-model="user.email" :invalid="validation.email" />
              <CFormFeedback v-if="validation.email" invalid>{{ validation.email.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="name">Full name</CFormLabel>
              <CFormInput type="text" id="name" placeholder="Full name" v-model="user.name" :invalid="validation.name" />
              <CFormFeedback v-if="validation.name" invalid>{{ validation.name.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="username">Username</CFormLabel>
              <CFormInput type="text" id="username" placeholder="Username" v-model="user.username" :invalid="validation.username" />
              <CFormFeedback v-if="validation.username" invalid>{{ validation.username.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="ip">IP Address</CFormLabel>
              <MultiSelect :options="ipOptions"  mode="tags" placeholder="IP Address" createOption tagPlaceholder="Press enter to create a tag" searchable @option="addIp" v-model="user.ip" :invalid="validation.ip" />
              <CFormFeedback v-if="validation.ip" invalid>{{ validation.ip.message }}</CFormFeedback>
            </div>
            <div class="mb-3" v-for="(items, index) in custom_field" :key="index">
              <CFormLabel for="supplier"> {{ items.label }}</CFormLabel>
              <CFormInput :id="items.key" :key="items.key" v-model="user.custom_field[items.key]" type="text"  :name="items.key" />
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
import MultiSelect from '@vueform/multiselect'
export default {
  name: 'Update User',
  components: { MultiSelect },
   data() {
    return {
      custom_field: JSON.parse(window.localStorage.getItem('organization')).custom_field.users
    }
  },
  setup() {
    // data binding
    let user = reactive({
      email: '',
      username:'',
      name:'',
      role:'worker',
      ip: [],
      custom_field : {}
    });
    const validation = ref([]);
    const router = routers;
    const route = useRoute();

    const ipOptions = ref([])

    function addIp(ip) {
      ipOptions.value.push(ip)
    }

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
        ipOptions.value = result.data.ip ?? [];
        user.ip = result.data.ip
        if(result.data.hasOwnProperty('custom_field')){
          user.custom_field = result.data.custom_field;
        }
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
      user,
      validation,
      router,
      update,
      addIp,
      ipOptions
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>