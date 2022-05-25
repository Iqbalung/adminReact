<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CAlert color="danger" :visible="validation.message !== null" dismissible @close="() => { resetValidation() }">{{ validation.message }}</CAlert>
                <CForm v-on:submit.prevent="login">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.email"
                      placeholder="Email"
                      autocomplete="email"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton
                        color="primary"
                        class="px-4"
                        :disabled="loading"
                      >
                        Login
                      </CButton>
                    </CCol>
                    <!-- <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol> -->
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <!-- <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <CButton color="light" variant="outline" class="mt-3">
                    Register Now!
                  </CButton>
                </div>
              </CCardBody>
            </CCard> -->
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'
// import router from 'vue-router'
import router from '../../router'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      validation: {
        message: null
      },
      loading: false
    }
  },
  methods: {
    resetValidation() {
      this.validation.message = null
    },
    login() {
      this.loading = true

      axios
        .post(`${process.env.VUE_APP_URL_API}/authentication`, {
          strategy: 'local',
          email: this.form.email,
          password: this.form.password,
        })
        .then((response) => {
          axios.get('https://api.ipify.org?format=json').then(res => {
            const myIp = res.data.ip
            const allowedIp = response.data.user.ip ?? []

            if (allowedIp.includes(myIp) || allowedIp.includes('*')) {
              axios.patch(`${process.env.VUE_APP_URL_API}/users/${response.data.user._id}`, { login_status: true }, {
                headers: {
                  Authorization: response.data.accessToken
                }
              })
              .then(res => {
                window.localStorage.setItem('urlApi',process.env.VUE_APP_URL_API);
                window.localStorage.setItem('_id', response.data.user._id);
                window.localStorage.setItem('organization_id', response.data.user.organization_id);
                window.localStorage.setItem('accessToken', response.data.accessToken);
                window.localStorage.setItem('username', response.data.user.username);
                window.localStorage.setItem('role', response.data.user.role);
                
                router.push({ path: '/tasks' })
              }).catch(err => {
                console.log(err.response)
              })
            } else {
              this.validation = { message: 'Ip Not Allowed' }
            }

          })
        })
        .catch((error) => {
          this.validation = error.response.data;
        }).finally(() => {
          this.loading = false
        })
    },
  }
}
</script>
