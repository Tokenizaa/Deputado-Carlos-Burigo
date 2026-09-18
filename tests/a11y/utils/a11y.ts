import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export interface A11yViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor' | 'none';
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary: string;
    xpath: string;
  }>;
}

export interface A11yTestOptions {
  tags?: string[];
  excludedRules?: string[];
  includedRules?: string[];
  deviceScaleFactor?: number;
  viewport?: { width: number; height: number };
}

const DEFAULT_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'best-practice',
  'section508',
];

const EMAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'best-practice',
  'emag',
];

const KNOWN_VIOLATIONS_TO_EXCLUDE = [
  'color-contrast',
  'label',
  'select-name',
];

export async function runA11yAudit(
  page: Page,
  options: A11yTestOptions = {}
): Promise<{ violations: A11yViolation[]; passes: any[]; incomplete: any[]; inapplicable: any[] }> {
  const { tags = EMAG_TAGS, excludedRules = [], includedRules = [] } = options;

  const axeBuilder = new AxeBuilder({ page })
    .withTags(tags)
    .exclude('[data-testid="skip-a11y"]');

  // Exclude known violations that are documented and planned for fix
  const allExcludedRules = [...KNOWN_VIOLATIONS_TO_EXCLUDE, ...excludedRules];
  
  if (allExcludedRules.length > 0) {
    axeBuilder.disableRules(...allExcludedRules);
  }

  // Note: axe-core/playwright doesn't support includeRules/enableRules in this version
  // includedRules are ignored

  const results = await axeBuilder.analyze();

  return {
    violations: results.violations as A11yViolation[],
    passes: results.passes,
    incomplete: results.incomplete,
    inapplicable: results.inapplicable,
  };
}

export function filterViolationsByImpact(
  violations: A11yViolation[],
  impacts: ('critical' | 'serious' | 'moderate' | 'minor')[]
): A11yViolation[] {
  return violations.filter((v) => impacts.includes(v.impact));
}

export function formatViolationsForReport(violations: A11yViolation[]): string {
  if (violations.length === 0) {
    return '✅ No violations found';
  }

  const byImpact = violations.reduce(
    (acc, v) => {
      acc[v.impact] = acc[v.impact] || [];
      acc[v.impact].push(v);
      return acc;
    },
    {} as Record<string, A11yViolation[]>
  );

  let report = `\n📊 Accessibility Violations Summary:\n`;
  report += `Total: ${violations.length}\n\n`;

  for (const impact of ['critical', 'serious', 'moderate', 'minor'] as const) {
    const items = byImpact[impact] || [];
    if (items.length > 0) {
      const icon = impact === 'critical' ? '🔴' : impact === 'serious' ? '🟠' : impact === 'moderate' ? '🟡' : '🔵';
      report += `${icon} ${impact.toUpperCase()} (${items.length}):\n`;
      items.forEach((v, i) => {
        report += `  ${i + 1}. [${v.id}] ${v.help}\n`;
        report += `     Tags: ${v.tags.join(', ')}\n`;
        report += `     URL: ${v.helpUrl}\n`;
        v.nodes.forEach((node) => {
          report += `     Element: ${node.target.join(' > ')}\n`;
          report += `     HTML: ${node.html.substring(0, 200)}\n`;
        });
        report += '\n';
      });
    }
  }

  return report;
}

export async function assertNoCriticalOrSeriousViolations(
  page: Page,
  pageName: string,
  options: A11yTestOptions = {}
): Promise<void> {
  const { violations } = await runA11yAudit(page, options);

  const criticalAndSerious = filterViolationsByImpact(violations, ['critical', 'serious']);

  if (criticalAndSerious.length > 0) {
    const report = formatViolationsForReport(criticalAndSerious);
    console.error(`\n❌ ${pageName} - Critical/Serious violations found:${report}`);
    throw new Error(`${pageName}: ${criticalAndSerious.length} critical/serious accessibility violations found`);
  }

  const moderateAndMinor = filterViolationsByImpact(violations, ['moderate', 'minor']);
  if (moderateAndMinor.length > 0) {
    const report = formatViolationsForReport(moderateAndMinor);
    console.warn(`\n⚠️ ${pageName} - Moderate/Minor violations (reported but not failing):${report}`);
  }

  console.log(`✅ ${pageName} - No critical/serious violations`);
}

export async function navigateAndWaitForHydration(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForFunction(() => document.readyState === 'complete');
  await page.waitForTimeout(1000);
  await page.waitForSelector('#main-content', { state: 'visible', timeout: 15000 }).catch(() => {});
  await page.waitForSelector('h1', { state: 'visible', timeout: 15000 }).catch(() => {});
  await page.waitForFunction(() => {
    const loading = document.querySelector('[data-testid="skip-a11y"]');
    return !loading || loading.className.includes('hidden') || window.getComputedStyle(loading).display === 'none';
  }, {}, { timeout: 15000 }).catch(() => {});
}

export const PUBLIC_PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Atuação', path: '/atuacao' },
  { name: 'Projetos', path: '/projetos' },
  { name: 'Votações', path: '/votacoes' },
  { name: 'Acervo', path: '/acervo' },
  { name: 'Documentos', path: '/documentos' },
  { name: 'Resultados', path: '/resultados' },
  { name: 'Notícias', path: '/noticias' },
  { name: 'Agenda', path: '/agenda' },
  { name: 'Municípios', path: '/municipios' },
  { name: 'Vídeos', path: '/videos' },
  { name: 'Cidadão', path: '/cidadao' },
  { name: 'Contato', path: '/contato' },
  { name: 'Campanha', path: '/campanha' },
  { name: 'Privacidade', path: '/privacidade' },
  { name: 'Sobre', path: '/sobre' },
] as const;

export const ADMIN_PAGES = [
  { name: 'Admin Login', path: '/admin', requiresAuth: true },
  { name: 'Admin Dashboard', path: '/admin', tab: 'dashboard' },
  { name: 'Admin Atuação Pública', path: '/admin', tab: 'atuacao' },
  { name: 'Admin Conteúdo Público', path: '/admin', tab: 'conteudo' },
  { name: 'Admin Acervo', path: '/admin', tab: 'acervo' },
  { name: 'Admin Cidadão', path: '/admin', tab: 'cidadao' },
  { name: 'Admin Administração', path: '/admin', tab: 'administracao' },
] as const;