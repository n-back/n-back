export default (() => {
  var language = null
  let self = {
    params () {
      let params = {}
      let paramsString = document.location.search
      if (paramsString.length > 1) {
        paramsString.substring(1).split('&').forEach((kv) => {
          let kvs = kv.split('=')
          params[decodeURI(kvs[0])] = decodeURI(kvs[1])
        })
      }
      return params
    },
    cookies () {
      let params = {}
      let paramsString = document.cookie
      if (paramsString.length > 1) {
        paramsString.split(';').forEach((kv) => {
          let kvs = kv.split('=')
          params[decodeURI(kvs[0])] = decodeURI(kvs[1])
        })
      }
      return params
    },
    language (value = null) {
      let key = 'language'
      if (value != null) {
        document.cookie = (key + '=' + value)
        language = value
      } else {
        language = (language || self.cookies()[key] || self.params()[key] || navigator.systemLanguage || navigator.language || 'en-US')
      }
      return language
    },
    init () {
      let key = 'language'
      language = self.params()[key]
      if (language != null) self.cookies()[key] = (key + '=' + language)
      else language = this.language()
    }
  }
  return self
})()
