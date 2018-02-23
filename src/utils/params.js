export default function () {
  let params = {}
  let paramsString = document.location.search
  if (paramsString.length > 1) {
    paramsString.substring(1).split('&').forEach((kv) => {
      let kvs = kv.split('=')
      params[decodeURI(kvs[0])] = decodeURI(kvs[1])
    })
  }
  return params
}
