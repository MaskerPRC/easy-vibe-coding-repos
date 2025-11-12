/**
 * 任务调度器
 * 负责定时抓取信息源并进行AI分析
 */

import { fetchSource } from './fetchService.js';
import { analyzeRelevance } from './aiService.js';
import { sourceStorage, projectStorage, messageStorage } from './storage.js';

// 任务状态
let isRunning = false;
let lastRunTime = null;

// 任务统计
let taskStats = {
  totalRuns: 0,
  successfulRuns: 0,
  failedRuns: 0,
  messagesProcessed: 0,
  messagesCreated: 0
};

/**
 * 获取任务状态
 */
export function getTaskStatus() {
  return {
    isRunning,
    lastRunTime,
    stats: taskStats
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
    messagesProcessed: 0,
    messagesCreated: 0
  };
}

/**
 * 处理单个信息源
 */
async function processSource(source) {
  console.log(`\n处理信息源: ${source.name} (${source.type})`);

  try {
    // 抓取信息源
    const result = await fetchSource(source);

    if (!result.success) {
      console.error(`抓取失败: ${result.error}`);
      return {
        success: false,
        error: result.error,
        processed: 0,
        created: 0
      };
    }

    // 更新最后抓取时间
    sourceStorage.updateLastFetched(source.id);

    const items = result.items || [];
    console.log(`获取了 ${items.length} 条项目`);

    // 获取所有项目
    const projects = projectStorage.getAll();

    if (projects.length === 0) {
      console.log('没有项目,跳过消息创建');
      return {
        success: true,
        processed: items.length,
        created: 0
      };
    }

    let createdCount = 0;

    // 对每条消息进行处理
    for (const item of items) {
      try {
        // 检查是否重复
        const duplicate = messageStorage.findDuplicateByUrl(item.url);
        if (duplicate) {
          console.log(`跳过重复消息: ${item.title}`);
          continue;
        }

        // 为每个项目分析相关性
        let bestMatch = null;
        let bestScore = 0;

        for (const project of projects) {
          const analysis = await analyzeRelevance(item, project);

          if (analysis.relevanceScore > bestScore) {
            bestScore = analysis.relevanceScore;
            bestMatch = {
              project,
              analysis
            };
          }
        }

        // 如果最高分超过项目阈值,创建消息
        if (bestMatch && bestScore >= bestMatch.project.threshold) {
          const message = messageStorage.create({
            sourceId: source.id,
            projectId: bestMatch.project.id,
            title: item.title,
            content: item.content,
            url: item.url,
            author: item.author,
            publishedAt: item.publishedAt,
            relevanceScore: bestMatch.analysis.relevanceScore,
            scores: bestMatch.analysis.scores,
            analysis: bestMatch.analysis.analysis
          });

          console.log(`✓ 创建消息: ${item.title} -> 项目: ${bestMatch.project.name} (评分: ${(bestScore * 100).toFixed(0)}%)`);
          createdCount++;
        } else {
          console.log(`✗ 相关性不足: ${item.title} (最高评分: ${(bestScore * 100).toFixed(0)}%)`);
        }
      } catch (error) {
        console.error(`处理消息失败: ${item.title}`, error.message);
      }
    }

    return {
      success: true,
      processed: items.length,
      created: createdCount
    };
  } catch (error) {
    console.error(`处理信息源失败: ${source.name}`, error);
    return {
      success: false,
      error: error.message,
      processed: 0,
      created: 0
    };
  }
}

/**
 * 运行定时任务
 */
export async function runScheduledTask() {
  if (isRunning) {
    console.log('任务已在运行中,跳过本次执行');
    return {
      success: false,
      error: '任务已在运行中'
    };
  }

  isRunning = true;
  lastRunTime = new Date().toISOString();
  taskStats.totalRuns++;

  console.log('\n========================================');
  console.log('开始执行定时任务');
  console.log(`时间: ${lastRunTime}`);
  console.log('========================================');

  try {
    // 获取所有启用的信息源
    const sources = sourceStorage.findEnabled();

    if (sources.length === 0) {
      console.log('没有启用的信息源');
      taskStats.successfulRuns++;
      return {
        success: true,
        message: '没有启用的信息源',
        processed: 0,
        created: 0
      };
    }

    console.log(`找到 ${sources.length} 个启用的信息源\n`);

    let totalProcessed = 0;
    let totalCreated = 0;

    // 处理每个信息源
    for (const source of sources) {
      const result = await processSource(source);

      if (result.success) {
        totalProcessed += result.processed;
        totalCreated += result.created;
      }

      // 信息源之间添加延迟
      await sleep(1000);
    }

    // 更新统计
    taskStats.successfulRuns++;
    taskStats.messagesProcessed += totalProcessed;
    taskStats.messagesCreated += totalCreated;

    console.log('\n========================================');
    console.log('任务执行完成');
    console.log(`处理了 ${totalProcessed} 条消息`);
    console.log(`创建了 ${totalCreated} 条消息`);
    console.log('========================================\n');

    return {
      success: true,
      processed: totalProcessed,
      created: totalCreated,
      sources: sources.length
    };
  } catch (error) {
    console.error('任务执行失败:', error);
    taskStats.failedRuns++;

    return {
      success: false,
      error: error.message
    };
  } finally {
    isRunning = false;
  }
}

/**
 * 启动定时调度
 */
export function startScheduler(intervalMinutes = 60) {
  console.log(`启动定时调度器,间隔: ${intervalMinutes} 分钟`);

  // 立即执行一次
  setTimeout(() => {
    runScheduledTask();
  }, 5000); // 5秒后首次执行

  // 设置定时执行
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(() => {
    runScheduledTask();
  }, intervalMs);
}

/**
 * 睡眠函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
