<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="playRandom">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <Songlist :songs="favoriteList" @select="selectSong"></Songlist>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <Songlist :songs="playHistory" @select="selectSong"></Songlist>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-Result :title="noDisc"></no-Result>
      </div>
    </div>
  </transition>
</template>

<script>
  import switches from '../../base/switches/switches'
  import scroll from '../../base/scroll/scroll'
  import Songlist from '../../base/song-list/song-list'
  import Song from '../../common/js/song'
  import {mapGetters, mapActions} from 'vuex'
  import {playlistMixin} from '../../common/js/mixin'
  import noResult from '../../base/no-result/no-result'
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        currentIndex: 0,
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ]
      }
    },
    components: {
      switches,
      scroll,
      Songlist,
      noResult
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      back() {
        this.$router.back()
      },
      selectSong(song) {
        this.insertSong(new Song(song))
      },
      playRandom() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        list = list.map((song) => {
          return new Song(song)
        })
        this.randomPlay({
          list
        })
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    computed: {
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ]),
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
      noDisc() {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过'
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/user-center.styl'
</style>