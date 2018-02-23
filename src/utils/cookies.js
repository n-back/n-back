export default function () {
  let params = {}
  let paramsString = document.cookie
  if (paramsString.length > 1) {
    paramsString.split('; ').forEach((kv) => {
      let kvs = kv.split('=')
      params[decodeURI(kvs[0])] = decodeURI(kvs[1])
    })
  }
  return params
}
