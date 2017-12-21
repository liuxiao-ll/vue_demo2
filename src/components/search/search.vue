<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox  ref="searchBox" @query="onQueryChange"></searchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortCartWrapper">
      <scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="(item, index) in hotKey" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索条件</span>
              <span class="clear"  @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <searchList :searches="searchHistory" @select="addQuery" @delete="deleteOne"></searchList>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" @confirm="deleteAll"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import searchBox from '../../base/search-box/search-box'
  import {getHotKey} from '../../api/search'
  import suggest from '../suggest/suggest'
  import {mapActions, mapGetters} from 'vuex'
  import searchList from '../../base/search-list/search-list'
  import confirm from '../../base/confirm/confirm'
  import scroll from '../../base/scroll/scroll'
  import {playlistMixin} from '../../common/js/mixin'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    components: {
      searchBox,
      suggest,
      searchList,
      confirm,
      scroll
    },
    created() {
      this._getHotKey()
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ]),
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    methods: {
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.shortCartWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.suggest.refresh()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === 0) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      addQuery(item) {
        this.$refs.searchBox.setQuery(item)
      },
      deleteAll() {
        this.clearSearchHistory()
      },
      deleteOne(item) {
        this.deleteSearchHistory(item)
      },
      onQueryChange(query) {
        this.query = query
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/search.styl'
</style>