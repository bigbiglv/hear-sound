/**
 * rgb转16进制
 */
export function rgbToHex(str: string) {
  let result = ''
  if (str.indexOf("#") === 0) {
    result = str
  } else if (str.indexOf("rgb(") === 0) {
    const colors = str.replace(/rgb\(/g, "").replace(/\)/g, "").split(",")
    const r = parseInt(colors[0]).toString(16).length === 1 ? "0" + parseInt(colors[0]).toString(16) : parseInt(colors[0]).toString(16)
    const g = parseInt(colors[1]).toString(16).length === 1 ? "0" + parseInt(colors[1]).toString(16) : parseInt(colors[1]).toString(16)
    const b = parseInt(colors[2]).toString(16).length === 1 ? "0" + parseInt(colors[2]).toString(16) : parseInt(colors[2]).toString(16)
    result = `#${r}${g}${b}`
  }
  return result
}