<template>
  <div class="song-list">
    <ul>
      <li v-for="item in songs" class="item">
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
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/st/song-list'
</style>