import {createStore} from 'vuex'
import users from './services/users'
import tasks from './services/tasks'
import { FeathersVuex } from '../feathers-client'

export default createStore({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {

  },
  plugins: [
    tasks,
    users
  ]
  ,
  getters: {}
})
