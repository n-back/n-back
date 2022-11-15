import Env from '@/utils/env.js'

/* eslint-disable */
let en_us = {
}

let zh_chs = {
  'Global intelligence games': '风靡全球的智力游戏',
  'Improve working memory': '提高工作记忆',
  'Increase your focus': '增强注意力',
  ' population': '人群',
  'Improve IQ': '提高IQ',

  'Rules': '规则',
  'Example': '例子',
  'Start': '开始',
  'Given a few simple math problems, calculate and note the result': '给出多道简单的算术问题,计算并记下结果',
  'After N questions, Reply ': '在N个问题之后回复',
  'answer\'s last digit': '答案的个位',
  'Previous question ': '上一题',
  'When N is 2, answer the current answer after 2 questions, and so on.': '当N是2时，在2个问题后回答当前答案，依此类推。',

  'Record the letter and its position in the grid': '记录字母以及它在格子中的位置',
  'Compare with the next Nth question that ': '与之后的第N个问题比较',
  'position and content if they are match': '位置和内容是否一致',
  'When N is 2, compare the 2-question with the current one, and so on.': '当N是2时，把当前问题与之后的第2个问题比较，依此类推。',

  'Give a picture': '给出一张图片',
  'After N questions, choose correct picture': '在N个问题之后选出正确图片',
  'graphics': '图片集',

  'Challenge Mode': '挑战模式',
  'Challenge Complete': '挑战完成',
  'Challenge Failed': '挑战失败',
  'Choose': '请选择',

  'Position match': '位置匹配',
  'Content match': '内容匹配',
  'No match, pass': '无匹配, 跳过',
  'OK': '确认',
}

let zh_cht = {
  'Global intelligence games': '風靡全球的智力遊戲',
  'Improve working memory': '提高工作記憶',
  'Increase your focus': '增強注意力',
  ' population': '人群',
  'Improve IQ': '提高IQ',

  'Rules': '規則',
  'Example': '例子',
  'Start': '開始',
  'Given a few simple math problems, calculate and note the result': '給出多道簡單的算術問題,計算並記下結果',
  'After N questions, Reply ': '在N個問題之後回復',
  'answer\'s last digit': '答案的個位',
  'Previous question ': '上壹題',
  'When N is 2, answer the current answer after 2 questions, and so on.': '當N是2時，在2個問題後回答當前答案，依此類推。',

  'Record the letter and its position in the grid': '記錄字母以及它在格子中的位置',
  'Compare with the next Nth question that ': '與之後的第N個問題比較',
  'position and content if they are match': '位置和內容是否壹致',
  'When N is 2, compare the 2-question with the current one, and so on.': '當N是2時，把當前問題與之後的第2個問題比較，依此類推。',

  'Give a picture': '給出一張圖片',
  'After N questions, choose correct picture': '在N個問題之後選出正確圖片',
  'graphics': '圖片集',

  'Challenge Mode': '挑戰模式',
  'Challenge Complete': '挑戰完成',
  'Challenge Failed': '挑戰失敗',
  'Choose': '請選擇',

  'Position match': '位置匹配',
  'Content match': '內容匹配',
  'No match, pass': '無匹配, 跳過',
  'OK': '確認',
}

let zh_cn = zh_chs
let zh_sg = zh_chs

let zh_tw = zh_cht
let zh_hk = zh_cht
let zh_mo = zh_cht

/* eslint-enable */

let locale = {en_us, zh_chs, zh_cht, zh_cn, zh_sg, zh_tw, zh_hk, zh_mo}

export default (() => {
  let defaultLanguage = navigator.systemLanguage || navigator.language
  let standard = (language) => (language || defaultLanguage).toLocaleLowerCase().replace('-', '_')
  var language = standard(Env.get('language'))
  return {
    language (value) {
      if (value != null) {
        language = standard(value)
        Env.set('language', value)
      }
      return language
    },
    t (str) {
      return (locale[language] || locale[standard('en_US')])[str] || str
    }
  }
})()
