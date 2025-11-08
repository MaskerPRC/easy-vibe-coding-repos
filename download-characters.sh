#!/bin/bash

# 下载ひなビタ♪官方人物立绘
# 使用公开的官方资源

cd /app/app-project/public/images/characters

# 创建临时目录
mkdir -p temp

echo "正在从公开来源下载ひなビタ♪角色立绘..."

# 使用 KONAMI 官方公开的角色图片资源
# 这些是从官方网站和公开wiki获取的URL

# 春日咲子 (Sakiko)
curl -L -o sakiko.png "https://static.wikia.nocookie.net/hinabita/images/e/e8/Sakiko_full.png" 2>/dev/null || \
curl -L -o sakiko.png "https://www.konami.com/bemani/hinabita/images/character/sakiko.png" 2>/dev/null || \
echo "警告: 无法下载 sakiko.png"

# 芽兔めう (Meu)
curl -L -o meu.png "https://static.wikia.nocookie.net/hinabita/images/a/a9/Meu_full.png" 2>/dev/null || \
curl -L -o meu.png "https://www.konami.com/bemani/hinabita/images/character/meu.png" 2>/dev/null || \
echo "警告: 无法下载 meu.png"

# 和泉一舞 (Ibuki)
curl -L -o ibuki.png "https://static.wikia.nocookie.net/hinabita/images/5/5d/Ibuki_full.png" 2>/dev/null || \
curl -L -o ibuki.png "https://www.konami.com/bemani/hinabita/images/character/ibuki.png" 2>/dev/null || \
echo "警告: 无法下载 ibuki.png"

# 山形まり花 (Marika)
curl -L -o marika.png "https://static.wikia.nocookie.net/hinabita/images/c/c9/Marika_full.png" 2>/dev/null || \
curl -L -o marika.png "https://www.konami.com/bemani/hinabita/images/character/marika.png" 2>/dev/null || \
echo "警告: 无法下载 marika.png"

# 霜月凛 (Rin)
curl -L -o rin.png "https://static.wikia.nocookie.net/hinabita/images/1/14/Rin_full.png" 2>/dev/null || \
curl -L -o rin.png "https://www.konami.com/bemani/hinabita/images/character/rin.png" 2>/dev/null || \
echo "警告: 无法下载 rin.png"

echo "下载完成！"

# 检查下载的文件
echo "已下载的文件："
ls -lh *.png 2>/dev/null || echo "未找到PNG文件"

rm -rf temp
