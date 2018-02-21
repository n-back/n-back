import Vue from 'vue'
import Router from 'vue-router'
import NBack from '@/components/NBack'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: NBack
    }
  ]
})
