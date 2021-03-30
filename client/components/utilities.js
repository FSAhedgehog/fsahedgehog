// Are we still using this???
export function renderUitilyQuarterlyValues() {
  const {thirteenFs} = this.props
  thirteenFs.reverse()
  const returnArray = []
  for (let i = 0; i < thirteenFs.length; i++) {
    let newObject = {
      x: String(thirteenFs[i].dateOfFiling).slice(0, 10),
      y: (thirteenFs[i].quarterlyValue / 1000) * 10,
    }
    returnArray.push(newObject)
  }
  return returnArray
}

export function camelCase(str) {
  return str
    .split(' ')
    .map((word) => {
      word = word.toLowerCase()
      return word[0].toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export function findAverageBeta(thirteenFs) {
  if (thirteenFs.length) {
    const result =
      thirteenFs.reduce((accum, element) => {
        return accum + element.thirteenFBeta
      }, 0) / thirteenFs.length

    return result
  } else {
    return 1.0
  }
}

export function determineColor(number) {
  if (number > 1.1) {
    return '#DABFFF'
  } else if (number < 0.9) {
    return '#8affc1'
  } else {
    return 'rgb(157, 97, 255)'
  }
}
