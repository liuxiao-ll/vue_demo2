<template>
  <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" ref="suggest" :beforeScroll="beforeScroll" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <noResult title="抱歉，暂无搜索结果"></noResult>
    </div>
  </scroll>
</template>

<script>
  import {search} from '../../api/search'
  import {createSong} from '../../common/js/song'
  import scroll from '../../base/scroll/scroll'
  import loading from '../../base/loading/loading'
  import Singer from '../../common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import noResult from '../../base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20
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
    components: {
      scroll,
      loading,
      noResult
    },
    methods: {
      search() {
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        this.hasMore = true
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this._genRsult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page += 1
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === 0) {
            this.result = this.result.concat(this._genRsult(res.data))
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * 20) > song.totalnum) {
          this.hasMore = false
        }
      },
      _genRsult(data) {
        let ret = []
        if (data.song.curpage === 1) {
          if (data.zhida && data.zhida.singerid) {
            ret.push({...data.zhida, ...{type: TYPE_SINGER}})
          }
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
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
          return `${item.name}-${item.singer}`
        }
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]),
      listScroll() {
        this.$emit('listScroll')
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true
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