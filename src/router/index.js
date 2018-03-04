import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import NBack from '@/components/NBack'
import DualNBack from '@/components/DualNBack'
import IntroNBack from '@/components/IntroNBack'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Main
    },
    {
      path: '/intro-n-back',
      component: IntroNBack
    },
    {
      path: '/n-back',
      component: NBack
    },
    {
      path: '/dual-n-back',
      component: DualNBack
    }
  ]
})
