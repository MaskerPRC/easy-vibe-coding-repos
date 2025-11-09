// 紫微斗数核心算法工具类

// 天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 十二宫位名称
const PALACE_NAMES = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '奴仆', '官禄', '田宅', '福德', '父母'
];

// 紫微斗数主星
const MAJOR_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞',
  '天府', '太阴', '贪狼', '巨门', '天相', '天梁',
  '七杀', '破军'
];

// 辅星
const MINOR_STARS = [
  '左辅', '右弼', '文昌', '文曲', '天魁', '天钺',
  '禄存', '天马', '擎羊', '陀罗', '火星', '铃星'
];

// 吉星
const LUCKY_STARS = ['天喜', '红鸾', '天德', '月德', '三台', '八座'];

// 命主与身主对照表
const MINGZHU_TABLE = ['贪狼', '巨门', '禄存', '文曲', '廉贞', '武曲', '破军', '武曲', '贪狼', '巨门', '贪狼', '巨门'];
const SHENZHU_TABLE = ['火星', '天相', '天梁', '天同', '文昌', '天机', '火星', '天相', '天梁', '天同', '文昌', '天机'];

/**
 * 计算农历年份的天干地支
 */
function getGanZhi(year) {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return {
    gan: HEAVENLY_STEMS[ganIndex],
    zhi: EARTHLY_BRANCHES[zhiIndex],
    ganIndex,
    zhiIndex
  };
}

/**
 * 根据出生日期计算命宫位置
 */
function calculateMingGongPosition(birthMonth, birthHour) {
  // 简化算法：命宫 = (寅宫位置 + 月份 - 1) - 时辰
  // 寅宫从2开始计数（子=0, 丑=1, 寅=2...）
  let position = (2 + birthMonth - 1 - birthHour) % 12;
  if (position < 0) position += 12;
  return position;
}

/**
 * 根据出生日期计算身宫位置
 */
function calculateShenGongPosition(birthMonth, birthHour) {
  // 简化算法：身宫 = (寅宫位置 + 月份 - 1) + 时辰
  let position = (2 + birthMonth - 1 + birthHour) % 12;
  return position;
}

/**
 * 安主星（紫微星系）
 */
function placeMajorStars(mingGongPos, birthDay, birthMonth) {
  const stars = {};

  // 计算紫微星位置（简化算法）
  const ziWeiPos = (birthDay + birthMonth - 1) % 12;

  // 紫微星系（顺时针分布）
  const ziWeiSequence = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞'];
  ziWeiSequence.forEach((star, index) => {
    const pos = (ziWeiPos + index) % 12;
    if (!stars[pos]) stars[pos] = [];
    stars[pos].push({ name: star, type: 'main' });
  });

  // 天府星系（逆时针分布）
  const tianFuPos = (14 - ziWeiPos) % 12;
  const tianFuSequence = ['天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];
  tianFuSequence.forEach((star, index) => {
    const pos = (tianFuPos - index + 12) % 12;
    if (!stars[pos]) stars[pos] = [];
    stars[pos].push({ name: star, type: 'main' });
  });

  return stars;
}

/**
 * 安辅星
 */
function placeMinorStars(mingGongPos, birthYear, birthMonth, birthHour) {
  const stars = {};

  const yearZhi = (birthYear - 4) % 12;

  // 左辅右弼
  const zuoFuPos = (mingGongPos + 1) % 12;
  const youBiPos = (mingGongPos - 1 + 12) % 12;
  stars[zuoFuPos] = stars[zuoFuPos] || [];
  stars[zuoFuPos].push({ name: '左辅', type: 'minor' });
  stars[youBiPos] = stars[youBiPos] || [];
  stars[youBiPos].push({ name: '右弼', type: 'minor' });

  // 文昌文曲
  const wenChangPos = (birthHour + 1) % 12;
  const wenQuPos = (birthHour - 1 + 12) % 12;
  stars[wenChangPos] = stars[wenChangPos] || [];
  stars[wenChangPos].push({ name: '文昌', type: 'minor' });
  stars[wenQuPos] = stars[wenQuPos] || [];
  stars[wenQuPos].push({ name: '文曲', type: 'minor' });

  // 天魁天钺
  const tianKuiPos = (yearZhi + 1) % 12;
  const tianYuePos = (yearZhi - 1 + 12) % 12;
  stars[tianKuiPos] = stars[tianKuiPos] || [];
  stars[tianKuiPos].push({ name: '天魁', type: 'minor' });
  stars[tianYuePos] = stars[tianYuePos] || [];
  stars[tianYuePos].push({ name: '天钺', type: 'minor' });

  // 禄存
  const luCunPos = yearZhi % 12;
  stars[luCunPos] = stars[luCunPos] || [];
  stars[luCunPos].push({ name: '禄存', type: 'minor' });

  return stars;
}

/**
 * 安吉星
 */
function placeLuckyStars(birthYear, birthMonth) {
  const stars = {};

  const yearZhi = (birthYear - 4) % 12;

  // 天喜红鸾
  const tianXiPos = (yearZhi + 9) % 12;
  const hongLuanPos = (3 - yearZhi + 12) % 12;
  stars[tianXiPos] = stars[tianXiPos] || [];
  stars[tianXiPos].push({ name: '天喜', type: 'lucky' });
  stars[hongLuanPos] = stars[hongLuanPos] || [];
  stars[hongLuanPos].push({ name: '红鸾', type: 'lucky' });

  return stars;
}

/**
 * 合并星曜到宫位
 */
function mergeStars(...starMaps) {
  const result = {};
  for (let i = 0; i < 12; i++) {
    result[i] = [];
  }

  starMaps.forEach(starMap => {
    Object.keys(starMap).forEach(pos => {
      result[pos] = result[pos].concat(starMap[pos]);
    });
  });

  return result;
}

/**
 * 生成命盘描述
 */
function generateDescription(mingGongPos, mingzhu, shenzhu, palaces) {
  const mingGongStars = palaces[mingGongPos].stars.map(s => s.name).join('、');

  return `您的命主星为${mingzhu}，身主星为${shenzhu}。命宫位于${palaces[mingGongPos].name}宫，有${mingGongStars}等星曜坐守。` +
    `命主${mingzhu}代表您的先天命格特质，身主${shenzhu}反映您的后天行为倾向。` +
    `此命盘显示您的性格、事业、感情等方面的基本运势走向。建议结合大运流年进行详细分析。`;
}

/**
 * 主计算函数
 */
export function calculateZiWeiChart(birthInfo) {
  const { gender, date, hour } = birthInfo;

  // 解析日期
  const birthDate = new Date(date);
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth() + 1; // 1-12
  const birthDay = birthDate.getDate();

  // 计算命宫和身宫位置
  const mingGongPos = calculateMingGongPosition(birthMonth, hour);
  const shenGongPos = calculateShenGongPosition(birthMonth, hour);

  // 计算命主和身主
  const mingzhu = MINGZHU_TABLE[hour];
  const shenzhu = SHENZHU_TABLE[shenGongPos];

  // 安置各类星曜
  const majorStars = placeMajorStars(mingGongPos, birthDay, birthMonth);
  const minorStars = placeMinorStars(mingGongPos, birthYear, birthMonth, hour);
  const luckyStars = placeLuckyStars(birthYear, birthMonth);

  // 合并所有星曜
  const allStars = mergeStars(majorStars, minorStars, luckyStars);

  // 生成宫位数据
  const palaces = [];
  for (let i = 0; i < 12; i++) {
    const palaceIndex = (mingGongPos + i) % 12;
    palaces.push({
      name: PALACE_NAMES[i],
      earthlyBranch: EARTHLY_BRANCHES[palaceIndex],
      stars: allStars[palaceIndex] || [],
      isMingGong: i === 0,
      isShenGong: palaceIndex === shenGongPos
    });
  }

  // 生成描述
  const description = generateDescription(0, mingzhu, shenzhu, palaces);

  return {
    mingzhu,
    shenzhu,
    minggong: `${PALACE_NAMES[0]}（${EARTHLY_BRANCHES[mingGongPos]}）`,
    shengong: `${PALACE_NAMES[(shenGongPos - mingGongPos + 12) % 12]}（${EARTHLY_BRANCHES[shenGongPos]}）`,
    palaces,
    description,
    birthInfo: {
      year: birthYear,
      month: birthMonth,
      day: birthDay,
      hour
    }
  };
}
