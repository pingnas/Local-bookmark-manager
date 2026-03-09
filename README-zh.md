# 本地书签管理器 | [English](./README.md)

**_更好地管理您的浏览器书签_**

一个功能强大的浏览器扩展，帮助您高效管理书签、历史记录和标签组。

> [chromewebstore](https://chromewebstore.google.com/detail/local-bookmark-manager/dlnccdfdalopgfbjbmgjlmehkjohpgng) 

## 功能特点

- **书签管理**：直观的树形结构展示，轻松组织和访问您的书签
- **历史记录管理**：快速查找和整理您的浏览历史
- **标签组管理**：高效管理和切换标签组
- **自定义背景**：支持本地上传和网络图片/视频作为背景
- **配置导出/导入**：轻松备份和恢复您的所有设置
- **多语言支持**：支持英文、简体中文和繁体中文
- **全局搜索**：快速搜索书签和历史记录

<!-- ## 截图展示 -->

<!-- ![alt text](img/README/1.gif) -->

## 使用方法

### 基本操作

1. **安装扩展后**：
   - 点击浏览器工具栏中的扩展图标打开弹出窗口
   - 新标签页将显示您的书签管理界面

2. **书签管理**：
   - 左侧和右侧面板显示书签树形结构
   - 中间区域显示快捷方式和搜索功能
   - 右键点击书签或文件夹可以进行更多操作（重命名、删除等）
   - 拖放书签可以调整位置或移动到不同文件夹

3. **搜索功能**：
   - 在搜索框中输入关键词可以搜索书签和历史记录
   - 按 Ctrl+Enter 可以直接进行网页搜索

4. **背景设置**：
   - 点击弹出窗口中的"更新背景"按钮
   - 可以选择默认背景、上传本地图片或使用网络图片/视频

### 高级功能

1. **配置管理**：
   - **导出配置**：保存您的所有设置到本地文件
   - **导入配置**：从之前导出的文件恢复设置
   - **清除配置**：重置所有设置到默认状态

2. **历史书签管理**：
   - 点击"历史书签管理"可以查看和管理历史记录
   - 支持添加、打开、导入和导出历史书签组

3. **自定义设置**：
   - 可以设置默认搜索引擎（百度、谷歌或自定义）
   - 调整书签拖拽行为
   - 启用/禁用默认右键菜单

## 技术栈

- **前端框架**：Vue 3 + TSX
- **UI组件**：@opentiny/vue
- **构建工具**：WXT (Web Extension Tools)
- **数据存储**：Chrome Storage API + IndexedDB
- **其他技术**：Dexie.js, RxJS, Lodash

## 快速开始（开发）

确保您已安装 Node.js 20+ 和 pnpm。

```sh
# 安装依赖
pnpm i

# 开发模式运行
pnpm run serve

# 构建生产版本
pnpm run build

# 打包为 zip 文件（用于上传到扩展商店）
pnpm run zip
```

## 浏览器兼容性

- **Chrome/Chromium**：完全支持
- **Firefox**：存在部分兼容性问题
- **Edge**：理论上兼容，尚未完全测试

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！请通过以下方式参与：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 隐私政策

本扩展尊重用户隐私，所有数据均存储在本地，不会上传到任何服务器。详细信息请查看[隐私政策](/privacy-policy-zh.md)。

## 许可证

[MIT](./LICENSE) © pingnas


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=pingnas/Local-bookmark-manager&type=Date)](https://www.star-history.com/#pingnas/Local-bookmark-manager&Date)