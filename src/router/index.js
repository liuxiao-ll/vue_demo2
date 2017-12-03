import Vue from 'vue'
import Router from 'vue-router'
import Recommed from '../components/recommend/recommend'
import Search from '../components/search/search'
import singer from '../components/singer/singer'
import Rank from '../components/rank/rank'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommed
    },
    {
      path: '/singer',
      component: singer
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
