<template>
  <div class="recommend" ref="recommend">
    <div ref="scroll" class="recommend-content">
      <div>
        <div class="slider-wrapper" ref="sliderWrapper" v-if="recommend.length">
          <slider>
            <div v-for="item in recommend">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item">
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container">
      </div>
    </div>
  </div>
</template>

<script>
  import {getRecommend} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import slider from '../../base/slider/slider'

  export default{
    data() {
      return {
        recommend: []
      }
    },
    created() {
      this._getRecommend()
    },
    methods: {
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommend = res.data.slider
          }
        })
      }
    },
    components: {
      slider
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/st/recommend.styl"
</style>