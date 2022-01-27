<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white">Create User</CCardHeader>
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
              <CFormLabel for="rekening">Rekening</CFormLabel>
              <MultiSelect :options="bankOptions" mode="tags" placeholder="Rekening" searchable v-model="user.banks" />
              <div v-if="validation.banks" class="text-danger">{{ validation.banks.message }}</div>
            </div>
            <div class="mb-3">
              <CFormLabel for="ip">IP Address</CFormLabel>
              <MultiSelect :options="ipOptions"  mode="tags" placeholder="IP Address" createOption tagPlaceholder="Press enter to create a tag" searchable @option="addIp" v-model="user.ip" />
              <div v-if="validation.ip" class="text-danger">{{ validation.ip.message }}</div>
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
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import MultiSelect from '@vueform/multiselect'
import routers from '../../router'
export default {
  name: 'Create User',
  components: { MultiSelect },
  setup() {
    // data binding
    const user = reactive({
      email: '',
      username:'',
      name:'',
      password:'',
      role:'worker',
      mistake:'',
      banks: [],
      ip: []
    });
    const bankOptions = ref([]);
    const ipOptions = ref([])
    const validation = ref([]);
    let valid = ref([]);
    const router = routers

    function addIp(ip) {
      ipOptions.value.push(ip)
    }

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
    onMounted(function() {
      axios.get(`${process.env.VUE_APP_URL_API}/bank`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      }).then(results => {
        return results.data.data.map(result => ({
          label: result.username,
          value: result._id
        }))
      }).then(results => {
        bankOptions.value = results
      }).catch(function (err) {
        console.log(err.response)
      })
    })
    return {
      user,
      bankOptions,
      ipOptions,
      validation,
      valid,
      router,
      store,
      addIp
    }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
