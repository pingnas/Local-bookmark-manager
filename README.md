# Local Bookmark Manager  | [Chinese](./README-zh.md)

**_A new-tab bookmark organizer and search_**

A browser extension focused on a clean new tab experience for managing and searching bookmarks.

> [chromewebstore](https://chromewebstore.google.com/detail/local-bookmark-manager/dlnccdfdalopgfbjbmgjlmehkjohpgng)

## Features

- **Bookmark Tree**: Clear tree structure for fast navigation
- **Drag & Drop**: Reorder bookmarks or move them between folders
- **Bookmark Search**: Keyword and pinyin matching
- **Quick Shortcuts**: One-click access to common browser pages
- **Background Image**: Auto Bing background with a local fallback
- **Search Engines**: Baidu, Google, or a custom search engine
- **Multilingual**: English, Simplified Chinese, Traditional Chinese

## Usage

### Basics

1. **After installation**:
   - Open a new tab to see the bookmark interface

2. **Bookmark management**:
   - The tree shows your bookmark structure
   - Right-click a bookmark or folder for rename, delete, new folder, and more
   - Drag items to reorder or move between folders

3. **Search**:
   - Type in the search box to find bookmarks
   - Press Ctrl+Enter to search the web with the selected engine

4. **Background**:
   - Bing image is fetched automatically
   - Fallback background is used if fetching fails

## Tech Stack

- **Frontend**: Vue 3 + TSX
- **UI**: @opentiny/vue
- **Build**: WXT (Web Extension Tools)
- **Storage**: Chrome Storage API + IndexedDB
- **Other**: Dexie.js, RxJS, Lodash

## Quick Start (Development)

Ensure Node.js 20+ and pnpm are installed.

```sh
# Install dependencies
pnpm i

# Run in development mode
pnpm run serve

# Build production version
pnpm run build

# Package as zip file (for extension stores)
pnpm run zip
```

## Browser Compatibility

- **Chrome/Chromium**: Fully supported
- **Firefox**: Some compatibility issues
- **Edge**: Theoretically compatible, not fully tested

## Contributing

Contributions are welcome:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Privacy Policy

This extension respects user privacy. All data is stored locally and not uploaded to any server. See the [Privacy Policy](/privacy-policy.md).

## License

[MIT](./LICENSE) © KineticSketch

## Star History

[![Star History Chart](https://api.star-history.com/image?repos=KineticSketch/Local-bookmark-manager&type=date&legend=top-left)](https://www.star-history.com/?repos=KineticSketch%2FLocal-bookmark-manager&type=date&legend=top-left)
