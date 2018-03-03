<template lang="slm">
  .language-select v-if="show"
    span v-for="l in languages" @click="language(l.c)" :class="language() == l.c ? 'selected' : '' " {{l.t}}
</template>

<style scoped lang="scss">
@import "../theme.scss";
.language-select {
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: .05rem;
  border: solid 1px #aaa;
  background: $color-dark;
  span {
    padding: .08rem .1rem;
    font-size: .2rem;
    &+span {
      border-top: solid .1px white;
    }
    &.selected {
      color: $color-selected;
    }
  }
}
</style>

<script>
import I18n from '@/utils/i18n.js'

export default {
  name: 'language-select',
  props: ['show'],
  data () {
    return {
      languages: [
        {t: '中文简体', c: 'zh_cn'},
        {t: '中文繁體', c: 'zh_tw'},
        {t: 'English', c: 'en_us'}
      ]
    }
  },
  methods: {
    language (value) {
      if (value != null) {
        this.selectLanguage = false
        if (value !== I18n.language()) {
          I18n.language(value)
          location.reload()
        }
      }
      return I18n.language()
    }
  }
}
</script>
