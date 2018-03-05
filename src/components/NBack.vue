<template lang="slm">
  Layout
    Language#language :show="selectLanguage && status == STATUS_NONE"
    template slot="header"
      span
        | N-back {{ (status == STATUS_START || status == STATUS_PREPARE) ? ('(n=' + level + ')') : '' }}
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
          | {{ question || '--------------' }}
        .answer v-if="status == STATUS_START"
          .item v-for="item in aItems" @click="checkItem(item)" :class="item.correct"
            | {{ item.index }}
        Score :correct="correct" :incorrect="incorrect" :total="total" v-if="status == STATUS_START && !config.challengeMode"
        .challenge.status v-if="status == STATUS_START && config.challengeMode" {{ t('Challenge Mode') }}
        .progress v-if="status == STATUS_PREPARE"
          .inner :style="{width: progressValue + '%'}"
        .time v-if="status == STATUS_START"
          i.fa.fa-hourglass-half
          span {{ " = " + time }}
        .welcome.cover v-if="isShowWelcome"
          .inner
            h1 N-back
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
import Layout from '@/components/Layout'
import Score from '@/components/Score'
import Language from '@/components/Language'
import I18n from '@/utils/i18n'
import Env from '@/utils/env'
import generateQuestion from '@/questions/n-back'

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
    status: STATUS_NONE,
    aItems: new Array(10).fill({}).map((el, i) => {
      return {
        index: i,
        correct: ''
      }
    }),
    config,
    ...data
  }
}

var questionTimeout = null
var selectTimeout = null

export default {
  name: 'NBack',
  components: {
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
      if ((this.status === STATUS_START || this.status === STATUS_PREPARE) && this.questions.length < this.count) {
        let a = generateQuestion()
        this.question = a.q
        this.questions.push(a)
      } else {
        this.question = null
      }
    },
    checkItem (a) {
      if (this.isAnswering) return
      this.isAnswering = true
      let question = this.questions[this.total]
      let correct = question !== null && question.a === a.index
      a.correct = correct ? 'correct' : 'incorrect'
      correct ? ++this.correct : ++this.incorrect
      ++this.total
      if (this.total >= this.count || (this.config.challengeMode && !correct)) {
        this.status = STATUS_STOPED
        return
      }
      selectTimeout = setTimeout(() => {
        a.correct = ''
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
        let time = 2000
        var timeNow = time
        let counter = () => {
          if (timeNow === 0) {
            this.showQuestion()
            return
          }
          timeNow -= 10
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
        margin-top: 10%;
        padding: .2rem;
        font-size: .4rem;
        line-height: .4rem;
        height: .4rem;
        text-align: center;
      }
      >.answer {
        display: flex;
        width: 100%;
        margin-top: .2rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .item {
          width: calc(20% - .1rem * 2);
          height: .6rem;
          line-height: .5rem;
          padding: .05rem;
          margin: .05rem;
          border-radius: .05rem;
          box-sizing: border-box;
          border: solid 1px #ccc;
          text-align: center;
          font-size: .2rem;
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
