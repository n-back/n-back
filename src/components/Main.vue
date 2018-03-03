<template lang="slm">
  Layout
    Language#language :show="selectLanguage"
    template slot="header"
      span
        | N-back
      .space
      .button.language @click="selectLanguage = !selectLanguage"
        i.fa.fa-language
    template slot="content"
      a href="https://en.wikipedia.org/wiki/N-back"
        h2 {{ 'N-back: ' + t('Global intelligence games') }}
      ul
        li {{ t('Improve working memory') }}
        li {{ t('Improve IQ') }}
        li {{ t('Increase your focus') }}
        li
          | {{ t('Suitable for ') }}
          a href="https://en.wikipedia.org/wiki/ADHD"
            | ADHD
          | {{ t(' population') }}
      .type
        span
          | Single N-back
        router-link to="/intro-n-back" {{ t('Rules') }}
        router-link to="/n-back" {{ t('Start') }}
</template>

<style lang="scss">
@import '../theme.scss';
.page {
  >#language {
    position: absolute;
    z-index: 1001;
    right: .1rem;
    top: .5rem;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    a {
      text-decoration: none;
    }
    ul {
      li {
        font-size: .2rem;
      }
    }
    .type {
      display: flex;
      align-items: center;
      width: calc(100% - .2rem);
      box-sizing: border-box;
      border-radius: .05rem;
      border: solid 1px $color-gray;
      margin: .1rem;
      padding: .1rem;
      font-size: .2rem;
      span {
        flex: 1;
      }
      a {
        text-decoration: none;
        color: black;
        background: white;
        border: solid 1px $color-gray;
        border-radius: .05rem;
        padding: .05rem;
        &+a {
          margin-left: .1rem;
        }
      }
    }
  }
}
</style>

<script>
import Layout from '@/components/Layout'
import Language from '@/components/Language'
import I18n from '@/utils/i18n.js'

export default {
  name: 'Main',
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
    t: (value) => I18n.t(value)
  }
}
</script>
