<template lang="slm">
  Layout
    Language#language :show="selectLanguage"
    template slot="header"
      span
        | Dual-N-back
      router-link.button.back to="/"
        i.fa.fa-chevron-left
      .space
      .button.language @click="selectLanguage = !selectLanguage"
        i.fa.fa-language
    template slot="content"
      .intro
        h2 {{ t('Rules') }}
        ul
          li {{ t('Record the letter and its position in the grid') }}
          li
            | {{ t('Compare with the next Nth question that ') }}
            b {{ t('position and content if they are match') }}
        br
        h3 {{ t('Example') + ": N=1" }}
        ul
          li
            .q
              | Q1:
            .question
              Grid :width="5" content="A" position="0"
          li
            .a
              | A:
            span
              | ------
          br
          li
            .q
              | Q2:
            .question
              Grid :width="5" content="A" position="24"
          li
            .a
              | A1:
            span {{ 'Q1: ' + t('Content match') }}
          br
          li
            .q
              | Q3:
            .question
              Grid :width="5" content="Z" position="24"
          li
            .a
              | A2:
            span {{ 'Q2: ' + t('Position match') }}
          br
          span.seperate
            | ........................
          br
          br
          li
            .q
              | Qn:
            .question
              Grid :width="5" content="H" position="12"
          li
            .a
              | An-1:
            span
              | Qn-1: (?)
          br
          li
            .q
              | Qn+1:
            .question
              Grid :width="5" content="H" position="12"
          li
            .a
              | An:
            span {{ 'Qn: ' + t('Position match') + '&' + t('Content match') }}
        b {{ t('When N is 2, compare the 2-question with the current one, and so on.') }}
        router-link.button to="/dual-n-back" {{ t('Start') }}
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
      .question {
        margin-left: .1rem;
        display: inline-block;
        width: 1rem;
        line-height: .2rem;
        font-size: .15rem;
        text-align: center;
      }
    }
    .q, .a, span {
      font-size: .16rem;
      display: inline-block;
    }
    .q, .a {
      width: 1rem;
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
import Grid from '@/components/Grid'
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
    Grid,
    Language
  },
  methods: {
    t: (str) => I18n.t(str)
  }
}
</script>
