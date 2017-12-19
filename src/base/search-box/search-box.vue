<template>
    <div class="search-box">
      <i class="icon-search"></i>
      <input class="box" :placeholder="placeholder" v-model="query" ref="query">
      <i class="icon-dismiss" v-show="query" @click="clear"></i>
    </div>
  </template>
  
  <script>
    import {debounce} from '../../common/js/util'
    export default {
      data() {
        return {
          query: ''
        }
      },
      props: {
        placeholder: {
          type: String,
          default: '搜索歌曲、歌手'
        }
      },
      methods: {
        clear() {
          this.query = ''
        },
        setQuery(query) {
          this.query = query
        },
        blur() {
          this.$refs.query.blur()
        }
      },
      created() {
        this.$watch('query', debounce((newQuery) => {
          this.$emit('query', newQuery)
        }, 200))
      }
    }
  </script>
  
  <style scoped lang="stylus" rel="stylesheet/stylus">
     @import '../../common/st/search-box.styl'
  </style>