<template lang="slm">
  Layout
    Language#language :show="selectLanguage && status == STATUS_NONE"
    template slot="header"
      span
        | Dual-N-back {{ (status == STATUS_START || status == STATUS_PREPARE) ? ('(n=' + level + ')') : '' }}
      .button.retry @click="start(level)" v-if="status != STATUS_NONE"
        i.fa.fa-refresh
      router-link.button.back to="/" v-else=""
        i.fa.fa-chevron-left
      .space
      .button.language @click="selectLanguage = !selectLanguage" v-if="status == STATUS_NONE"
        i.fa.fa-language
      .button.home @click="home" v-else=""
        i.fa.fa-home
    template slot="content"
      .content-inner
        .number v-if="status == STATUS_START || status == STATUS_PREPARE"
          span.q
            span.label Q:
            span {{ ' ' + (questions.length > count ? '--' : questions.length) }}
          span.a
            span.label A:
            span {{ ' ' + (total > 0 ? total : '--') }}
          span
            span.label Sum:
            span {{ count }}
        .number v-else=""
        .question v-if="status == STATUS_START || status == STATUS_PREPARE"
          .inner
            Grid :width="5" :position="question.p" :content="question.a"
        .answer v-if="status == STATUS_START"
          .item @click="positionMatch =! positionMatch" :class="positionMatch ? 'select' : '' "
            i.fa.fa-check-square-o v-if="positionMatch"
            i.fa.fa-square-o v-else=""
            | {{ t('Position match') }}
          .item @click="contentMatch =! contentMatch" :class="contentMatch ? 'select' : '' "
            i.fa.fa-check-square-o v-if="contentMatch"
            i.fa.fa-square-o v-else=""
            | {{ t('Content match') }}
          .button @click="check" :class="buttonSelect" {{ t('OK') }}
        Score :correct="correct" :incorrect="incorrect" :total="total" v-if="status == STATUS_START && !config.challengeMode"
        .challenge.status v-if="status == STATUS_START && config.challengeMode" {{ t('Challenge Mode') }}
        .progress v-if="status == STATUS_PREPARE"
          .inner :style="{width: progressValue + '%'}"
        .time v-if="status == STATUS_START"
          i.fa.fa-hourglass-half
          span {{ " = " + time }}
        .welcome.cover v-if="isShowWelcome"
          .inner
            h1 Dual-N-back
            h2 {{ t('Choose') + " N=?" }}
            .buttons
              button v-for="i in 9" @click="start(i)"
                | N={{i}}
            .challenge @click="config.challengeMode=!config.challengeMode"
              i.fa.fa-check-square-o v-if="config.challengeMode"
              i.fa.fa-square-o v-else=""
              | {{ t('Challenge Mode') }}
        .result.cover v-if="status == STATUS_STOPED"
          .inner
            .infos
              .level.item
                span.label
                  | N =
                .n
                  | {{ level }}
              .score.item v-if="!config.challengeMode"
                span.label
                  i.fa.fa-heartbeat
                Score :correct="correct" :incorrect="incorrect" :total="total"
              .score.item v-else=""
                .challenge.success v-if="correct==total"
                  i.fa.fa-check
                  | {{ t('Challenge Complete') }}
                .challenge v-else=""
                  i.fa.fa-close
                  | {{ t('Challenge Failed') }}
              .spend.item
                span.label
                  i.fa.fa-hourglass-end
                span.time
                  | {{ time }}
            .buttons
              button.again @click="start(level)"
                i.fa.fa-refresh
              button.home @click="home"
                i.fa.fa-home
</template>

<script>
import Grid from '@/components/Grid'
import Layout from '@/components/Layout'
import Score from '@/components/Score'
import Language from '@/components/Language'
import I18n from '@/utils/i18n'
import Env from '@/utils/env'
import generateQuestion from '@/questions/dual-n-back'

let config = {
  challengeMode: Env.get('challengeMode') || false
}

let STATUS_NONE = 10
let STATUS_PREPARE = 11
let STATUS_START = 12
let STATUS_STOPED = 13
function generateData (data) {
  return {
    STATUS_NONE,
    STATUS_PREPARE,
    STATUS_START,
    STATUS_STOPED,
    question: '',
    level: 1,
    correct: 0,
    incorrect: 0,
    total: 0,
    count: 10,
    time: '0s',
    selectLanguage: false,
    progressValue: 100,
    questions: [],
    isShowWelcome: false,
    isAnswering: false,
    positionMatch: false,
    contentMatch: false,
    buttonSelect: '',
    status: STATUS_NONE,
    config,
    ...data
  }
}

var questionTimeout = null
var selectTimeout = null

export default {
  name: 'DualNBack',
  components: {
    Grid,
    Layout,
    Score,
    Language
  },
  data () {
    return generateData()
  },
  watch: {
    'config.challengeMode': (value) => {
      Env.set('challengeMode', value)
    }
  },
  methods: {
    t (value) {
      return I18n.t(value)
    },
    updateQuestion () {
      if ((this.status === STATUS_START || this.status === STATUS_PREPARE)) {
        let a = generateQuestion(this.questions[this.questions.length - this.level])
        this.question = a
        this.questions.push(a)
      }
    },
    check () {
      if (this.isAnswering) return
      this.isAnswering = true
      let question = this.questions[this.total]
      let currentQuestion = this.questions[this.questions.length - 1]
      let correct = ((question.p === currentQuestion.p) === this.positionMatch) && ((question.a === currentQuestion.a) === this.contentMatch)
      this.positionMatch = false
      this.contentMatch = false
      this.buttonSelect = correct ? 'correct' : 'incorrect'
      correct ? ++this.correct : ++this.incorrect
      ++this.total
      if (this.total >= this.count || (this.config.challengeMode && !correct)) {
        this.status = STATUS_STOPED
        return
      }
      selectTimeout = setTimeout(() => {
        this.buttonSelect = ''
        this.updateQuestion()
        this.isAnswering = false
      }, 200)
    },
    startTimeCount () {
      let getTime = () => new Date().getTime()
      let startTime = getTime()
      let a = () => {
        if (this.status === STATUS_START && this.total < this.count) {
          this.time = ((getTime() - startTime) / 1000) + 's'
          questionTimeout = setTimeout(a, 10)
        }
      }
      questionTimeout = setTimeout(a, 10)
    },
    showQuestion () {
      this.updateQuestion()
      if (this.questions.length <= this.level) {
        let getTime = () => new Date().getTime()
        let time = config.challengeMode ? 2000 : 5000
        let endTime = getTime() + time
        let counter = () => {
          let timeNow = endTime - getTime()
          if (timeNow <= 0) {
            this.showQuestion()
            return
          }
          this.progressValue = timeNow * 100 / time
          questionTimeout = setTimeout(counter, 10)
        }
        questionTimeout = setTimeout(counter, 10)
      } else {
        this.status = STATUS_START
        this.startTimeCount()
      }
    },
    reset () {
      clearTimeout(questionTimeout)
      clearTimeout(selectTimeout)
    },
    start (level) {
      this.reset()
      Object.assign(this, generateData({level, count: level + 10}))
      this.status = STATUS_PREPARE
      this.showQuestion()
    },
    home () {
      this.reset()
      Object.assign(this, generateData())
      this.isShowWelcome = true
    }
  },
  mounted () {
    this.home()
  }
}
</script>

<style scoped lang="scss">
  @import '../styles/n-back-common.scss';
  .page {
    .content-inner {
      >.question {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: .1rem;
        text-align: center;
        .inner {
          width: 2rem;
          line-height: .4rem;
          font-size: .3rem;
        }
      }
      >.answer {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .item {
          width: calc(50% - .1rem * 2);
          height: .5rem;
          line-height: .4rem;
          padding: .05rem;
          margin: .05rem;
          box-sizing: border-box;
          text-align: center;
          font-size: .2rem;
          cursor: pointer;
          i {
            width: .3rem;
            margin-right: .05rem;
          }
          &.select {
          }
        }
        .button {
          border: solid 1px gray;
          border-radius: .05rem;
          background: white;
          margin-top: .1rem;
          padding: .05rem .5rem;
          font-size: .25rem;
          border-radius: .05rem;
          cursor: pointer;
          &.correct {
            background: $color-correct;
          }
          &.incorrect {
            background: $color-error;
          }
        }
      }
    }
  }
</style>
