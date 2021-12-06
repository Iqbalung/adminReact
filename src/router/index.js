import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
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
          path:'/tasks',
          name:'Tasks',
          component: () => import('@/views/tasks/index.vue'),
          beforeEnter:(to,from,next)=> {
            if(!window.localStorage.getItem('accessToken')) {
              return next({
                name:'Login'
              })
            }
            if(window.localStorage.getItem('role')== 'worker')
            {
              return next({
                name:'Worker'
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
        path:'/users',
        name:'Users',
        component: () => import('@/views/users/index.vue'),
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
        path:'/users/create',
        name:'Create Users',
        component: () => import('@/views/users/create.vue')
        ,
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
        component: () => import('@/views/users/update.vue')
        ,
        beforeEnter:(to,from,next)=> {
          if(!window.localStorage.getItem('accessToken')) {
            return next({
              name:'Login'
            })
          }
        return next();
        }
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
