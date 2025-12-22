import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component:HomeView,
  },
  {
    path: '/concept',
    name: 'Concept',
    component: () => import ('../views/ConceptView.vue'),
    children: [
      {
        path: 'css',
        name: 'ConceptCSS',
        component: () => import ('../views/ConceptviewCSS.vue')
      },
      {
        path: 'js',
        name: 'ConceptJS',
        component: () => import ('../views/ConceptviewJS.vue')
      },
    ]
  },
  {
    path: '/devconcept',
    name: 'DevConcept',
    component: () => import ('../views/DevConcept.vue'),
    children: [
      {
        path: 'vue',
        name: 'DevVue',
        component: () => import ('../views/DevVue.vue'),
        children: [
          {
            path: '', // 空路徑作為預設子路由
            name: 'DevVueIndex',
            component: () => import ('../views/DevVue/DevVueIndex.vue')
          },
          {
            path: 'todolist',
            name: 'TodoList',
            component: () => import ('../views/DevVue/TodoList.vue')
          },
          {
            path: 'propsemit',
            name: 'PropsEmit',
            component: () => import ( '../views/DevVue/PropsEmit.vue')
          },
          {
            path: 'axiosjson',
            name: 'axiosJson',
            component: () => import ( '../views/DevVue/AxiosJson.vue')
          },
          {
            path: 'axiospropsemit',
            name: 'axiosPropsEmit',
            component: () => import ( '../views/DevVue/AxiosJsonPropsEmit.vue')
          },
          {
            path: 'reservationPage',
            name: 'reservationPage',
            component: () => import ( '../views/DevVue/ReservationPage.vue')
          },
          {
            path: 'leisurefarm',
            name: 'LeisureFarm',
            component: () => import ( '../views/DevVue/LeisureFarm.vue')
          },
          {
            path: 'pricecomparison',
            name: 'PriceComparison',
            component: () => import ( '../views/DevVue/PriceComparison.vue')
          }
        ]
      },
      {
        path: 'js',
        name: 'DevJS',
        component: () => import ('../views/DevJS.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory('/ViteProject/'),
  routes
})

export default router
