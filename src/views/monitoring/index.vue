<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardBody>
          <div class="d-flex align-items-center justify-content-between mb-3">
            <b>agwlbot</b>
            <router-link :to="{ name: 'Log Activity' }">Today's Log</router-link>
          </div>
          <p class="mb-0">{{ agwlbot?.message }}</p>
          <small class="text-muted">Last Activity: {{ formatDate(agwlbot?.date) }}</small>
          <div class="mt-3">
            <CButton color="warning me-2" v-on:click="startAgwlbot">Start</CButton>
            <CButton color="danger" v-on:click="stopAgwlbot">Stop</CButton>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol>
      <CCard>
        <CCardBody>
          <div class="d-flex align-items-center justify-content-between mb-3">
            <b>bcabot</b>
            <router-link :to="{ name: 'Log Activity' }">Today's Log</router-link>
          </div>
          <p class="mb-0">{{ bcabot?.message }}</p>
          <small class="text-muted">Last Activity: {{ formatDate(agwlbot?.date) }}</small>
          <div class="mt-3">
            <CButton color="warning me-2" v-on:click="startBcabot">Start</CButton>
            <CButton color="danger" v-on:click="stopBcabot">Stop</CButton>
          </div>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import momentTz from 'moment-timezone'

const agwlbot = ref()
const bcabot = ref()

const setAgwlbot = () => {
  const params = {
    process_name: 'Cron Engine',
    '$sort[_id]': -1,
    '$limit': 1
  }

  axios
    .get(`${process.env.VUE_APP_URL_API}/logactivity`, {
      headers: {
        Authorization: window.localStorage.getItem('accessToken'),
      },
      params,
    })
    .then((result) => {
      agwlbot.value = result.data.data[0]
    })
    .catch((err) => {
      console.log(err.response)
    })
}

const setBcabot = () => {
  const params = {
    process_name: 'Process Mutation',
    '$sort[_id]': -1,
    '$limit': 1
  }

  axios
    .get(`${process.env.VUE_APP_URL_API}/logactivity`, {
      headers: {
        Authorization: window.localStorage.getItem('accessToken'),
      },
      params,
    })
    .then((result) => {
      bcabot.value = result.data.data[0]
    })
    .catch((err) => {
      console.log(err.response)
    })
}

const startAgwlbot = () => {
  axios.get('https://agwlbot.my.id:8080/agwlmain/start')
}

const stopAgwlbot = () => {
  axios.get('https://agwlbot.my.id:8080/agwlmain/stop')
}

const startBcabot = () => {
  axios.get('https://agwlbca.my.id/agwlbca/start')
}

const stopBcabot = () => {
  axios.get('https://agwlbca.my.id/agwlbca/start')
}

const formatDate = date => momentTz(date).format('DD/MM/YYYY HH:mm:ss')

onMounted(() => {
  setAgwlbot()
  setBcabot()

  setInterval(() => {
    setAgwlbot()
    setBcabot()
  }, 5000)
})
</script>