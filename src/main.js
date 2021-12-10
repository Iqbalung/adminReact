import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-3-socket.io'
// import feathers from '@feathersjs/feathers'
// import fsocket from '@feathersjs/socketio-client'
import SocketIO from 'socket.io-client'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsCallout from '@/components/DocsCallout'
import DocsExample from '@/components/DocsExample'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// const feat = feathers();
const app = createApp(App)
app.use(new VueSocketIO({
  debug:true,
  connection: SocketIO('http://localhost:3031'), //options object is Optional
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
}))
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(VueSweetalert2);
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsCallout', DocsCallout)
app.component('DocsExample', DocsExample)

app.mount('#app')
