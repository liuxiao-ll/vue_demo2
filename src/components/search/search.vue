<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox  ref="searchBox" @query="onQueryChange"></searchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li v-for="(item, index) in hotKey" class="item" @click="addQuery(item)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import searchBox from '../../base/search-box/search-box'
  import {getHotKey} from '../../api/search'
  import suggest from '../suggest/suggest'
  export default {
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    components: {
      searchBox,
      suggest
    },
    created() {
      this._getHotKey()
    },
    methods: {
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === 0) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addQuery(item) {
        this.$refs.searchBox.setQuery(item.k)
      },
      onQueryChange(query) {
        this.query = query
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/search.styl'
</style>