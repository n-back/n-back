<template lang="slm">
  .page
    header
      slot name="header"
    .content
      slot name="content"
    slot
    footer
      .copyright v-html="'2022-2032 @' + config.author"
      a.about href="https://github.com/n-back/n-back"
        i.fa.fa-github
</template>

<style scoped lang="scss">
@import '../theme.scss';
$header-height: 0.5rem;
$footer-height: 0.4rem;
.page {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  position: relative;
  header {
    position: relative;
    background: $color-dark;
    font-size: 0.2rem;
    height: $header-height;
    box-sizing: border-box;
    color: white;
    display: flex;
    align-items: center;
    .button {
      z-index: 1;
      margin: 0 0.1rem;
      padding: 0.06rem;
      text-align: left;
      font-size: 0.2rem;
      color: white;
      border: none;
      background: $color-dark;
      cursor: pointer;
    }
    .space {
      flex: 1;
    }
    span {
      z-index: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      line-height: $header-height;
      font-size: 0.2rem;
      font-weight: bold;
      text-align: center;
    }
  }
  .content {
    overflow: auto;
    position: fixed;
    top: $header-height;
    bottom: $footer-height;
    left: 0;
    right: 0;
    width: 100%;
    height: calc(100% - #{$header-height} - #{$footer-height});
  }
  footer {
    height: $footer-height;
    padding: 0 0.1rem;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    color: gray;
    background: white;
    box-sizing: border-box;
    border-top: solid 1px #eee;
    .copyright {
      font-size: 0.12rem;
      padding-right: 0.4rem;
      position: absolute;
      top: 0.025rem;
      bottom: 0.025rem;
    }
    > a {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0.1rem;
      line-height: $footer-height;
      text-decoration: none;
      color: gray;
      font-size: 0.24rem;
    }
  }
}
</style>

<style lang="scss">
.page {
  footer {
    .copyright {
      a {
        text-decoration: none;
        color: gray;
      }
    }
  }
}
</style>

<script>
let config = {
  author: 'n-back'
}

if (window.configData != null) Object.assign(config, window.configData())

export default {
  name: 'Layout',
  data () {
    return {
      config
    }
  }
}
</script>
