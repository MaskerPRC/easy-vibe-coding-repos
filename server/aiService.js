/**
 * AI 分析服务模块
 * 使用 OpenAI API 进行智能内容分析
 */

import axios from 'axios';

// AI 配置（从环境变量或设置中获取）
let aiConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  apiEndpoint: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
  model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  enabled: false
};

/**
 * 设置 AI 配置
 */
export function setAIConfig(config) {
  aiConfig = { ...aiConfig, ...config };
  aiConfig.enabled = !!aiConfig.apiKey;
}

/**
 * 获取 AI 配置状态
 */
export function getAIConfigStatus() {
  return {
    enabled: aiConfig.enabled,
    model: aiConfig.model,
    hasApiKey: !!aiConfig.apiKey
  };
}

/**
 * 分析消息与项目的相关性
 * @param {Object} message - 消息对象
 * @param {Object} project - 项目对象
 * @returns {Object} 分析结果
 */
export async function analyzeRelevance(message, project) {
  // 如果 AI 未启用，返回默认分数
  if (!aiConfig.enabled) {
    return {
      relevanceScore: 0.5,
      scores: {
        topicMatch: 0.5,
        contextRelevance: 0.5,
        actionability: 0.5,
        urgency: 0.5
      },
      analysis: '未启用 AI 分析功能，使用默认评分。',
      aiUsed: false
    };
  }

  try {
    // 构建提示词
    const prompt = buildAnalysisPrompt(message, project);

    // 调用 OpenAI API
    const response = await axios.post(
      aiConfig.apiEndpoint,
      {
        model: aiConfig.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的内容相关性分析助手。你需要评估消息与项目的相关性，从主题匹配度、上下文相关性、可操作性和紧急程度四个维度进行评分（0-1之间）。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiConfig.apiKey}`
        }
      }
    );

    // 解析 AI 响应
    const aiResponse = response.data.choices[0].message.content;
    const analysis = parseAIResponse(aiResponse);

    return {
      ...analysis,
      aiUsed: true
    };
  } catch (error) {
    console.error('AI 分析失败:', error.message);

    // 如果 AI 分析失败，使用基于规则的简单分析
    return fallbackAnalysis(message, project);
  }
}

/**
 * 构建分析提示词
 */
function buildAnalysisPrompt(message, project) {
  return `请分析以下消息与项目的相关性：

项目信息：
- 名称：${project.name}
- 描述：${project.description}
- 关键词：${project.keywords.join(', ')}
- 上下文：${project.context}

消息信息：
- 标题：${message.title}
- 内容：${message.content?.substring(0, 500) || '无内容'}
- 来源：${message.url || '未知'}

请按以下 JSON 格式返回评分（0-1 之间的小数）：
{
  "topicMatch": 0.0-1.0,
  "contextRelevance": 0.0-1.0,
  "actionability": 0.0-1.0,
  "urgency": 0.0-1.0,
  "summary": "简要说明评分理由"
}

评分标准：
1. topicMatch (主题匹配度 30%)：消息主题与项目关键词的匹配程度
2. contextRelevance (上下文相关性 25%)：消息内容与项目上下文的相关程度
3. actionability (可操作性 25%)：消息对项目的实际价值和可操作性
4. urgency (紧急程度 20%)：消息的时效性和紧急程度`;
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(aiResponse) {
  try {
    // 尝试提取 JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);

      // 计算综合相关性分数（加权平均）
      const relevanceScore =
        (parsed.topicMatch || 0) * 0.3 +
        (parsed.contextRelevance || 0) * 0.25 +
        (parsed.actionability || 0) * 0.25 +
        (parsed.urgency || 0) * 0.2;

      return {
        relevanceScore: Math.round(relevanceScore * 100) / 100,
        scores: {
          topicMatch: parsed.topicMatch || 0,
          contextRelevance: parsed.contextRelevance || 0,
          actionability: parsed.actionability || 0,
          urgency: parsed.urgency || 0
        },
        analysis: parsed.summary || aiResponse
      };
    }
  } catch (error) {
    console.error('解析 AI 响应失败:', error.message);
  }

  // 如果解析失败，返回默认值
  return {
    relevanceScore: 0.5,
    scores: {
      topicMatch: 0.5,
      contextRelevance: 0.5,
      actionability: 0.5,
      urgency: 0.5
    },
    analysis: aiResponse
  };
}

/**
 * 回退分析（基于简单规则）
 */
function fallbackAnalysis(message, project) {
  let topicMatch = 0;
  let contextRelevance = 0;

  const messageText = `${message.title} ${message.content || ''}`.toLowerCase();
  const keywords = project.keywords.map(k => k.toLowerCase());
  const contextWords = project.context.toLowerCase().split(/\s+/);

  // 计算关键词匹配度
  let matchedKeywords = 0;
  for (const keyword of keywords) {
    if (messageText.includes(keyword)) {
      matchedKeywords++;
    }
  }
  topicMatch = keywords.length > 0 ? matchedKeywords / keywords.length : 0.5;

  // 计算上下文相关性
  let matchedContextWords = 0;
  for (const word of contextWords) {
    if (word.length > 3 && messageText.includes(word)) {
      matchedContextWords++;
    }
  }
  contextRelevance = contextWords.length > 0 ?
    Math.min(matchedContextWords / contextWords.length, 1) : 0.5;

  // 简单的可操作性和紧急度评估
  const actionability = messageText.includes('发布') || messageText.includes('更新') ? 0.7 : 0.5;
  const urgency = messageText.includes('重要') || messageText.includes('紧急') ? 0.8 : 0.4;

  const relevanceScore =
    topicMatch * 0.3 +
    contextRelevance * 0.25 +
    actionability * 0.25 +
    urgency * 0.2;

  return {
    relevanceScore: Math.round(relevanceScore * 100) / 100,
    scores: {
      topicMatch: Math.round(topicMatch * 100) / 100,
      contextRelevance: Math.round(contextRelevance * 100) / 100,
      actionability: Math.round(actionability * 100) / 100,
      urgency: Math.round(urgency * 100) / 100
    },
    analysis: '使用基于规则的简单分析（AI 服务不可用）',
    aiUsed: false
  };
}

/**
 * 批量分析消息
 */
export async function batchAnalyzeMessages(messages, projects) {
  const results = [];

  for (const message of messages) {
    let bestMatch = null;
    let bestScore = 0;

    // 对每个项目进行分析
    for (const project of projects) {
      const analysis = await analyzeRelevance(message, project);

      if (analysis.relevanceScore > bestScore) {
        bestScore = analysis.relevanceScore;
        bestMatch = {
          projectId: project.id,
          ...analysis
        };
      }
    }

    results.push({
      message,
      bestMatch
    });
  }

  return results;
}
