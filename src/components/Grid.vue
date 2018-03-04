<template lang="slm">
  .grid
    .item v-for="index in width * width" :style="{width: style_width, 'padding-top': style_width}"
      span v-if="index-1==position" {{ content }}
</template>

<style scoped lang="scss">
.grid {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  .item {
    position: relative;
    border: solid .25px #ccc;
    box-sizing: border-box;
    height: 0;
    span {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      text-align: center;
    }
  }
}
</style>

<script>
export default {
  name: 'Grid',
  computed: {
    style_width () {
      return (100 / this.width) + '%'
    }
  },
  props: {
    position: {
      required: true
    },
    content: {
      required: true
    },
    width: {
      default: 3
    }
  }
}
</script>
