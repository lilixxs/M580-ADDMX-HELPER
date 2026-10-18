# M580-ADDMX-HELPER

[简体中文](README.md) · [Contributing](CONTRIBUTING.en.md) · [MIT license](LICENSE)

Generate and inspect ADDM / ADDMX addresses for Schneider Electric M340 / M580 PLCs. The page also displays topology diagrams, function-block parameters, and ST reference templates.

[Live page](https://lilixxs.github.io/M580-ADDMX-HELPER/) · [GitHub repository](https://github.com/lilixxs/M580-ADDMX-HELPER)

## Run

Open `index.html` in a desktop browser. The page needs no backend, CDN, or runtime network connection. Copy buttons use a fallback when the Clipboard API is unavailable.

The target devices are desktops and tablets. Screenshot tests cover widths of 1440, 1024, and 820 pixels. Phones are outside the acceptance scope.

## Features

- Select M340 or M580.
- Select CPU ports, local communication modules, or CRA remote serial modules.
- Restrict Modbus-TCP, Modbus-RTU, Ethernet/IP, and CANopen options by interface.
- Select main or extension racks.
- Enter port coordinates, IPv4 addresses, network link names, and station numbers.
- Generate address strings as inputs change.
- Inspect supported address segments.
- Display inherited READ_VAR, WRITE_VAR, and DATA_EXCH reference templates.

The tool processes text in the browser. It does not connect to a PLC or send industrial protocol messages.

## Develop

Use Node.js 22 or later.

```sh
npm ci
npx playwright install chromium
npm run serve
```

Open `http://127.0.0.1:4173`. The local server exposes only the page and copyright files. It does not expose source documents or Git metadata.

After a style change, run:

```sh
npm run build:css
npm run check
npm test
```

`index.html` embeds generated Tailwind CSS. `tailwind.config.cjs` defines utility colors. The second style block in the HTML defines page components. Rebuild embedded CSS after changing utilities or colors.

Playwright runs Chromium interaction tests. It writes screenshots to `artifacts/`, failure reports to `playwright-report/`, and traces to `test-results/`. Git ignores these outputs.

## Checks and deployment

GitHub Actions runs static checks, CSS reproducibility checks, and Playwright tests for pull requests and main-branch pushes.

After main passes the checks, the workflow deploys `index.html` to GitHub Pages. The deployment directory contains only the page, license, third-party notices, and `.nojekyll`. It excludes source DOCX files, temporary images, test dependencies, and Git metadata.

A repository administrator must select **GitHub Actions** under **Settings → Pages → Build and deployment → Source**. Deployment needs `pages: write` and `id-token: write`. Private-repository Pages availability depends on the GitHub plan.

## Known limitations

This initialization preserves the supplied address and PLC template rules. Browser regression tests check page behavior. They do not certify PLC communication.

Check these items against Schneider manuals and the target firmware:

1. The inherited template labels multiple-register read/write as `22 (0x16)`. This project has not verified that mapping.
2. The READ_VAR graphic and ST template omit RECP, but the reference table still lists RECP. READ_VAR / WRITE_VAR management parameters also need review.
3. DATA_EXCH maps the selected direction to TYP values 1 / 2 / 3. The tool inserts buffer names. It does not construct Modbus or CIP messages.
4. NB limits remain 125 / 2000 from the supplied page. Each function-code limit needs verification.
5. The parser supports limited formats. It does not validate the full grammar. An address does not uniquely identify the CPU or interface. Its diagram reflects the generator selection, not a topology reconstructed from the parsed address.
6. Some invalid inputs still produce text. Output is not a validated Control Expert program.
7. SVG module slots are fixed examples. They can differ from input defaults.

Check block signatures, management arrays, message formats, and variable declarations in Control Expert. Then compile and test against the target device. This project has not performed PLC hardware tests.

## Files

- `index.html`: offline single-page tool.
- `claude_code_light_ui_style_guide.md`: supplied UI style guide.
- `scripts/`: CSS generation, static checks, local server, and site packaging.
- `tests/`: Playwright regression tests.
- `.github/workflows/`: checks and Pages deployment.
- `THIRD_PARTY_NOTICES.md`: provenance, dependency licenses, and trademark notes.

Source DOCX files and temporary images remain local. The public repository excludes them.

## License

Project-owned code uses the [MIT license](LICENSE). Keep the embedded Tailwind copyright and license when distributing the page. MIT does not relicense third-party material. Read [Third-party notices](THIRD_PARTY_NOTICES.md).
