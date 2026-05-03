<div align="center">

# 📖 BookTrack

**扫书即记 · 离线优先 · 全渠道 OCR 录入**

[![GitHub Pages](https://img.shields.io/badge/demo-online-blue?logo=github)](https://WakuOOXX.github.io/book-tracker/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/WakuOOXX/book-tracker?style=social)](https://github.com/WakuOOXX/book-tracker)

</div>

---

## 📑 目录

- [✨ 概述](#✨-概述)
- [🏗 技术架构](#🏗-技术架构)
- [🚀 核心功能](#🚀-核心功能)
- [📊 数据模型](#📊-数据模型)
- [🛠 快速开始](#🛠-快速开始)
- [📱 Termux（Android）启动](#📱-termuxandroid启动)
- [📦 部署](#📦-部署)
- [📄 许可证](#📄-许可证)

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

## 📱 Termux（Android）启动

在安卓手机上通过 Termux 启动开发服务器，适合本地调试或离线开发。

### 前置条件

Termux 中需安装 Node.js：

```bash
pkg update && pkg upgrade -y
pkg install nodejs git -y
```

### 启动步骤

```bash
# 1. 克隆项目
git clone https://github.com/WakuOOXX/book-tracker.git
cd book-tracker

# 2. 安装依赖
npm install

# 3. 启动开发服务器（热点模式，局域网可访问）
npm run dev -- --host 0.0.0.0
```

启动后在浏览器打开 `http://localhost:5173` 即可访问。若同一 Wi-Fi 下的其他设备（如平板、电脑）需要访问，查看 Termux 中打印的 Network URL（形如 `http://192.168.x.x:5173`）。

### 生产模式（纯前端，无需 Node.js 运行）

```bash
# 生成 dist/ 目录
npm run build

# 用 serve 启动（需先安装）
npx serve dist

# 或用 Python（Termux 内置）
python3 -m http.server 8080 -d dist
```

浏览器打开 `http://localhost:8080` 访问。

### 注意事项

- Termux 在 Android 12+ 上可能被系统杀后台 → 开启 Termux 的「省电策略 - 不限制」
- 某些 ROM 需要开启「悬浮窗」/「后台弹出界面」权限保证常驻
- 建议使用 [Termux:Widget](https://wiki.termux.com/wiki/Termux:Widget) 配置一键启动脚本

## 📦 部署

纯前端应用,任意静态服务器均可托管:

| 平台 | 方式 |
|------|------|
| GitHub Pages | `npm run build`, 推送 `dist/` 到 `gh-pages` 分支 |
| Netlify     | 连接仓库,构建命令 `npm run build`,输出目录 `dist` |
| Vercel      | 连接仓库,自动识别 Vite 配置 |
| 任意静态服务器 | `cp -r dist/* /var/www/html/` |

## 📄 许可证

[GNU General Public License v3.0](LICENSE)
