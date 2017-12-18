<template>
  <transition name="slide">
    <musicList :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></musiclist>
  </transition>
</template>

<script>
  import musicList from '../music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getMusicList} from '../../api/rank'
  import {createSong} from '../../common/js/song'
  export default {
    components: {
      musicList
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    computed: {
      ...mapGetters([
        'topList'
      ]),
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      }
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === 0) {
            this.songs = this._normalizSongs(res.songlist)
          }
        })
      },
      _normalizSongs(list) {
        let ret = []
        list.forEach((items) => {
          const item = items.data
          if (item.songid && item.albumid) {
            ret.push(createSong(item))
          }
        })
        return ret
      }
    },
    created() {
      this._getMusicList()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>