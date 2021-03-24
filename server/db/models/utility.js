const convertToDollars = (value) => {
  if (!Number.isNaN(value)) {
    return value / 100
  }
}
const convertToPennies = (value) => {
  if (!Number.isNaN(value)) {
    return Math.round(value * 100)
  }
}
module.exports = {
  convertToDollars,
  convertToPennies,
}
