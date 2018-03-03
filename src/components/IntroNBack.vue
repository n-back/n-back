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
          li {{ t('Given a few simple math problems, calculate and note the result') }}
          li
            | {{ t('After N questions, Reply ') }}
            b {{ t('answer\'s last digit') }}
        br
        h3 {{ t('Example') + ": N=1" }}
        ul
          li
            .q
              | Q1:
            span
              | 1+2=?
          li
            .a
              | A:
            span
              | ------
          br
          li
            .q
              | Q2:
            span
              | 3*4=?
          li
            .a
              | A1(2-N):
            span
              | 3  (Q1: 1+2=<b>3</b>)
          br
          li
            .q
              | Q3:
            span
              | 5*6=?
          li
            .a
              | A2:
            span
              | 2  (Q2: 3*4=1<b>2</b>)
          span.seperate
            | ........................
          br
          li
            .q
              | Qn:
            span
              | 5+5=?
          li
            .a
              | An-1(n-N):
            span
              | ? (Qn-1: ?)
          br
          li
            .q
              | Q:
            span
              | -------
          li
            .a
              | An:
            span
              | 0 (Qn: 5+5)
        b {{ t('When N is 2, answer the current answer after 2 questions, and so on.') }}
        router-link.button to="/n-back" {{ t('Start') }}
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
