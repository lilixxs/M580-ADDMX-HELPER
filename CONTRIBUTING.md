# 贡献指南

[English](CONTRIBUTING.en.md)

## 开始修改

1. 阅读 README 中的“当前限制”。
2. 从最新 main 创建任务分支。
3. 安装锁定版本的依赖。

```sh
git switch main
git pull --ff-only
git switch -c feature/short-task-name
npm ci
npx playwright install chromium
```

不要提交凭据、原始对话文档、`node_modules/` 或临时截图。不要强制推送 main。

## 修改范围

- 保持 `index.html` 可离线运行。
- 按风格指南使用直角控件、暖色背景和陶土橙强调色。
- 保留 SVG 蓝色链路和红色寻址标注的含义。
- 不要手动修改 `<style id="utilities">` 中的生成代码。
- 将用户输入作为文本渲染。不要直接把输入插入 `innerHTML`。
- 修改寻址规则或功能块模板时，附上官方手册链接、文档版本和相关页码。
- 区分示意图、浏览器测试、Control Expert 编译与 PLC 实机测试。

功能码、TYP、GEST、RECP 或数量范围变更必须有独立回归用例。不要用当前页面输出作为协议正确性的唯一证据。

## 检测

```sh
npm run build:css
npm run check
npm test
git diff --check
```

检查 `artifacts/` 中的 1440、1024 和 820 像素截图。检查表单、错误提示、完整地址、功能块管脚和远程扩展拓扑。确认页面没有横向溢出。

`npm run check` 只执行静态检查。`npm test` 在真实 Chromium 进程中执行浏览器测试。两者都不执行 PLC 程序。

浏览器单用例超时为 30 秒，整套测试超时为 300 秒。GitHub Actions 每个任务另设超时。若使用子 agent，将单次任务上限设为 600 秒。超时后停止任务，保存已确认结果，再从明确的检查点继续。不要启动无人看管的无限重试。

## 提交拉取请求

说明修改目的、文件范围、规则依据、测试命令和未验证内容。界面变更附上前后截图。用户可见行为变化需同步更新中英文文档。

main 检测通过后会自动发布 GitHub Pages。不要把未完成的 PLC 规则修改直接合入 main。

## 版权

只提交你有权分发的材料。保留现有版权和许可证。新增依赖时，更新锁文件与 `THIRD_PARTY_NOTICES.md`。项目自有贡献使用 MIT 协议。第三方材料保留原许可。
