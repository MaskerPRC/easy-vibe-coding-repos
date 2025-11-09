import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import axios from 'axios';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 3002; // 后端端口 3002，前端 5173

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    port: PORT,
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

// 获取访问者IP和位置信息
app.get('/api/location', async (req, res) => {
  try {
    // 获取客户端真实IP
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] ||
                     req.headers['x-real-ip'] ||
                     req.connection.remoteAddress ||
                     req.socket.remoteAddress;

    console.log('客户端IP:', clientIp);

    // 对于本地IP，使用一个默认位置（北京）
    if (clientIp === '::1' || clientIp === '127.0.0.1' || clientIp?.includes('::ffff:127.0.0.1')) {
      return res.json({
        ip: clientIp,
        city: '北京',
        country: '中国',
        lat: 39.9042,
        lon: 116.4074,
        isLocal: true
      });
    }

    // 使用ip-api.com获取IP位置信息（免费，无需API key）
    const response = await axios.get(`http://ip-api.com/json/${clientIp}?lang=zh-CN`, {
      timeout: 5000
    });

    if (response.data.status === 'success') {
      res.json({
        ip: clientIp,
        city: response.data.city || response.data.regionName,
        country: response.data.country,
        lat: response.data.lat,
        lon: response.data.lon,
        isLocal: false
      });
    } else {
      // 如果获取失败，返回默认位置
      res.json({
        ip: clientIp,
        city: '北京',
        country: '中国',
        lat: 39.9042,
        lon: 116.4074,
        isLocal: true,
        error: 'Unable to detect location'
      });
    }
  } catch (error) {
    console.error('获取位置信息失败:', error.message);
    // 返回默认位置
    res.json({
      ip: 'unknown',
      city: '北京',
      country: '中国',
      lat: 39.9042,
      lon: 116.4074,
      isLocal: true,
      error: error.message
    });
  }
});

// 获取天气数据（小时和周数据，包含风力、空气质量等）
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: '缺少经纬度参数'
      });
    }

    console.log('获取天气数据，经纬度:', lat, lon);

    // 使用Open-Meteo API（免费，无需API key，支持中文）
    // 获取详细的天气数据，包括：温度、湿度、降水、风速、空气质量等
    const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant',
        timezone: 'auto',
        forecast_days: 7
      },
      timeout: 10000
    });

    // 获取空气质量数据
    let airQuality = null;
    try {
      const airQualityResponse = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi',
          timezone: 'auto',
          forecast_days: 1
        },
        timeout: 5000
      });
      airQuality = airQualityResponse.data;
    } catch (airError) {
      console.error('获取空气质量数据失败:', airError.message);
    }

    const weatherData = weatherResponse.data;

    // 处理小时数据（取未来24小时）
    const now = new Date();
    const currentHour = now.getHours();
    const hourlyData = [];

    for (let i = 0; i < 24; i++) {
      const index = currentHour + i;
      if (index < weatherData.hourly.time.length) {
        hourlyData.push({
          time: weatherData.hourly.time[index],
          temperature: weatherData.hourly.temperature_2m[index],
          humidity: weatherData.hourly.relative_humidity_2m[index],
          precipitation_probability: weatherData.hourly.precipitation_probability[index],
          precipitation: weatherData.hourly.precipitation[index],
          weather_code: weatherData.hourly.weather_code[index],
          wind_speed: weatherData.hourly.wind_speed_10m[index],
          wind_direction: weatherData.hourly.wind_direction_10m[index]
        });
      }
    }

    // 处理每日数据（7天）
    const dailyData = [];
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      dailyData.push({
        date: weatherData.daily.time[i],
        weather_code: weatherData.daily.weather_code[i],
        temperature_max: weatherData.daily.temperature_2m_max[i],
        temperature_min: weatherData.daily.temperature_2m_min[i],
        precipitation_sum: weatherData.daily.precipitation_sum[i],
        precipitation_probability: weatherData.daily.precipitation_probability_max[i],
        wind_speed_max: weatherData.daily.wind_speed_10m_max[i],
        wind_direction: weatherData.daily.wind_direction_10m_dominant[i]
      });
    }

    // 处理空气质量数据（当前时刻）
    let currentAirQuality = null;
    if (airQuality && airQuality.hourly) {
      currentAirQuality = {
        pm10: airQuality.hourly.pm10[currentHour] || null,
        pm2_5: airQuality.hourly.pm2_5[currentHour] || null,
        carbon_monoxide: airQuality.hourly.carbon_monoxide[currentHour] || null,
        nitrogen_dioxide: airQuality.hourly.nitrogen_dioxide[currentHour] || null,
        ozone: airQuality.hourly.ozone[currentHour] || null,
        us_aqi: airQuality.hourly.us_aqi[currentHour] || null
      };
    }

    res.json({
      hourly: hourlyData,
      daily: dailyData,
      airQuality: currentAirQuality,
      timezone: weatherData.timezone,
      elevation: weatherData.elevation
    });

  } catch (error) {
    console.error('获取天气数据失败:', error.message);
    res.status(500).json({
      error: '获取天气数据失败',
      message: error.message
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
  console.log(`数据文件路径: ${DATA_FILE}`);
  console.log(`__dirname: ${__dirname}`);
});

