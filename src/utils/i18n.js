/* eslint-disable */

let zh_chs = {
  'Choose': '请选择',
  'Giving No.X question': '当给你第X个问题时',
  'answer No.(X-N) question': '回答第（X-N）个问题',
  'Only need answer last digit of result': '只需回答结果的最后一位数字'
}

let zh_cht = {
  'Choose': '請選擇',
  'Giving No.X question': '當給你第X個問題時',
  'answer No.(X-N) question': '回答第（X-N）個問題',
  'Only need answer last digit of result': '只需回答結果的最後一位數字'
}

let zh_cn = zh_chs
let zh_sg = zh_chs

let zh_tw = zh_cht
let zh_hk = zh_cht
let zh_mo = zh_cht

/* eslint-enable */

let locale = {zh_chs, zh_cht, zh_cn, zh_sg, zh_tw, zh_hk, zh_mo}

export default (() => {
  let defaultLanguage = navigator.systemLanguage || navigator.language
  var language = ''
  return {
    language (value) {
      if (value != null) {
        language = (value || defaultLanguage).toLocaleLowerCase().replace('-', '_')
      }
      return language
    },
    t (str) {
      return (locale[language] || {})[str] || str
    }
  }
})()
