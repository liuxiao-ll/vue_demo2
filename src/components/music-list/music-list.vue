<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="backlist"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgstyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playButton">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list" :data="songs" ref="list" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
      <div class="song-list-wrapper">
        <songList :songs="songs" @select="selectItem"></songList>  
      </div>  
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>   
    </scroll>
  </div>
</template>

<script>
  import scroll from '../../base/scroll/scroll'
  import songList from '../../base/song-list/song-list'
  import loading from '../../base/loading/loading'
  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    computed: {
      bgstyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    methods: {
      backlist() {
        this.$router.push('/singer')
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(item, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    components: {
      scroll,
      songList,
      loading
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    data() {
      return {
        scrollY
      }
    },
    watch: {
      scrollY(newY) {
        let zIndex = 0
        let translateY = Math.max(this.minTranslateY + 44, newY)
        let scale = 1
        let blur = 0
        this.$refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
        const percent = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale += percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style.filter = `blur(${blur}px)`
        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = '44px'
          this.$refs.playButton.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playButton.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style.transform = `scale(${scale})`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/music-list.styl'
</style>