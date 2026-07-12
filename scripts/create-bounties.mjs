import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const REPO = 'mergeos-bounties/BloggerEasy';

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function ensureLabel(name, color, description) {
  try {
    sh(`gh label create ${JSON.stringify(name)} --repo ${REPO} --color ${color} --description ${JSON.stringify(description)}`);
  } catch {
    try {
      sh(`gh label edit ${JSON.stringify(name)} --repo ${REPO} --color ${color} --description ${JSON.stringify(description)}`);
    } catch { /* ignore */ }
  }
}

function createIssue(title, body, labels) {
  const dir = mkdtempSync(join(tmpdir(), 'be-issue-'));
  const file = join(dir, 'body.md');
  try {
    writeFileSync(file, body, 'utf8');
    const labelFlags = labels.map((l) => `--label ${JSON.stringify(l)}`).join(' ');
    console.log(sh(`gh issue create --repo ${REPO} --title ${JSON.stringify(title)} --body-file ${JSON.stringify(file)} ${labelFlags}`));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

for (const row of [
  ['bounty', '5319E7', 'Eligible for MergeOS MRG bounty'],
  ['bounty: feature', 'A2EEEF', 'Feature bounty'],
  ['html', '1D76DB', 'HTML/CSS parsing'],
  ['blogger-xml', 'B60205', 'Blogger XML theme export'],
  ['vision', 'D93F0B', 'Image to theme'],
  ['api', '0E8A16', 'HTTP / SDK'],
  ['ux', 'C5DEF5', 'Studio UI / templates'],
  ['documentation', '0075CA', 'Docs'],
  ['reward:25-mrg', 'FEF2C0', 'Target 25 MRG'],
  ['reward:50-mrg', 'FEF2C0', 'Target 50 MRG'],
  ['reward:100-mrg', 'FEF2C0', 'Target 100 MRG'],
  ['reward:200-mrg', 'FEF2C0', 'Target 200 MRG'],
  ['good first issue', '7057FF', 'Good for newcomers'],
  ['theme-pack', 'BFDADC', 'Per-template / style pack'],
]) ensureLabel(...row);

const footer = `

## Claim (MergeOS MRG)

1. Star https://github.com/mergeos-bounties/BloggerEasy and https://github.com/mergeos-bounties/mergeos  
2. Comment on **this issue**: \`I claim this bounty\`  
3. Comment on MergeOS [Claim Token #1](https://github.com/mergeos-bounties/mergeos/issues/1)  
4. PR to **BloggerEasy** with \`Fixes #<this-issue>\`

Policy: [docs/BOUNTY.md](../blob/master/docs/BOUNTY.md)
`;

const issues = [
  { title: '[25 MRG] Docs: HOWTO import generated XML into Blogger', labels: ['bounty', 'bounty: feature', 'documentation', 'reward:25-mrg', 'good first issue'],
    body: `## Bounty: 25 MRG\n\nWrite docs/IMPORT_BLOGGER.md with screenshots/steps for Theme → Backup/Restore.\n\n## Acceptance\n- [ ] Doc + README link\n${footer}` },
  { title: '[25 MRG] CLI: bloggereasy gen html --url fetch public page (httpx)', labels: ['bounty', 'bounty: feature', 'html', 'reward:25-mrg', 'good first issue'],
    body: `## Bounty: 25 MRG\n\nAdd optional --url fetch with timeout + robots note; tests mock HTTP.\n\n## Acceptance\n- [ ] Command + mocked tests\n${footer}` },
  { title: '[25 MRG] Expand sample HTML fixtures (3 layouts)', labels: ['bounty', 'bounty: feature', 'html', 'reward:25-mrg', 'good first issue'],
    body: `## Bounty: 25 MRG\n\nAdd magazine, portfolio, docs-style HTML samples under data/samples/html/.\n\n## Acceptance\n- [ ] ≥3 new samples + tests parse them\n${footer}` },
  { title: '[25 MRG] Pydantic models for page structure + theme meta', labels: ['bounty', 'bounty: feature', 'html', 'reward:25-mrg', 'good first issue'],
    body: `## Bounty: 25 MRG\n\nReplace raw dicts with pydantic models and validate builder input.\n\n## Acceptance\n- [ ] Models + tests\n${footer}` },
  { title: '[50 MRG] CSS extractor: fonts, spacing, button styles', labels: ['bounty', 'bounty: feature', 'html', 'blogger-xml', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nRicher CSS parse into skin variables beyond hex colors.\n\n## Acceptance\n- [ ] Module + tests on samples\n${footer}` },
  { title: '[50 MRG] Magazine 3-column Blogger layout template', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'theme-pack', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nImplement template magazine with featured + grid-ish CSS and correct b:sections.\n\n## Acceptance\n- [ ] --template magazine works\n- [ ] XML contains Blog widget\n${footer}` },
  { title: '[50 MRG] Dark mode skin variant', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\n--dark flag or auto detect dark palette → dark skin CSS.\n\n## Acceptance\n- [ ] CLI flag + tests\n${footer}` },
  { title: '[50 MRG] Blogger XML validator (required widgets/namespaces)', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nValidate export has html/b namespaces, b:skin, Blog widget; fail with clear errors.\n\n## Acceptance\n- [ ] bloggereasy validate --file theme.xml\n${footer}` },
  { title: '[50 MRG] Vision: dominant palette + region hints with Pillow', labels: ['bounty', 'bounty: feature', 'vision', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nImprove structure_from_image (header band color, content bg). Graceful without vision extra.\n\n## Acceptance\n- [ ] Tests with tiny synthetic PNG\n${footer}` },
  { title: '[50 MRG] FastAPI: POST /gen/html and /gen/image', labels: ['bounty', 'bounty: feature', 'api', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nOptional API returning XML download.\n\n## Acceptance\n- [ ] TestClient tests\n${footer}` },
  { title: '[50 MRG] Nav widget from HTML menu → LinkList gadget', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'html', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nMap parsed nav_links into a proper Blogger LinkList or PageList widget.\n\n## Acceptance\n- [ ] Widget present in XML + test\n${footer}` },
  { title: '[50 MRG] Responsive mobile polish + amp-safe CSS notes', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'ux', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nImprove media queries; document Blogger mobile limitations.\n\n## Acceptance\n- [ ] CSS + docs snippet\n${footer}` },
  { title: '[100 MRG] Web studio: paste HTML → download theme', labels: ['bounty', 'bounty: feature', 'api', 'ux', 'reward:100-mrg'],
    body: `## Bounty: 100 MRG\n\nweb/ UI for paste HTML / upload image and download XML.\n\n## Acceptance\n- [ ] Local README + screenshots\n${footer}` },
  { title: '[100 MRG] Figma/export HTML adapter (common export quirks)', labels: ['bounty', 'bounty: feature', 'html', 'reward:100-mrg'],
    body: `## Bounty: 100 MRG\n\nNormalize absolute paths, inline huge CSS, strip scripts for safer theme gen.\n\n## Acceptance\n- [ ] Fixture + tests\n${footer}` },
  { title: '[100 MRG] Multi-theme pack: portfolio, news, personal, docs', labels: ['bounty', 'bounty: feature', 'theme-pack', 'blogger-xml', 'reward:100-mrg'],
    body: `## Bounty: 100 MRG\n\nFour named templates with distinct CSS and section layouts.\n\n## Acceptance\n- [ ] templates list shows them\n- [ ] gen works for each\n${footer}` },
  { title: '[100 MRG] Round-trip test: generate → parse skin colors still present', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'reward:100-mrg'],
    body: `## Bounty: 100 MRG\n\nProperty-style tests ensuring primary color lands in b:skin CDATA.\n\n## Acceptance\n- [ ] pytest coverage\n${footer}` },
  { title: '[200 MRG] End-to-end product: screenshot/HTML → importable theme with guide', labels: ['bounty', 'bounty: feature', 'vision', 'blogger-xml', 'ux', 'reward:200-mrg'],
    body: `## Bounty: 200 MRG\n\nPolished path with sample assets, quality bar, and import evidence screenshots.\n\n## Acceptance\n- [ ] One command path\n- [ ] Evidence in PR\n${footer}` },
  { title: '[25 MRG] CONTRIBUTING.md + good first issue path', labels: ['bounty', 'bounty: feature', 'documentation', 'reward:25-mrg', 'good first issue'],
    body: `## Bounty: 25 MRG\n\nCONTRIBUTING with setup, tests, claim flow.\n\n## Acceptance\n- [ ] File + README link\n${footer}` },
  { title: '[25 MRG] CI: coverage + ruff format check', labels: ['bounty', 'bounty: feature', 'documentation', 'reward:25-mrg', 'good first issue'],
    body: `## Bounty: 25 MRG\n\npytest-cov + ruff format --check.\n\n## Acceptance\n- [ ] CI green\n${footer}` },
  { title: '[50 MRG] SEO skin defaults: meta, open graph placeholders', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nInject sensible head extras where Blogger allows.\n\n## Acceptance\n- [ ] Documented + tested snippets\n${footer}` },
  { title: '[50 MRG] Vietnamese docs + sample theme titles', labels: ['bounty', 'bounty: feature', 'documentation', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nVI README section + sample HTML with Vietnamese content.\n\n## Acceptance\n- [ ] Docs + sample\n${footer}` },
  { title: '[50 MRG] Widget pack: PopularPosts, Labels, Archive presets', labels: ['bounty', 'bounty: feature', 'blogger-xml', 'reward:50-mrg'],
    body: `## Bounty: 50 MRG\n\nOptional sidebar gadgets with safe defaults for new blogs.\n\n## Acceptance\n- [ ] Flag --widgets full|minimal\n${footer}` },
];

// Theme style packs as individual good-first issues (HTML mock → theme)
const themePacks = [
  ['minimal_white', 'Clean white personal blog'],
  ['dark_dev', 'Dark developer blog'],
  ['magazine_news', 'News magazine multi-card'],
  ['portfolio_photo', 'Photographer portfolio'],
  ['food_recipe', 'Food / recipe warm tones'],
  ['travel_journal', 'Travel journal with hero'],
  ['tech_saas', 'SaaS marketing-like blog'],
  ['fashion_editorial', 'Fashion editorial serif'],
  ['kids_colorful', 'Bright kids / education'],
  ['corporate_blue', 'Corporate blue professional'],
  ['nature_green', 'Nature / eco green'],
  ['music_purple', 'Music / entertainment purple'],
  ['gaming_neon', 'Gaming dark neon accents'],
  ['finance_serif', 'Finance / newspaper'],
  ['wedding_soft', 'Wedding soft pastel'],
  ['fitness_bold', 'Fitness bold sans'],
  ['book_review', 'Book review library feel'],
  ['startup_gradient', 'Startup gradient header'],
  ['vietnamese_news', 'Vietnamese news portal style'],
  ['minimal_mono', 'Ultra-minimal monochrome'],
];

for (const [id, desc] of themePacks) {
  issues.push({
    title: `[25 MRG] Theme pack sample: \`${id}\` — HTML fixture + golden XML`,
    labels: ['bounty', 'bounty: feature', 'theme-pack', 'html', 'blogger-xml', 'reward:25-mrg', 'good first issue'],
    body: `## Bounty: 25 MRG — theme style pack

Add a **${desc}** pack so BloggerEasy can demonstrate style \`${id}\`.

## Deliver

1. \`data/samples/html/${id}.html\` — self-contained HTML+CSS matching the style  
2. Optional golden: \`data/templates/${id}.xml\` or generate via CLI in test  
3. Test that \`bloggereasy gen html -i data/samples/html/${id}.html\` produces XML with \`b:skin\` and Blog widget  
4. PR screenshots of the HTML in a browser (desktop)

## Acceptance

- [ ] Sample HTML merged  
- [ ] Gen succeeds in CI test  
- [ ] Screenshot evidence in PR  
${footer}`,
  });
}

for (const issue of issues) {
  createIssue(issue.title, issue.body, issue.labels);
}
console.log(`Created ${issues.length} issues on ${REPO}`);
