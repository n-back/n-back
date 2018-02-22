<template lang="slm">
  .page
    .top-bar
      span
        | N-back {{ (status == STATUS_START || status == STATUS_PREPARE) ? ('(n=' + level + ')') : '' }}
      button.retry @click="start(level)"
        | Retry
      button.home @click="home"
        | Home
    .content
      .number v-if="status == STATUS_START || status == STATUS_PREPARE"
        span.q
          label Q:
          span {{ ' ' + (solutions.length > count ? '--' : solutions.length) }}
        span.a
          label A:
          span {{ ' ' + (solutions.length > level ? solutions.length - level : '--') }}
        span
          label Sum:
          span {{ count }}
      .number v-else=""
      .question v-if="solutions.length <= count"
        | {{ question }}
      .question v-else=""
        | --------------
      .answer v-if="status == STATUS_START"
        .item v-for="item in aItems" @click="checkItem(item)" :class="item.correct"
          | {{ item.index }}
      Score :correct="correct" :incorrect="incorrect" :total="total" v-if="status == STATUS_START"
      .progress v-if="status == STATUS_PREPARE"
        .inner :style="{width: progressValue + '%'}"
      .time v-if="status == STATUS_START"
        | {{ 'Spend: ' + time }}
    .bottom-bar
      .copyright
        | 2018 @Xiaobawang
      a.about href="https://github.com/n-back/n-back"
        | About N-back
    .welcome.cover v-if="isShowWelcome"
      .inner
        h1 Welcome to N-back Training!!
        .buttons
          button v-for="i in 9" @click="start(i)"
            | N={{i}}
        h2 Choose N=?
        h3 Giving No.X question,
        h3 answering No.(X-N) question.
        h3 ="(Only need last digit)"
    .result.cover v-if="status == STATUS_STOPED"
      .inner
        .infos
          .level.item
            label
              | N =
            .n
              | {{ level }}
          .score.item
            label
              | Score:
            Score :correct="correct" :incorrect="incorrect" :total="total"
          .spend.item
            label
              | Spend:
            .time
              | {{ time }}
        .buttons
          button.again @click="start(level)"
            | Again
          button.home @click="home"
            | Home
</template>

<script>
import Score from './Score.vue'

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
    progressValue: 100,
    solutions: [],
    answerHistory: [],
    isShowWelcome: false,
    isAnswering: false,
    status: STATUS_NONE,
    aItems: new Array(10).fill({}).map((el, i) => {
      return {
        index: i,
        correct: ''
      }
    }),
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
  components: {Score},
  data () {
    return generateData()
  },
  methods: {
    updateQuestion () {
      if (this.status === STATUS_START || this.status === STATUS_PREPARE) {
        let a = generateQuestion()
        this.question = a.q
        this.solutions.push(a.a)
      }
    },
    checkItem (a) {
      if (this.isAnswering) return
      this.isAnswering = true
      let answer = this.solutions[this.solutions.length - 1 - this.level]
      let correct = answer === a.index
      a.correct = correct ? 'correct' : 'incorrect'
      this.answerHistory.push(correct)
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
      if (this.solutions.length <= this.level) {
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
  $topbar-height: .5rem;
  $bottombar-height: .4rem;
  .page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    >.top-bar {
      background: $color-dark;
      font-size: .2rem;
      height: $topbar-height;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        z-index: 1;
        margin: 0 .1rem;
        border: solid 1px white;
        border-radius: .05rem;
        padding: .06rem;
        text-align: left;
        font-size: .15rem;
        color: white;
        background: $color-dark;
      }
      span {
        position: absolute;
        width: 100%;
        font-size: .2rem;
        font-weight: bold;
        text-align: center;
      }
    }
    >.content {
      display: flex;
      flex-direction: column;
      .number {
        align-self: center;
        display: flex;
        justify-content: space-between;
        align-self: center;
        width: 75%;
        height: .3rem;
        padding: .2rem;
        font-size: .2rem;
        text-align: center;
        >span {
          width: 30%;
          label {
            width: 50%;
          }
          span {
            width: 50%;
          }
          &.q {
            label {
              color: $color-green;
            }
          }
          &.a {
            label {
              color: $color-red;
            }
          }
        }
      }
      .question {
        margin-top: .6rem;
        padding: .2rem;
        font-size: .4rem;
        line-height: .4rem;
        height: .4rem;
        text-align: center;
      }
      .progress {
        border: solid 1px #aaa;
        margin: 0 10%;
        .inner {
          width: 100%;
          height: .05rem;
          background: $color-green;
        }
      }
      .answer {
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
      .status {
        margin: .2rem 0;
      }
      .time {
        position: fixed;
        left: .4rem;
        bottom: .6rem;
        font-size: .2rem;
        text-align: center;
      }
    }
    >.cover {
      z-index: 1000;
      position: fixed;
      left: 0;
      right: 0;
      top: $topbar-height;
      bottom: $bottombar-height;
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
          label {
            margin-right: .1rem;
          }
          .item {
            display: flex;
            &.level {
              justify-content: center;
              font-size: .3rem;
            }
          }
        }
        .buttons {
          margin-top: .2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          button {
            color: white;
            font-size: .2rem;
            padding: .1rem;
            margin: .05rem;
            border-radius: .2rem;
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
    .bottom-bar {
      height: $bottombar-height;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      padding: .1rem;
      color: gray;
      box-sizing: border-box;
      justify-content: space-between;
      border-top: solid 1px #eee;
      a {
        text-decoration:none;
        color: gray;
      }
    }
  }
</style>
