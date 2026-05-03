<div align="center">

# 📖 BookTrack

**扫书即记 · 离线优先 · 全渠道 OCR 录入**

[![GitHub Pages](https://img.shields.io/badge/demo-online-blue?logo=github)](https://WakuOOXX.github.io/book-tracker/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/WakuOOXX/book-tracker?style=social)](https://github.com/WakuOOXX/book-tracker)

</div>

---

## ✨ 概述

BookTrack 是一款面向重度读者的离线优先 PWA 应用,以"扫书即记"为核心理念,解决纸质书阅读场景下记录成本高、自动化程度低的问题。

👉 **[在线演示](https://WakuOOXX.github.io/book-tracker/)**

## 🏗 技术架构

| 层        | 选型                                          |
|-----------|-----------------------------------------------|
| 渲染      | Vite + Tailwind CSS 3 + Vanilla JS            |
| 存储      | IndexedDB(idb 封装),双表结构(books + reading_logs) |
| 路由      | Hash-based SPA,自行实现(无框架依赖)              |
| OCR       | 阿里云 / 百度 OCR 双引擎,可切换                  |
| 图表      | Chart.js(年度趋势 + 分类占比)                    |
| 部署      | PWA 可安装 + Service Worker 离线缓存            |

## 🚀 核心功能

### 1. 全渠道 OCR 录入

支持拍照(后置摄像头)、相册批量多选、截图粘贴三种输入方式。自动调用 OCR API 提取书名、作者,通过内置分类算法(9 大类关键词匹配)自动打标签。一次拍照即可完成录入。

### 2. 多刷阅读追踪

同一本书支持多次阅读记录(N 刷独立记录),每次阅读的进度、评分、笔记分别保存,支持回溯历史刷次。

### 3. 多维统计

- 年度阅读量统计
- 月度趋势折线图
- 分类占比饼图
- 阅读状态分布

### 4. 离线优先

所有数据写入本地 IndexedDB,PWA 缓存全部静态资源。无 OCR 需求时可全程离线使用。

### 5. 数据迁移

JSON 导出 / 导入,支持覆盖和合并两种模式,方便备份或跨设备迁移。

## 📊 数据模型

```
books:          id, title, author, isbn, category, status, rating, review, cover, totalPages, createdAt
reading_logs:   id, bookId, round, status, startDate, endDate, progress, rating, review, notes
```

## 🛠 快速开始

```bash
git clone https://github.com/WakuOOXX/book-tracker.git
cd book-tracker
npm install
npm run dev                # 开发模式(http://localhost:5173)
npm run build && npx serve dist   # 生产部署(PWA)
```

## 📦 部署

纯前端应用,任意静态服务器均可托管:

| 平台 | 方式 |
|------|------|
| GitHub Pages | `npm run build`, 推送 `dist/` 到 `gh-pages` 分支 |
| Netlify     | 连接仓库,构建命令 `npm run build`,输出目录 `dist` |
| Vercel      | 连接仓库,自动识别 Vite 配置 |
| 任意静态服务器 | `cp -r dist/* /var/www/html/` |

## 📄 许可证

[MIT](LICENSE)
