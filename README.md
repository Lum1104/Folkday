<p align="center">
  <img src="assets/folkday_icon.png" alt="节知 Folkday" width="100" height="100" />
</p>

<h1 align="center">节知 Folkday</h1>

<p align="center">
  <strong>让年轻人不再错过家乡的每一个传统节日</strong>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License" /></a>
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/React%20Native-0.84-61dafb.svg?logo=react" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178c6.svg?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/festivals-196-orange.svg" alt="Festivals" />
</p>

---

节知是一款专注于华南地方传统节日的开源 App。项目收录了潮汕、闽南、广府、客家四大地区共 **196 个节日**的完整民俗数据——涵盖时年八节、神明诞辰、节气习俗等，这在现有应用中几乎没有先例。App 提供公历/农历双历显示、习俗详情和分级提醒，帮助用户轻松了解和传承家乡的民俗文化。

## 功能特性

- **双历显示** — 公历与农历同屏展示，节气标注一目了然
- **四大地区** — 内置潮汕、闽南、广府、客家完整民俗数据
- **196 个节日** — 涵盖时年八节、神明诞辰、地方特有民俗等
- **习俗详情** — 每个节日附带具体习俗说明、所需物品清单和时间要求
- **节日提醒** — 按重要程度分级提醒，支持自定义提前天数
- **地区筛选** — 自由选择关注的地区，只看你关心的节日
- **节日倒计时** — 距离下一个节日还有几天，心中有数

## 效果展示

| 日历主页 | 节日详情 | 习俗展开 |
|:---:|:---:|:---:|
| ![日历主页](assets/screenshot-calendar.png) | ![节日详情](assets/screenshot-detail.png) | ![习俗展开](assets/screenshot-customs.png) |

| 地区筛选 | 客家地区 | 提醒设置 |
|:---:|:---:|:---:|
| ![地区筛选](assets/screenshot-regions.png) | ![客家地区](assets/screenshot-regions-kejia.png) | ![提醒设置](assets/screenshot-reminders.png) |

## 支持地区

| 地区 | 覆盖范围 | 节日数量 |
|------|----------|----------|
| 🔴 潮汕 | 潮州、汕头、揭阳及周边地区 | 41 |
| 🟠 闽南 | 厦门、泉州、漳州等福建南部地区 | 66 |
| 🟡 广府 | 广州、佛山、顺德等珠三角粤语区 | 44 |
| 🟢 客家 | 梅州、河源、惠州、龙岩、赣州等客家聚居区 | 45 |

## 快速开始

### 前置要求

- Node >= 22.11.0
- Ruby >= 2.6.10（iOS 构建需要）
- Xcode（iOS）/ Android SDK（Android）

### 安装与运行

```bash
git clone https://github.com/Lum1104/Folkday.git
cd Folkday
npm install
```

**iOS：**

```bash
cd ios && bundle exec pod install && cd ..
npm run ios
```

**Android：**

```bash
npm run android
```

## 技术栈

| 用途 | 技术选型 |
|------|----------|
| 框架 | React Native 0.84 (bare workflow) |
| 语言 | TypeScript 5.8 |
| 农历转换 | [lunar-typescript](https://github.com/6tail/lunar-typescript) |
| 日历 UI | react-native-calendars + 自定义 Day 组件 |
| 导航 | @react-navigation/native (Tab + Stack) |
| 状态管理 | React Context + useReducer |
| 本地存储 | @react-native-async-storage/async-storage |
| 本地通知 | react-native-push-notification |

## 参与贡献

欢迎任何形式的贡献！无论是补充节日数据、修复 Bug、改进功能还是完善文档，都非常有价值。

请阅读 [贡献指南 (CONTRIBUTING.md)](CONTRIBUTING.md) 了解开发环境搭建、数据格式和提交流程。

## 联系

如有问题或建议，欢迎通过 [GitHub Issues](https://github.com/Lum1104/Folkday/issues) 或邮件 lin.yuxiang.contact@gmail.com 联系。

## 许可证

本项目基于 [AGPL-3.0](LICENSE) 许可证开源。
