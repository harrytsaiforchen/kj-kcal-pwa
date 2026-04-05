# 中国大陆部署说明

这个项目是纯静态站点，不依赖 Node 服务端，最适合部署到对象存储静态网站。

推荐顺序：

1. 腾讯云 COS + 自定义域名
2. 阿里云 OSS + 自定义域名

## 推荐原因

### 腾讯云 COS

- 更贴近中国大陆访问场景
- 官方支持静态网站托管
- 可配自定义源站域名或 CDN 加速域名

## 需要上传的文件

直接上传当前目录中的这些文件到存储桶根目录：

- `index.html`
- `styles.css`
- `app.js`
- `sw.js`
- `manifest.webmanifest`
- `favicon.svg`
- `icon-192.png`
- `icon-512.png`
- `startup-1290x2796.png`
- `startup-1179x2556.png`
- `startup-1170x2532.png`
- `startup-1284x2778.png`
- `startup-1242x2688.png`
- `startup-828x1792.png`
- `startup-1125x2436.png`
- `startup-750x1334.png`
- `startup-640x1136.png`

## 腾讯云 COS 路线

1. 创建一个 COS 存储桶。
2. 把上面的文件全部上传到存储桶根目录。
3. 开启静态网站：
   - 索引文档：`index.html`
   - 错误文档：`index.html`
4. 绑定自定义域名，并将源站类型设为“静态网站源站”。
5. 在 DNS 中把域名 CNAME 到 COS 给出的目标地址。
6. 如需 HTTPS，给这个域名绑定证书。

## 阿里云 OSS 路线

1. 创建一个 OSS Bucket。
2. 把上面的文件全部上传到 Bucket 根目录。
3. 开启静态网站：
   - 首页：`index.html`
   - 404：`index.html`
   - 如果控制台支持 SPA 选项，直接按 SPA 静态网站配置。
4. 绑定自定义域名。
5. 在 DNS 中做 CNAME 解析。
6. 如需 HTTPS，给域名绑定证书。

## 重要注意

- 如果你把站点放在中国大陆地域，并且使用自定义域名，通常需要 ICP 备案。
- 这是一个前端路由友好的静态站，所以错误页回落到 `index.html` 更稳。
- `sw.js` 和 `manifest.webmanifest` 必须放根目录，路径不能改。

## 我下一步可以继续做什么

### 如果你选腾讯云

我可以继续帮你：

- 生成腾讯云专用的上传清单
- 检查域名路径和缓存策略
- 帮你把文件结构再收紧一版

### 如果你选阿里云

我可以继续帮你：

- 按 OSS 规则再检查一次静态网站配置
- 帮你确认自定义域名和 HTTPS 路径
- 给你补一版更贴近 OSS 控制台的步骤
