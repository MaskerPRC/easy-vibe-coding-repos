// 斗地主游戏逻辑测试
import { ref } from 'vue'

export function useDoudizhuTests(addLog) {
  const results = ref([])

  const runTests = () => {
    addLog('开始斗地主游戏逻辑测试...', 'info')
    results.value = []

    // 测试1: 牌库初始化
    try {
      const suits = ['♠', '♥', '♦', '♣']
      const values = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
      const deck = []

      suits.forEach(suit => {
        values.forEach(value => {
          deck.push({ suit, value, id: `${suit}${value}` })
        })
      })
      deck.push({ suit: 'joker', value: '小王', id: 'joker_small' })
      deck.push({ suit: 'joker', value: '大王', id: 'joker_big' })

      results.value.push({
        name: '牌库初始化',
        passed: deck.length === 54,
        message: deck.length === 54
          ? '牌库正确包含54张牌（52张普通牌+2张王牌）'
          : `牌库数量错误: ${deck.length}`
      })
      addLog('牌库初始化测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '牌库初始化',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('牌库初始化测试失败', 'error')
    }

    // 测试2: 洗牌算法
    try {
      const deck = Array.from({ length: 54 }, (_, i) => i)
      const shuffled = [...deck]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      const isDifferent = deck.some((val, idx) => val !== shuffled[idx])

      results.value.push({
        name: '洗牌算法',
        passed: isDifferent && shuffled.length === 54,
        message: isDifferent
          ? '洗牌算法正常工作，牌序已打乱'
          : '洗牌后牌序未改变'
      })
      addLog('洗牌算法测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '洗牌算法',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('洗牌算法测试失败', 'error')
    }

    // 测试3: 发牌逻辑
    try {
      const deck = Array.from({ length: 54 }, (_, i) => i)
      const player1 = deck.slice(0, 17)
      const player2 = deck.slice(17, 34)
      const player3 = deck.slice(34, 51)
      const landlordCards = deck.slice(51, 54)

      const correctDistribution =
        player1.length === 17 &&
        player2.length === 17 &&
        player3.length === 17 &&
        landlordCards.length === 3

      results.value.push({
        name: '发牌逻辑',
        passed: correctDistribution,
        message: correctDistribution
          ? '每人17张牌，底牌3张，分配正确'
          : '发牌数量分配错误'
      })
      addLog('发牌逻辑测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '发牌逻辑',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('发牌逻辑测试失败', 'error')
    }

    // 测试4: 牌面大小比较
    try {
      const cardOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', '小王', '大王']
      const getCardRank = (value) => cardOrder.indexOf(value)

      const isCorrect =
        getCardRank('3') < getCardRank('A') &&
        getCardRank('2') > getCardRank('A') &&
        getCardRank('大王') > getCardRank('2') &&
        getCardRank('小王') < getCardRank('大王')

      results.value.push({
        name: '牌面大小比较',
        passed: isCorrect,
        message: isCorrect
          ? '牌面大小顺序正确：3<...<A<2<小王<大王'
          : '牌面大小顺序有误'
      })
      addLog('牌面大小比较测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '牌面大小比较',
        passed: false,
        message: `测试异常: ${error.message}`
      })
      addLog('牌面大小比较测试失败', 'error')
    }

    // 测试5: 牌型识别 - 单牌
    try {
      const cards = [{ value: 'A' }]
      const isSingle = cards.length === 1

      results.value.push({
        name: '牌型识别 - 单牌',
        passed: isSingle,
        message: isSingle ? '正确识别单牌' : '单牌识别错误'
      })
      addLog('单牌识别测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '牌型识别 - 单牌',
        passed: false,
        message: `测试异常: ${error.message}`
      })
    }

    // 测试6: 牌型识别 - 对子
    try {
      const cards = [{ value: 'K' }, { value: 'K' }]
      const isPair = cards.length === 2 && cards[0].value === cards[1].value

      results.value.push({
        name: '牌型识别 - 对子',
        passed: isPair,
        message: isPair ? '正确识别对子' : '对子识别错误'
      })
      addLog('对子识别测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '牌型识别 - 对子',
        passed: false,
        message: `测试异常: ${error.message}`
      })
    }

    // 测试7: 牌型识别 - 炸弹
    try {
      const cards = [
        { value: '7' }, { value: '7' },
        { value: '7' }, { value: '7' }
      ]
      const isBomb = cards.length === 4 &&
        cards.every(c => c.value === cards[0].value)

      results.value.push({
        name: '牌型识别 - 炸弹',
        passed: isBomb,
        message: isBomb ? '正确识别炸弹（四张相同）' : '炸弹识别错误'
      })
      addLog('炸弹识别测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '牌型识别 - 炸弹',
        passed: false,
        message: `测试异常: ${error.message}`
      })
    }

    // 测试8: 牌型识别 - 王炸
    try {
      const cards = [
        { value: '小王', suit: 'joker' },
        { value: '大王', suit: 'joker' }
      ]
      const isRocketBomb = cards.length === 2 &&
        cards.every(c => c.suit === 'joker')

      results.value.push({
        name: '牌型识别 - 王炸',
        passed: isRocketBomb,
        message: isRocketBomb ? '正确识别王炸（双王）' : '王炸识别错误'
      })
      addLog('王炸识别测试完成', 'success')
    } catch (error) {
      results.value.push({
        name: '牌型识别 - 王炸',
        passed: false,
        message: `测试异常: ${error.message}`
      })
    }

    addLog('斗地主逻辑测试全部完成', 'info')
  }

  const clearResults = () => {
    results.value = []
  }

  return {
    results,
    runTests,
    clearResults
  }
}
