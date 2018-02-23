import params from './params.js'
import cookies from './cookies.js'

export default (() => {
  var dict = Object.assign(cookies(), params())
  return {
    get (key) {
      return dict[key]
    },
    set (key, value) {
      document.cookie = key + '=' + value
      dict[key] = value
    }
  }
})()
