<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close">
          <i class="icon-close" @click="hide"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <searchBox placeholder="搜索歌曲" @query="search" ref="searchBox"></searchBox>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
        <div class="list-wrapper">
          <scroll v-if="currentIndex === 0" :data="playHistory" class="list-scroll" ref="songList">
            <div class="list-inner">
              <Songlist :songs="playHistory" @select="selectSong"></Songlist>
            </div>
          </scroll>
          <scroll v-if="currentIndex === 1" :data="searchHistory" class="list-scroll" ref="searchList">
            <div class="list-inner">
              <searchList @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></searchList>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <topTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </topTip>
    </div>
  </transition>
</template>

<script>
  import searchBox from '../../base/search-box/search-box'
  import suggest from '../suggest/suggest'
  import {searchMixin} from '../../common/js/mixin'
  import switches from '../../base/switches/switches'
  import scroll from '../../base/scroll/scroll'
  import {mapGetters, mapActions} from 'vuex'
  import Songlist from '../../base/song-list/song-list'
  import Song from '../../common/js/song'
  import searchList from '../../base/search-list/search-list'
  import topTip from '../../base/top-tip/top-tip'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        query: '',
        showSinger: false,
        currentIndex: 0,
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
        ]
      }
    },
    methods: {
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      search(query) {
        this.query = query
      },
      selectSuggest() {
        this.saveSearch()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(song, index) {
        if (index !== 0) {
          console.log('啊啊啊啊')
          this.insertSong(new Song(song))
          this.showTip()
        }
      },
      ...mapActions([
        'insertSong'
      ]),
      showTip() {
        this.$refs.topTip.show()
      }
    },
    components: {
      searchBox,
      suggest,
      switches,
      scroll,
      Songlist,
      searchList,
      topTip
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/add-song.styl'
</style>