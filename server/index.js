import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// 初始化 Anthropic Claude 客户端
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-api03-demo-key',
});

// ==================== Claude AI 对话 API ====================

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'Claude AI Chat Server is running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

/**
 * Claude AI 对话接口 - 支持流式响应
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, stream = true } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: '消息列表不能为空'
      });
    }

    console.log(`💬 收到对话请求 - 消息数: ${messages.length}`);

    // 设置流式响应头
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
    }

    try {
      if (stream) {
        // 流式响应
        const streamResponse = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 8096,
          messages: messages,
          stream: true,
        });

        // 发送流式数据
        for await (const messageStreamEvent of streamResponse) {
          if (messageStreamEvent.type === 'content_block_delta') {
            const delta = messageStreamEvent.delta;
            if (delta.type === 'text_delta') {
              res.write(`data: ${JSON.stringify({ type: 'text', content: delta.text })}\n\n`);
            }
          } else if (messageStreamEvent.type === 'message_stop') {
            res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
          }
        }

        res.end();
        console.log('✅ 流式响应完成');
      } else {
        // 非流式响应
        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 8096,
          messages: messages,
        });

        const content = response.content[0].text;
        res.json({
          success: true,
          content: content,
          usage: response.usage
        });

        console.log('✅ 对话响应完成');
      }
    } catch (apiError) {
      console.error('❌ Claude API 调用失败:', apiError);

      if (stream) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: apiError.message })}\n\n`);
        res.end();
      } else {
        res.status(500).json({
          success: false,
          error: 'Claude API 调用失败: ' + apiError.message
        });
      }
    }
  } catch (error) {
    console.error('❌ 对话请求处理失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== 错误处理 ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '接口不存在',
    path: req.path
  });
});

app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: error.message
  });
});

// ==================== 启动服务器 ====================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🤖 Claude AI Chat Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`📁 Working Directory: ${process.cwd()}`);
  console.log('='.repeat(60) + '\n');
});
