<template>
  <transition name="slide">
    <musicLlist :songs="songs" :title="singer.name" :bgImage="singer.avatar"></musicLlist>
  </transition>
</template>

<script>
  import {mapGetters} from 'vuex'
  import musicLlist from '../music-list/music-list'
  import {getSingerDetail} from '../../api/singer'
  import {createSong} from '../../common/js/song'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    components: {
      musicLlist
    },
    created() {
      setTimeout(() => {
        this._getDetail()
      }, 20)
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === 0) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>