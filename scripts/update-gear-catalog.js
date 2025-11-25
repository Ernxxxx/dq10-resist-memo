#!/usr/bin/env node
/**
 * Fetches the gear list from draquex.com and saves it as assets/gear-catalog.json
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');
const { JSDOM } = require('jsdom');

const SOURCE_URL = 'https://draquex.com/bougu/0-zenbu.php';
const BASE_URL = 'https://draquex.com/bougu/';
const OUTPUT_JSON = path.join(__dirname, '..', 'assets', 'gear-catalog.json');
const OUTPUT_JS = path.join(__dirname, '..', 'assets', 'gear-catalog.js');

const jobAbbrMap = new Map([
  ['戦', '戦士'],
  ['僧', '僧侶'],
  ['魔', '魔法使い'],
  ['武', '武闘家'],
  ['盗', '盗賊'],
  ['旅', '旅芸人'],
  ['バ', 'バトルマスター'],
  ['パ', 'パラディン'],
  ['マ', '魔法戦士'],
  ['レ', 'レンジャー'],
  ['賢', '賢者'],
  ['ス', 'スーパースター'],
  ['ま', 'まもの使い'],
  ['道', 'どうぐ使い'],
  ['踊', '踊り子'],
  ['占', '占い師'],
  ['天', '天地雷鳴士'],
  ['遊', '遊び人'],
  ['デ', 'デスマスター'],
  ['海', '海賊'],
  ['剣', '魔剣士'],
  ['ガ', 'ガーディアン'],
  ['竜', '竜術士'],
  ['隠', '隠者']
]);

const allJobs = Array.from(new Set(jobAbbrMap.values())).sort((a, b) => a.localeCompare(b, 'ja'));

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch (${res.statusCode})`));
          res.resume();
          return;
        }
        res.setEncoding('utf8');
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

function decodeJobs(text, unknownTokens) {
  if (!text) return [];
  const cleaned = text.replace(/[()（）\\s]/g, '');
  if (!cleaned) return [];
  if (cleaned.includes('全職業')) {
    return allJobs;
  }
  const resolved = new Set();
  cleaned
    .split(/[･・,、/]/)
    .map((token) => token.trim())
    .filter(Boolean)
    .forEach((token) => {
      const job = jobAbbrMap.get(token);
      if (job) {
        resolved.add(job);
      } else {
        unknownTokens.add(token);
      }
    });
  return Array.from(resolved).sort((a, b) => a.localeCompare(b, 'ja'));
}

async function main() {
  const html = await fetchHtml(SOURCE_URL);
  const dom = new JSDOM(html);
  const { document } = dom.window;
  const sections = Array.from(document.querySelectorAll('section.item'));
  const entries = [];
  const unknownTokens = new Set();

  sections.forEach((section) => {
    const heading = section.querySelector('h2');
    const levelMatch = heading?.textContent?.match(/(\\d+)/);
    const level = levelMatch ? Number(levelMatch[1]) : null;
    section.querySelectorAll('li').forEach((li) => {
      const link = li.querySelector('a');
      const nameEl = link?.querySelector('p.name');
      if (!link || !nameEl) return;
      const nameNode = nameEl.childNodes[0];
      const name = nameNode ? nameNode.textContent.trim() : nameEl.textContent.trim();
      const seriesEl = nameEl.querySelector('.text-series');
      const jobs = decodeJobs(seriesEl?.textContent || '', unknownTokens);
      const detailHref = link.getAttribute('href');
      const detailUrl = detailHref ? new URL(detailHref, BASE_URL).toString() : null;
      const imgEl = link.querySelector('img');
      const imageUrl = imgEl?.getAttribute('src') ? new URL(imgEl.getAttribute('src'), BASE_URL).toString() : null;

      entries.push({
        name,
        level,
        jobs,
        detailUrl,
        image: imageUrl
      });
    });
  });

  if (unknownTokens.size) {
    console.warn('Unknown job abbreviations:', Array.from(unknownTokens));
  }

  const jsonData = JSON.stringify(entries, null, 2);
  fs.writeFileSync(OUTPUT_JSON, jsonData);
  const jsData = `window.__GEAR_CATALOG__ = ${jsonData};\n`;
  fs.writeFileSync(OUTPUT_JS, jsData);
  console.log(`Saved ${entries.length} gear entries to:`);
  console.log(` - ${OUTPUT_JSON}`);
  console.log(` - ${OUTPUT_JS}`);
}

main().catch((error) => {
  console.error('Failed to update gear catalog:', error);
  process.exitCode = 1;
});
