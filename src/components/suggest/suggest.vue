<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {search} from '../../api/search'
  import {filterSinger} from '../../common/js/song'
  const TYPE_SINGER = 'singer'
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      search() {
        search(this.query, this.page, this.showSinger).then((res) => {
          if (res.code === 0) {
            this.result = this._genRsult(res.data)
            console.log(this.result)
          }
        })
      },
      _genRsult(data) {
        let ret = []
        console.log(data)
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(data.song.list)
        }
        return ret
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.songname}-${filterSinger(item.singer)}`
        }
      }
    },
    data() {
      return {
        page: 1,
        result: []
      }
    },
    watch: {
      query() {
        this.search()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/suggest'
</style>