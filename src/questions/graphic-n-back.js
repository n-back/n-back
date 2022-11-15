export default (assets) => {
  let randomNumber = (n) => Math.floor(Math.random() * n)

  let randomArray = (arr, n) => {
    var result = []
    while (arr.length > 0 && result.length < n) {
      let random = randomNumber(arr.length)
      result.push(arr[random])
      arr[random] = arr[arr.length - 1]
      arr.splice(arr.length - 1, 1)
    }
    return result
  }

  let totalSelection = 4
  return {
    q: randomArray(Array.from(assets), totalSelection).map((x, i) => ({ url: x, index: i })),
    a: randomNumber(totalSelection)
  }
}
