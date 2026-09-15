# BewlyBewly Safari

这是 [BewlyBewly](https://github.com/BewlyBewly/BewlyBewly) 的独立 Safari Web Extension 工程。网页端源码保持与上游一致，Safari 宿主 App 和扩展 Target 位于 `Safari/`。

## 已做的 Safari 适配

- 使用 Apple Safari Web Extension Converter 生成 macOS 宿主 App 与扩展 Target。
- 将 Manifest V3 后台 Service Worker 转为 Safari 支持的后台脚本。
- 用 Web Accessible Resource 桥接页面脚本，替代 Safari 不支持的 `content_scripts[].world = "MAIN"`。
- 移除 Safari 不支持且非必要的 `persistent`、`match_about_blank` Manifest 字段。
- 配置本机开发团队和 `dev.eli.bewlybewly.safari` Bundle ID，可直接签名安装。

## 构建

环境要求：macOS 12.3 或更高版本、Safari 15.4 或更高版本、Xcode、Node.js，以及 Corepack 提供的 pnpm 9.5.0。

```sh
pnpm install --frozen-lockfile
pnpm build-safari
pnpm sync-safari
xcodebuild \
  -project "Safari/BewlyBewly Safari/BewlyBewly Safari.xcodeproj" \
  -scheme "BewlyBewly Safari" \
  -configuration Debug \
  -derivedDataPath build/DerivedData \
  CODE_SIGNING_ALLOWED=NO \
  build
```

## 安装

```sh
pnpm install-safari
```

安装脚本会重新生成扩展资源、以 Apple Development 证书构建并签名，然后安装到 `/Applications/BewlyBewly Safari.app`。

首次安装后，在 Safari 的 **设置 → 扩展** 中启用 **BewlyBewly Safari Extension**，并为 Bilibili 网站选择“始终允许”。

## 同步上游

本仓库的 `upstream` 远程指向原项目。合并上游更新后，重新运行 `pnpm install-safari` 即可刷新 Safari 版本。
