<template>
  <CDropdown variant="nav-item" alignment="end" class="notif-incident">
    <CDropdownToggle placement="bottom-end" :caret="false">
      <CIcon class="mx-2" icon="cil-bell" size="lg" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-12">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Notification Incidents
      </CDropdownHeader>
      <CDropdownItem v-for="(incident, key) in incidents" :key="key">
        <CCard style="width: 18rem">
          <CCardBody>
            <CCardText
              ><CIcon icon="cil-bell" />
              <span>{{ incident.detailData.payload.description.join(" ") }}</span>
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

<style>
.notif-incident .dropdown-menu {
  min-width: 24rem;
}
.notif-incident .card {
  width: 100% !important;
}
</style>

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
    const incidents = ref([])

    onMounted(() => {
      var acknowledgedcreate = []

      socket.on('incidents created', (message) => {
        showToast('Incident Created ', message, message.createdAt);

        if (!~acknowledgedcreate.indexOf(message._id)) {
          // add to array of acknowledged events
          acknowledgedcreate.unshift(message._id)

          // prevent array from growing to large
          if (acknowledgedcreate.length > 5) {
            acknowledgedcreate.length = 5
          }

          loadIncidents()
        }
      })

      loadIncidents()
    })

    function loadIncidents() {
      const params = {
        '$sort[id]': -1,
        '$limit': 5
      }

      axios
        .get(`${process.env.VUE_APP_URL_API}/incidents`, {
          headers: {
            Authorization: window.localStorage.getItem('accessToken'),
          },
          params,
        })
        .then((result) => {
          incidents.value = result.data.data
        })
        .catch((err) => {
          console.log(err.response)
        })
    }

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
      incidents,
      avatar: avat,
      itemsCount: 42,
    }
  },
}
</script>
