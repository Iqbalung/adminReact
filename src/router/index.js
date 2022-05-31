import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/tasks',
    children: [
      {
        path:'/tasks',
        name:'Tasks',
        component: () => import('@/views/tasks/index.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
        return next();
        }
      },
      {
        path:'/worker',
        name:'Worker',
        component: () => import('@/views/worker/index.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/tasks/create',
        name:'Create Tasks',
        component: () => import('@/views/tasks/create.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank',
        name:'Bank Account',
        component: () => import('@/views/bank_account/index.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/worker',
        name:'Worker',
        component: () => import('@/views/worker/index.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank/create',
        name:'Create Bank',
        component: () => import('@/views/bank_account/create.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank',
        name:'Bank Account',
        component: () => import('@/views/bank_account/index.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank/import',
        name:'Import Excel',
        component: () => import('@/views/bank_account/import.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank/create',
        name:'Create Bank',
        component: () => import('@/views/bank_account/create.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank/update/:id',
        name:'Update Bank',
        component: () => import('@/views/bank_account/update.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank/import',
        name:'Import Excel',
        component: () => import('@/views/bank_account/import.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/profile',
        name:'Profile',
        component:()=>import('@/views/worker/profile.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/bank/update/:id',
        name:'Update Bank',
        component: () => import('@/views/bank_account/update.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/profile',
        name:'Profile',
        component:()=>import('@/views/worker/profile.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          return next();
        }
      },
      {
        path:'/users',
        name:'Users',
        component: () => import('@/views/users/index.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
          if(window.localStorage.getItem('role')== 'worker')
          {
            return next({
              name:'Profile'
            })
          }
        return next();
        }
      },
      {
        path:'/users/create',
        name:'Create Users',
        component: () => import('@/views/users/create.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
        return next();
        }
      },
      {
        path:'/users/import',
        name:'Import Users',
        component: () => import('@/views/users/import.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
        return next();
        }
      },
      {
        path:'/users/update/:id',
        name:'Update Users',
        component: () => import('@/views/users/update.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
        return next();
        }
      },
      {
        path:'/customers',
        name:'Customers',
        component: () => import('@/views/customers/index.vue'),
        beforeEnter: (to,from,next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login'
            })
          }
  
          return next();
        }
      },
      {
        path:'/customers/create',
        name:'Create Customers',
        component: () => import('@/views/customers/create.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
  
          return next();
        }
      },
      {
        path:'/customers/update/:id',
        name:'Update Customers',
        component: () => import('@/views/customers/update.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
  
          return next();
        }
      },
      {
        path:'/items',
        name:'Items',
        component: () => import('@/views/items/index.vue'),
        beforeEnter: (to,from,next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login'
            })
          }
  
          return next();
        }
      },
      {
        path:'/items/create',
        name:'Create Items',
        component: () => import('@/views/items/create.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
  
          return next();
        }
      },
      {
        path:'/items/update/:id',
        name:'Update Items',
        component: () => import('@/views/items/update.vue'),
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
  
          return next();
        }
      },
      {
        path: '/incidents',
        name: 'Incidents',
        component: () => import('@/views/incidents/index.vue'),
        beforeEnter: (to, from, next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login',
            })
          }
          return next()
        },
      },
      {
        path:'/invoice',
        name:'Invoice',
        component: () => import('@/views/invoice/index.vue'),
        beforeEnter: (to,from,next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login'
            })
          }
  
          return next();
        }
      },
      {
        path: '/debt',
        name: 'Debt',
        component: () => import('@/views/debt/index.vue'),
        beforeEnter: (to, from, next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login',
            })
          }
          return next()
        },
      },
      {
        path: '/log',
        name: 'Log Activity',
        component: () => import('@/views/logactivity/index.vue'),
        beforeEnter: (to, from, next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login',
            })
          }
          return next()
        },
      },
      {
        path: '/agwlbot',
        name: 'Agwlbot',
        component: () => import('@/views/webcontrol/agwlbot.vue'),
        beforeEnter: (to, from, next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login',
            })
          }
          return next()
        },
      },
      {
        path: '/agwlbca',
        name: 'Agwlbca',
        component: () => import('@/views/webcontrol/agwlbca.vue'),
        beforeEnter: (to, from, next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login',
            })
          }
          return next()
        },
      },
      {
        path: '/monitoring',
        name: 'Monitoring',
        component: () => import('@/views/monitoring/index.vue'),
        beforeEnter: (to, from, next) => {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name: 'Login',
            })
          }
          return next()
        },
      },
    ],
  },

  {
    path: '/',
    redirect: '/login',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
        beforeEnter:(to,from,next)=> {
          if(window.localStorage.getItem('accessToken')) {
            return next({
              name:'Dashboard'
            })
          }
        return next();
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
