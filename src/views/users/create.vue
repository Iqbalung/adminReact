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
              <CFormLabel for="role">Role</CFormLabel>
              <CFormSelect
                :options="[
                  { label: 'Worker', value: 'worker' },
                  { label: 'Assistace Worker', value: 'assistace_worker' },
                  { label: 'Admin', value: 'admin' },
                ]" v-model="user.role" :invalid="validation.role">
              </CFormSelect>
              <CFormFeedback v-if="validation.role" invalid>{{ validation.role.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="rekening">Rekening</CFormLabel>
              <MultiSelect :options="bankOptions" mode="tags" placeholder="Rekening" searchable v-model="user.banks" :invalid="validation.banks" />
              <CFormFeedback v-if="validation.banks" invalid>{{ validation.banks.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="ip">IP Address</CFormLabel>
              <MultiSelect :options="ipOptions"  mode="tags" placeholder="IP Address" createOption tagPlaceholder="Press enter to create a tag" searchable @option="addIp" v-model="user.ip" :invalid="validation.ip" />
              <CFormFeedback v-if="validation.ip" invalid>{{ validation.ip.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="password">Password</CFormLabel>
              <CFormInput
                type="password"
                id="password"
                placeholder="Password"
                v-model="user.password"
                :invalid="validation.password" />
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
      ip: [],
      organization_id: window.localStorage.getItem('organization_id')
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
      axios.post(`${process.env.VUE_APP_URL_API}/users`, {
        ...user,
        plainPassword: user.password
      },{
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
