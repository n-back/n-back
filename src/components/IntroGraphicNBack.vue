<template lang="slm">
  Layout
    Language#language :show="selectLanguage"
    template slot="header"
      span
        | N-back
      router-link.button.back to="/"
        i.fa.fa-chevron-left
      .space
      .button.language @click="selectLanguage = !selectLanguage"
        i.fa.fa-language
    template slot="content"
      .intro
        h2 {{ t('Rules') }}
        ul
          li {{ t('Give a picture') }}. {{ t('After N questions, choose correct picture') }}
        br
        router-link.button to="/graphic-n-back" {{ t('Start') }}
</template>

<style scoped lang="scss">
@import "../theme.scss";
.page {
  >#language {
    position: absolute;
    z-index: 1001;
    right: .1rem;
    top: .5rem;
  }
  .intro {
    padding: .1rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-direction: column;
    span.seperate {
      text-align: center;
      width: 100%;
      padding: 0;
      margin: 0;
    }
    li {
      padding: .05rem;
      span {
        margin-left: .2rem;
      }
    }
    .q, .a, span {
      font-size: .16rem;
      display: inline-block;
    }
    .q {
      color: $color-green;
    }
    .a {
      color: $color-red;
    }
    ul {
      margin: 0;
      padding: .1rem .2rem;
      &.example {
        width: 70%;
        li {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    >b {
      align-self: center;
      margin-top: .2rem;
    }
    .button {
      text-decoration: none;
      margin: .1rem;
      padding: .1rem;
      color: white;
      font-size: .2rem;
      background: $color-green;
      border-radius: .05rem;
    }
  }
}
h1,h2,h3,h4,h5,h6,p {
  margin: 0;
  padding: 0;
}
</style>

<script>
import Layout from '@/components/Layout'
import Language from '@/components/Language'
import I18n from '@/utils/i18n'

export default {
  name: 'IntroNBack',
  data () {
    return {
      selectLanguage: false
    }
  },
  components: {
    Layout,
    Language
  },
  methods: {
    t: (str) => I18n.t(str)
  }
}
</script>
