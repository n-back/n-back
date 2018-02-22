<template lang="slm">
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
</template>

<script>
export default {
  name: 'Score',
  props: ['correct', 'incorrect', 'total']
}
</script>

<style scoped lang="scss">
  @import '../theme.scss';
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
</style>
