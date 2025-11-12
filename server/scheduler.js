/**
 * 定时任务调度器
 * 定期抓取信息源并进行 AI 分析
 */

import { sourceStorage, projectStorage, messageStorage } from './storage.js';
import { fetchSource } from './fetchService.js';
import { analyzeRelevance } from './aiService.js';

// 任务状态
let isRunning = false;
let lastRunTime = null;
let taskStats = {
  totalRuns: 0,
  successfulRuns: 0,
  failedRuns: 0,
  lastError: null,
  messagesProcessed: 0,
  messagesCreated: 0
};

/**
 * 处理单个信息源
 */
async function processSource(source) {
  try {
    console.log(`开始处理信息源: ${source.name} (${source.url})`);

    // 1. 抓取信息源
    const fetchResult = await fetchSource(source);

    if (!fetchResult.success) {
      console.error(`抓取失败: ${fetchResult.error}`);
      return {
        sourceId: source.id,
        success: false,
        error: fetchResult.error,
        messagesProcessed: 0,
        messagesCreated: 0
      };
    }

    const items = fetchResult.items || [];
    console.log(`抓取到 ${items.length} 条消息`);

    // 2. 更新最后抓取时间
    sourceStorage.updateLastFetched(source.id);

    // 3. 获取所有项目
    const allProjects = projectStorage.getAll();

    if (allProjects.length === 0) {
      console.log('没有项目，跳过消息分析');
      return {
        sourceId: source.id,
        success: true,
        messagesProcessed: 0,
        messagesCreated: 0
      };
    }

    let messagesProcessed = 0;
    let messagesCreated = 0;

    // 4. 对每条消息进行处理
    for (const item of items) {
      messagesProcessed++;

      // 检查是否已存在（去重）
      const existing = messageStorage.findDuplicateByUrl(item.url);
      if (existing) {
        console.log(`消息已存在，跳过: ${item.title}`);
        continue;
      }

      // 对每个项目进行相关性分析
      let bestMatch = null;
      let bestScore = 0;

      for (const project of allProjects) {
        const analysis = await analyzeRelevance(item, project);

        if (analysis.relevanceScore > bestScore) {
          bestScore = analysis.relevanceScore;
          bestMatch = {
            projectId: project.id,
            ...analysis
          };
        }
      }

      // 如果相关性分数超过阈值，创建消息
      if (bestMatch && bestScore >= (bestMatch.project?.threshold || 0.6)) {
        const message = messageStorage.create({
          sourceId: source.id,
          projectId: bestMatch.projectId,
          title: item.title,
          content: item.content,
          url: item.url,
          author: item.author,
          publishedAt: item.publishedAt,
          relevanceScore: bestMatch.relevanceScore,
          scores: bestMatch.scores,
          analysis: bestMatch.analysis
        });

        messagesCreated++;
        console.log(`创建消息: ${message.title} (相关性: ${bestScore.toFixed(2)})`);
      } else {
        console.log(`消息相关性过低，跳过: ${item.title} (${bestScore.toFixed(2)})`);
      }
    }

    return {
      sourceId: source.id,
      success: true,
      messagesProcessed,
      messagesCreated
    };
  } catch (error) {
    console.error(`处理信息源失败:`, error);
    return {
      sourceId: source.id,
      success: false,
      error: error.message,
      messagesProcessed: 0,
      messagesCreated: 0
    };
  }
}

/**
 * 运行定时任务
 */
export async function runScheduledTask() {
  if (isRunning) {
    console.log('任务正在运行中，跳过本次执行');
    return {
      skipped: true,
      reason: '任务正在运行中'
    };
  }

  isRunning = true;
  lastRunTime = new Date().toISOString();
  taskStats.totalRuns++;

  console.log('======== 开始定时任务 ========');
  console.log('时间:', lastRunTime);

  try {
    // 获取所有启用的信息源
    const enabledSources = sourceStorage.findEnabled();

    if (enabledSources.length === 0) {
      console.log('没有启用的信息源');
      taskStats.successfulRuns++;
      return {
        success: true,
        sourcesProcessed: 0,
        messagesProcessed: 0,
        messagesCreated: 0
      };
    }

    console.log(`找到 ${enabledSources.length} 个启用的信息源`);

    // 处理所有信息源
    const results = [];
    for (const source of enabledSources) {
      const result = await processSource(source);
      results.push(result);
    }

    // 统计结果
    const totalMessagesProcessed = results.reduce((sum, r) => sum + (r.messagesProcessed || 0), 0);
    const totalMessagesCreated = results.reduce((sum, r) => sum + (r.messagesCreated || 0), 0);
    const successCount = results.filter(r => r.success).length;

    taskStats.messagesProcessed += totalMessagesProcessed;
    taskStats.messagesCreated += totalMessagesCreated;

    if (successCount === enabledSources.length) {
      taskStats.successfulRuns++;
    } else {
      taskStats.failedRuns++;
    }

    console.log('======== 任务完成 ========');
    console.log(`处理了 ${enabledSources.length} 个信息源`);
    console.log(`处理了 ${totalMessagesProcessed} 条消息`);
    console.log(`创建了 ${totalMessagesCreated} 条新消息`);

    return {
      success: true,
      sourcesProcessed: enabledSources.length,
      messagesProcessed: totalMessagesProcessed,
      messagesCreated: totalMessagesCreated,
      results
    };
  } catch (error) {
    console.error('定时任务失败:', error);
    taskStats.failedRuns++;
    taskStats.lastError = error.message;

    return {
      success: false,
      error: error.message
    };
  } finally {
    isRunning = false;
  }
}

/**
 * 获取任务状态
 */
export function getTaskStatus() {
  return {
    isRunning,
    lastRunTime,
    stats: { ...taskStats }
  };
}

/**
 * 重置任务统计
 */
export function resetTaskStats() {
  taskStats = {
    totalRuns: 0,
    successfulRuns: 0,
    failedRuns: 0,
    lastError: null,
    messagesProcessed: 0,
    messagesCreated: 0
  };
}

/**
 * 初始化定时任务调度器
 * 注意：实际使用时需要安装 node-cron 包
 */
export function initScheduler() {
  // 注意：这里需要 node-cron 包
  // import cron from 'node-cron';
  //
  // // 每小时运行一次
  // cron.schedule('0 * * * *', async () => {
  //   await runScheduledTask();
  // });

  console.log('定时任务调度器已初始化');
  console.log('提示：安装 node-cron 包以启用自动调度');
  console.log('当前可以通过 API 手动触发任务');
}
