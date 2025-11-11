import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 验证网站地址的函数
function validateWebsite(website) {
  if (!website || typeof website !== 'string') {
    return false;
  }

  // 移除协议前缀
  const cleanWebsite = website.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // 基本的域名验证正则表达式
  const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

  return domainRegex.test(cleanWebsite) || ipRegex.test(cleanWebsite);
}

// 清理网站地址，移除协议和路径
function cleanWebsite(website) {
  return website
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .trim();
}

// 解析ping输出
function parsePingOutput(output) {
  const result = {
    transmitted: null,
    received: null,
    loss: null,
    time: null
  };

  // 解析统计信息
  const statsMatch = output.match(/(\d+) packets transmitted, (\d+) (?:packets )?received, ([\d.]+)% packet loss/);
  if (statsMatch) {
    result.transmitted = parseInt(statsMatch[1], 10);
    result.received = parseInt(statsMatch[2], 10);
    result.loss = parseFloat(statsMatch[3]);
  }

  // 解析平均延迟 (支持多种格式)
  const timeMatch = output.match(/rtt min\/avg\/max\/mdev = [\d.]+\/([\d.]+)\/([\d.]+)\/[\d.]+ ms/) ||
                   output.match(/round-trip min\/avg\/max = [\d.]+\/([\d.]+)\/([\d.]+) ms/) ||
                   output.match(/Average = ([\d.]+)ms/);

  if (timeMatch) {
    result.time = parseFloat(timeMatch[1]);
  }

  return result;
}

// Ping接口
app.post('/api/ping', async (req, res) => {
  try {
    const { website } = req.body;

    if (!website) {
      return res.status(400).json({
        success: false,
        message: '请提供网站地址'
      });
    }

    const cleanedWebsite = cleanWebsite(website);

    if (!validateWebsite(cleanedWebsite)) {
      return res.status(400).json({
        success: false,
        message: '无效的网站地址格式，请输入有效的域名或IP地址'
      });
    }

    // 执行ping命令（发送4个数据包，超时5秒）
    // 使用-c参数限制ping次数，-W参数设置超时
    const command = `ping -c 4 -W 5 ${cleanedWebsite}`;

    try {
      const { stdout, stderr } = await execPromise(command, {
        timeout: 10000 // 10秒总超时
      });

      const output = stdout || stderr;
      const stats = parsePingOutput(output);

      // 判断是否成功（至少收到1个包）
      const isSuccess = stats.received && stats.received > 0;

      return res.json({
        success: isSuccess,
        target: cleanedWebsite,
        transmitted: stats.transmitted,
        received: stats.received,
        loss: stats.loss,
        time: stats.time,
        message: output
      });

    } catch (execError) {
      // Ping失败的情况
      const output = execError.stdout || execError.stderr || execError.message;
      const stats = parsePingOutput(output);

      return res.json({
        success: false,
        target: cleanedWebsite,
        transmitted: stats.transmitted,
        received: stats.received,
        loss: stats.loss,
        time: stats.time,
        message: output || '网络连接失败，无法到达目标主机'
      });
    }

  } catch (error) {
    console.error('Ping错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误: ' + error.message
    });
  }
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
  console.log(`Ping接口: http://localhost:${PORT}/api/ping`);
});
