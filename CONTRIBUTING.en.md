# Contributing

[简体中文](CONTRIBUTING.md)

## Start a change

1. Read the known limitations in the README.
2. Create a task branch from the latest main.
3. Install locked dependencies.

```sh
git switch main
git pull --ff-only
git switch -c feature/short-task-name
npm ci
npx playwright install chromium
```

Do not commit credentials, conversation documents, `node_modules/`, or temporary screenshots. Do not force-push main.

## Change rules

- Keep `index.html` usable offline.
- Follow the supplied square-control, warm-background, clay-accent style guide.
- Preserve the meaning of blue topology links and red address labels.
- Do not edit generated code inside `<style id="utilities">` by hand.
- Render user input as text. Do not insert raw input into `innerHTML`.
- Cite official manual URLs, document versions, and pages when changing address rules or PLC templates.
- Distinguish diagrams, browser tests, Control Expert compilation, and PLC hardware tests.

Add separate regression cases for changes to function codes, TYP, GEST, RECP, or quantity limits. Current page output alone is not protocol evidence.

## Check a change

```sh
npm run build:css
npm run check
npm test
git diff --check
```

Inspect the 1440-, 1024-, and 820-pixel screenshots in `artifacts/`. Check forms, errors, full addresses, block pins, and remote extension diagrams. Confirm that the page has no horizontal overflow.

`npm run check` performs static checks. `npm test` runs browser tests in a real Chromium process. Neither command executes PLC programs.

Each browser test has a 30-second limit. The suite has a 300-second limit. Actions jobs have separate limits. If you use a subagent, limit each task to 600 seconds. Stop an expired task. Preserve confirmed results. Continue from an explicit checkpoint. Do not create unattended retry loops.

## Submit a pull request

State the purpose, file scope, rule sources, test commands, and unverified behavior. Include before-and-after screenshots for UI changes. Update both language versions when user-visible behavior changes.

Successful main checks trigger GitHub Pages deployment. Do not merge unfinished PLC rule changes directly into main.

## Copyright

Submit only material you can distribute. Preserve copyright and license notices. Update the lockfile and `THIRD_PARTY_NOTICES.md` when adding dependencies. Project-owned contributions use MIT. Third-party material retains its original license.
