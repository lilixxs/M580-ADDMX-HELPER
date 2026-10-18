# 版权与第三方说明 / Third-party notices

## 项目代码来源 / Project provenance

本项目从用户提供的 `index.html` 和 `claude_code_light_ui_style_guide.md` 初始化。用户同时提供了由 Kimi 对话导出的历史说明。原 HTML 未包含作者版权头或独立许可证。我们没有删除原文件中的版权声明，也无法仅凭该文件核实全部上游权利。

The project starts from the supplied `index.html` and style guide. The user also supplied history exported from Kimi conversations. The original HTML contained no author copyright header or separate license. We removed no original copyright notice. The file alone does not establish all upstream rights.

`LICENSE` 将项目自有代码按 MIT 授权。该授权不覆盖第三方拥有的商标、手册、截图或其他材料。若补充材料包含原作者声明，必须保留该声明，并在此记录来源。原始 DOCX 与临时图片不纳入公开仓库，也不发布到 Pages。

`LICENSE` applies MIT to project-owned code. It does not license third-party trademarks, manuals, screenshots, or other materials. Preserve author notices in later additions. Record their sources here. The public repository and Pages site exclude the source DOCX and temporary images.

## Tailwind CSS 4.3.3 — MIT

来源 / Source: <https://github.com/tailwindlabs/tailwindcss/tree/v4.3.3>

原页面运行时加载 Tailwind CDN。当前页面内嵌构建后的样式，不再请求 CDN。为便于单文件分发，页面样式块内也保留以下完整声明。

The original page loaded Tailwind from a CDN. The current page embeds generated CSS. It also embeds the complete notice below for single-file distribution.

```text
MIT License

Copyright (c) Tailwind Labs, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 构建与测试依赖 / Build and test dependencies

- PostCSS 8.5.30：MIT。版权 / Copyright 2013 Andrey Sitnik <andrey@sitnik.es>。来源 / Source: <https://github.com/postcss/postcss>。
- @tailwindcss/postcss 4.3.3：MIT。版权 / Copyright Tailwind Labs, Inc.。来源 / Source: <https://github.com/tailwindlabs/tailwindcss>。
- Playwright Test 1.64.1：Apache-2.0。来源 / Source: <https://github.com/microsoft/playwright>。
- Chromium 由 Playwright 单独安装。其自身及第三方组件保留各自许可证。
- Playwright installs Chromium separately. Its components retain their own licenses.

这些依赖仅用于开发、构建或测试。Pages 不分发这些包或浏览器二进制。`package-lock.json` 固定传递依赖。安装后的包目录包含各包许可证。若分发依赖或浏览器二进制，需一并保留其许可证和适用的 NOTICE 文件。

These dependencies serve development, builds, or tests. Pages does not distribute their packages or browser binaries. `package-lock.json` locks transitive dependencies. Installed packages contain their licenses. Preserve applicable licenses and NOTICE files when distributing dependencies or browser binaries.

## 产品名称 / Product names

Schneider Electric、Modicon、EcoStruxure、Control Expert、Modbus、EtherNet/IP 等名称属于各自权利人。本项目仅使用这些名称描述兼容目标。本项目不是 Schneider Electric 官方产品。

Schneider Electric, Modicon, EcoStruxure, Control Expert, Modbus, and EtherNet/IP names belong to their respective owners. This project uses the names to identify compatibility targets. It is not an official Schneider Electric product.
