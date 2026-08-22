# Clash 分类库

Clash / mihomo 格式规则集与配置文件，适配 **Clash Apple 原生客户端**（Hako 内核）。

## 目录结构

```
├── config/
│   └── clash-config.yaml      # 完整 Clash 配置（22个规则集 + 15个策略组）
├── ruleset/
│   ├── Advertising_Supplement.yaml  # 广告拦截补充（14 rules）
│   ├── AppleIntelligence.yaml       # Apple AI 走代理（3 rules）
│   ├── Direct_Supplement.yaml       # 补充国内直连（78 rules）
│   ├── Telegram_All.yaml            # Telegram 完整规则集（45 rules）
│   └── ASN_China.yaml               # 中国 ASN 直连（5076 rules）
└── README.md
```

## 规则集来源

| 文件 | 来源 | 说明 |
|------|------|------|
| Advertising_Supplement | [mickeu/surge](https://github.com/mickeu/surge) | blackmatrix7 广告规则集漏覆盖补充 |
| AppleIntelligence | [mickeu/surge](https://github.com/mickeu/surge) | Apple Intelligence 域名，需走代理 |
| Direct_Supplement | [mickeu/surge](https://github.com/mickeu/surge) | 国内业务域名直连补充 |
| Telegram_All | [mickeu/surge](https://github.com/mickeu/surge) | 合并 blackmatrix7 + VirgilClyne + CDN 补充 |
| ASN_China | [VirgilClyne/GetSomeFries](https://github.com/VirgilClyne/GetSomeFries) | 中国 ASN 直连（5076 条自治域） |

其余规则集直接引用 [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) 的 Clash 版 `.yaml` 文件。

## 配置特点

- **22 个规则集**：广告/劫持/隐私/苹果/AI(OpenAI/Claude/Gemini)/微软/游戏/暴雪/YouTube/Netflix/Disney/Spotify/TikTok/BiliBili/国内外媒体/Telegram/境外综合/ChinaMax/局域网
- **15 个策略组**：PROXY/自动选择/Apple/AIGC/Telegram/Netflix/Disney+/YouTube/Spotify/TikTok/BiliBili/GlobalMedia/Microsoft/Game
- **DNS 优化**：fake-ip-filter + nameserver-policy（Apple CDN 和 STUN 域名专用国内 DNS）
- **Apple 测速修复**：`mensura.cdn-apple.com` / `aaplimg.com` 直连 + nameserver-policy
- **STUN 修复**：`voipgate.com` 走代理（节点 UDP 转发绕开本地屏蔽）

## 格式说明

- Clash 规则集使用 `payload` 格式（YAML）
- 由 Surge `.list` 格式自动转换
- `behavior: domain` 用于域名规则，`behavior: ipcidr` 用于 IP 规则
