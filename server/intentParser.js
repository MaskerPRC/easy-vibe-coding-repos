// 意图解析器 - 将自然语言转换为安全DSL

export const intentParser = {
  /**
   * 解析自然语言文本，生成DSL
   * @param {string} text - 用户输入的自然语言
   * @returns {object} - {success: boolean, dsl?: object, error?: string}
   */
  parse(text) {
    const normalizedText = text.toLowerCase().trim();
    const changes = [];

    try {
      // 1. 检测主标题修改意图
      if (this.matchIntent(normalizedText, ['主标题', '标题', 'hero', 'title'])) {
        const titleMatch = this.extractText(text, ['改成', '改为', '修改成', '修改为', '换成', '变成', '设置为']);
        if (titleMatch) {
          changes.push({
            op: 'set_text',
            selector: '#hero-title',
            text: titleMatch
          });
        }
      }

      // 2. 检测副标题修改意图
      if (this.matchIntent(normalizedText, ['副标题', '子标题', 'subtitle', 'sub-title']) ||
          (this.matchIntent(normalizedText, ['描述', 'description']) && !this.matchIntent(normalizedText, ['主标题', '标题']))) {
        const subtitleMatch = this.extractText(text, ['改成', '改为', '修改成', '修改为', '换成', '变成', '设置为']);
        if (subtitleMatch) {
          changes.push({
            op: 'set_text',
            selector: '#sub-title',
            text: subtitleMatch
          });
        }
      }

      // 3. 检测主题色修改意图
      if (this.matchIntent(normalizedText, ['主题色', '主题颜色', '颜色', '色彩', 'color', 'theme'])) {
        let colorValue = null;

        // 检测蓝色
        if (this.matchIntent(normalizedText, ['蓝色', 'blue', '蓝'])) {
          colorValue = 'blue';
        }
        // 检测绿色
        else if (this.matchIntent(normalizedText, ['绿色', 'green', '绿'])) {
          colorValue = 'green';
        }
        // 检测琥珀色/橙色/黄色
        else if (this.matchIntent(normalizedText, ['琥珀', 'amber', '橙', 'orange', '黄', 'yellow'])) {
          colorValue = 'amber';
        }

        if (colorValue) {
          changes.push({
            op: 'set_style_var',
            selector: 'body',
            var: '--color-primary',
            value: colorValue
          });
        }
      }

      // 4. 检测促销条显示/隐藏意图
      if (this.matchIntent(normalizedText, ['促销', 'promo', 'banner', '横幅'])) {
        let enabled = null;

        // 检测隐藏意图
        if (this.matchIntent(normalizedText, ['隐藏', 'hide', '不显示', '关闭', '去掉', '删除'])) {
          enabled = false;
        }
        // 检测显示意图
        else if (this.matchIntent(normalizedText, ['显示', 'show', '展示', '打开', '开启'])) {
          enabled = true;
        }

        if (enabled !== null) {
          changes.push({
            op: 'toggle',
            selector: '.promo-banner',
            enabled: enabled
          });
        }
      }

      // 5. 如果没有识别到任何变更，返回错误
      if (changes.length === 0) {
        return {
          success: false,
          error: '无法识别您的需求。请尝试以下格式：\n1. 把主标题改成：xxx\n2. 把主题色改为绿色/蓝色/琥珀色\n3. 隐藏促销条/显示促销条'
        };
      }

      // 6. 构建DSL
      const dsl = {
        version: '0.1',
        changes: changes
      };

      return {
        success: true,
        dsl: dsl
      };

    } catch (error) {
      return {
        success: false,
        error: '解析过程中出现错误'
      };
    }
  },

  /**
   * 匹配意图关键词
   * @param {string} text - 归一化后的文本
   * @param {array} keywords - 关键词列表
   * @returns {boolean}
   */
  matchIntent(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  },

  /**
   * 提取文本内容（在特定关键词之后）
   * @param {string} text - 原始文本
   * @param {array} triggers - 触发关键词列表
   * @returns {string|null}
   */
  extractText(text, triggers) {
    for (const trigger of triggers) {
      const index = text.indexOf(trigger);
      if (index !== -1) {
        // 提取关键词后的文本
        let extracted = text.substring(index + trigger.length).trim();

        // 去除可能的标点符号
        extracted = extracted.replace(/^[:：\s]+/, '').trim();
        extracted = extracted.replace(/[。！？\.!\?]+$/, '').trim();

        // 去除引号
        extracted = extracted.replace(/^["'「『【]/, '').replace(/["'」』】]$/, '').trim();

        if (extracted && extracted.length > 0 && extracted.length <= 40) {
          return extracted;
        }
      }
    }
    return null;
  }
};
