<template lang="slm">
  Layout
    Language#language :show="selectLanguage && status == STATUS_NONE"
    template slot="header"
      span
        | Graphic-N-back {{ (status == STATUS_START || status == STATUS_PREPARE) ? ('(n=' + level + ')') : '' }}
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
        .question v-if="(status == STATUS_START || status == STATUS_PREPARE) && question.url != null"
          img :src="question.url"
        .question v-else=""
          | --------------
        .answer v-if="status == STATUS_START"
          .item v-for="item in aItems" @click="checkItem(item)" :class="item.correct"
            img :src="item.url"
        Score :correct="correct" :incorrect="incorrect" :total="total" v-if="status == STATUS_START && !config.challengeMode"
        .challenge.status v-if="status == STATUS_START && config.challengeMode" {{ t('Challenge Mode') }}
        .progress v-if="status == STATUS_PREPARE"
          .inner :style="{width: progressValue + '%'}"
        .time v-if="status == STATUS_START"
          i.fa.fa-hourglass-half
          span {{ " = " + time }}
        .welcome.cover v-if="isShowWelcome"
          .inner
            h1 Graphic-N-back
            h2 {{ t('Choose') + t('graphics') }}
            .graphics v-for='(item,index) in config.graphics'
                input type='radio' name='graphics' :value='index' :id='index' v-model='config.selectGraphic'
                label :for='index' {{ item.name }}
            .content-inner v-if="(config.graphics[config.selectGraphic].assets || []).length > 0"
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
import generateQuestion from '@/questions/graphic-n-back'

let config = {
  challengeMode: Env.get('challengeMode') || false,
  selectGraphic: Env.get('selectGraphic') || '0',
  graphics: window.graphics || []
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
    question: {},
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
    aItems: [],
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
    },
    'config.selectGraphic': (value) => {
      Env.set('selectGraphic', value)
    }
  },
  methods: {
    t (value) {
      return I18n.t(value)
    },
    updateQuestion () {
      if ((this.status === STATUS_START || this.status === STATUS_PREPARE) && this.questions.length < this.count) {
        let a = generateQuestion(this.config.graphics[this.config.selectGraphic].assets || [])
        this.question = a.q[a.a] || {}
        this.questions.push(a)
      } else {
        this.question = {}
      }
      let question = this.questions[this.total] || {}
      this.aItems = question.q || []
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
        flex-direction: column;
        align-items: center;
        .graphics {
          label {
            font-size: .2rem;
          }
        }
        padding: .1rem;
        font-size: .4rem;
        line-height: .4rem;
        align-items: center;
        text-align: center;
        > img {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
      >.answer {
        display: flex;
        max-width: 4rem;
        margin: .2rem auto 0;
        padding: 0 .4rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .item {
          width: calc(50% - .1rem * 2);
          height: calc(50% - .1rem * 2);
          line-height: calc(50% - .1rem * 2);
          padding: .05rem;
          margin: .05rem;
          border-radius: .05rem;
          box-sizing: border-box;
          border: solid 1px #ccc;
          text-align: center;
          font-size: .2rem;
          cursor: pointer;
          > img {
            width: 100%;
            height: 100%;
          }
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
