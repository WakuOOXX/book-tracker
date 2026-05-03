# BookTrack -- 个人读书记录器

> 扫书即记,离线优先,全渠道 OCR 录入

[在线演示](https://WakuOOXX.github.io/book-tracker/)

## 概述

BookTrack 是一款面向重度读者的离线优先 PWA 应用,以"扫书即记"为核心理念,解决纸质书阅读场景下记录成本高、自动化程度低的问题。

## 技术架构

| 层        | 选型                                          |
|-----------|-----------------------------------------------|
| 渲染      | Vite + Tailwind CSS 3 + Vanilla JS            |
| 存储      | IndexedDB(idb 封装),双表结构(books + reading_logs) |
| 路由      | Hash-based SPA,自行实现(无框架依赖)              |
| OCR       | 阿里云 / 百度 OCR 双引擎,可切换                  |
| 图表      | Chart.js(年度趋势 + 分类占比)                    |
| 部署      | PWA 可安装 + Service Worker 离线缓存            |

全应用不依赖 React/Vue 等框架,核心逻辑约 1500 行纯 JS 实现。

## 核心功能

**1. 全渠道 OCR 录入**

支持拍照(后置摄像头)、相册批量多选、截图粘贴三种输入方式。自动调用 OCR API 提取书名、作者,通过内置分类算法(9 大类关键词匹配)自动打标签。一次拍照即可完成录入,省去手动输入。

**2. 多刷阅读追踪**

同一本书支持多次阅读记录(N 刷独立记录),每次阅读的进度、评分、笔记分别保存,支持回溯历史刷次。

**3. 多维统计**

年度阅读量统计、月度趋势(折线图)、分类占比(饼图)、阅读状态分布,数据驱动审视阅读习惯。

**4. 离线优先**

所有数据写入本地 IndexedDB,PWA 缓存全部静态资源。无 OCR 需求时可全程离线使用。

**5. 数据迁移**

JSON 导出 / 导入,支持覆盖和合并两种模式,方便备份或跨设备迁移。

## 数据模型

```
books:         id, title, author, isbn, category, status, rating, review, cover, totalPages, createdAt
reading_logs:  id, bookId, round, status, startDate, endDate, progress, rating, review, notes
```

## 快速开始

```bash
npm install
npm run dev                # 开发模式
npm run build && npx serve dist   # 生产部署(PWA)
```

纯前端应用,任意静态服务器均可托管,亦可部署至 GitHub Pages / Netlify / Vercel。
