# AI 输出可信度检查 Demo

一个面向 AI 产品经理作品集展示的单页交互 Demo，用于帮助用户识别 AI 回答中的事实、推断与待确认内容，降低模型无依据扩展风险。

## 在线 Demo

- 在线体验：https://ai-output-credibility-demo.vercel.app
- GitHub：https://github.com/MOCCMO/ai-output-credibility-demo

## 项目背景

本项目基于 **15 组任务、45 条模型回答和 10 条无依据扩展 badcase** 推导，用于展示从模型评测发现、风险归因到产品功能设计的完整链路。

在简历优化、研究设计和用户反馈洞察等场景中，模型可能补写用户未提供的成果、数据来源、执行条件或量化指标。Demo 通过事实边界拆分、分层输出与 badcase 反馈，让信息依据和使用风险更清晰。

当前版本仅使用静态示例模拟 AI 分析流程，不接入后端或真实模型 API，也不需要 API token。

## 功能模块

- **场景输入**：支持简历优化、研究设计、用户反馈洞察三类预设场景，并允许编辑输入内容。
- **风险识别**：根据当前场景展示风险等级、信息缺口和潜在用户风险。
- **事实边界拆分**：将输出依据区分为已提供信息、合理推断和需用户确认。
- **保守 / 进阶输出**：默认给出低风险保守版，用户可主动展开进阶方案。
- **AI 建议改写**：按场景展示静态改写示例，并标注信息来源与使用边界。
- **badcase 反馈**：支持选择无依据扩展、回答过泛、解释不足和格式不稳定等标签。

## 技术栈

- React 18
- Vite 8
- Tailwind CSS 3
- 静态本地数据，无后端、无真实 API

## 作品集说明

该 Demo 重点展示 AI 产品经理从评测证据到产品方案的转化能力：

- 从 15 组任务和 45 条模型回答中定位“无依据扩展”高频 badcase。
- 将错误问题归因到用户风险，设计事实边界拆分、保守 / 进阶输出和标签反馈机制。
- 用高风险识别触发率、保守版选择率和 badcase 反馈提交率构建后续迭代闭环。
- 通过可交互前端原型呈现产品逻辑、信息层级和风险边界，而非仅停留在 PRD 描述。

## 本地运行

环境要求：Node.js 20.19+ 或 22.12+。

```bash
cd ai-output-credibility-demo
npm install
npm run dev
```

开发服务器默认访问地址通常为：`http://localhost:5173`。

## 构建与预览

```bash
npm run build
npm run preview
```

生产构建输出目录为 `dist/`。

## 部署到 Vercel

推荐使用 Git 仓库连接方式：

1. 将项目提交并推送到 GitHub、GitLab 或 Bitbucket。
2. 登录 Vercel，在 Dashboard 中选择 **Add New → Project**。
3. 导入对应 Git 仓库。
4. 如果项目位于仓库根目录，保持默认 Root Directory；如果位于子目录，则选择对应目录。
5. 确认 Framework Preset 为 **Vite**。通常 Vercel 会自动识别；如需手动设置：
   - Build Command：`npm run build`
   - Output Directory：`dist`
   - Install Command：`npm install`
6. 本项目不需要配置环境变量或 API token。
7. 点击 **Deploy**。连接 Git 后，后续分支推送会生成预览部署，生产分支更新会触发生产部署。

## 项目结构

```text
ai-output-credibility-demo/
├── src/
│   ├── App.jsx          # 页面内容、静态数据与交互逻辑
│   ├── index.css        # Tailwind 指令与全局样式
│   └── main.jsx         # React 入口
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json         # Vercel 的 Vite 构建与输出配置
├── package.json
└── README.md
```
