import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 内存存储 - 药物数据
const medicinesData = [
  {
    id: 1,
    name: '阿莫西林',
    category: '抗生素',
    image: '💊',
    shortDesc: '青霉素类抗生素，用于治疗多种细菌感染',
    pharmacology: '阿莫西林是一种半合成青霉素类广谱抗生素，通过抑制细菌细胞壁的合成而起到杀菌作用。',
    indications: '用于敏感菌引起的呼吸道感染、泌尿系统感染、皮肤软组织感染等。',
    dosage: '成人常规剂量：每次0.5g，每8小时1次。儿童按体重每日20-40mg/kg，分3次服用。',
    contraindications: '对青霉素类药物过敏者禁用。传染性单核细胞增多症患者禁用。',
    sideEffects: '常见不良反应包括：恶心、呕吐、腹泻、皮疹等。少数患者可能出现过敏反应。',
    precautions: '使用前应询问过敏史。肾功能不全者需调整剂量。不可随意停药，应完成疗程。'
  },
  {
    id: 2,
    name: '布洛芬',
    category: '解热镇痛药',
    image: '🌡️',
    shortDesc: '非甾体抗炎药，用于退热和缓解疼痛',
    pharmacology: '布洛芬通过抑制环氧化酶（COX）活性，减少前列腺素的合成，从而产生解热、镇痛和抗炎作用。',
    indications: '用于缓解轻至中度疼痛如头痛、关节痛、痛经等，也用于普通感冒或流行性感冒引起的发热。',
    dosage: '成人：每次0.2-0.4g，每日3-4次，最大剂量每日2.4g。儿童：每次5-10mg/kg，每6-8小时1次。',
    contraindications: '对本品过敏者、活动性消化道溃疡患者、严重心功能不全患者禁用。',
    sideEffects: '常见胃肠道反应如恶心、呕吐、胃痛。长期使用可能导致胃溃疡、肾功能损害等。',
    precautions: '应餐后服用以减少胃肠道刺激。不宜长期大量使用。有心血管疾病史者慎用。'
  },
  {
    id: 3,
    name: '阿司匹林',
    category: '解热镇痛药',
    image: '💊',
    shortDesc: '经典的非甾体抗炎药，具有解热、镇痛、抗炎作用',
    pharmacology: '阿司匹林通过不可逆地抑制COX酶，减少前列腺素合成。小剂量可抑制血小板聚集，用于心血管疾病预防。',
    indications: '用于发热、头痛、神经痛、关节痛等。小剂量用于预防心肌梗死、脑血栓等血栓性疾病。',
    dosage: '解热镇痛：成人每次0.3-0.6g，每日3-4次。抗血小板：每日75-150mg。',
    contraindications: '活动性溃疡病、血友病、维生素K缺乏、对阿司匹林过敏者禁用。孕妇及哺乳期妇女慎用。',
    sideEffects: '胃肠道反应常见。可能引起出血倾向。少数患者出现过敏反应如哮喘、荨麻疹。',
    precautions: '应餐后服用。长期服用需监测凝血功能。有消化道溃疡史者慎用。'
  },
  {
    id: 4,
    name: '头孢克肟',
    category: '抗生素',
    image: '💉',
    shortDesc: '第三代头孢菌素，广谱抗菌药物',
    pharmacology: '头孢克肟是第三代口服头孢菌素，通过抑制细菌细胞壁合成发挥杀菌作用，对革兰阳性和阴性菌均有效。',
    indications: '用于敏感菌所致的呼吸道感染、泌尿道感染、胆道感染等。',
    dosage: '成人：每次0.1g，每日2次，或每次0.2g，每日1次。儿童：每日按体重6mg/kg，分2次服用。',
    contraindications: '对头孢菌素类药物过敏者禁用。',
    sideEffects: '常见腹泻、恶心、皮疹。少数患者可能出现过敏反应、肝功能异常。',
    precautions: '青霉素过敏者慎用（约10%交叉过敏）。肾功能不全者需调整剂量。'
  },
  {
    id: 5,
    name: '奥美拉唑',
    category: '消化系统用药',
    image: '🫘',
    shortDesc: '质子泵抑制剂，用于治疗胃酸相关疾病',
    pharmacology: '奥美拉唑是质子泵抑制剂，通过抑制胃壁细胞上的H+/K+-ATP酶，减少胃酸分泌。',
    indications: '用于消化性溃疡、反流性食管炎、卓-艾综合征等胃酸相关疾病的治疗。',
    dosage: '消化性溃疡：每次20mg，每日1-2次。反流性食管炎：每次20-40mg，每日1次。',
    contraindications: '对本品过敏者禁用。',
    sideEffects: '常见头痛、腹泻、恶心。长期使用可能导致维生素B12缺乏、骨折风险增加。',
    precautions: '应在餐前30分钟服用。不宜长期大剂量使用。肝功能不全者需减量。'
  },
  {
    id: 6,
    name: '二甲双胍',
    category: '降糖药',
    image: '💊',
    shortDesc: '一线口服降糖药，用于2型糖尿病治疗',
    pharmacology: '二甲双胍主要通过减少肝糖输出、改善胰岛素抵抗、增加外周组织对葡萄糖的摄取和利用来降低血糖。',
    indications: '用于2型糖尿病，特别是肥胖和单纯饮食控制无效的患者。',
    dosage: '起始剂量：每次0.5g，每日2-3次，餐中或餐后服用。可逐渐增加至每日最大剂量2.0g。',
    contraindications: '1型糖尿病、糖尿病酮症酸中毒、严重肾功能不全、急性心肌梗死患者禁用。',
    sideEffects: '常见胃肠道反应如恶心、腹泻、腹胀。极少数患者可能出现乳酸性酸中毒。',
    precautions: '应餐中或餐后服用以减轻胃肠道反应。需定期监测肾功能和维生素B12水平。'
  },
  {
    id: 7,
    name: '氨氯地平',
    category: '降压药',
    image: '❤️',
    shortDesc: '钙通道阻滞剂，用于治疗高血压和心绞痛',
    pharmacology: '氨氯地平通过阻断血管平滑肌和心肌细胞膜上的钙离子通道，使血管扩张，降低外周血管阻力，从而降低血压。',
    indications: '用于高血压和慢性稳定型心绞痛的治疗。',
    dosage: '起始剂量：每日5mg，1次服用。可根据需要增至每日10mg。',
    contraindications: '对本品过敏者、严重低血压患者禁用。',
    sideEffects: '常见头痛、水肿（特别是踝部）、面部潮红、心悸等。',
    precautions: '应避免突然停药。肝功能不全者需减量。老年患者起始剂量宜小。'
  },
  {
    id: 8,
    name: '氯雷他定',
    category: '抗过敏药',
    image: '🤧',
    shortDesc: '第二代抗组胺药，用于治疗过敏性疾病',
    pharmacology: '氯雷他定是长效的三环类抗组胺药，选择性拮抗外周H1受体，无明显中枢镇静作用。',
    indications: '用于缓解过敏性鼻炎、荨麻疹及其他过敏性皮肤病的症状。',
    dosage: '成人及12岁以上儿童：每日10mg，1次服用。2-12岁儿童：体重≥30kg每日10mg，<30kg每日5mg。',
    contraindications: '对本品过敏者禁用。',
    sideEffects: '不良反应少见，可能出现头痛、嗜睡、口干、胃肠道不适。',
    precautions: '肝功能不全者起始剂量应减半。驾驶和机械操作者慎用。'
  }
];

// 药物分类数据
const categories = [
  { id: 'all', name: '全部药物', count: medicinesData.length },
  { id: 'antibiotic', name: '抗生素', count: medicinesData.filter(m => m.category === '抗生素').length },
  { id: 'analgesic', name: '解热镇痛药', count: medicinesData.filter(m => m.category === '解热镇痛药').length },
  { id: 'digestive', name: '消化系统用药', count: medicinesData.filter(m => m.category === '消化系统用药').length },
  { id: 'cardiovascular', name: '降压药', count: medicinesData.filter(m => m.category === '降压药').length },
  { id: 'diabetes', name: '降糖药', count: medicinesData.filter(m => m.category === '降糖药').length },
  { id: 'allergy', name: '抗过敏药', count: medicinesData.filter(m => m.category === '抗过敏药').length }
];

// API路由

// 获取所有药物
app.get('/api/medicines', (req, res) => {
  const { category } = req.query;
  let result = medicinesData;

  if (category && category !== 'all') {
    const categoryMap = {
      'antibiotic': '抗生素',
      'analgesic': '解热镇痛药',
      'digestive': '消化系统用药',
      'cardiovascular': '降压药',
      'diabetes': '降糖药',
      'allergy': '抗过敏药'
    };

    const categoryName = categoryMap[category];
    if (categoryName) {
      result = medicinesData.filter(m => m.category === categoryName);
    }
  }

  res.json({
    success: true,
    data: result
  });
});

// 获取单个药物详情
app.get('/api/medicines/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const medicine = medicinesData.find(m => m.id === id);

  if (!medicine) {
    return res.status(404).json({
      success: false,
      error: '未找到该药物'
    });
  }

  res.json({
    success: true,
    data: medicine
  });
});

// 获取药物分类
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: categories
  });
});

// 搜索药物
app.get('/api/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json({
      success: true,
      data: []
    });
  }

  const keyword = q.toLowerCase();
  const result = medicinesData.filter(m =>
    m.name.toLowerCase().includes(keyword) ||
    m.category.toLowerCase().includes(keyword) ||
    m.shortDesc.toLowerCase().includes(keyword)
  );

  res.json({
    success: true,
    data: result
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

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
});

