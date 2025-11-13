import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3002;

// 省市区映射数据（内存存储）
// 格式：{ "省份": { "城市": ["区1", "区2", ...] } }
const districtData = {
  "广东": {
    "深圳": ["福田区", "罗湖区", "南山区", "盐田区", "宝安区", "龙岗区", "龙华区", "坪山区", "光明区", "大鹏新区"],
    "广州": ["荔湾区", "越秀区", "海珠区", "天河区", "白云区", "黄埔区", "番禺区", "花都区", "南沙区", "从化区", "增城区"],
    "东莞": ["莞城区", "南城区", "东城区", "万江区", "石碣镇", "石龙镇", "茶山镇", "石排镇", "企石镇", "横沥镇", "桥头镇"],
    "佛山": ["禅城区", "南海区", "顺德区", "三水区", "高明区"],
    "珠海": ["香洲区", "斗门区", "金湾区"],
    "中山": ["石岐区", "东区", "西区", "南区", "五桂山区"]
  },
  "北京": {
    "北京": ["东城区", "西城区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "怀柔区", "平谷区", "密云区", "延庆区"]
  },
  "上海": {
    "上海": ["黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区", "闵行区", "宝山区", "嘉定区", "浦东新区", "金山区", "松江区", "青浦区", "奉贤区", "崇明区"]
  },
  "浙江": {
    "杭州": ["上城区", "下城区", "江干区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "富阳区", "临安区", "桐庐县", "淳安县", "建德市"],
    "宁波": ["海曙区", "江北区", "北仑区", "镇海区", "鄞州区", "奉化区", "余姚市", "慈溪市", "宁海县", "象山县"],
    "温州": ["鹿城区", "龙湾区", "瓯海区", "洞头区", "永嘉县", "平阳县", "苍南县", "文成县", "泰顺县", "瑞安市", "乐清市"]
  },
  "江苏": {
    "南京": ["玄武区", "秦淮区", "建邺区", "鼓楼区", "浦口区", "栖霞区", "雨花台区", "江宁区", "六合区", "溧水区", "高淳区"],
    "苏州": ["姑苏区", "虎丘区", "吴中区", "相城区", "吴江区", "常熟市", "张家港市", "昆山市", "太仓市"],
    "无锡": ["梁溪区", "锡山区", "惠山区", "滨湖区", "新吴区", "江阴市", "宜兴市"]
  },
  "四川": {
    "成都": ["锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "新都区", "温江区", "双流区", "郫都区", "新津区"],
    "绵阳": ["涪城区", "游仙区", "安州区", "江油市", "三台县", "盐亭县", "梓潼县", "北川县", "平武县"]
  },
  "湖北": {
    "武汉": ["江岸区", "江汉区", "硚口区", "汉阳区", "武昌区", "青山区", "洪山区", "东西湖区", "汉南区", "蔡甸区", "江夏区", "黄陂区", "新洲区"]
  },
  "湖南": {
    "长沙": ["芙蓉区", "天心区", "岳麓区", "开福区", "雨花区", "望城区", "长沙县", "浏阳市", "宁乡市"]
  },
  "河北": {
    "石家庄": ["长安区", "桥西区", "新华区", "井陉矿区", "裕华区", "藁城区", "鹿泉区", "栾城区"],
    "唐山": ["路南区", "路北区", "古冶区", "开平区", "丰南区", "丰润区", "曹妃甸区"]
  },
  "河南": {
    "郑州": ["中原区", "二七区", "管城区", "金水区", "上街区", "惠济区", "中牟县", "巩义市", "荥阳市", "新密市", "新郑市", "登封市"],
    "洛阳": ["老城区", "西工区", "瀍河区", "涧西区", "吉利区", "洛龙区"]
  },
  "山东": {
    "济南": ["历下区", "市中区", "槐荫区", "天桥区", "历城区", "长清区", "章丘区", "济阳区", "莱芜区", "钢城区"],
    "青岛": ["市南区", "市北区", "黄岛区", "崂山区", "李沧区", "城阳区", "即墨区", "胶州市", "平度市", "莱西市"]
  },
  "福建": {
    "福州": ["鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "长乐区", "闽侯县", "连江县", "罗源县", "闽清县", "永泰县", "平潭县", "福清市"],
    "厦门": ["思明区", "海沧区", "湖里区", "集美区", "同安区", "翔安区"]
  },
  "陕西": {
    "西安": ["新城区", "碑林区", "莲湖区", "灞桥区", "未央区", "雁塔区", "阎良区", "临潼区", "长安区", "高陵区", "鄠邑区"]
  },
  "天津": {
    "天津": ["和平区", "河东区", "河西区", "南开区", "河北区", "红桥区", "东丽区", "西青区", "津南区", "北辰区", "武清区", "宝坻区", "滨海新区", "宁河区", "静海区", "蓟州区"]
  },
  "重庆": {
    "重庆": ["万州区", "涪陵区", "渝中区", "大渡口区", "江北区", "沙坪坝区", "九龙坡区", "南岸区", "北碚区", "綦江区", "大足区", "渝北区", "巴南区", "黔江区", "长寿区", "江津区", "合川区", "永川区", "南川区", "璧山区", "铜梁区", "潼南区", "荣昌区", "开州区"]
  }
};

// 根据省市信息查找对应的区
// 返回第一个区作为默认值，实际使用中可以根据IP更精确定位
function getDistrict(province, city) {
  if (!province || !city) {
    return null;
  }

  // 清理省市名称（去除"省"、"市"等后缀）
  const cleanProvince = province.replace(/省|市|自治区|特别行政区|壮族|回族|维吾尔|藏族/g, '').trim();
  const cleanCity = city.replace(/市|区|县|自治州|地区/g, '').trim();

  // 查找匹配的省份
  for (const [prov, cities] of Object.entries(districtData)) {
    if (cleanProvince.includes(prov) || prov.includes(cleanProvince)) {
      // 查找匹配的城市
      for (const [cityName, districts] of Object.entries(cities)) {
        if (cleanCity.includes(cityName) || cityName.includes(cleanCity)) {
          // 返回该城市的第一个区作为示例
          // 在实际场景中，可以根据IP的经纬度进一步精确定位
          return districts[0];
        }
      }
    }
  }

  return null;
}

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// IP信息查询接口
app.get('/api/ip-info', async (req, res) => {
  try {
    const { ip } = req.query;

    // 使用免费的IP查询API：ip-api.com
    // 如果没有提供IP地址，则查询请求者的IP
    const targetIP = ip || '';
    const apiUrl = targetIP
      ? `http://ip-api.com/json/${targetIP}?lang=zh-CN`
      : `http://ip-api.com/json/?lang=zh-CN`;

    // 使用axios请求IP信息
    const response = await axios.get(apiUrl);
    const data = response.data;

    // 检查查询状态
    if (data.status === 'fail') {
      return res.json({
        success: false,
        message: data.message || 'IP地址无效或查询失败'
      });
    }

    // 根据省市信息查找对应的区
    const district = getDistrict(data.regionName, data.city);

    // 返回成功结果
    res.json({
      success: true,
      data: {
        query: data.query,
        country: data.country,
        regionName: data.regionName,
        city: data.city,
        district: district, // 新增区级信息
        isp: data.isp,
        org: data.org,
        as: data.as,
        timezone: data.timezone,
        lat: data.lat,
        lon: data.lon
      }
    });
  } catch (error) {
    console.error('IP查询错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器查询失败，请稍后再试'
    });
  }
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
