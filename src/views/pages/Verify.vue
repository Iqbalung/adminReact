<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CCard class="p-4">
        <CCardBody>
          <h1>Verifying account</h1>
        </CCardBody>
      </CCard>
    </CContainer>
  </div>
</template>

<script>
import axios from 'axios'
// import router from 'vue-router'
import router from '../../router'

export default {
  name: 'Login',
  methods: {
    async sendToken() {
      try {
        await axios.post(`${process.env.VUE_APP_URL_API}/authmanagement`, {
          action: 'verifySignupLong',
          value: this.$route.query.token
        })

        this.$router.push({ name: 'Login' })
      } catch (err) {
        console.log(err.response)
      }
    }
  },
  mounted() {
    this.sendToken()
  }
}
</script>
