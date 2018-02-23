let locale = {
  'zh-cn': {
    'Choose': '请选择',
    'Giving No.X question': '当给你第X个问题时',
    'answer No.(X-N) question': '回答第（X-N）个问题',
    'Only need answer last digit of result': '只需回答结果的最后一位数字'
  }
}

export default (() => {
  let defaultLanguage = navigator.systemLanguage || navigator.language
  var language = ''
  return {
    language (value) {
      language = (value || defaultLanguage).toLocaleLowerCase().replace('_', '-')
    },
    t (str) {
      return (locale[language] || {})[str] || str
    }
  }
})()
