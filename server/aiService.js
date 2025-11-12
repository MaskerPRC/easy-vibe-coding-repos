/**
 * AI 相关性分析服务
 * 使用 OpenAI API 进行消息相关性分析
 */

import axios from 'axios';

// AI 配置(内存存储)
let aiConfig = {
  enabled: false,
  apiKey: null,
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo'
};

/**
 * 设置 AI 配置
 */
export function setAIConfig(config) {
  aiConfig = {
    ...aiConfig,
    ...config
  };
  console.log('AI 配置已更新:', {
    enabled: aiConfig.enabled,
    model: aiConfig.model,
    hasApiKey: !!aiConfig.apiKey
  });
}

/**
 * 获取 AI 配置状态
 */
export function getAIConfig() {
  return {
    enabled: aiConfig.enabled,
    model: aiConfig.model,
    hasApiKey: !!aiConfig.apiKey
  };
}

/**
 * 构建分析提示词
 */
function buildAnalysisPrompt(message, project) {
  return `你是一个新闻相关性分析专家。请分析以下消息与项目的相关性。

项目信息:
- 名称: ${project.name}
- 描述: ${project.description}
- 关键词: ${project.keywords.join(', ')}
- 上下文: ${project.context}

消息信息:
- 标题: ${message.title}
- 内容: ${message.content.substring(0, 500)}
- 作者: ${message.author}

请从以下4个维度评分(0-1):
1. topicMatch: 主题匹配度 - 消息主题与项目关键词的匹配程度
2. contextRelevance: 上下文相关性 - 消息内容与项目上下文的相关程度
3. actionability: 可操作性 - 消息对项目成员的实用价值
4. urgency: 紧急程度 - 消息的时效性和重要性

并提供一句话分析摘要。

请以JSON格式返回,格式如下:
{
  "scores": {
    "topicMatch": 0.8,
    "contextRelevance": 0.7,
    "actionability": 0.6,
    "urgency": 0.5
  },
  "analysis": "这是分析摘要"
}`;
}

/**
 * 分析消息与项目的相关性
 */
export async function analyzeRelevance(message, project) {
  // 如果 AI 未启用,返回基于规则的简单评分
  if (!aiConfig.enabled || !aiConfig.apiKey) {
    return fallbackAnalysis(message, project);
  }

  try {
    const prompt = buildAnalysisPrompt(message, project);

    const response = await axios.post(
      aiConfig.apiEndpoint,
      {
        model: aiConfig.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的新闻相关性分析助手,擅长评估消息与项目的相关性。'
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
          'Authorization': `Bearer ${aiConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const content = response.data.choices[0].message.content;

    // 解析 JSON 响应
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);

      // 计算综合评分(加权平均)
      const relevanceScore =
        result.scores.topicMatch * 0.3 +
        result.scores.contextRelevance * 0.25 +
        result.scores.actionability * 0.25 +
        result.scores.urgency * 0.2;

      return {
        relevanceScore,
        scores: result.scores,
        analysis: result.analysis,
        aiUsed: true
      };
    }

    throw new Error('AI 响应格式错误');
  } catch (error) {
    console.error('AI 分析失败,使用备用规则:', error.message);
    return fallbackAnalysis(message, project);
  }
}

/**
 * 备用分析方法(基于规则)
 */
function fallbackAnalysis(message, project) {
  const title = message.title.toLowerCase();
  const content = (message.content || '').toLowerCase();
  const text = `${title} ${content}`;

  // 计算关键词匹配度
  const keywords = project.keywords.map(k => k.toLowerCase());
  let matchCount = 0;

  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      matchCount++;
    }
  }

  const topicMatch = Math.min(matchCount / Math.max(keywords.length, 1), 1);

  // 简单的相关性评分
  const contextRelevance = topicMatch * 0.8 + 0.1;
  const actionability = 0.5 + (topicMatch * 0.3);
  const urgency = 0.5;

  const relevanceScore =
    topicMatch * 0.3 +
    contextRelevance * 0.25 +
    actionability * 0.25 +
    urgency * 0.2;

  return {
    relevanceScore,
    scores: {
      topicMatch,
      contextRelevance,
      actionability,
      urgency
    },
    analysis: `基于关键词匹配的简单分析: 匹配了 ${matchCount}/${keywords.length} 个关键词`,
    aiUsed: false
  };
}
