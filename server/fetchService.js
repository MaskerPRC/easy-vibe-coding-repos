/**
 * 信息源爬取和处理模块
 * 支持 RSS、API、网站、GitHub等多种信息源
 * 使用 rss-parser 进行真实的RSS抓取
 */

import Parser from 'rss-parser';
import axios from 'axios';

// 创建RSS解析器实例
const rssParser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)'
  }
});

/**
 * 检测 URL 类型
 */
export function detectUrlType(url) {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('github.com')) {
    return 'github';
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return 'twitter';
  }
  if (lowerUrl.includes('/rss') || lowerUrl.includes('/feed') || lowerUrl.endsWith('.xml') || lowerUrl.includes('atom')) {
    return 'rss';
  }
  if (lowerUrl.includes('/api/')) {
    return 'api';
  }

  return 'website';
}

/**
 * 抓取 RSS 源 (使用真实的 rss-parser)
 */
export async function fetchRSS(url) {
  try {
    console.log(`开始抓取 RSS: ${url}`);

    // 使用 rss-parser 解析 RSS 源
    const feed = await rssParser.parseURL(url);

    console.log(`成功抓取 RSS: ${feed.title || url}, 获取 ${feed.items?.length || 0} 条项目`);

    // 将RSS项目转换为标准格式
    const items = (feed.items || []).slice(0, 20).map(item => ({
      title: item.title || '无标题',
      url: item.link || item.url || url,
      content: item.contentSnippet || item.content || item.description || '',
      publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
      author: item.creator || item.author || feed.title || ''
    }));

    return {
      success: true,
      items
    };
  } catch (error) {
    console.error(`抓取 RSS 失败 (${url}):`, error.message);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
}

/**
 * 清理HTML标签
 */
function cleanHTML(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .trim();
}

/**
 * 抓取网站内容
 */
export async function fetchWebsite(url) {
  try {
    console.log(`开始抓取网站: ${url}`);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)'
      }
    });

    const html = response.data;

    // 简单的内容提取
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? cleanHTML(titleMatch[1]) : url;

    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const description = metaMatch ? metaMatch[1] : '';

    console.log(`成功抓取网站: ${title}`);

    return {
      success: true,
      items: [{
        title: title,
        url: url,
        content: cleanHTML(description),
        publishedAt: new Date().toISOString(),
        author: ''
      }]
    };
  } catch (error) {
    console.error(`抓取网站失败 (${url}):`, error.message);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
}

/**
 * 抓取 GitHub 仓库信息
 */
export async function fetchGitHub(url) {
  try {
    console.log(`开始抓取 GitHub: ${url}`);

    // 解析 GitHub URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('无效的 GitHub URL');
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');

    // 获取最新的 releases
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`;

    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'NewsAggregator/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const items = response.data.map(release => ({
      title: `${repo}: ${release.name || release.tag_name}`,
      url: release.html_url,
      content: release.body || '无描述',
      publishedAt: release.published_at,
      author: release.author?.login || owner
    }));

    console.log(`成功抓取 GitHub: ${repo}, 获取 ${items.length} 个 releases`);

    return {
      success: true,
      items
    };
  } catch (error) {
    console.error(`抓取 GitHub 失败 (${url}):`, error.message);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
}

/**
 * 抓取 API 数据
 */
export async function fetchAPI(url, config = {}) {
  try {
    console.log(`开始抓取 API: ${url}`);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'NewsAggregator/1.0',
        ...config.headers
      }
    });

    const data = response.data;

    // 尝试从数据中提取项目列表
    let items = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (data.items && Array.isArray(data.items)) {
      items = data.items;
    } else if (data.data && Array.isArray(data.data)) {
      items = data.data;
    } else if (data.results && Array.isArray(data.results)) {
      items = data.results;
    }

    // 标准化数据格式
    const standardized = items.slice(0, 20).map(item => ({
      title: item.title || item.name || item.subject || '无标题',
      url: item.url || item.link || item.href || url,
      content: item.content || item.description || item.body || '',
      publishedAt: item.publishedAt || item.created_at || item.date || new Date().toISOString(),
      author: item.author || item.creator || item.user?.name || ''
    }));

    console.log(`成功抓取 API, 获取 ${standardized.length} 条项目`);

    return {
      success: true,
      items: standardized
    };
  } catch (error) {
    console.error(`抓取 API 失败 (${url}):`, error.message);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
}

/**
 * 抓取 Twitter (简化版本)
 */
export async function fetchTwitter(url) {
  // 注意：Twitter API 需要认证,这里提供一个简化的模拟
  console.log('Twitter 抓取需要 API 认证,当前为模拟数据');

  return {
    success: true,
    items: [
      {
        title: '示例 Twitter 内容',
        url: url,
        content: 'Twitter 抓取需要配置 API 密钥。请在 Twitter Developer Portal 申请 API 密钥后配置。',
        publishedAt: new Date().toISOString(),
        author: 'twitter_user'
      }
    ]
  };
}

/**
 * 根据源类型抓取内容
 */
export async function fetchSource(source) {
  const { type, url, config } = source;

  try {
    switch (type) {
      case 'rss':
        return await fetchRSS(url);

      case 'api':
        return await fetchAPI(url, config);

      case 'website':
        return await fetchWebsite(url);

      case 'github':
        return await fetchGitHub(url);

      case 'twitter':
        return await fetchTwitter(url);

      default:
        // 自动检测类型
        const detectedType = detectUrlType(url);
        console.log(`自动检测到类型: ${detectedType}`);
        return await fetchSource({ ...source, type: detectedType });
    }
  } catch (error) {
    console.error(`抓取信息源失败:`, error);
    return {
      success: false,
      error: error.message,
      items: []
    };
  }
}

/**
 * 批量抓取多个信息源
 */
export async function fetchMultipleSources(sources) {
  const results = [];

  for (const source of sources) {
    const result = await fetchSource(source);
    results.push({
      sourceId: source.id,
      sourceName: source.name,
      ...result
    });

    // 避免请求过快
    await sleep(1000);
  }

  return results;
}

/**
 * 睡眠函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
