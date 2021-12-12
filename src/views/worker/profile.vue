<template>
<div>
   <CCard class="mb-4">
      <CCardHeader>Profile</CCardHeader>
      <CCardBody>
        <div class="mt-3">
          <CForm @submit.prevent="store()">
            <div class="mb-3 col-4">
              <CFormLabel for="email">Email address</CFormLabel>
              <CFormInput disabled type="email" id="email" v-model="users.email" placeholder="User email"/>
              <!-- <div v-if="validation.email" class="text-danger">{{ validation.email.message }}</div> -->
            </div>
            <div class="mb-3 col-4">
              <CFormLabel for="name">Full name</CFormLabel>
              <CFormInput disabled type="text" v-model="users.name" id="name" placeholder="Full name"/>
              <!-- <div v-if="validation.name" class="text-danger">{{ validation.name.message }}</div> -->
            </div>
            <div class="mb-3 col-4">
              <CFormLabel for="username">Username</CFormLabel>
              <CFormInput disabled type="text" id="username" v-model="users.username" placeholder="Username"/>
              <!-- <div v-if="validation.username" class="text-danger">{{ validation.username.message }}</div> -->
            </div>
            <!-- <div class="mb-3">
              <CFormLabel for="password">Password</CFormLabel>
              <CFormInput
                type="password"
                id="password"
                placeholder="Password"
                v-model="user.password"
              />
              <div v-if="validation.password" class="text-danger">{{ validation.password.message }}</div>
            </div> -->
            <!-- <div class="mb-3">
              <CFormLabel for="mistake"
                >Mistake User</CFormLabel
              >
              <CFormTextarea
                id="mistake"
                rows="3"
                v-model="user.mistake"
              ></CFormTextarea>
            </div> -->
            <!-- <div class="mb-3">
              <CButton color="primary" class="rounded">Save</CButton>
            </div> -->
          </CForm>
        </div>
      </CCardBody>
    </CCard>
</div>

</template>

<script>
import axios from 'axios'
import {onMounted,ref} from 'vue'
export default {
name:'Profile',
setup() {
    //reactive state
    let users = ref([]);

    onMounted(()=> {
      // get data
      axios.get(`${process.env.VUE_APP_URL_API}/users/${window.localStorage.getItem('_id')}`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        }
      })
      .then((result) => {
        users.value = result.data;
      }).catch((err) =>{
        console.log(err.response);
      });
    });


    return {
      users,
    }
  }
}
</script>
