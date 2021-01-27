const readline = require('readline')

const reset = '\x1b[0m'
const red = '\x1b[31m'
const blue = '\x1b[36m'
const green = '\x1b[32m'
const orange = '\x1b[33m'
const yellow = '\x1b[93m'
const grey = '\x1b[90m'

const icons = {
  square: '■',
  circle: '●',
  victory: '✌',
  ok: '✔',
  check: '✔',
  error: '✗',
  sad: '☹',
  dash: '-',
  pipe: '|'
}

const write = (str) => process.stdout.write(str)
const writeLine = (...args) => { return write([].slice.call(args).join('') + '\n') }

const remove = (lines = -1) => {
  readline.moveCursor(process.stdout, 0, lines)
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)
}
const error = l => writeLine(red, l, reset)
const warn = l => writeLine(orange, l, reset)
const info = l => writeLine(blue, l, reset)
const debug = l => writeLine(yellow, l, reset)
const ok = l => writeLine(green, l, reset)
const example = l => writeLine(grey, l, reset)
const label = l => writeLine(green, l, reset)
const logMethods = { error, warn, debug, info, label, remove }

const log = new Proxy({}, {
  get (t, p) {
    return logMethods[p] || writeLine
  }
})

const ansiCode = number => `\x1b[${parseInt(number)}m`

const randomColor = () => ansiCode(Math.floor(Math.random() * (40 - 30 + 1)) + 30)

const line = (char = icons.dash, len = 105) => char.repeat(len)

const progressBar = (total, value, options = {}) => {
  const steps = options.steps || 10
  const char = options.char || icons.square
  const empty = options.empty || ' '
  const close = options.close || icons.pipe
  const percent = Math.floor(value * 100 / total)
  const bars = [...new Array(steps + 1)]
    .map((v, i) => (i * (100 / steps) < percent) ? char : empty)
  bars.splice(Math.floor(bars.length / 2), 0, ` ${percent}% `)
  return `${close}${bars.join('')}${close}`
}

const argKey = key => `--${key}`

const parseArg = (args, key) => {
  if (!Array.isArray(args)) return
  if (!key) return
  key = argKey(key)
  let a = args.find(v => v.startsWith(key))
  if (a) {
    a = a.split('=').pop()
    return (a === key) || a
  }
}

const getArgs = (options, userArgs) => {
  const args = {}
  for (const o in options) {
    args[o] = parseArg(userArgs, options[o])
  }
  return args
}

module.exports = {
  reset,
  red,
  blue,
  green,
  orange,
  yellow,
  grey,
  ok,
  example,
  log,
  line,
  write,
  writeLine,
  randomColor,
  ansiCode,
  progressBar,
  icons,
  argKey,
  parseArg,
  getArgs
}
