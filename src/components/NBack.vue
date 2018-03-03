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
        .question
          | {{ question || '--------------' }}
        .answer v-if="status == STATUS_START"
          .item v-for="item in aItems" @click="checkItem(item)" :class="item.correct"
            | {{ item.index }}
        Score :correct="correct" :incorrect="incorrect" :total="total" v-if="status == STATUS_START"
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
            h3 {{ t('Giving No.X question') + ',' }}
            h3 {{ t('answer No.(X-N) question') + '.' }}
            h3 {{ '(' + t('Only need answer last digit of result') + ')' }}
        .result.cover v-if="status == STATUS_STOPED"
          .inner
            .infos
              .level.item
                span.label
                  | N =
                .n
                  | {{ level }}
              .score.item
                span.label
                  i.fa.fa-heartbeat
                Score :correct="correct" :incorrect="incorrect" :total="total"
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
import Layout from '@/components/Layout.vue'
import Score from '@/components/Score.vue'
import Language from '@/components/Language.vue'
import I18n from '@/utils/i18n.js'

let config = {
  author: '小霸王'
}

let xhr = new XMLHttpRequest()
xhr.onload = (result) => Object.assign(config, JSON.parse(result.currentTarget.responseText))
xhr.open('get', '/static/info.json')
xhr.send()

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

function randomNumber (n = 9) {
  return Math.floor(Math.random() * n) + 1
}

function generateQuestion () {
  let a = randomNumber()
  let b = randomNumber()
  let calcs = [
    () => {
      return {
        q: a + ' + ' + b + ' = ? ',
        a: (a + b) % 10
      }
    },
    () => {
      let c = a + b
      return {
        q: c + ' - ' + b + ' = ? ',
        a: a % 10
      }
    },
    () => {
      return {
        q: a + ' * ' + b + ' = ? ',
        a: a * b % 10
      }
    },
    () => {
      let c = a * b
      return {
        q: c + ' / ' + b + ' = ? ',
        a: a % 10
      }
    }
  ]
  return calcs[randomNumber(calcs.length) % calcs.length]()
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
      if (this.total >= this.count) {
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
      var time = 0
      let a = () => {
        if (this.status === STATUS_START && this.total < this.count) {
          this.time = (++time / 100) + 's'
          questionTimeout = setTimeout(a, 10)
        }
      }
      questionTimeout = setTimeout(a, 10)
    },
    showQuestion () {
      this.updateQuestion()
      if (this.questions.length <= this.level) {
        let time = 1500
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
  @import '../theme.scss';
  .page {
    display: flex;
    flex-direction: column;
    >#language {
      position: absolute;
      z-index: 1001;
      right: .1rem;
      top: .5rem;
    }
    .content-inner {
      width: 100%;
      >.number {
        align-self: center;
        display: flex;
        justify-content: space-between;
        align-self: center;
        width: calc(100%- .2rem * 2);
        height: .3rem;
        padding: .2rem;
        font-size: .2rem;
        text-align: center;
        >span {
          width: 30%;
          .label {
            width: 50%;
          }
          span {
            width: 50%;
          }
          &.q {
            .label {
              color: $color-green;
            }
          }
          &.a {
            .label {
              color: $color-red;
            }
          }
        }
      }
      >.question {
        margin-top: 10%;
        padding: .2rem;
        font-size: .4rem;
        line-height: .4rem;
        height: .4rem;
        text-align: center;
      }
      >.progress {
        border: solid 1px #aaa;
        margin: 0 10%;
        .inner {
          width: 100%;
          height: .05rem;
          background: $color-green;
        }
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
          &.correct {
            background: $color-correct;
          }
          &.incorrect {
            background: $color-error;
          }
        }
      }
      >.status {
        margin: .2rem 0;
      }
      >.time {
        width: 100%;
        position: absolute;
        bottom: .1rem;
        font-size: .2rem;
        text-align: center;
        span {
          display: inline-block;
          text-align: left;
          margin-left: .1rem;
          width: 1rem;
        }
      }
      >.cover {
        z-index: 1000;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0,0,0, .5);
        display: flex;
        align-items: center;
        justify-content: center;
        .inner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          $width: 3rem;
          $height: 2rem;
          background: white;
          width: $width;
          height: $height;
          border-radius: .2rem;
        }
      }
      >.welcome {
        .inner {
          height: 5rem;
          h1 {
            text-align: center;
          }
          h2 {
            margin: 0 0 .1rem;
            text-align: center;
          }
          h3 {
            margin: 0 10%;
            text-align: center;
          }
          .buttons {
            padding: 0 .1rem;
            margin-bottom: .1rem;
            button {
              width: calc(33% - .05rem * 2);
              box-sizing: border-box;
              margin-top: .2rem;
              font-size: .2rem;
              padding: .1rem;
              margin: .05rem;
              border-radius: .2rem;
              border: solid 1px $color-dark;
            }
          }
        }
      }
      >.result {
        .inner {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          $width: 3rem;
          $height: 2rem;
          background: white;
          width: $width;
          height: $height;
          border-radius: .2rem;
          .infos {
            font-size: .2rem;
            .label {
              margin-right: .1rem;
            }
            .item {
              display: flex;
              justify-content: left;
              &.level {
                justify-content: center;
                font-size: .3rem;
              }
            }
          }
          .buttons {
            margin-top: .1rem;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;
            button {
              color: white;
              font-size: .24rem;
              padding: .1rem;
              margin: .05rem;
              border-radius: .2rem;
              width: 30%;
              &.home {
                background: $color-red;
              }
              &.again {
                background: $color-green;
              }
            }
          }
        }
      }
    }
  }
</style>
