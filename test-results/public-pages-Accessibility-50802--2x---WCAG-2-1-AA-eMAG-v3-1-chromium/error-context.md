# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> Accessibility Audit - Public Pages (Mobile) >> Atuação - Mobile (375x667 @2x) - WCAG 2.1 AA + eMAG v3.1
- Location: tests/a11y/public-pages.spec.ts:21:5

# Error details

```
Error: page.evaluate: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | 
  4   | export interface A11yViolation {
  5   |   id: string;
  6   |   impact: 'critical' | 'serious' | 'moderate' | 'minor' | 'none';
  7   |   tags: string[];
  8   |   description: string;
  9   |   help: string;
  10  |   helpUrl: string;
  11  |   nodes: Array<{
  12  |     target: string[];
  13  |     html: string;
  14  |     failureSummary: string;
  15  |     xpath: string;
  16  |   }>;
  17  | }
  18  | 
  19  | export interface A11yTestOptions {
  20  |   tags?: string[];
  21  |   excludedRules?: string[];
  22  |   includedRules?: string[];
  23  |   deviceScaleFactor?: number;
  24  |   viewport?: { width: number; height: number };
  25  | }
  26  | 
  27  | const DEFAULT_TAGS = [
  28  |   'wcag2a',
  29  |   'wcag2aa',
  30  |   'wcag21a',
  31  |   'wcag21aa',
  32  |   'best-practice',
  33  |   'section508',
  34  | ];
  35  | 
  36  | const EMAG_TAGS = [
  37  |   'wcag2a',
  38  |   'wcag2aa',
  39  |   'wcag21a',
  40  |   'wcag21aa',
  41  |   'best-practice',
  42  |   'emag',
  43  | ];
  44  | 
  45  | const KNOWN_VIOLATIONS_TO_EXCLUDE = [
  46  |   'color-contrast',
  47  |   'label',
  48  |   'select-name',
  49  | ];
  50  | 
  51  | export async function runA11yAudit(
  52  |   page: Page,
  53  |   options: A11yTestOptions = {}
  54  | ): Promise<{ violations: A11yViolation[]; passes: any[]; incomplete: any[]; inapplicable: any[] }> {
  55  |   const { tags = EMAG_TAGS, excludedRules = [], includedRules = [] } = options;
  56  | 
  57  |   const axeBuilder = new AxeBuilder({ page })
  58  |     .withTags(tags)
  59  |     .exclude('[data-testid="skip-a11y"]');
  60  | 
  61  |   // Exclude known violations that are documented and planned for fix
  62  |   const allExcludedRules = [...KNOWN_VIOLATIONS_TO_EXCLUDE, ...excludedRules];
  63  |   
  64  |   if (allExcludedRules.length > 0) {
  65  |     axeBuilder.disableRules(...allExcludedRules);
  66  |   }
  67  | 
  68  |   // Note: axe-core/playwright doesn't support includeRules/enableRules in this version
  69  |   // includedRules are ignored
  70  | 
> 71  |   const results = await axeBuilder.analyze();
      |                                    ^ Error: page.evaluate: Target page, context or browser has been closed
  72  | 
  73  |   return {
  74  |     violations: results.violations as A11yViolation[],
  75  |     passes: results.passes,
  76  |     incomplete: results.incomplete,
  77  |     inapplicable: results.inapplicable,
  78  |   };
  79  | }
  80  | 
  81  | export function filterViolationsByImpact(
  82  |   violations: A11yViolation[],
  83  |   impacts: ('critical' | 'serious' | 'moderate' | 'minor')[]
  84  | ): A11yViolation[] {
  85  |   return violations.filter((v) => impacts.includes(v.impact));
  86  | }
  87  | 
  88  | export function formatViolationsForReport(violations: A11yViolation[]): string {
  89  |   if (violations.length === 0) {
  90  |     return '✅ No violations found';
  91  |   }
  92  | 
  93  |   const byImpact = violations.reduce(
  94  |     (acc, v) => {
  95  |       acc[v.impact] = acc[v.impact] || [];
  96  |       acc[v.impact].push(v);
  97  |       return acc;
  98  |     },
  99  |     {} as Record<string, A11yViolation[]>
  100 |   );
  101 | 
  102 |   let report = `\n📊 Accessibility Violations Summary:\n`;
  103 |   report += `Total: ${violations.length}\n\n`;
  104 | 
  105 |   for (const impact of ['critical', 'serious', 'moderate', 'minor'] as const) {
  106 |     const items = byImpact[impact] || [];
  107 |     if (items.length > 0) {
  108 |       const icon = impact === 'critical' ? '🔴' : impact === 'serious' ? '🟠' : impact === 'moderate' ? '🟡' : '🔵';
  109 |       report += `${icon} ${impact.toUpperCase()} (${items.length}):\n`;
  110 |       items.forEach((v, i) => {
  111 |         report += `  ${i + 1}. [${v.id}] ${v.help}\n`;
  112 |         report += `     Tags: ${v.tags.join(', ')}\n`;
  113 |         report += `     URL: ${v.helpUrl}\n`;
  114 |         v.nodes.forEach((node) => {
  115 |           report += `     Element: ${node.target.join(' > ')}\n`;
  116 |           report += `     HTML: ${node.html.substring(0, 200)}\n`;
  117 |         });
  118 |         report += '\n';
  119 |       });
  120 |     }
  121 |   }
  122 | 
  123 |   return report;
  124 | }
  125 | 
  126 | export async function assertNoCriticalOrSeriousViolations(
  127 |   page: Page,
  128 |   pageName: string,
  129 |   options: A11yTestOptions = {}
  130 | ): Promise<void> {
  131 |   const { violations } = await runA11yAudit(page, options);
  132 | 
  133 |   const criticalAndSerious = filterViolationsByImpact(violations, ['critical', 'serious']);
  134 | 
  135 |   if (criticalAndSerious.length > 0) {
  136 |     const report = formatViolationsForReport(criticalAndSerious);
  137 |     console.error(`\n❌ ${pageName} - Critical/Serious violations found:${report}`);
  138 |     throw new Error(`${pageName}: ${criticalAndSerious.length} critical/serious accessibility violations found`);
  139 |   }
  140 | 
  141 |   const moderateAndMinor = filterViolationsByImpact(violations, ['moderate', 'minor']);
  142 |   if (moderateAndMinor.length > 0) {
  143 |     const report = formatViolationsForReport(moderateAndMinor);
  144 |     console.warn(`\n⚠️ ${pageName} - Moderate/Minor violations (reported but not failing):${report}`);
  145 |   }
  146 | 
  147 |   console.log(`✅ ${pageName} - No critical/serious violations`);
  148 | }
  149 | 
  150 | export async function navigateAndWaitForHydration(page: Page, url: string): Promise<void> {
  151 |   await page.goto(url, { waitUntil: 'networkidle' });
  152 |   await page.waitForLoadState('domcontentloaded');
  153 |   await page.waitForFunction(() => document.readyState === 'complete');
  154 |   await page.waitForTimeout(1000);
  155 |   await page.waitForSelector('#main-content', { state: 'visible', timeout: 15000 }).catch(() => {});
  156 |   await page.waitForSelector('h1', { state: 'visible', timeout: 15000 }).catch(() => {});
  157 |   await page.waitForFunction(() => {
  158 |     const loading = document.querySelector('[data-testid="skip-a11y"]');
  159 |     return !loading || loading.className.includes('hidden') || window.getComputedStyle(loading).display === 'none';
  160 |   }, {}, { timeout: 15000 }).catch(() => {});
  161 | }
  162 | 
  163 | export const PUBLIC_PAGES = [
  164 |   { name: 'Home', path: '/' },
  165 |   { name: 'Atuação', path: '/atuacao' },
  166 |   { name: 'Projetos', path: '/projetos' },
  167 |   { name: 'Votações', path: '/votacoes' },
  168 |   { name: 'Acervo', path: '/acervo' },
  169 |   { name: 'Documentos', path: '/documentos' },
  170 |   { name: 'Resultados', path: '/resultados' },
  171 |   { name: 'Notícias', path: '/noticias' },
```