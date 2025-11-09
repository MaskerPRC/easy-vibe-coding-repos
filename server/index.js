import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import schedule from 'node-schedule';
import { spawn } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 3002; // 后端端口 3002，前端 5173
const WPS_BRIDGE_PORT = 23334; // WPS Bridge 服务端口

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ==================== WPS Bridge 服务管理 ====================

let wpsBridgeProcess = null;
let wpsBridgeReady = false;

/**
 * 启动 WPS Bridge Python 服务
 */
function startWPSBridge() {
  if (wpsBridgeProcess) {
    console.log('WPS Bridge 服务已在运行');
    return;
  }

  const bridgePath = path.join(__dirname, '../packages/wps-bridge');
  const appPath = path.join(bridgePath, 'app.py');

  console.log('正在启动 WPS Bridge 服务...');
  console.log('Python 脚本路径:', appPath);

  try {
    wpsBridgeProcess = spawn('python', [appPath], {
      cwd: bridgePath,
      env: {
        ...process.env,
        PORT: WPS_BRIDGE_PORT.toString(),
        PYTHONIOENCODING: 'utf-8',
        PYTHONUTF8: '1'
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // 监听标准输出
    wpsBridgeProcess.stdout?.on('data', (data) => {
      const output = data.toString().trim();
      console.log('[WPS Bridge stdout]', output);

      // 检测服务是否已启动
      if (output.includes('Running on') || output.includes('启动在端口')) {
        wpsBridgeReady = true;
        console.log('✓ WPS Bridge 服务已就绪');
      }
    });

    // 监听标准错误
    wpsBridgeProcess.stderr?.on('data', (data) => {
      const output = data.toString().trim();
      console.error('[WPS Bridge stderr]', output);
    });

    // 监听进程退出
    wpsBridgeProcess.on('exit', (code, signal) => {
      console.log(`WPS Bridge 进程退出，code: ${code}, signal: ${signal}`);
      wpsBridgeProcess = null;
      wpsBridgeReady = false;

      // 5秒后自动重启
      if (code !== 0 && !signal) {
        console.log('5秒后自动重启 WPS Bridge 服务...');
        setTimeout(startWPSBridge, 5000);
      }
    });

    // 监听错误
    wpsBridgeProcess.on('error', (error) => {
      console.error('WPS Bridge 启动失败:', error.message);
      console.error('请确保已安装 Python 3.9+ 和依赖包 (pip install -r requirements.txt)');
      wpsBridgeProcess = null;
      wpsBridgeReady = false;
    });

    console.log('WPS Bridge 进程已启动，PID:', wpsBridgeProcess.pid);
  } catch (error) {
    console.error('启动 WPS Bridge 失败:', error);
  }
}

/**
 * 停止 WPS Bridge 服务
 */
function stopWPSBridge() {
  if (wpsBridgeProcess) {
    console.log('正在停止 WPS Bridge 服务...');
    wpsBridgeProcess.kill('SIGTERM');
    wpsBridgeProcess = null;
    wpsBridgeReady = false;
  }
}

// 启动 WPS Bridge 服务
startWPSBridge();

// 进程退出时清理
process.on('SIGTERM', stopWPSBridge);
process.on('SIGINT', stopWPSBridge);
process.on('exit', stopWPSBridge);

// API 路由

// ==================== WPS Bridge API 代理 ====================

// WPS Bridge 健康检查
app.get('/api/wps/bridge/health', async (req, res) => {
  try {
    const response = await fetch(`http://localhost:${WPS_BRIDGE_PORT}/health`);
    const data = await response.json();
    res.json({
      ...data,
      bridgeReady: wpsBridgeReady,
      pid: wpsBridgeProcess?.pid
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      message: 'WPS Bridge 服务未启动或无响应',
      error: error.message
    });
  }
});

// WPS Bridge 服务控制
app.post('/api/wps/bridge/restart', (req, res) => {
  stopWPSBridge();
  setTimeout(() => {
    startWPSBridge();
    res.json({
      success: true,
      message: 'WPS Bridge 服务重启中...'
    });
  }, 1000);
});

// 代理所有 WPS API 请求到 Python Flask
app.use('/api/wps', createProxyMiddleware({
  target: `http://localhost:${WPS_BRIDGE_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api/wps': '/api/wps'
  },
  onError: (err, req, res) => {
    console.error('WPS API 代理错误:', err.message);
    res.status(503).json({
      error: 'WPS Bridge 服务不可用',
      message: err.message,
      hint: '请确保 WPS Bridge 服务已启动且运行正常'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[WPS Proxy] ${req.method} ${req.url} -> http://localhost:${WPS_BRIDGE_PORT}${req.url}`);
  }
}));

// ==================== 应用健康检查 ====================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    wpsBridge: {
      ready: wpsBridgeReady,
      port: WPS_BRIDGE_PORT
    },
    timestamp: new Date().toISOString()
  });
});

// 获取数据示例
app.get('/api/data', async (req, res) => {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf-8');
    const parsedData = JSON.parse(fileData);
    res.json({
      message: '这是来自后端的数据',
      data: parsedData
    });
  } catch (error) {
    console.error('读取数据失败:', error);
    // 如果文件不存在或读取失败，返回默认数据
    res.json({
      message: '这是来自后端的数据',
      data: {
        count: 0,
        items: []
      }
    });
  }
});

// 更新数据示例
app.post('/api/data', async (req, res) => {
  try {
    const { count } = req.body;
    console.log('收到更新请求，count =', count);
    console.log('数据文件路径:', DATA_FILE);

    // 读取现有数据
    let currentData = { count: 0, items: [] };
    try {
      const fileData = await fs.readFile(DATA_FILE, 'utf-8');
      currentData = JSON.parse(fileData);
      console.log('读取到现有数据:', currentData);
    } catch (error) {
      // 文件不存在或读取失败，使用默认数据
      console.log('使用默认数据, 错误:', error.message);
    }

    // 更新 count 值
    currentData.count = count;
    console.log('准备保存的数据:', currentData);

    // 保存到文件
    await fs.writeFile(DATA_FILE, JSON.stringify(currentData, null, 2), 'utf-8');
    console.log('数据已写入文件');

    // 验证写入
    const savedData = await fs.readFile(DATA_FILE, 'utf-8');
    console.log('验证写入后的文件内容:', savedData);

    res.json({
      success: true,
      message: '数据已更新并保存',
      data: currentData
    });
  } catch (error) {
    console.error('保存数据失败:', error);
    res.status(500).json({
      success: false,
      message: '保存数据失败: ' + error.message
    });
  }
});

// 获取配置
app.get('/api/config', (req, res) => {
  res.json({
    appName: '应用项目',
    version: '1.0.0',
    features: ['前端', '后端', 'API']
  });
});

// 获取服务器配置信息
app.get('/api/server-info', (req, res) => {
  const os = require('os');

  res.json({
    server: {
      platform: os.platform(),
      architecture: os.arch(),
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Unknown',
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: `${(os.uptime() / 3600).toFixed(2)} hours`,
      hostname: os.hostname(),
      nodeVersion: process.version
    },
    application: {
      name: '应用项目',
      version: '1.0.0',
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      features: ['Vue 3 前端', 'Express 后端', 'RESTful API', '路由系统']
    },
    timestamp: new Date().toISOString()
  });
});

// Todo 相关 API
const TODOS_FILE = path.join(__dirname, 'todos.json');

// 搜索历史相关 API
const SEARCH_HISTORY_FILE = path.join(__dirname, 'search-history.json');

// WHV 素材相关 API
const WHV_MATERIALS_FILE = path.join(__dirname, 'whv-materials.json');

// 获取所有待办事项
app.get('/api/todos', async (req, res) => {
  try {
    const fileData = await fs.readFile(TODOS_FILE, 'utf-8');
    const todos = JSON.parse(fileData);
    res.json({
      success: true,
      todos
    });
  } catch (error) {
    // 文件不存在时返回空数组
    if (error.code === 'ENOENT') {
      res.json({
        success: true,
        todos: []
      });
    } else {
      console.error('读取 todos 失败:', error);
      res.status(500).json({
        success: false,
        message: '读取数据失败'
      });
    }
  }
});

// 保存待办事项
app.post('/api/todos', async (req, res) => {
  try {
    const { todos } = req.body;
    await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), 'utf-8');
    res.json({
      success: true,
      message: '待办事项已保存'
    });
  } catch (error) {
    console.error('保存 todos 失败:', error);
    res.status(500).json({
      success: false,
      message: '保存数据失败'
    });
  }
});

// 简繁转换映射（简化版，实际应用可使用opencc-js等专业库）
const s2tMap = {
  '的': '的', '一': '一', '是': '是', '在': '在', '不': '不', '了': '了', '有': '有', '和': '和', '人': '人', '这': '這',
  '中': '中', '大': '大', '为': '為', '上': '上', '个': '個', '国': '國', '我': '我', '以': '以', '要': '要', '他': '他',
  '时': '時', '来': '來', '用': '用', '们': '們', '生': '生', '到': '到', '作': '作', '地': '地', '于': '於', '出': '出',
  '就': '就', '分': '分', '对': '對', '成': '成', '会': '會', '可': '可', '主': '主', '发': '發', '年': '年', '动': '動',
  '同': '同', '工': '工', '也': '也', '能': '能', '下': '下', '过': '過', '子': '子', '说': '說', '产': '產', '种': '種',
  '面': '面', '而': '而', '方': '方', '后': '後', '多': '多', '定': '定', '行': '行', '学': '學', '法': '法', '所': '所',
  '民': '民', '得': '得', '经': '經', '十': '十', '三': '三', '之': '之', '进': '進', '着': '著', '等': '等', '部': '部',
  '度': '度', '家': '家', '电': '電', '力': '力', '里': '裡', '如': '如', '水': '水', '化': '化', '高': '高', '自': '自',
  '二': '二', '理': '理', '起': '起', '小': '小', '物': '物', '现': '現', '实': '實', '加': '加', '量': '量', '都': '都',
  '两': '兩', '体': '體', '制': '制', '机': '機', '当': '當', '使': '使', '点': '點', '从': '從', '业': '業', '本': '本',
  '去': '去', '把': '把', '性': '性', '好': '好', '应': '應', '开': '開', '它': '它', '合': '合', '还': '還', '因': '因',
  '由': '由', '其': '其', '些': '些', '然': '然', '前': '前', '外': '外', '天': '天', '政': '政', '四': '四', '日': '日',
  '那': '那', '社': '社', '义': '義', '事': '事', '平': '平', '形': '形', '相': '相', '全': '全', '表': '表', '间': '間',
  '样': '樣', '与': '與', '关': '關', '各': '各', '重': '重', '新': '新', '线': '線', '内': '內', '数': '數', '正': '正',
  '心': '心', '反': '反', '你': '你', '明': '明', '看': '看', '原': '原', '又': '又', '么': '麼', '利': '利', '比': '比',
  '或': '或', '但': '但', '质': '質', '气': '氣', '第': '第', '向': '向', '道': '道', '命': '命', '此': '此', '变': '變',
  '条': '條', '只': '只', '没': '沒', '结': '結', '解': '解', '问': '問', '意': '意', '建': '建', '月': '月', '公': '公',
  '无': '無', '系': '系', '军': '軍', '很': '很', '情': '情', '者': '者', '最': '最', '立': '立', '代': '代', '想': '想',
  '已': '已', '通': '通', '并': '並', '提': '提', '直': '直', '题': '題', '党': '黨', '程': '程', '展': '展', '五': '五',
  '果': '果', '料': '料', '象': '象', '员': '員', '革': '革', '位': '位', '入': '入', '常': '常', '文': '文', '总': '總',
  '次': '次', '品': '品', '式': '式', '活': '活', '设': '設', '及': '及', '管': '管', '特': '特', '件': '件', '长': '長',
  '求': '求', '老': '老', '头': '頭', '基': '基', '资': '資', '边': '邊', '流': '流', '路': '路', '级': '級', '少': '少',
  '图': '圖', '山': '山', '统': '統', '接': '接', '知': '知', '较': '較', '将': '將', '组': '組', '见': '見', '计': '計',
  '别': '別', '她': '她', '手': '手', '角': '角', '期': '期', '根': '根', '论': '論', '运': '運', '农': '農', '指': '指',
  '几': '幾', '九': '九', '区': '區', '强': '強', '放': '放', '决': '決', '西': '西', '被': '被', '干': '幹', '做': '做',
  '必': '必', '战': '戰', '先': '先', '回': '回', '则': '則', '任': '任', '取': '取', '据': '據', '处': '處', '队': '隊',
  '南': '南', '给': '給', '色': '色', '光': '光', '门': '門', '即': '即', '保': '保', '治': '治', '北': '北', '造': '造',
  '百': '百', '规': '規', '热': '熱', '领': '領', '七': '七', '海': '海', '口': '口', '东': '東', '导': '導', '器': '器',
  '压': '壓', '志': '志', '世': '世', '金': '金', '增': '增', '争': '爭', '济': '濟', '阶': '階', '油': '油', '思': '思',
  '术': '術', '极': '極', '交': '交', '受': '受', '联': '聯', '什': '什', '认': '認', '六': '六', '共': '共', '权': '權',
  '收': '收', '证': '證', '改': '改', '清': '清', '美': '美', '再': '再', '采': '採', '转': '轉', '更': '更', '单': '單',
  '风': '風', '切': '切', '打': '打', '白': '白', '教': '教', '速': '速', '花': '花', '带': '帶', '安': '安', '场': '場',
  '身': '身', '车': '車', '例': '例', '真': '真', '务': '務', '具': '具', '万': '萬', '每': '每', '目': '目', '至': '至',
  '达': '達', '走': '走', '积': '積', '示': '示', '议': '議', '声': '聲', '报': '報', '斗': '鬥', '完': '完', '类': '類',
  '八': '八', '离': '離', '华': '華', '名': '名', '确': '確', '才': '才', '科': '科', '张': '張', '信': '信', '马': '馬',
  '节': '節', '话': '話', '米': '米', '整': '整', '空': '空', '元': '元', '况': '況', '今': '今', '集': '集', '温': '溫',
  '传': '傳', '土': '土', '许': '許', '步': '步', '群': '群', '广': '廣', '石': '石', '记': '記', '需': '需', '段': '段',
  '研': '研', '界': '界', '拉': '拉', '林': '林', '律': '律', '叫': '叫', '且': '且', '究': '究', '观': '觀', '越': '越',
  '织': '織', '装': '裝', '影': '影', '算': '算', '低': '低', '持': '持', '音': '音', '众': '眾', '书': '書', '布': '布',
  '复': '復', '容': '容', '儿': '兒', '须': '須', '际': '際', '商': '商', '非': '非', '验': '驗', '连': '連', '断': '斷',
  '深': '深', '难': '難', '近': '近', '矿': '礦', '千': '千', '周': '周', '委': '委', '素': '素', '技': '技', '备': '備',
  '半': '半', '办': '辦', '青': '青', '省': '省', '列': '列', '习': '習', '响': '響', '约': '約', '支': '支', '般': '般',
  '史': '史', '感': '感', '劳': '勞', '便': '便', '团': '團', '往': '往', '酸': '酸', '历': '歷', '市': '市', '克': '克',
  '何': '何', '除': '除', '消': '消', '构': '構', '府': '府', '称': '稱', '太': '太', '准': '準', '精': '精', '值': '值',
  '号': '號', '率': '率', '族': '族', '维': '維', '划': '劃', '选': '選', '标': '標', '写': '寫', '存': '存', '候': '候',
  '毛': '毛', '亲': '親', '快': '快', '效': '效', '斯': '斯', '院': '院', '查': '查', '江': '江', '型': '型', '眼': '眼',
  '王': '王', '按': '按', '格': '格', '养': '養', '易': '易', '置': '置', '派': '派', '层': '層', '片': '片', '始': '始',
  '却': '卻', '专': '專', '状': '狀', '育': '育', '厂': '廠', '京': '京', '识': '識', '适': '適', '属': '屬', '圆': '圓',
  '包': '包', '火': '火', '住': '住', '调': '調', '满': '滿', '县': '縣', '局': '局', '照': '照', '参': '參', '红': '紅',
  '细': '細', '引': '引', '听': '聽', '该': '該', '铁': '鐵', '价': '價', '严': '嚴', '龙': '龍', '飞': '飛', '简': '簡',
  '头': '頭', '汉': '漢', '宁': '寧', '难': '難', '台': '臺', '湾': '灣', '岛': '島', '乡': '鄉', '后': '後', '里': '裡',
  '据': '據', '继': '繼', '众': '眾', '阳': '陽', '产': '產', '义': '義', '时': '時', '钱': '錢', '实': '實', '为': '為',
  '译': '譯', '翻': '翻', '体': '體', '网': '網', '页': '頁', '应': '應', '软': '軟', '医': '醫', '处': '處', '铁': '鐵',
  '计': '計', '讯': '訊', '购': '購', '买': '買', '卖': '賣', '货': '貨', '银': '銀', '错': '錯', '钟': '鐘', '锁': '鎖',
  '铜': '銅', '镜': '鏡', '题': '題', '签': '簽', '笔': '筆', '录': '錄', '练': '練', '习': '習', '读': '讀', '写': '寫',
  '词': '詞', '语': '語', '试': '試', '课': '課', '诉': '訴', '讼': '訟', '访': '訪', '设': '設', '证': '證', '评': '評',
  '识': '識', '诚': '誠', '误': '誤', '说': '說', '请': '請', '诸': '諸', '谁': '誰', '课': '課', '调': '調', '谈': '談',
  '谊': '誼', '谋': '謀', '谓': '謂', '谢': '謝', '谦': '謙', '讲': '講', '谨': '謹', '让': '讓', '谱': '譜', '译': '譯',
  '议': '議', '护': '護', '誉': '譽', '读': '讀', '变': '變', '显': '顯', '优': '優', '云': '雲', '双': '雙', '队': '隊',
  '难': '難', '树': '樹', '惊': '驚', '杂': '雜', '诗': '詩', '词': '詞', '审': '審', '写': '寫', '宽': '寬', '宾': '賓',
  '卧': '臥', '尘': '塵', '尽': '盡', '层': '層', '届': '屆', '愿': '願', '纪': '紀', '伟': '偉', '传': '傳', '乱': '亂',
  '伤': '傷', '优': '優', '伙': '夥', '会': '會', '伞': '傘', '伟': '偉', '传': '傳', '债': '債', '伦': '倫', '储': '儲',
  '催': '催', '亿': '億', '仪': '儀', '们': '們', '仓': '倉', '仅': '僅', '价': '價', '众': '眾', '优': '優', '伙': '夥',
  '们': '們', '会': '會', '伞': '傘', '伟': '偉', '传': '傳', '债': '債', '伦': '倫', '储': '儲', '亿': '億', '仪': '儀',
  '们': '們', '仓': '倉', '仅': '僅', '价': '價'
};

function convertToTraditional(text) {
  if (!text) return '';
  return text.split('').map(char => s2tMap[char] || char).join('');
}

// 翻译 API - 简体转繁体
app.post('/api/translate', (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: '请提供要翻译的文本'
      });
    }

    const translatedText = convertToTraditional(text);

    res.json({
      success: true,
      original: text,
      translated: translatedText,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('翻译失败:', error);
    res.status(500).json({
      success: false,
      message: '翻译失败: ' + error.message
    });
  }
});

// 获取搜索历史
app.get('/api/search-history', async (req, res) => {
  try {
    const fileData = await fs.readFile(SEARCH_HISTORY_FILE, 'utf-8');
    const history = JSON.parse(fileData);
    res.json(history);
  } catch (error) {
    // 文件不存在时返回空数组
    if (error.code === 'ENOENT') {
      res.json([]);
    } else {
      console.error('读取搜索历史失败:', error);
      res.status(500).json({
        success: false,
        message: '读取数据失败'
      });
    }
  }
});

// 保存搜索历史
app.post('/api/search-history', async (req, res) => {
  try {
    const history = req.body;
    await fs.writeFile(SEARCH_HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
    res.json({
      success: true,
      message: '搜索历史已保存'
    });
  } catch (error) {
    console.error('保存搜索历史失败:', error);
    res.status(500).json({
      success: false,
      message: '保存数据失败'
    });
  }
});

// WHV 素材搜集函数
async function collectWHVMaterials() {
  try {
    console.log('开始搜集WHV素材...');

    // 模拟从小红书搜集WHV相关内容
    // 实际应用中需要使用小红书API或爬虫
    const newMaterials = [
      {
        id: Date.now() + Math.random(),
        title: `WHV澳洲申请攻略 - ${new Date().toLocaleDateString()}`,
        content: '详细介绍WHV澳洲签证申请流程、所需材料和注意事项...',
        author: '小红书用户' + Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        tags: ['WHV', '澳洲', '打工度假', '签证攻略'],
        imageUrl: 'https://via.placeholder.com/400x300?text=WHV+Australia',
        sourceUrl: 'https://www.xiaohongshu.com/explore/...',
        collectedAt: new Date().toISOString()
      },
      {
        id: Date.now() + Math.random() + 1,
        title: `新西兰WHV生活分享 - ${new Date().toLocaleDateString()}`,
        content: '分享在新西兰打工度假的真实生活体验，工作、住宿、旅行...',
        author: '小红书用户' + Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        tags: ['WHV', '新西兰', '打工度假', '生活分享'],
        imageUrl: 'https://via.placeholder.com/400x300?text=WHV+New+Zealand',
        sourceUrl: 'https://www.xiaohongshu.com/explore/...',
        collectedAt: new Date().toISOString()
      },
      {
        id: Date.now() + Math.random() + 2,
        title: `日本WHV工作经验 - ${new Date().toLocaleDateString()}`,
        content: '在日本打工度假的工作经验分享，包括找工作技巧、工资待遇等...',
        author: '小红书用户' + Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 200),
        tags: ['WHV', '日本', '打工度假', '工作经验'],
        imageUrl: 'https://via.placeholder.com/400x300?text=WHV+Japan',
        sourceUrl: 'https://www.xiaohongshu.com/explore/...',
        collectedAt: new Date().toISOString()
      }
    ];

    // 读取现有数据
    let materials = [];
    try {
      const fileData = await fs.readFile(WHV_MATERIALS_FILE, 'utf-8');
      materials = JSON.parse(fileData);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('读取WHV素材文件失败:', error);
      }
    }

    // 添加新素材到列表开头
    materials = [...newMaterials, ...materials];

    // 限制最多保存500条记录
    if (materials.length > 500) {
      materials = materials.slice(0, 500);
    }

    // 保存更新后的数据
    await fs.writeFile(WHV_MATERIALS_FILE, JSON.stringify(materials, null, 2), 'utf-8');

    console.log(`成功搜集 ${newMaterials.length} 条WHV素材，总计 ${materials.length} 条`);

    return {
      success: true,
      collected: newMaterials.length,
      total: materials.length
    };
  } catch (error) {
    console.error('搜集WHV素材失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 获取WHV素材列表
app.get('/api/whv-materials', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const fileData = await fs.readFile(WHV_MATERIALS_FILE, 'utf-8');
    const allMaterials = JSON.parse(fileData);

    // 分页处理
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const materials = allMaterials.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: materials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: allMaterials.length,
        totalPages: Math.ceil(allMaterials.length / limitNum)
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        }
      });
    } else {
      console.error('读取WHV素材失败:', error);
      res.status(500).json({
        success: false,
        message: '读取数据失败'
      });
    }
  }
});

// 手动触发搜集WHV素材
app.post('/api/whv-materials/collect', async (req, res) => {
  try {
    const result = await collectWHVMaterials();
    res.json(result);
  } catch (error) {
    console.error('手动搜集WHV素材失败:', error);
    res.status(500).json({
      success: false,
      message: '搜集失败: ' + error.message
    });
  }
});

// 获取搜集统计信息
app.get('/api/whv-materials/stats', async (req, res) => {
  try {
    const fileData = await fs.readFile(WHV_MATERIALS_FILE, 'utf-8');
    const materials = JSON.parse(fileData);

    // 按日期统计
    const dateStats = {};
    materials.forEach(item => {
      const date = new Date(item.collectedAt).toLocaleDateString();
      dateStats[date] = (dateStats[date] || 0) + 1;
    });

    // 按标签统计
    const tagStats = {};
    materials.forEach(item => {
      item.tags.forEach(tag => {
        tagStats[tag] = (tagStats[tag] || 0) + 1;
      });
    });

    res.json({
      success: true,
      stats: {
        total: materials.length,
        byDate: dateStats,
        byTag: tagStats,
        latestCollectedAt: materials[0]?.collectedAt || null
      }
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({
        success: true,
        stats: {
          total: 0,
          byDate: {},
          byTag: {},
          latestCollectedAt: null
        }
      });
    } else {
      console.error('获取统计信息失败:', error);
      res.status(500).json({
        success: false,
        message: '获取统计失败'
      });
    }
  }
});

// 设置定时任务：每天凌晨2点自动搜集
const dailyCollectionJob = schedule.scheduleJob('0 2 * * *', async () => {
  console.log('定时任务开始：每日WHV素材搜集');
  await collectWHVMaterials();
});

console.log('WHV素材定时搜集任务已启动（每天凌晨2点执行）');

// 错误处理
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '未找到资源',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`应用项目后端运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/api/health`);
  console.log(`数据文件路径: ${DATA_FILE}`);
  console.log(`__dirname: ${__dirname}`);
});

