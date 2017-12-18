<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox  ref="searchBox"></searchBox>
    </div>
    <div class="shortcut-wrapper">
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
  </div>
</template>

<script>
  import searchBox from '../../base/search-box/search-box'
  import {getHotKey} from '../../api/search'
  export default {
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    components: {
      searchBox
    },
    created() {
      this._getHotKey()
    },
    methods: {
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === 0) {
            console.log(res)
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addQuery(item) {
        this.$refs.searchBox.setQuery(item.k)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/search.styl'
</style>