import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:4173') && !request.url().startsWith('file:')) {
      errors.push(`Unexpected external request: ${request.url()}`);
    }
  });
  page.__appErrors = errors;
  await page.goto('/');
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.3{192.168.1.10}1'");
});

test.afterEach(async ({ page }) => {
  expect(page.__appErrors).toEqual([]);
});

test('default page uses local assets, light palette and square controls', async ({ page }) => {
  await expect(page.locator('#stCodeOut')).toHaveValue(/READ_VAR\(/);
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(250, 249, 245)');
  expect(await page.locator('#tabGenBtn').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(217, 119, 87)');
  for (const selector of ['#panelGenerator', '#cpuType', '#f_ip', '#tabGenBtn']) {
    expect(await page.locator(selector).evaluate(el => getComputedStyle(el).borderRadius)).toBe('0px');
  }
  await page.locator('#f_ip').focus();
  expect(await page.locator('#f_ip').evaluate(el => getComputedStyle(el).borderTopColor)).toBe('rgb(217, 119, 87)');
});

test('M340 serial and CAN use fixed addresses and disable remote IO', async ({ page }) => {
  await page.selectOption('#cpuType', 'M340');
  await expect(page.locator('#interfaceLoc option[value="rio_serial"]')).toBeDisabled();
  await page.selectOption('#interfaceLoc', 'cpu_serial');
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.0.4'");
  await page.selectOption('#interfaceLoc', 'cpu_can');
  await expect(page.locator('#commTarget')).toHaveValue('canopen');
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.2.4'");
  await expect(page.locator('#f_fb')).toHaveValue('DATA_EXCH');
});

test('local and remote extensions apply rack limits and route selection', async ({ page }) => {
  await page.selectOption('#interfaceLoc', 'rack_eth');
  await page.selectOption('#rackPos', 'local_ext');
  await expect(page.locator('#f_r')).toHaveAttribute('min', '1');
  await expect(page.locator('#f_r')).toHaveAttribute('max', '7');
  await expect(page.locator('#rawStringOut')).toHaveValue("'1.1.0{192.168.1.10}1'");
  await page.selectOption('#cpuType', 'M340');
  await expect(page.locator('#f_r')).toHaveAttribute('max', '4');
  await page.selectOption('#cpuType', 'M580');
  await page.selectOption('#interfaceLoc', 'rio_serial');
  await page.selectOption('#rackPos', 'remote_ext');
  await expect(page.locator('#f_r1')).toHaveAttribute('max', '1');
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.3{192.168.100.31}\\\\1.8.1.15'");
  await expect(page.locator('#stCodeOut')).toHaveValue(/ADDMX\(/);
});

test('link-name toggle resets defaults and validates input', async ({ page }) => {
  await page.check('#f_uselink');
  await expect(page.locator('#f_ip')).toHaveValue('Ethernet_1');
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.3{Ethernet_1}1'");
  await page.fill('#f_ip', 'bad-link');
  await expect(page.locator('#err_f_ip')).toContainText('链路名');
  await page.uncheck('#f_uselink');
  await expect(page.locator('#f_ip')).toHaveValue('192.168.1.10');
  await page.fill('#f_ip', '999.1.2.3');
  await expect(page.locator('#err_f_ip')).toContainText('IP 地址格式不正确');
});

test('optional Modbus station and mandatory CAN station retain baseline validation', async ({ page }) => {
  await page.fill('#f_node', '');
  await expect(page.locator('#err_f_node')).toContainText('255');
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.3{192.168.1.10}'");
  await page.fill('#f_node', '256');
  await expect(page.locator('#err_f_node')).toContainText('1-255');
  await page.selectOption('#cpuType', 'M340');
  await page.selectOption('#interfaceLoc', 'cpu_can');
  await page.fill('#f_node', '');
  await expect(page.locator('#err_f_node')).toContainText('不能为空');
});

const operations = [
  ['%M:read', 'READ_VAR', '01 (0x01)'],
  ['%M:write', 'WRITE_VAR', '15 (0x0F)'],
  ['%I:read', 'READ_VAR', '02 (0x02)'],
  ['%MW:read', 'READ_VAR', '03 (0x03)'],
  ['%MW:write', 'WRITE_VAR', '16 (0x10)'],
  // This test records inherited UI behavior. It does not certify the protocol code.
  ['%MW:rw', 'DATA_EXCH', '22 (0x16)'],
  ['%IW:read', 'READ_VAR', '04 (0x04)']
];
for (const [combo, fb, code] of operations) {
  test(`operation ${combo} selects ${fb}`, async ({ page }) => {
    await page.selectOption('#f_orw', combo);
    await expect(page.locator('#f_fb')).toHaveValue(fb);
    await expect(page.locator('#f_fc')).toHaveValue(new RegExp(code.replace(/[()]/g, '\\$&')));
    await expect(page.locator('#stCodeOut')).toHaveValue(new RegExp(`${fb}\\(`));
    await expect(page.locator('#fbGraphic .plc-block')).toContainText(fb);
    await expect(page.locator('#fbGraphic .plc-block')).not.toContainText('STRING');
  });
}

test('DATA_EXCH remains selected when changing the combined operation', async ({ page }) => {
  await page.selectOption('#f_fb', 'DATA_EXCH');
  await expect(page.locator('#f_orw')).toHaveValue('%MW:read');
  await page.selectOption('#f_orw', '%M:write');
  await expect(page.locator('#f_fb')).toHaveValue('DATA_EXCH');
  await expect(page.locator('#f_fc')).toHaveValue('15 (0x0F) - 写多线圈');
});

test('Ethernet/IP generates the inherited explicit-message template', async ({ page }) => {
  await page.selectOption('#commTarget', 'eip');
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.3{192.168.1.10}CON.CIP'");
  await expect(page.locator('#f_fb')).toHaveValue('DATA_EXCH');
  await expect(page.locator('#stCodeOut')).toHaveValue(/GEST := MgmtBuf/);
});

test('NUM and NB show range errors', async ({ page }) => {
  await page.fill('#f_num', '70000');
  await expect(page.locator('#numMsg')).toBeVisible();
  await page.fill('#f_num', '0');
  await expect(page.locator('#numMsg')).toBeHidden();
  await page.fill('#f_nb', '200');
  await expect(page.locator('#nbMsg')).toBeVisible();
  await page.selectOption('#f_orw', '%M:read');
  await expect(page.locator('#nbMsg')).toBeHidden();
});

test('parser splits local and remote addresses without rendering user HTML', async ({ page }) => {
  await page.click('#tabParseBtn');
  await expect(page.locator('#tabParseBtn')).toHaveAttribute('aria-pressed', 'true');
  await page.fill('#parseInput', "ADDM('0.0.3{192.168.1.10}5.SYS')");
  await page.getByRole('button', { name: '解析拆分' }).click();
  await expect(page.locator('#parseDetailsTbody')).toContainText('5');
  await expect(page.locator('#parseDetailsTbody')).toContainText('SYS');
  await page.fill('#parseInput', "ADDMX('0.0.3{192.168.100.31}\\\\0.8.1.15')");
  await page.getByRole('button', { name: '解析拆分' }).click();
  await expect(page.locator('#parseDetailsTbody')).toContainText('0.8.1');
  await page.fill('#parseInput', '0.0.3{<img src=x onerror=alert(1)>}1');
  await page.getByRole('button', { name: '解析拆分' }).click();
  await expect(page.locator('#parseDetailsTbody img')).toHaveCount(0);
  await expect(page.locator('#parseDetailsTbody')).toContainText('<img');
});

test('function-block preview renders buffer names as text', async ({ page }) => {
  await page.selectOption('#f_fb', 'DATA_EXCH');
  await page.fill('#f_emis', '<img src=x onerror=alert(1)>');
  await expect(page.locator('#fbGraphic img')).toHaveCount(0);
  await expect(page.locator('#fbGraphic')).toContainText('<img');
});

test('copy confirms with icon only and restores after two seconds', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const button = page.locator('button[onclick*="rawStringOut"]');
  const original = await button.innerHTML();
  const style = await button.evaluate(el => ({ color: getComputedStyle(el).backgroundColor, width: el.clientWidth, height: el.clientHeight }));
  await button.click();
  await expect(button.locator('path')).toHaveAttribute('d', 'M5 13l4 4L19 7');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("'0.0.3{192.168.1.10}1'");
  expect(await button.evaluate(el => ({ color: getComputedStyle(el).backgroundColor, width: el.clientWidth, height: el.clientHeight }))).toEqual(style);
  await expect.poll(() => button.innerHTML(), { timeout: 4000 }).toBe(original);
});

test('single-file page works with the browser offline', async ({ page, context }) => {
  await context.setOffline(true);
  await page.goto(pathToFileURL(`${process.cwd()}/index.html`).href);
  await expect(page.locator('#rawStringOut')).toHaveValue("'0.0.3{192.168.1.10}1'");
  expect(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(250, 249, 245)');
});

for (const width of [1440, 1024, 820]) {
  test(`layout and screenshots at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await fs.mkdir('artifacts', { recursive: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    const note = page.locator('#genSchematicContent .schematic-note');
    await expect(note).toContainText('蓝色为当前选择链路');
    await expect(page.locator('#genSchematicContent svg')).not.toContainText('以下模块所在');
    const svg = await page.locator('#genSchematicContent svg').boundingBox();
    const host = await page.locator('#genSchematicContent').boundingBox();
    expect(Math.abs(svg.width - host.width)).toBeLessThan(4);
    await page.screenshot({ path: `artifacts/generator-${width}.png`, fullPage: true });
    await page.selectOption('#interfaceLoc', 'rio_serial');
    await page.selectOption('#rackPos', 'remote_ext');
    await page.locator('#genSchematicArea').screenshot({ path: `artifacts/remote-${width}.png` });
    await page.click('#tabParseBtn');
    await page.fill('#parseInput', "ADDMX('0.0.3{192.168.100.31}\\\\1.8.1.15')");
    await page.getByRole('button', { name: '解析拆分' }).click();
    await expect(page.locator('#parseSchematicContent .schematic-note')).toBeVisible();
    await page.screenshot({ path: `artifacts/parser-${width}.png`, fullPage: true });
  });
}
