<template>
  <div class="song-list">
    <ul>
      <li v-for="(item, index) in songs" class="item" @click="selectItem(item, index)">
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{desc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    methods: {
      desc(song) {
        return `${song.singer} 。 ${song.album}`
      },
      selectItem(item, index) {
        this.$emit('select', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/song-list'
</style>