import Vue from 'vue'
import Router from 'vue-router'
import Recommed from '../components/recommend/recommend'
import Search from '../components/search/search'
import singer from '../components/singer/singer'
import Rank from '../components/rank/rank'
import singerDetail from '../components/singer-detail/singer-detail'
import Disc from '../components/disc/disc'
import TopList from '../components/top-list/top-list'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommed,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
