# Clash 分类库

Clash / mihomo 格式配置文件，适配 **Clash Apple 原生客户端**（Hako 内核）。

## 配置特点

- **20 个策略组**（含图标，Qure Color 风格）
  - 5 个地区组（🇯🇵日本/🇭🇰香港/🇸🇬新加坡/🇺🇸美国/🌍其他）
  - 15 个服务组（Apple/AIGC/Telegram/Netflix/Disney+/YouTube/Spotify/TikTok/BiliBili/GlobalMedia/Microsoft/Game）
- **27 个规则集**（blackmatrix7 + 自建）
- **DNS 优化**：fake-ip-filter + nameserver-policy
- **规则排序**：广告 → 局域网 → AI → 苹果 → 微软 → Telegram → 游戏 → 流媒体 → 国内直连补充 → 境外兜底 → 国内四层防线
- 每个服务组都引入全部地区组，可按服务选地区

## 使用方法

1. 在 `proxies` 段添加你的节点
2. 启动 Clash 客户端，导入配置文件
