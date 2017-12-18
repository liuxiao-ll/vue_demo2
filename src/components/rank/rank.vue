<template>
    <div class="rank" ref="rank">
      <scroll class="toplist" ref="toplist" :data="topList">
        <ul>
          <li class="item" v-for="item in topList" @click="selectItem(item)">
            <div class="icon">
              <img width="100" height="100" v-lazy="item.picUrl">
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song, index) in item.songList">
                <span>{{index + 1}}</span>
                <span>{{song.songname}}--{{song.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
        <div class="loading-container" v-show="!topList.length" > 
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
    import {getTopList} from '../../api/rank'
    import scroll from '../../base/scroll/scroll'
    import loading from '../../base/loading/loading'
    import {playlistMixin} from '../../common/js/mixin'
    import {mapMutations} from 'vuex'
    export default {
      mixins: [playlistMixin],
      created() {
        this._getTopList()
      },
      data() {
        return {
          topList: []
        }
      },
      methods: {
        _getTopList() {
          getTopList().then((res) => {
            if (res.code === 0) {
              this.topList = res.data.topList
            }
          })
        },
        handlePlaylist(playList) {
          const bottom = playList.length > 0 ? '60px' : ''
          this.$refs.rank.style.bottom = bottom
          this.$refs.toplist.refresh()
        },
        selectItem(item) {
          this.$router.push({
            path: `/rank/${item.id}`
          })
          this.setTopList(item)
        },
        ...mapMutations({
          setTopList: 'SET_TOPLIST'
        })
      },
      components: {
        scroll,
        loading
      }
    }
  </script>
  
  <style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../common/st/rank.styl"
  </style>