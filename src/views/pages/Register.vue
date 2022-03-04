<template>
  <div class="min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="5">
          <CForm v-on:submit.prevent="register(successAlert)">
            <div class="text-center">
              <h1>Register</h1>
              <p class="text-medium-emphasis">Buat akun untuk cek mutasi anda</p>
            </div>
            <div class="mb-3">
              <CFormLabel>Name</CFormLabel>
              <CFormInput placeholder="Name" autocomplete="name" v-model="body.name" :invalid="!!validation.name" />

              <CFormFeedback invalid v-if="validation.name">{{ validation.name.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel>Username</CFormLabel>
              <CFormInput placeholder="Username" autocomplete="username" v-model="body.username" :invalid="!!validation.username" />

              <CFormFeedback invalid v-if="validation.username">{{ validation.username.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel>Email</CFormLabel>
              <CFormInput placeholder="Email" autocomplete="email" v-model="body.email" :invalid="!!validation.email" />

              <CFormFeedback invalid v-if="validation.email">{{ validation.email.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel>Organization</CFormLabel>
              <MultiSelect :options="organizations" placeholder="Organization" v-model="body.organization_id" searchable>
                <template #option="props">
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <span>{{ props.option.label }}</span>
                  </div>
                </template>
              </MultiSelect>

              <CFormFeedback invalid v-if="validation.password">{{ validation.password.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel>Password</CFormLabel>
              <CFormInput
                type="password"
                placeholder="Password"
                autocomplete="new-password"
                v-model="body.password" :invalid="!!validation.password" />

              <CFormFeedback invalid v-if="validation.password">{{ validation.password.message }}</CFormFeedback>
            </div>
            <div class="d-grid">
              <CButton color="primary" :disabled="loading">Create Account</CButton>
            </div>
          </CForm>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import axios from 'axios'
import MultiSelect from '@vueform/multiselect'

export default {
  name: 'Register',
  components: { MultiSelect },
  methods: {
    successAlert() {
      this.$swal({
        title: 'Registrasi Berhasil, silakan cek email untuk verifikasi akun anda',
        icon: 'success'
      })

      this.$router.push({ name: 'Login' })
    }
  },
  setup() {
    const body = reactive({
      email: '',
      username: '',
      password: '',
      organization_id: ''
    })
    const validation = ref({})
    const loading = ref(false)
    const organizations = ref([])

    const register = async cb => {
      validation.value = {}
      loading.value = true

      try {
        const res = await axios.post(`${process.env.VUE_APP_URL_API}/users`, body)

        cb()
      } catch (err) {
        validation.value = err.response.data.errors

        if (err.response.status === 409) {
          validation.value = {
            ...(err.response.data.errors.username ? { username: {
              message: err.response.data.message
            } } : {}),
            ...(err.response.data.errors.email ? { email: {
              message: err.response.data.message
            } } : {}),
          }
        }
      } finally {
        loading.value = false
      }
    }

    const getOrganization = async () => {
      try {
        const res = await axios.get(`${process.env.VUE_APP_URL_API}/organization`)

        organizations.value = res.data.data.map(organization => ({
          label: organization.name,
          value: organization._id,
        }))
      } catch (err) {
        console.log(err)
      }
    }

    onMounted(getOrganization)

    return { body, validation, loading, register, organizations }
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>