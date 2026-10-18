# M580-ADDMX-HELPER

[English](README.en.md) · [贡献指南](CONTRIBUTING.md) · [MIT 许可证](LICENSE)

为 Schneider Electric M340 / M580 生成和拆解 ADDM / ADDMX 地址。页面还显示硬件拓扑示意图、功能块参数和 ST 程序参考模板。

[在线页面](https://lilixxs.github.io/M580-ADDMX-HELPER/) · [GitHub 仓库](https://github.com/lilixxs/M580-ADDMX-HELPER)

## 运行

直接用桌面浏览器打开 `index.html`。页面不需要后端、CDN 或运行时网络连接。浏览器不支持 Clipboard API 时，复制操作会使用兼容方法。

本项目主要适配电脑和平板。截图验证尺寸为 1440、1024 和 820 像素宽。手机不属于验收范围。

## 功能

- 选择 M340 或 M580。
- 选择 CPU 端口、本地通讯模块或 CRA 远程串口模块。
- 根据接口限制 Modbus-TCP、Modbus-RTU、Ethernet/IP 和 CANopen 选项。
- 选择主机架或扩展机架。
- 输入端口、IPv4、网络链路名和站号。
- 实时生成地址字符串。
- 拆解地址中的路径段。
- 显示 READ_VAR、WRITE_VAR、DATA_EXCH 的历史程序参考模板。

工具只处理浏览器中的文本。工具不连接 PLC，也不发送工业协议报文。

## 开发

需要 Node.js 22 或更新版本。

```sh
npm ci
npx playwright install chromium
npm run serve
```

打开 `http://127.0.0.1:4173`。本地服务器只提供首页与版权文件，不暴露原始文档或 Git 目录。

样式修改后执行：

```sh
npm run build:css
npm run check
npm test
```

`index.html` 内嵌生成后的 Tailwind 样式。`tailwind.config.cjs` 定义工具类的配色。HTML 中的第二个样式块定义页面组件。修改工具类或配色后，必须重新生成内嵌样式。

Playwright 使用 Chromium 执行交互测试，并将截图写入 `artifacts/`。失败报告写入 `playwright-report/`，执行轨迹写入 `test-results/`。这些文件不进入 Git。

## 检测与发布

GitHub Actions 在拉取请求和 main 分支提交时执行静态检查、样式重建检查和 Playwright 测试。

main 分支检测通过后，工作流通过 GitHub Pages 发布 `index.html`。发布目录只包含页面、许可证、第三方说明和 `.nojekyll`。原始 DOCX、临时图片、测试依赖和 Git 元数据不会发布。

仓库管理员需在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。工作流需要 `pages: write` 和 `id-token: write` 权限。私有仓库的 Pages 可用性取决于 GitHub 套餐。

## 当前限制

本次初始化保留了用户提供的地址与 PLC 程序规则。浏览器回归测试只证明页面行为，不证明 PLC 通讯正确。

以下内容需要单独核对 Schneider 手册和目标固件：

1. 历史模板把“读+写多个寄存器”标为 `22 (0x16)`。该映射尚未在本项目中核实。
2. READ_VAR 的图示和 ST 模板省略 RECP，但引脚说明表仍包含 RECP。READ_VAR / WRITE_VAR 的管理参数也需要核对。
3. DATA_EXCH 的 TYP 当前由读写方向映射为 1 / 2 / 3。发送缓冲区只使用变量名，工具不构造 Modbus 或 CIP 报文。
4. NB 上限沿用旧页面的 125 / 2000，未按每种功能码分别核实。
5. 解析器只拆分有限格式。解析器不执行完整语法校验，也不能仅凭地址唯一确定 CPU 或接口类型。解析页示意图沿用生成页选择，不是解析结果重建的实际拓扑。
6. 部分输入报错后仍会生成文本。输出不是经过验证的 Control Expert 程序。
7. SVG 中的模块槽位是固定图例。图例槽位可能与输入框默认值不同。

在 Control Expert 中核对功能块签名、管理表、报文格式和变量声明。随后执行编译与目标设备测试。本项目没有执行 PLC 硬件测试。

## 文件

- `index.html`：离线单页工具。
- `claude_code_light_ui_style_guide.md`：用户提供的界面风格指南。
- `scripts/`：内嵌样式生成、静态检查、本地服务器和发布目录生成脚本。
- `tests/`：Playwright 回归测试。
- `.github/workflows/`：检测与 Pages 发布工作流。
- `THIRD_PARTY_NOTICES.md`：代码来源、第三方许可与商标说明。

原始 DOCX 与临时图片保留在本地，不纳入公开仓库。

## 许可证

项目自有代码使用 [MIT](LICENSE) 协议。分发页面时，保留页面内的 Tailwind 版权和许可声明。第三方材料不因本项目使用 MIT 而自动改变许可证。详见 [版权与第三方说明](THIRD_PARTY_NOTICES.md)。
