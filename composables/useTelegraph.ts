enum KeyStatus {
  Press,
  Up,
}

/**
 * 模拟电报机
 * @param onSend 发送消息事件
 */
export function useTelegraph(onSend: (word: string) => void) {
  let letterTimer: NodeJS.Timeout
  let wordTimer: NodeJS.Timeout

  const time = ref<number>(0)
  const word = ref<string>('')
  const inputCodeValue = ref<string>('')

  const keyStatus = ref<KeyStatus>(1)

  const morseMap = new Map([
    ['01', 'A'],
    ['1000', 'B'],
    ['1010', 'C'],
    ['100', 'D'],
    ['0', 'E'],
    ['0010', 'F'],
    ['110', 'G'],
    ['0000', 'H'],
    ['00', 'I'],
    ['0111', 'J'],
    ['101', 'K'],
    ['0100', 'L'],
    ['11', 'M'],
    ['10', 'N'],
    ['111', 'O'],
    ['0110', 'P'],
    ['1101', 'Q'],
    ['010', 'R'],
    ['000', 'S'],
    ['1', 'T'],
    ['001', 'U'],
    ['0001', 'V'],
    ['011', 'W'],
    ['1001', 'X'],
    ['1011', 'Y'],
    ['1100', 'Z'],
  ])

  const dotLength = 50
  const dashLength = dotLength * 3
  const letterSpace = dotLength * 6
  const wordSpace = dotLength * 12

  function transcoder(codeGroup: string) {
    return codeGroup.replaceAll('0', '.').replaceAll('1', '-')
  }

  function press() {
    letterTimer && clearTimeout(letterTimer)
    wordTimer && clearTimeout(wordTimer)

    keyStatus.value = KeyStatus.Press
    time.value = Date.now()

    startOscillate()
  }

  function up() {
    keyStatus.value = KeyStatus.Up

    stopOscillate()

    if (Date.now() - time.value > dashLength)
      inputCodeValue.value += '1'
    else
      inputCodeValue.value += '0'

    // 字母上屏
    letterTimer = setTimeout(() => {
      word.value += morseMap.get(inputCodeValue.value) || ''
      inputCodeValue.value = ''

      // 发送单词
      wordTimer = setTimeout(() => {
        onSend(word.value)
        word.value = ''
      }, wordSpace)
    }, letterSpace)
  }

  return {
    /** 摩斯电码映射表 */
    morseMap,
    /** 电报键状态 */
    keyStatus,
    /** 输入的摩斯电码 */
    inputCode: computed<string>(() => transcoder(inputCodeValue.value)),
    /** 发送的单词 */
    word,
    /** 发送消息事件 */
    onSend,
    /**
     * 将 `0` 和 `1` 转换为摩斯电码 `.` 和 `-`
     * @param codeGroup 摩斯电码
     */
    transcoder,
    /** 按下电报键 */
    press,
    /** 抬起电报键 */
    up,
  }
}
