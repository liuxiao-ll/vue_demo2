<template>
  <div class="singer" ref="singer">
    <listview :data="singers" @select="selectSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import Singer from '../../common/js/singer'
  import listview from '../../base/listview/listview'
  import {mapMutations} from 'vuex'

  const HONT_NAME = '热门'
  const HONT_NAME_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    components: {
      listview
    },
    created() {
      setTimeout(() => {
        this._getSingerList()
      }, 20)
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HONT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HONT_NAME_LEN) {
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HONT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%

</style>
