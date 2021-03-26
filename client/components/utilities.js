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
