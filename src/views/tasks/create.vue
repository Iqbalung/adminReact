<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white">Create Task</CCardHeader>
      <CCardBody>
        <router-link :to="{ name: 'Tasks' }">
          <CButton color="primary">
            <CIcon class="text-white" name="cil-arrow-left" /> Back
          </CButton>
        </router-link>

        <div class="mt-3">
          <CForm @submit.prevent="store()">
            <div class="mb-3">
              <CFormLabel for="title">Task Title</CFormLabel>
              <CFormInput type="text" id="title" placeholder="Task Title" v-model="body.taskTittle" :invalid="validation.taskTittle" />
              <CFormFeedback v-if="validation.taskTittle" invalid>{{ validation.taskTittle.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="ref">Task Ref Number</CFormLabel>
              <CFormInput type="text" id="ref" placeholder="Task Ref Number" v-model="body.taskRefNumber" :invalid="validation.taskRefNumber" />
              <CFormFeedback v-if="validation.taskRefNumber" invalid>{{ validation.taskRefNumber.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="decsription">Task Description</CFormLabel>
              <CFormTextarea id="decsription" placeholder="Task Description" v-model="body.taskDescription" :invalid="validation.taskDescription" />
              <CFormFeedback v-if="validation.taskDescription" invalid>{{ validation.taskDescription.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="time">Task Start Time</CFormLabel>
              <Datepicker v-model="body.taskStartTime" :enableTimePicker="false" placeholder="Task Start Time" class="datepicker-control" :class="{ 'invalid': validation.taskStartTime }" />
              <CFormFeedback v-if="validation.taskStartTime" class="d-block" invalid>{{ validation.taskStartTime.message }}</CFormFeedback>
            </div>
            <div class="mb-3">
              <CFormLabel for="time">Task Expired Time</CFormLabel>
              <Datepicker v-model="body.taskExpiredTime" :enableTimePicker="false" placeholder="Task Expired Time" class="datepicker-control" :class="{ 'invalid': validation.taskExpiredTime }" />
              <CFormFeedback v-if="validation.taskExpiredTime" class="d-block" invalid>{{ validation.taskExpiredTime.message }}</CFormFeedback>
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
import routers from '../../router'

export default {
  name: 'Create Task',
  setup() {
    const body = reactive({
      taskTittle: '',
      taskDescription: '',
      taskExpiredTime: '',
      taskStartTime: '',
      taskRefNumber: '',
      taskCreatedBy: window.localStorage.getItem('username'),
      organization_id: window.localStorage.getItem('organization_id')
    });
    const validation = ref([]);
    const router = routers

    function store() {
      axios.post(`${process.env.VUE_APP_URL_API}/tasks`, body, {
         headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then(() => {
        router.push({
          name: 'Tasks'
        })
      }).catch((err) => {
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
      body,
      validation,
      store,
    }
  }
}
</script>