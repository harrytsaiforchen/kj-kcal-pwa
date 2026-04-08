# 千焦 / 卡路里自由转换

一个面向手机使用场景的轻量 PWA，用来做 `kJ` 和 `kcal` 的双向自由换算。它可以直接在网页打开，也可以添加到 iPhone 主屏幕，作为一个随手打开的小工具使用。

这个项目不是传统“只给一个输入框”的换算器，而是把换算、食品标签阅读、能量区间感知和每日热量收支放到同一个首页里，让用户在看包装时更容易把 `kJ` 翻译成更直觉的 `kcal`，也能顺手记录当天摄入与热量缺口。

## 在线地址

- 生产地址：[https://kj-kcal-pwa.vercel.app](https://kj-kcal-pwa.vercel.app)
- 中国大陆部署说明：[DEPLOY_CN.md](./DEPLOY_CN.md)

## 当前版本能做什么

- 双向输入：输入 `kJ` 或 `kcal`，另一边实时联动
- 顶部首页交互板：把换算器做成可输入的“包装标签”样式
- 可视化能量尺：拖动滑杆，快速感知轻食、主餐和高能量区间
- 包装模式：把食品标签上的 `kJ` 翻译成更容易脑内判断的 `kcal`
- 今日摄入合计：支持添加多条能量条目，并自动汇总成总 `kcal / kJ`
- 每日代谢估算：按 `Mifflin-St Jeor` 公式估算 `BMR` 和 `TDEE`
- 热量缺口显示：自动用 `TDEE - 今日摄入` 算出当天热量缺口或盈余
- 最近使用：本地保存最近换算值
- PWA 支持：可安装到 iPhone 主屏幕，支持离线首屏资源
- 无障碍与兼容性修正：补充滑杆语义、输入占位、滚轮误触防护、iPadOS Safari 检测与缓存更新策略

## 适合的使用场景

- 看食品包装时只写了 `kJ`，想快速知道大概是多少 `kcal`
- 想判断某个数值更像零食、轻食还是一顿正餐
- 想把早餐、午餐、零食的热量加总，快速知道今天已经吃了多少
- 想估算自己的基础代谢和总消耗，并直接看到今日热量缺口
- 想把工具放到 iPhone 主屏幕，随时点开直接换算

## 换算公式

```text
1 kcal = 4.184 kJ
1 kJ ≈ 0.239 kcal
```

## 设计方向

这版视觉故意不走通用 SaaS 风格，而是更偏：

- 食品包装标签感
- 票据式信息层次
- 仪表盘式能量反馈
- 暖色纸张质感和高对比数字排版

目标是让它更像“口袋小工具”，而不是普通网页计算器。

## 技术实现

- 纯静态站点
- 纯 `HTML + CSS + vanilla JavaScript`
- 不依赖前端框架
- 数据全部保存在浏览器本地，不依赖后端
- 使用 `manifest.webmanifest` 和 `sw.js` 提供 PWA 能力

## 主要文件

```text
.
├── index.html
├── styles.css
├── app.js
├── sw.js
├── manifest.webmanifest
├── favicon.svg
├── icon-192.png
├── icon-512.png
├── startup-*.png
├── assets/
│   └── startup-screen.svg
├── DEPLOY_CN.md
└── RELEASE_NOTES.md
```

## 本地运行

项目是纯静态站点，不需要构建步骤。

```bash
cd /Users/harrytsai/Documents/codex/kj-kcal-pwa
python3 -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173/
```

## iPhone 主屏幕安装

1. 用 Safari 打开生产地址。
2. 点击“分享”。
3. 选择“添加到主屏幕”。
4. 从主屏幕图标打开。

如果之前安装过旧版本，建议先删除旧图标，再重新添加一次，确保新的缓存、图标和启动页生效。

## 生产状态

当前仓库中的核心静态文件会发布到同一个生产地址：

- `index.html`
- `styles.css`
- `app.js`
- `sw.js`
- `manifest.webmanifest`

本次整理时，已核对过线上版本与本地当前代码在这些核心文件上的内容一致。

当前生产版本已包含：

- 首页包装标签式换算器
- 今日摄入相加模块
- 每日代谢与热量缺口模块

## 部署建议

临时预览：

- Vercel

中国大陆长期使用：

- 腾讯云 COS 静态网站
- 阿里云 OSS 静态网站

详细步骤见 [DEPLOY_CN.md](./DEPLOY_CN.md)。

## 仓库协作

当前仓库已经配置好 `origin` 和 `main -> origin/main` 跟踪关系，后续可以直接使用标准 git 流程：

```bash
git add .
git commit -m "your message"
git push
```

## 版本说明

最近一次整理重点见 [RELEASE_NOTES.md](./RELEASE_NOTES.md)。
