<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader>
      <!-- <CDropdownItem>
        <CIcon icon="cil-bell" /> Updates
        <CBadge color="info" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <!-- <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Messages
        <CBadge color="success" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <CDropdownItem>
        <CIcon icon="cil-task" /> Tasks
        <CBadge color="danger" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <!-- <CDropdownItem>
        <CIcon icon="cil-comment-square" /> Comments
        <CBadge color="warning" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <!-- <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Settings
      </CDropdownHeader> -->
      <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <!-- <CDropdownItem> <CIcon icon="cil-settings" /> Settings </CDropdownItem> -->
      <!-- <CDropdownItem>
        <CIcon icon="cil-dollar" /> Payments
        <CBadge color="secondary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <!-- <CDropdownItem>
        <CIcon icon="cil-file" /> Projects
        <CBadge color="primary" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem> -->
      <!-- <CDropdownDivider /> -->
      <!-- <CDropdownItem>
        <CIcon icon="cil-shield-alt" /> Lock Account
      </CDropdownItem> -->
      <CDropdownItem @click="handleClick">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
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
    return {
      avatar: avat,
      itemsCount: 42,
    }
  },
}
</script>
