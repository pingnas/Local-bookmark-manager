# 本地书签管理器 | [English](./README.md)

**_新标签页里的书签整理与搜索_**

一款专注新标签页体验的浏览器扩展，帮助您更高效地管理与检索书签。

> [chromewebstore](https://chromewebstore.google.com/detail/local-bookmark-manager/dlnccdfdalopgfbjbmgjlmehkjohpgng)

## 功能特点

- **书签树展示**：清晰的树形结构，快速定位书签与文件夹
- **拖拽整理**：拖放调整书签位置或移动到其他文件夹
- **书签搜索**：支持关键词与拼音匹配搜索
- **快捷入口**：常用浏览器页面一键直达
- **背景图片**：自动获取 Bing 背景，失败时回退默认背景
- **搜索引擎**：支持百度、谷歌或自定义搜索引擎
- **多语言支持**：英文、简体中文、繁体中文

## 使用方法

### 基本操作

1. **安装扩展后**：
   - 打开浏览器新标签页即可看到书签界面

2. **书签管理**：
   - 书签树展示书签结构
   - 右键书签或文件夹可进行重命名、删除、新建文件夹等操作
   - 拖拽书签可调整顺序或移动到其他文件夹

3. **搜索功能**：
   - 在搜索框中输入关键词即可检索书签
   - 按 Ctrl+Enter 使用选定搜索引擎进行网页搜索

4. **背景显示**：
   - 自动拉取 Bing 背景
   - 拉取失败时使用默认背景

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

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 隐私政策

本扩展尊重用户隐私，所有数据均存储在本地，不会上传到任何服务器。详见[隐私政策](/privacy-policy-zh.md)。

## 许可证

[MIT](./LICENSE) © KineticSketch

## Star History

[![Star History Chart](https://api.star-history.com/image?repos=KineticSketch/Local-bookmark-manager&type=date&legend=top-left)](https://www.star-history.com/?repos=KineticSketch%2FLocal-bookmark-manager&type=date&legend=top-left)
