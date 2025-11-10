#!/bin/bash

# PHP 安装脚本
# 适用于 OpenClound OS 9 / CentOS / Red Hat 系统

echo "======================================"
echo "  PHP 安装脚本"
echo "======================================"
echo ""

# 检查是否已安装 PHP
if command -v php &> /dev/null; then
    echo "✓ PHP 已安装"
    php -v
    exit 0
fi

echo "开始安装 PHP..."
echo ""

# 更新包列表
echo "1. 更新包列表..."
yum update -y

# 安装 PHP
echo ""
echo "2. 安装 PHP 和 PHP CLI..."
yum install -y php php-cli php-common php-json php-mbstring

# 验证安装
echo ""
echo "3. 验证安装..."
if command -v php &> /dev/null; then
    echo ""
    echo "✓ PHP 安装成功！"
    echo ""
    php -v
    echo ""
    echo "======================================"
    echo "安装完成！请刷新浏览器页面。"
    echo "======================================"
else
    echo ""
    echo "✗ PHP 安装失败"
    echo "请尝试手动执行以下命令："
    echo "  yum update -y"
    echo "  yum install -y php php-cli"
    echo "======================================"
    exit 1
fi
