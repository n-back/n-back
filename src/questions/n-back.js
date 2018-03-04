export default () => {
  let randomNumber = (n) => Math.floor(Math.random() * n)
  let a = randomNumber(9) + 1
  let b = randomNumber(9) + 1
  let calcs = [
    () => {
      return {
        q: a + ' + ' + b + ' = ? ',
        a: (a + b) % 10
      }
    },
    () => {
      let c = a + b
      return {
        q: c + ' - ' + b + ' = ? ',
        a: a % 10
      }
    },
    () => {
      return {
        q: a + ' * ' + b + ' = ? ',
        a: a * b % 10
      }
    },
    () => {
      let c = a * b
      return {
        q: c + ' / ' + b + ' = ? ',
        a: a % 10
      }
    }
  ]
  return calcs[randomNumber(calcs.length) % calcs.length]()
}
