import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsCallout from '@/components/DocsCallout'
import DocsExample from '@/components/DocsExample'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import useClipboard from 'vue-clipboard3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import BootstrapVue3 from 'bootstrap-vue-3'
import Datepicker from 'vue3-date-time-picker';
import 'vue3-date-time-picker/dist/main.css'
// import clipboardjs from 'clipboard';


// const feat = feathers();
const app = createApp(App)
// app.use(clipboardjs)
app.component('Datepicker',Datepicker);
app.use(BootstrapVue3)
app.use(useClipboard);
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(VueSweetalert2);
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsCallout', DocsCallout)
app.component('DocsExample', DocsExample)

app.mount('#app')
