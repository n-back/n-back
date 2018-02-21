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
        | {{ solutions.length + ' / ' + (count + level) }}
      .question
        | {{ question }}
      .status v-if="status == STATUS_START"
        span.correct
          | {{correct}}
        span
          | /
        span.incorrect
          | {{incorrect}}
        span
          | /
        span.total
          | {{total}}
      .answer v-if="status == STATUS_START"
        .item v-for="item in aItems" @click="checkItem(item)" :class="item.correct"
          | {{ item.index }}
      .time v-if="status == STATUS_START"
        | {{ 'Spend: ' + time }}
    .bottom-bar
      .copyright
        | 2018 @Xiaobawang
      a.about href="https://github.com/n-back"
        | About N-back
    .welcome.cover v-if="isShowWelcome"
      .inner
        h1 Welcome N-back Training!!
        .buttons
          button v-for="i in 9" @click="start(i)"
            | N={{i}}
        h2 Choose one
        h3 Answer question before N questions
    .result.cover v-if="status == STATUS_STOPED"
      .inner
        .infos
          .score.item
            label
              | Score:
            .status
              span.correct
                | {{correct}}
              span
                | /
              span.incorrect
                | {{incorrect}}
              span
                | /
              span.total
                | {{total}}
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

export default {
  name: 'NBack',
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
      setTimeout(() => {
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
          setTimeout(a, 10)
        }
      }
      setTimeout(a, 10)
    },
    showQuestion () {
      this.updateQuestion()
      if (this.solutions.length <= this.level) setTimeout(() => this.showQuestion(), 1500)
      else {
        this.status = STATUS_START
        this.startTimeCount()
      }
    },
    start (level) {
      Object.assign(this, generateData({level}))
      this.status = STATUS_PREPARE
      this.showQuestion()
    },
    home () {
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
  $color-green: green;
  $color-red: red;
  $color-correct: $color-green;
  $color-error: $color-red;
  $color-dark: #333;
  .page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    >.top-bar {
      background: $color-dark;
      font-size: .2rem;
      height: .5rem;
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
      .number {
        padding: .2rem;
        font-size: .2rem;
        text-align: center;
      }
      .question {
        margin-top: 30%;
        padding: .2rem;
        font-size: .4rem;
        text-align: center;
      }
      .answer {
        display: flex;
        width: 100%;
        height: 1rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .item {
          width: calc(20% - .1rem * 2);
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
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .2rem;
        span {
          &.correct {
            color: $color-correct;
          }
          &.incorrect {
            color: $color-error;
          }
        }
      }
      .time {
        position: fixed;
        left: .2rem;
        bottom: .5rem;
      }
    }
    >.cover {
      z-index: 1000;
      position: fixed;
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
          margin: 0;
        }
        h3 {
          margin: 0;
        }
        .buttons {
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
          label {
            font-size: .2rem;
            margin-right: .1rem;
          }
          .item {
            display: flex;
            &.score {
              .status {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .2rem;
                span {
                  &.correct {
                    color: $color-correct;
                  }
                  &.incorrect {
                    color: $color-error;
                  }
                }
              }
            }
            &.spend {
              .time {
                font-size: .2rem;
              }
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
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      padding: .1rem;
      color: gray;
      justify-content: space-between;
      border-top: solid 1px #eee;
      a {
        text-decoration:none;
        color: gray;
      }
    }
  }
</style>
