export default (previous) => {
  let randomNumber = (n) => Math.floor(Math.random() * n)
  let ret = {}
  if (previous != null) {
    if (randomNumber(3) === 0) ret.p = previous.p
    if (randomNumber(4) === 0) ret.a = previous.a
  }
  return {
    p: ret.p || randomNumber(25),
    a: ret.a || String.fromCharCode(randomNumber(26) + 'A'.charCodeAt())
  }
}
