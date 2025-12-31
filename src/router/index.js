import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component:HomeView,
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
          },
          
          {
            path: 'pricecomparisonactivesort',
            name: 'PriceComparisonActiveSort',
            component: () => import ( '../views/DevVue/PriceComparisonActiveSort.vue')
          },
          {
            path: 'loginpage',
            name: 'LoginPage',
            component: () => import ( '../views/DevVue/LoginPage.vue')
          },
          {
            path: 'currencyconverter',
            name: 'CurrencyConverter',
            component: () => import ( '../views/DevVue/CurrencyConverter.vue')
          },
          {
            path: 'restfulapi',
            name: 'RESTfulAPI',
            component: () => import ( '../views/DevVue/RESTfulAPI.vue')
          }
        ]
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404page',
    component: () => import('../views/DevVue/404Page.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory('/ViteProject/'),
  routes
})

export default router
