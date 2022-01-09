<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <CAlert color="danger" v-if="validation.message">{{ validation.message }}</CAlert>
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="form.username"
                      placeholder="Username"
                      autocomplete="username"
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
                        @click="handleClick"
                        color="primary"
                        class="px-4"
                      >
                        Login
                      </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol>
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
        username: '',
        password: '',
      },
      validation: []
    }
  },
  methods: {
    handleClick() {
      axios
        .post(`${process.env.VUE_APP_URL_API}/authentication`, {
          strategy: 'local',
          email: this.form.username,
          password: this.form.password,
        })
        .then(function (response) {
          window.localStorage.setItem('urlApi',process.env.VUE_APP_URL_API);
          window.localStorage.setItem('_id', response.data.user._id);
          window.localStorage.setItem('accessToken', response.data.accessToken);
          window.localStorage.setItem('username', response.data.user.username);
          window.localStorage.setItem('role', response.data.user.role);
          router.push({ path: '/tasks' })
        })
        .catch((error) => {
          this.validation = error.response.data;
        })
    },
  },
}
</script>
