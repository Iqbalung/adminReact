<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-task" /> Tasks
        <CBadge color="danger" class="ms-auto">{{ taskCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownItem @click="handleClick">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import avatar from '@/assets/images/avatars/8.jpg'
import avat from '@/assets/images/avatars/pic.jpg'
import router from '../router'
export default {
  name: 'AppHeaderDropdownAccnt',
  methods: {
    handleClick() {
      axios.patch(`${process.env.VUE_APP_URL_API}/users/${window.localStorage.getItem('_id')}`, { login_status: false }, {
        headers: {
          Authorization: window.localStorage.getItem('accessToken')
        }
      })
        .then(res => {
          window.localStorage.removeItem('role')
          window.localStorage.removeItem('username')
          window.localStorage.removeItem('_id')
          window.localStorage.removeItem('urlApi');
          window.localStorage.removeItem('accessToken')
          router.push({ name:'Login' })
        }).catch(err => {
          console.log(err.response)
        })
    },
  },
  setup() {
    const taskCount = ref(0)

    onMounted(()=> {
      socket.on('tasks created', (message) => {
        getTaskCount()
      })

      getTaskCount()
    })

    function getTaskCount() {
      const param_admin = {
        'createdAt[$gte]': new Date(new Date().setDate(new Date().getDate() - 1)),
        'createdAt[$lte]':new Date(),
      }
      const param_users = {
        'createdAt[$gte]': new Date(new Date().setDate(new Date().getDate() - 1)),
        'createdAt[$lte]': new Date(),
        taskAssigne: `${window.localStorage.getItem('username')}`,
      }

      const params = (window.localStorage.getItem('role') === 'admin') ? param_admin : param_users;

      axios.get(`${process.env.VUE_APP_URL_API}/tasks`,{
        headers: {
          Authorization:window.localStorage.getItem('accessToken')
        },
        params
      }).then((result) => {
        taskCount.value = result.data.total
      }).catch((err) =>{
        console.log(err.response);
      });
    }

    return {
      avatar: avat,
      taskCount,
    }
  },
}
</script>
