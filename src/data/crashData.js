// 内核崩溃画面数据（内存存储）
// 所有数据都存储在这个模块的变量中，程序重启后会丢失

export const crashScreens = [
  {
    id: 1,
    year: 1993,
    os: 'Windows NT 3.1',
    type: 'BSOD',
    title: 'Windows NT 3.1 蓝屏死机',
    designer: 'Microsoft',
    inspiration: '这是Windows NT系列的第一个蓝屏死机画面，采用蓝色背景和白色文字，奠定了后续Windows BSOD的基本样式。',
    technicalDetails: '使用80x25字符模式显示，显示停止代码和基本的错误信息。设计目标是在系统崩溃时提供足够的调试信息。',
    culturalImpact: '虽然这不是第一个蓝屏，但它开创了Windows NT系列标准化的错误显示方式。'
  },
  {
    id: 2,
    year: 2000,
    os: 'Windows 2000',
    type: 'BSOD',
    title: 'Windows 2000 蓝屏死机',
    designer: 'Microsoft',
    inspiration: '继承了NT系列的蓝屏设计，但增加了更详细的错误信息和调试建议。',
    technicalDetails: '显示STOP错误代码、可能的原因、以及推荐的用户操作。蓝色背景(#0000AA)成为标志性颜色。',
    culturalImpact: '这个版本的蓝屏成为了最广为人知的版本之一，经常出现在Windows XP和2000系统中。'
  },
  {
    id: 3,
    year: 2012,
    os: 'Windows 8',
    type: 'BSOD',
    title: 'Windows 8 简化蓝屏',
    designer: 'Microsoft - Windows User Experience Team',
    inspiration: '微软意识到传统蓝屏对普通用户过于技术化，决定简化设计，使用友好的语言和悲伤表情符号。',
    technicalDetails: '使用浅蓝色背景，显示悲伤的emoticon :(，简化的错误信息，以及二维码用于快速搜索错误。',
    culturalImpact: '这是蓝屏设计的重大转变，从技术导向转向用户友好。悲伤表情符号成为新的文化符号。'
  },
  {
    id: 4,
    year: 2016,
    os: 'Windows 10',
    type: 'BSOD',
    title: 'Windows 10 绿屏死机（预览版）',
    designer: 'Microsoft',
    inspiration: 'Windows Insider预览版使用绿色屏幕来区别于正式版的蓝屏，帮助开发者识别预览版系统的崩溃。',
    technicalDetails: '与蓝屏设计相同，但使用绿色背景。包含停止代码和QR码。',
    culturalImpact: '这是为了区分测试版本而设计的特殊变体，让测试人员能够快速识别崩溃来源。'
  },
  {
    id: 5,
    year: 2001,
    os: 'Mac OS X 10.0',
    type: 'Kernel Panic',
    title: 'Mac OS X 早期内核崩溃',
    designer: 'Apple - Darwin团队',
    inspiration: '基于BSD Unix的kernel panic设计，但增加了多语言支持，体现Apple的国际化理念。',
    technicalDetails: '黑色半透明遮罩覆盖整个屏幕，以多种语言显示"您需要重新启动电脑"的消息。',
    culturalImpact: '这个设计体现了Apple对用户体验的重视，即使在错误界面也保持简洁优雅的设计哲学。'
  },
  {
    id: 6,
    year: 2011,
    os: 'Mac OS X 10.7 Lion',
    type: 'Kernel Panic',
    title: 'OS X Lion 内核崩溃',
    designer: 'Apple',
    inspiration: '继续保持多语言显示，但优化了视觉设计，使用更柔和的渐变背景。',
    technicalDetails: '深灰色渐变背景，白色文字，电源符号图标，支持超过15种语言显示。',
    culturalImpact: '这个版本的设计成为了macOS kernel panic的标准样式，一直沿用到现在。'
  },
  {
    id: 7,
    year: 1994,
    os: 'Linux Kernel 1.0',
    type: 'Kernel Panic',
    title: 'Linux 内核崩溃',
    designer: 'Linus Torvalds 和 Linux内核团队',
    inspiration: '受Unix系统启发，直接在终端显示内核错误信息和堆栈跟踪。',
    technicalDetails: '纯文本输出，显示"Kernel panic"消息，寄存器转储，调用堆栈信息。',
    culturalImpact: '体现了Linux的开源和透明哲学，向用户和开发者提供完整的调试信息。'
  },
  {
    id: 8,
    year: 2015,
    os: 'Linux（现代）',
    type: 'Kernel Panic',
    title: 'Linux 现代内核崩溃',
    designer: 'Linux Kernel Community',
    inspiration: '在保持传统的详细信息输出的同时，增加了颜色编码和格式化。',
    technicalDetails: '使用ANSI颜色代码，红色高亮关键错误，详细的堆栈跟踪，寄存器状态。',
    culturalImpact: '现代Linux发行版的panic screen在保持技术性的同时，也注重可读性。'
  },
  {
    id: 9,
    year: 1993,
    os: 'FreeBSD 1.0',
    type: 'Kernel Panic',
    title: 'FreeBSD 内核崩溃',
    designer: 'FreeBSD Core Team',
    inspiration: '继承自4.4BSD的设计，强调提供详细的系统状态信息。',
    technicalDetails: '显示panic消息、内核版本、寄存器转储、以及调试提示。',
    culturalImpact: 'FreeBSD的panic screen体现了BSD系统注重稳定性和可调试性的传统。'
  },
  {
    id: 10,
    year: 1996,
    os: 'OpenBSD 2.0',
    type: 'Kernel Panic',
    title: 'OpenBSD 内核崩溃',
    designer: 'Theo de Raadt 和 OpenBSD团队',
    inspiration: 'OpenBSD以安全为首要目标，其panic screen设计也体现了这一理念。',
    technicalDetails: '简洁的错误信息，强调安全相关的错误细节，以及系统状态。',
    culturalImpact: 'OpenBSD的设计哲学"安全第一"甚至体现在错误提示中。'
  },
  {
    id: 11,
    year: 2005,
    os: 'NetBSD 2.0',
    type: 'Kernel Panic',
    title: 'NetBSD 内核崩溃',
    designer: 'NetBSD Foundation',
    inspiration: 'NetBSD的"可移植性"理念也体现在其panic screen设计中，确保在各种硬件平台上都能正确显示。',
    technicalDetails: '标准化的panic输出格式，适配多种终端类型和硬件平台。',
    culturalImpact: 'NetBSD的panic screen设计考虑了从嵌入式设备到服务器的广泛兼容性。'
  }
];

// 导出一个获取所有崩溃画面的函数
export const getAllCrashScreens = () => {
  return [...crashScreens];
};

// 根据ID获取特定的崩溃画面
export const getCrashScreenById = (id) => {
  return crashScreens.find(screen => screen.id === id);
};

// 按年份排序获取崩溃画面
export const getCrashScreensByYear = () => {
  return [...crashScreens].sort((a, b) => a.year - b.year);
};
