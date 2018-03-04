<template lang="slm">
  .grid
    .item v-for="index in width * width" :style="{width: style_width, 'padding-top': style_width}"
      span v-if="index-1==position" {{ number }}
</template>

<style scoped lang="scss">
.grid {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  .item {
    position: relative;
    border: solid .5px #ccc;
    box-sizing: border-box;
    height: 0;
    span {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
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
    number: {
      required: true
    },
    width: {
      default: 3
    }
  }
}
</script>
