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
  return (
    thirteenFs.reduce((accum, element) => accum + element.thirteenFBeta, 0) /
    thirteenFs.length
  )
}
