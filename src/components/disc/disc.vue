<template>
  <transition name="slide">
    <musicLlist :title="title" :bg-image="bgImage" :songs="songs"></musicLlist>
  </transition>
</template>

<script>
  import musicLlist from '../music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from '../../api/recommend'
  import {createSong} from '../../common/js/song'

  export default {
    components: {
      musicLlist
    },
    computed: {
      ...mapGetters([
        'disc'
      ]),
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      }
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === 0) {
            this.songs = this._normalizeSongs(res.cdlist[0])
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
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