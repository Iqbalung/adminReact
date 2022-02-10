<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" :caret="false">
      <CIcon class="mx-2" icon="cil-bell" size="lg" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-12">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Notification Incidents
      </CDropdownHeader>
      <CDropdownItem>
        <CCard style="width: 18rem">
          <CCardBody>
            <CCardText
              ><CIcon icon="cil-bell" /> mutation number
            </CCardText></CCardBody
          >
        </CCard>
      </CDropdownItem>
      <CDropdownItem>
        <CCard style="width: 18rem">
          <CCardBody>
            <CCardText
              ><CIcon icon="cil-bell" /> mutation number
            </CCardText></CCardBody
          >
        </CCard>
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  <!-- Toast Task -->
  <CToaster placement="top-end">
    <CToast v-for="(toast, index) in toasts" :key="index" :autohide="false">
      <CToastHeader closeButton color="danger">
        <span class="me-auto fw-bold">{{ toast.title }}</span>
        <small>{{ toast.time }}</small>
      </CToastHeader>
      <CToastBody>
        Ref Number {{ toast.content.refNumber }} <br/>
        Sender {{ toast.content.detailData.account_sender }} <br/>
        Receiver {{ toast.content.detailData.account_receiver }}
      </CToastBody>
    </CToast>
  </CToaster>
</template>

<script>
import axios from 'axios'
import avat from '@/assets/images/avatars/pic.jpg'
import router from '../router'
import { onMounted, ref } from 'vue'
export default {
  name: 'AppHeaderDropdownNotification',
  methods: {
    handleClick() {
      axios
        .patch(
          `${process.env.VUE_APP_URL_API}/users/${window.localStorage.getItem(
            '_id',
          )}`,
          { login_status: false },
          {
            headers: {
              Authorization: window.localStorage.getItem('accessToken'),
            },
          },
        )
        .then((res) => {
          window.localStorage.removeItem('role')
          window.localStorage.removeItem('username')
          window.localStorage.removeItem('_id')
          window.localStorage.removeItem('urlApi')
          window.localStorage.removeItem('accessToken')
          router.push({ name: 'Login' })
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
  },
  setup() {
    let toasts = ref([])

    onMounted(() => {
      socket.on('incidents created', (message) => {
        showToast('Incident Created ', message, message.createdAt);
      })
    })

    function showToast(title, content, time) {
      let last = new Date(time).getTime()
      let now = new Date().getTime()
      let date = now - last
      let second = new Date(date).getSeconds() + ' seconds ago'
      let minute = new Date(date).getSeconds() + ' minutes agoe'
      let dt = minute > 0 ? minute : second
      toasts.value.push({
        title: title,
        content: content,
        time: dt,
      })
      // playSound()
    }

    return {
      toasts,
      avatar: avat,
      itemsCount: 42,
    }
  },
}
</script>
