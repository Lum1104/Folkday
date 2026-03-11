# 贡献指南

感谢你对节知 (Folkday) 的关注！我们欢迎任何形式的贡献，包括提交节日数据、修复 Bug、改进功能或完善文档。

## 开发环境搭建

### 前置要求

- Node >= 22.11.0
- Ruby >= 2.6.10（iOS 构建需要）
- Xcode（iOS 开发）
- Android SDK（Android 开发）

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/Lum1104/Folkday.git
cd Folkday

# 安装依赖
npm install

# iOS 需要额外安装 CocoaPods 依赖
cd ios && bundle exec pod install && cd ..

# 启动 Metro bundler
npm start

# 运行到 iOS 模拟器
npm run ios

# 运行到 Android 模拟器
npm run android
```

## 贡献节日数据

节日数据存放在 `src/data/regions/` 目录下，按地区分为四个 JSON 文件：

- `chaoshan.json` — 潮汕
- `minnan.json` — 闽南
- `guangfu.json` — 广府
- `kejia.json` — 客家

每个节日条目的结构如下：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识，格式如 `chaoshan_spring_festival` |
| `name` | string | 节日名称 |
| `region` | string | 所属地区：`chaoshan` / `minnan` / `guangfu` / `kejia` |
| `calendarType` | string | 日期类型：`lunar`（农历）/ `solar`（公历）/ `solarTerm`（节气） |
| `date` | string | 日期，格式取决于 calendarType |
| `importance` | string | 重要程度：`high` / `medium` / `low` |
| `description` | string | 节日简介 |
| `customs` | array | 相关习俗列表 |
| `tags` | array | 标签 |

如果你熟悉某个地区的传统节日，欢迎补充新的节日条目或完善现有条目的习俗描述。

## 提交 Issue

- 使用 GitHub Issues 报告 Bug 或提出功能建议
- 提交 Bug 时请尽量提供：运行环境、复现步骤、期望行为与实际行为
- 提交功能建议时请简要描述使用场景

## 提交 Pull Request

1. Fork 本仓库并创建你的分支（从 `main` 分支创建）
2. 进行修改并确保通过检查：
   ```bash
   npm run lint    # 代码风格检查
   npm test        # 运行测试
   ```
3. 提交 PR 并简要描述你的更改内容

## 代码规范

- 使用 TypeScript 编写代码
- 运行 `npm run lint` 确保代码风格一致
- 路径别名：`@/*` 映射到 `src/*`
- 测试文件放在对应源文件旁的 `__tests__/` 目录中

## 行为准则

请以友善、包容的态度参与社区交流。我们致力于维护一个开放、互相尊重的协作环境。
