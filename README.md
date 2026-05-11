# Smart Edu UI

智能教育系统前端项目，为 AI 教育问答后端（[smart_edu](https://github.com/zs2731070169-web/smart_edu)）提供 Web 界面。

## 项目特性 Features

- 支持自然语言提问与流式结果展示
- 简洁清晰的用户体验，适配多端
- 前后端分离，API 默认对接 `/smart/edu/chat`
- 各类会话历史与基本权限支持（如有）

## 快速开始

1. 克隆本仓库

   ```bash
   git clone https://github.com/zs2731070169-web/smart_edu_ui.git
   cd smart_edu_ui
   ```

2. 安装依赖

   ```bash
   npm install
   # 或 yarn install
   ```

3. 启动开发服务器

   ```bash
   npm run dev
   # 或 yarn dev
   ```

4. 构建产物（发布部署）

   ```bash
   npm run build
   # 或 yarn build
   ```

5. 配置

   - 后端 API 地址可在 `.env` 或配置文件中指定。

## 目录结构（示例）

```
src/
  components/      # 通用组件
  pages/           # 页面
  api/             # 后端 API 封装
  assets/          # 静态资源
  styles/          # 样式文件
  main.js/ts       # 项目入口
```

## 相关项目

- [smart_edu](https://github.com/zs2731070169-web/smart_edu) 后端项目

## 开发&贡献

欢迎通过 issue、PR 共建完善！

## 许可证 License

本项目采用 MIT License - 详见 [LICENSE](LICENSE)
