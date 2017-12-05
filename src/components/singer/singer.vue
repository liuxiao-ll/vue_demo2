<template>
  <div class="singer" ref="singer">
    singer
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import Singer from '../../common/js/singer'
  const HONT_NAME = '热门'
  const HONT_NAME_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
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
            this.singers = res.data.list
            console.log(this._normalizeSinger(this.singers))
          }
        })
      },
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
          }
        })
        console.log(map)
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
