<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :data-index="index" :class="{'current': currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="scrollY <= 0" ref="fixed">
      <h1 class="fixed-title">{{fixedtitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import scroll from '../scroll/scroll'
  import {getData} from '../../common/js/dom.js'
  import loading from '../loading/loading'
  const ANCHOR_HEIGHT = 18
  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: 0,
        diff: 0,
        currentIndex: 0
      }
    },
    components: {
      scroll,
      loading
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedtitle() {
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : null
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        if (anchorIndex < 0) {
          this.touch.anchorIndex = 0
        } else if (anchorIndex > this.listHeight.length - 2) {
          this.touch.anchorIndex = this.listHeight.length - 2
        } else {
          this.touch.anchorIndex = anchorIndex
        }
        this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 1000)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        if (anchorIndex < 0) {
          anchorIndex = 0
        } else if (anchorIndex > this.listHeight.length - 2) {
          anchorIndex = this.listHeight.length - 2
        }
        this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 10)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _calcu() {
        this.listHeight = []
        const list = this.$refs.listgroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          height += this.$refs.listgroup[i].clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calcu()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 滚动到上边
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (!height2 || (-newY >= height1 && -newY < height2)) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 滚动到底部
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/st/listview"
</style>
