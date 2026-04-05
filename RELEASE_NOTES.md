# Release Notes

## Current Release

这次版本主要完成了两类工作：一类是首页产品形态的升级，一类是 PWA、无障碍和兼容性的修正。

### UI and product updates

- 把首页原本分开的 `Live Label` 和换算面板合并成一个主交互板块
- 顶部“包装标签”区域改成真正可输入的 `kJ / kcal` 双向换算器
- 保留并整合了滑杆、快捷值、区间提示和最近使用入口
- 视觉方向继续保持“营养标签 + 仪表盘 + 纸张质感”的风格

### PWA and reliability fixes

- 调整 `service worker` 缓存策略，避免旧缓存长期顶住新版首页
- 非导航请求失败时不再错误回退到 `index.html`
- `install` 阶段不再吞掉预缓存失败
- 每次修改 `sw.js` 后同步提升 `CACHE_NAME`

### Accessibility and compatibility fixes

- 为滑杆补充 `aria-label`、`aria-valuenow`、`aria-valuemin`、`aria-valuemax`
- 输入框补上 `placeholder="0"`
- 防止 number 输入框在 focus 时被滚轮误改数值
- 拆分 PWA icon 的 `purpose: any` 与 `purpose: maskable`
- 为不支持 `@property` 的浏览器补了圆环动画 fallback
- 修正 iPadOS 的 Safari 检测逻辑
- 清理未使用变量等小型死代码

## Production URL

- [https://kj-kcal-pwa.vercel.app](https://kj-kcal-pwa.vercel.app)

## Git commit

- `97a7984 Refine PWA UX, accessibility, and cache behavior`
