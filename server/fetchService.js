/**
 * 信息源爬取和处理模块
 * 支持 RSS、API、网站、GitHub、Twitter 等多种信息源
 */

import axios from 'axios';

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
  if (lowerUrl.includes('/rss') || lowerUrl.includes('/feed') || lowerUrl.endsWith('.xml')) {
    return 'rss';
  }
  if (lowerUrl.includes('/api/')) {
    return 'api';
  }

  return 'website';
}

/**
 * 抓取 RSS 源
 */
export async function fetchRSS(url) {
  try {
    // 注意：实际使用时需要安装 rss-parser 包
    // import Parser from 'rss-parser';
    // const parser = new Parser();
    // const feed = await parser.parseURL(url);

    // 这里使用简化的实现
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)'
      }
    });

    // 简单的 XML 解析（实际应该使用 rss-parser）
    const items = parseRSSXML(response.data);

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
 * 简单的 RSS XML 解析
 */
function parseRSSXML(xml) {
  const items = [];

  try {
    // 这是一个非常简化的 XML 解析
    // 实际使用应该用 rss-parser 或 xml2js
    const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) ||
                       xml.match(/<entry>[\s\S]*?<\/entry>/gi) || [];

    for (const itemXml of itemMatches.slice(0, 20)) {
      const title = extractXMLTag(itemXml, 'title');
      const link = extractXMLTag(itemXml, 'link');
      const description = extractXMLTag(itemXml, 'description') ||
                         extractXMLTag(itemXml, 'summary') ||
                         extractXMLTag(itemXml, 'content');
      const pubDate = extractXMLTag(itemXml, 'pubDate') ||
                     extractXMLTag(itemXml, 'published') ||
                     extractXMLTag(itemXml, 'updated');
      const author = extractXMLTag(itemXml, 'author') ||
                    extractXMLTag(itemXml, 'dc:creator');

      if (title && link) {
        items.push({
          title: cleanHTML(title),
          url: cleanHTML(link),
          content: cleanHTML(description),
          publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
          author: cleanHTML(author) || ''
        });
      }
    }
  } catch (error) {
    console.error('解析 RSS XML 失败:', error.message);
  }

  return items;
}

/**
 * 从 XML 中提取标签内容
 */
function extractXMLTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : '';
}

/**
 * 清理 HTML 标签
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
    // 注意：实际使用时需要安装 cheerio 包进行 HTML 解析
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)'
      }
    });

    const html = response.data;

    // 简单的内容提取（实际应该使用 cheerio）
    const title = extractHTMLTag(html, 'title') || url;
    const description = extractMetaTag(html, 'description') ||
                       extractHTMLTag(html, 'h1') ||
                       '';

    return {
      success: true,
      items: [{
        title: cleanHTML(title),
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
 * 从 HTML 中提取标签内容
 */
function extractHTMLTag(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

/**
 * 提取 meta 标签内容
 */
function extractMetaTag(html, name) {
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
  const match = html.match(regex);
  return match ? match[1] : '';
}

/**
 * 抓取 GitHub 仓库信息
 */
export async function fetchGitHub(url) {
  try {
    // 解析 GitHub URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('无效的 GitHub URL');
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');

    // 获取最新的 releases 或 commits
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
 * 抓取 Twitter（简化版本）
 */
export async function fetchTwitter(url) {
  // 注意：Twitter API 需要认证，这里提供一个简化的模拟
  console.log('Twitter 抓取需要 API 认证，当前为模拟数据');

  return {
    success: true,
    items: [
      {
        title: '示例 Twitter 内容',
        url: url,
        content: 'Twitter 抓取需要配置 API 密钥',
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
