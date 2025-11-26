const resistanceMeta = {
  '封印ガード': { group: '状態異常', description: '呪文封印・特技封印を防ぐ' },
  '幻惑ガード': { group: '状態異常', description: '物理命中率低下を防ぐ' },
  '転びガード': { group: '状態異常', description: '転倒による行動不能を防ぐ' },
  '眠りガード': { group: '状態異常', description: '眠りによる行動不能を防ぐ' },
  '混乱ガード': { group: '状態異常', description: '混乱による暴走を防ぐ' },
  'マヒガード': { group: '状態異常', description: 'マヒ・しびれによる行動不能を防ぐ' },
  '呪いガード': { group: '状態異常', description: '最大HP低下や行動不能を防ぐ' },
  '毒ガード': { group: '状態異常', description: '猛毒・どくの継続ダメージを防ぐ' },
  '踊りガード': { group: '状態異常', description: '踊りによる行動拘束を防ぐ' },
  '即死ガード': { group: '状態異常', description: 'ザキ系・呪殺を防ぐ' },
  'おびえガード': { group: '状態異常', description: 'ショック・おびえによる行動不能を防ぐ' },
  '魅了ガード': { group: '状態異常', description: '魅了で敵対化するのを防ぐ' },
  'MP吸収ガード': { group: '状態異常', description: 'MP吸収・MPダメージを防ぐ' },
  '封印耐性': { group: '状態異常', description: '封印対策（ガード装備がない職向け）' },
  'ブレス耐性': { group: 'ダメージ軽減', description: 'ブレスダメージと付随する状態異常を軽減' },
  '呪文耐性': { group: 'ダメージ軽減', description: '呪文ダメージを軽減' },
  '炎耐性': { group: '属性耐性', description: '炎属性ダメージを軽減' },
  '氷耐性': { group: '属性耐性', description: '氷属性ダメージを軽減' },
  '雷耐性': { group: '属性耐性', description: '雷属性ダメージを軽減' },
  '闇耐性': { group: '属性耐性', description: '闇属性ダメージを軽減' },
  '風耐性': { group: '属性耐性', description: '風属性ダメージを軽減' },
  '土耐性': { group: '属性耐性', description: '土属性ダメージを軽減' },
  '光耐性': { group: '属性耐性', description: '光属性ダメージを軽減' }
};

const priorityLabels = {
  must: '必須',
  recommended: '推奨',
  nice: 'あると安心'
};

const jobDefinitions = [
  { label: '戦士', keywords: ['戦士', '戦'] },
  { label: '僧侶', keywords: ['僧侶', '僧'] },
  { label: '賢者', keywords: ['賢者', '賢'] },
  { label: '旅芸人', keywords: ['旅芸人', '旅芸', '旅'] },
  { label: '魔法使い', keywords: ['魔法使い', '魔使', '魔法', '魔'] },
  { label: '武闘家', keywords: ['武闘家', '武闘', '武'] },
  { label: '盗賊', keywords: ['盗賊'] },
  { label: 'バトルマスター', keywords: ['バトルマスター', 'バトマス', 'バト'] },
  { label: 'パラディン', keywords: ['パラディン', 'パラ', 'ヤリパラ'] },
  { label: '魔法戦士', keywords: ['魔法戦士', '魔戦'] },
  { label: 'レンジャー', keywords: ['レンジャー', 'レン'] },
  { label: 'まもの使い', keywords: ['まもの使い', 'まも'] },
  { label: 'どうぐ使い', keywords: ['どうぐ使い', 'どうぐ', 'どう', '道具', '道'] },
  { label: '踊り子', keywords: ['踊り子', '踊'] },
  { label: '占い師', keywords: ['占い師', '占い', '占'] },
  { label: '天地雷鳴士', keywords: ['天地雷鳴士', '天地'] },
  { label: 'ガーディアン', keywords: ['ガーディアン', 'ガデ'] },
  { label: '魔剣士', keywords: ['魔剣士', '魔剣'] },
  { label: '海賊', keywords: ['海賊'] },
  { label: '竜術士', keywords: ['竜術士', '竜術'] },
  { label: '隠者', keywords: ['隠者'] }
];

const jobKeywordMap = new Map();
jobDefinitions.forEach((job) => {
  job.keywords.forEach((keyword) => {
    jobKeywordMap.set(keyword, job.label);
  });
});
const jobKeywordsByLength = Array.from(jobKeywordMap.keys()).sort((a, b) => b.length - a.length);

const bossImageExtensions = ['webp', 'png', 'jpg', 'jpeg'];
const buildImageCandidates = (key) => bossImageExtensions.map((ext) => `assets/bosses/${key}.${ext}`);
const imageShiftDownNames = new Set([
  '人食い火竜',
  '結界の守護者たち',
  'アンドレアル',
  'ムドー',
  '帝国三将軍',
  'ゲルニック将軍',
  'Sキラーマシン',
  'ドン・モグーラ',
  'キラーマジンガ',
  'キラーマジンガ強',
  'グラコス',
  'グラコス強',
  'キングヒドラ強',
  'バラモス強',
  'ドラゴンガイア強',
  '悪霊の神々強',
  'ベリアル強',
  'バズズ強',
  '剣王ガルドリオン'
]);

const imageShiftUpNames = new Set([
  'アトラス',
  'アトラス強',
  'タロット魔人',
  'タロット魔人強',
  '幻界の四諸侯',
  '幻界の四諸侯強'
]);

const sanitizeJobSourceText = (text = '') =>
  text
    .replace(/（[^）]*）/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[【】「」『』《》〈〉［］\[\]{}]/g, ' ')
    .replace(/サポ討伐：/g, ' ')
    .replace(/[+＋&＆・·•,、，:：;]/g, ' ')
    .replace(/[\\/|｜]/g, ' ')
    .replace(/または/g, ' ')
    .replace(/or/gi, ' ')
    .replace(/×\d+/g, ' ')
    .replace(/\d+/g, ' ')
    .replace(/[%％@＠]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractJobsFromRecommended = (recommendedList = []) => {
  const jobs = new Set();
  recommendedList.forEach((combo) => {
    const sanitized = sanitizeJobSourceText(combo);
    if (!sanitized) return;
    let idx = 0;
    while (idx < sanitized.length) {
      const char = sanitized[idx];
      if (/\s/.test(char)) {
        idx += 1;
        continue;
      }
      let matchedKeyword = null;
      for (const keyword of jobKeywordsByLength) {
        if (sanitized.startsWith(keyword, idx)) {
          matchedKeyword = keyword;
          break;
        }
      }
      if (matchedKeyword) {
        const jobLabel = jobKeywordMap.get(matchedKeyword);
        if (jobLabel) {
          jobs.add(jobLabel);
        }
        idx += matchedKeyword.length;
      } else {
        idx += 1;
      }
    }
  });
  return Array.from(jobs).sort((a, b) => a.localeCompare(b, 'ja'));
};

const rawEntries = [
  {
    slug: 'boss-108',
    name: 'デスマシーン',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '転びガード', priority: 'must' }
    ],
    highlights: [
      '必須: ブレス耐性 / 幻惑ガード / 転びガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id108.html' }
  },
  {
    slug: 'boss-105',
    name: '人食い火竜',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' },
      { label: '呪文耐性', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: '炎耐性', priority: 'must' },
      { label: '呪いガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'recommended' }
    ],
    highlights: [
      '必須: ブレス耐性 / 呪文耐性 / 封印ガード / 炎耐性',
      '推奨: 呪いガード / 混乱ガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id105.html' }
  },
  {
    slug: 'boss-102',
    name: 'タイムマスター',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪文耐性', priority: 'must' },
      { label: '氷耐性', priority: 'recommended' },
      { label: '光耐性', priority: 'nice' },
      { label: '炎耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 呪文耐性',
      '推奨: 氷耐性',
      'あると安心: 光耐性 / 炎耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id102.html' }
  },
  {
    slug: 'boss-101',
    name: '結界の守護者たち',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪いガード', priority: 'must' },
      { label: '呪文耐性', priority: 'must' },
      { label: '毒ガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'recommended' },
      { label: 'ブレス耐性', priority: 'nice' },
      { label: '闇耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 呪いガード / 呪文耐性 / 毒ガード / 転びガード',
      '推奨: 幻惑ガード / 混乱ガード',
      'あると安心: ブレス耐性 / 闇耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id101.html' }
  },
  {
    slug: 'boss-99',
    name: '究極エビルプリースト',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪文耐性', priority: 'must' },
      { label: '眠りガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'recommended' }
    ],
    highlights: [
      '必須: 呪文耐性 / 眠りガード / 転びガード',
      '推奨: ブレス耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id99.html' }
  },
  {
    slug: 'boss-94',
    name: 'エビルプリースト',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    release: 'Lv124（バージョン6.2実装ボス）',
    difficulty: 3,
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪いガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '闇耐性', priority: 'must' },
      { label: '呪文耐性', priority: 'recommended' }
    ],
    highlights: [
      '必須: 呪いガード / 転びガード / 闇耐性',
      '推奨: 呪文耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id94.html' }
  },
  {
    slug: 'boss-93',
    name: 'アンドレアル',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    release: 'Lv120（バージョン6.0実装ボス）',
    difficulty: 3,
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪いガード', priority: 'must' },
      { label: '毒ガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'recommended' }
    ],
    highlights: [
      '必須: 呪いガード / 毒ガード',
      '推奨: ブレス耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id93.html' }
  },
  {
    slug: 'boss-92',
    name: '真・幻界諸侯',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    release: 'Lv120（バージョン5.5後期実装ボス）',
    difficulty: 3,
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '眠りガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '光耐性', priority: 'recommended' },
      { label: '呪文耐性', priority: 'recommended' },
      { label: '炎耐性', priority: 'recommended' },
      { label: 'マヒガード', priority: 'nice' },
      { label: '呪いガード', priority: 'nice' },
      { label: '幻惑ガード', priority: 'nice' },
      { label: '雷耐性', priority: 'nice' },
      { label: '魅了ガード', priority: 'nice' }
    ],
    highlights: [
      '必須: おびえガード / 眠りガード / 転びガード',
      '推奨: 光耐性 / 呪文耐性 / 炎耐性',
      'あると安心: マヒガード / 呪いガード / 幻惑ガード / 雷耐性 / 魅了ガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id92.html' }
  },
  {
    slug: 'boss-89',
    name: 'ムドー',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    release: 'Lv116（バージョン5.4実装ボス）',
    difficulty: 4,
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '呪文耐性', priority: 'must' },
      { label: '眠りガード', priority: 'must' },
      { label: '雷耐性', priority: 'must' },
      { label: '光耐性', priority: 'recommended' },
      { label: '炎耐性', priority: 'recommended' }
    ],
    highlights: [
      '必須: おびえガード / 呪文耐性 / 眠りガード / 雷耐性',
      '推奨: 光耐性 / 炎耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id89.html' }
  },
  {
    slug: 'boss-107',
    name: 'プチムドー',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '眠りガード', priority: 'must' },
      { label: '光耐性', priority: 'nice' },
      { label: '呪文耐性', priority: 'nice' },
      { label: '炎耐性', priority: 'nice' },
      { label: '雷耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: おびえガード / 眠りガード',
      'あると安心: 光耐性 / 呪文耐性 / 炎耐性 / 雷耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id107.html' }
  },
  {
    slug: 'boss-88',
    name: '魔犬レオパルド',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'must' },
      { label: '呪いガード', priority: 'recommended' },
      { label: '毒ガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'recommended' },
      { label: '呪文耐性', priority: 'nice' },
      { label: '氷耐性', priority: 'nice' },
      { label: '闇耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: おびえガード / ブレス耐性',
      '推奨: 呪いガード / 毒ガード / 混乱ガード',
      'あると安心: 呪文耐性 / 氷耐性 / 闇耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id88.html' }
  },
  {
    slug: 'boss-106',
    name: 'プチ魔犬レオパルド',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '毒ガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'recommended' },
      { label: '呪いガード', priority: 'nice' },
      { label: '呪文耐性', priority: 'nice' },
      { label: '氷耐性', priority: 'nice' },
      { label: '混乱ガード', priority: 'nice' },
      { label: '闇耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: おびえガード / 毒ガード',
      '推奨: ブレス耐性',
      'あると安心: 呪いガード / 呪文耐性 / 氷耐性 / 混乱ガード / 闇耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id106.html' }
  },
  {
    slug: 'boss-87',
    name: 'ドラゴン',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '炎耐性', priority: 'must' },
      { label: 'ブレス耐性', priority: 'recommended' }
    ],
    highlights: [
      '必須: 炎耐性',
      '推奨: ブレス耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id87.html' }
  },
  {
    slug: 'boss-104',
    name: 'プチドラゴン',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'recommended' },
      { label: '炎耐性', priority: 'recommended' }
    ],
    highlights: [
      '推奨: ブレス耐性 / 炎耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id104.html' }
  },
  {
    slug: 'boss-86',
    name: '帝国三将軍',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪文耐性', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: 'おびえガード', priority: 'recommended' },
      { label: '眠りガード', priority: 'recommended' }
    ],
    highlights: [
      '必須: 呪文耐性 / 封印ガード / 幻惑ガード',
      '推奨: おびえガード / 眠りガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id86.html' }
  },
  {
    slug: 'boss-103',
    name: 'プチ帝国三将軍',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '呪文耐性', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '眠りガード', priority: 'recommended' }
    ],
    highlights: [
      '必須: おびえガード / 呪文耐性 / 封印ガード / 幻惑ガード',
      '推奨: 眠りガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id103.html' }
  },
  {
    slug: 'boss-81',
    name: 'ゴレオン将軍',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '呪いガード', priority: 'recommended' }
    ],
    highlights: [
      '必須: おびえガード / 幻惑ガード',
      '推奨: 呪いガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id81.html' }
  },
  {
    slug: 'boss-79',
    name: 'ゲルニック将軍',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪文耐性', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '眠りガード', priority: 'must' },
      { label: '炎耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 呪文耐性 / 封印ガード / 幻惑ガード / 眠りガード',
      'あると安心: 炎耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id79.html' }
  },
  {
    slug: 'boss-98',
    name: 'プチゲルニック将軍',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '眠りガード', priority: 'must' },
      { label: '呪文耐性', priority: 'recommended' },
      { label: '封印ガード', priority: 'recommended' },
      { label: '幻惑ガード', priority: 'recommended' },
      { label: '炎耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 眠りガード',
      '推奨: 呪文耐性 / 封印ガード / 幻惑ガード',
      'あると安心: 炎耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id98.html' }
  },
  {
    slug: 'boss-78',
    name: 'ギュメイ将軍',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'recommended' },
      { label: '光耐性', priority: 'recommended' }
    ],
    highlights: [
      '推奨: おびえガード / 光耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id78.html' }
  },
  {
    slug: 'boss-97',
    name: 'プチギュメイ将軍',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'recommended' },
      { label: '光耐性', priority: 'recommended' }
    ],
    highlights: [
      '推奨: おびえガード / 光耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id97.html' }
  },
  {
    slug: 'boss-66',
    name: 'Sキラーマシン',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id66.html' }
  },
  {
    slug: 'boss-84',
    name: 'プチSキラーマシン',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id84.html' }
  },
  {
    slug: 'boss-63',
    name: '暗黒の魔人',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'マヒガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '土耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: マヒガード / 転びガード',
      'あると安心: 土耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id63.html' }
  },
  {
    slug: 'boss-90',
    name: '暗黒の魔人強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'マヒガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '土耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: マヒガード / 転びガード',
      'あると安心: 土耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id90.html' }
  },
  {
    slug: 'boss-91',
    name: 'プチ暗黒の魔人',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id91.html' }
  },
  {
    slug: 'boss-61',
    name: 'ドン・モグーラ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '混乱ガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: 'マヒガード', priority: 'nice' },
      { label: '呪文耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: おびえガード / 幻惑ガード / 混乱ガード / 転びガード',
      'あると安心: マヒガード / 呪文耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id61.html' }
  },
  {
    slug: 'boss-83',
    name: 'プチドン・モグーラ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id83.html' }
  },
  {
    slug: 'boss-59',
    name: '幻界の四諸侯',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪文耐性', priority: 'must' },
      { label: '風耐性', priority: 'must' },
      { label: 'マヒガード', priority: 'recommended' },
      { label: '雷耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 呪文耐性 / 風耐性',
      '推奨: マヒガード',
      'あると安心: 雷耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id59.html' }
  },
  {
    slug: 'boss-73',
    name: '幻界の四諸侯強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '呪いガード', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: '混乱ガード', priority: 'must' },
      { label: '風耐性', priority: 'must' },
      { label: 'マヒガード', priority: 'recommended' },
      { label: '呪文耐性', priority: 'recommended' },
      { label: 'ブレス耐性', priority: 'nice' },
      { label: '雷耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 呪いガード / 封印ガード / 混乱ガード / 風耐性',
      '推奨: マヒガード / 呪文耐性',
      'あると安心: ブレス耐性 / 雷耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id73.html' }
  },
  {
    slug: 'boss-81',
    name: 'プチ幻界の四諸侯',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '呪いガード', priority: 'recommended' }
    ],
    highlights: [
      '必須: おびえガード / 幻惑ガード',
      '推奨: 呪いガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id81.html' }
  },
  {
    slug: 'boss-54',
    name: 'キラーマジンガ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '転びガード', priority: 'must' },
      { label: '土耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 転びガード',
      'あると安心: 土耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id54.html' }
  },
  {
    slug: 'boss-75',
    name: 'キラーマジンガ強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id75.html' }
  },
  {
    slug: 'boss-76',
    name: 'プチマジンガ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id76.html' }
  },
  {
    slug: 'boss-53',
    name: '伝説の三悪魔',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '踊りガード', priority: 'must' },
      { label: '魅了ガード', priority: 'must' },
      { label: 'おびえガード', priority: 'recommended' },
      { label: '毒ガード', priority: 'recommended' },
      { label: '転びガード', priority: 'recommended' },
      { label: 'マヒガード', priority: 'nice' }
    ],
    highlights: [
      '必須: 踊りガード / 魅了ガード',
      '推奨: おびえガード / 毒ガード / 転びガード',
      'あると安心: マヒガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id53.html' }
  },
  {
    slug: 'boss-67',
    name: '伝説の三悪魔・闘',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' },
      { label: 'マヒガード', priority: 'must' },
      { label: '毒ガード', priority: 'must' },
      { label: '踊りガード', priority: 'must' },
      { label: '転びガード', priority: 'recommended' },
      { label: '魅了ガード', priority: 'recommended' },
      { label: '呪文耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: ブレス耐性 / マヒガード / 毒ガード / 踊りガード',
      '推奨: 転びガード / 魅了ガード',
      'あると安心: 呪文耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id67.html' }
  },
  {
    slug: 'boss-82',
    name: 'プチ伝説の三悪魔',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id82.html' }
  },
  {
    slug: 'boss-46',
    name: 'グラコス',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'マヒガード', priority: 'recommended' },
      { label: '眠りガード', priority: 'recommended' },
      { label: '踊りガード', priority: 'recommended' },
      { label: 'MP吸収ガード', priority: 'nice' },
      { label: '呪いガード', priority: 'nice' },
      { label: '呪文耐性', priority: 'nice' }
    ],
    highlights: [
      '推奨: マヒガード / 眠りガード / 踊りガード',
      'あると安心: MP吸収ガード / 呪いガード / 呪文耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id46.html' }
  },
  {
    slug: 'boss-68',
    name: 'グラコス強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id68.html' }
  },
  {
    slug: 'boss-62',
    name: 'プチグラコス',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id62.html' }
  },
  {
    slug: 'boss-30',
    name: 'キングヒドラ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' },
      { label: '踊りガード', priority: 'must' },
      { label: 'おびえガード', priority: 'recommended' },
      { label: '毒ガード', priority: 'recommended' }
    ],
    highlights: [
      '必須: ブレス耐性 / 踊りガード',
      '推奨: おびえガード / 毒ガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id30.html' }
  },
  {
    slug: 'boss-58',
    name: 'キングヒドラ強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id58.html' }
  },
  {
    slug: 'boss-56',
    name: 'プチヒドラ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id56.html' }
  },
  {
    slug: 'boss-27',
    name: 'バラモス',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '封印ガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '魅了ガード', priority: 'must' }
    ],
    highlights: [
      '必須: 封印ガード / 幻惑ガード / 転びガード / 魅了ガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id27.html' }
  },
  {
    slug: 'boss-57',
    name: 'バラモス強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id57.html' }
  },
  {
    slug: 'boss-55',
    name: 'プチバラモス',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id55.html' }
  },
  {
    slug: 'boss-23',
    name: 'ドラゴンガイア',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' }
    ],
    highlights: [
      '必須: ブレス耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id23.html' }
  },
  {
    slug: 'boss-52',
    name: 'ドラゴンガイア強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'must' },
      { label: '炎耐性', priority: 'recommended' }
    ],
    highlights: [
      '必須: おびえガード / ブレス耐性',
      '推奨: 炎耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id52.html' }
  },
  {
    slug: 'boss-49',
    name: 'プチガイア',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id49.html' }
  },
  {
    slug: 'boss-16',
    name: '悪霊の神々',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '封印ガード', priority: 'must' },
      { label: '眠りガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: 'マヒガード', priority: 'recommended' },
      { label: '即死ガード', priority: 'recommended' }
    ],
    highlights: [
      '必須: 封印ガード / 眠りガード / 転びガード',
      '推奨: マヒガード / 即死ガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id16.html' }
  },
  {
    slug: 'boss-51',
    name: '悪霊の神々強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id51.html' }
  },
  {
    slug: 'boss-50',
    name: 'プチ悪霊',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id50.html' }
  },
  {
    slug: 'boss-13',
    name: 'ベリアル',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'recommended' },
      { label: 'マヒガード', priority: 'recommended' }
    ],
    highlights: [
      '推奨: ブレス耐性 / マヒガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id13.html' }
  },
  {
    slug: 'boss-37',
    name: 'ベリアル強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id37.html' }
  },
  {
    slug: 'boss-40',
    name: 'プチベリアル',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id40.html' }
  },
  {
    slug: 'boss-12',
    name: 'バズズ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '即死ガード', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: '眠りガード', priority: 'recommended' },
      { label: 'ブレス耐性', priority: 'nice' },
      { label: '呪文耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 即死ガード / 封印ガード',
      '推奨: 眠りガード',
      'あると安心: ブレス耐性 / 呪文耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id12.html' }
  },
  {
    slug: 'boss-36',
    name: 'バズズ強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id36.html' }
  },
  {
    slug: 'boss-39',
    name: 'プチバズズ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id39.html' }
  },
  {
    slug: 'boss-11',
    name: 'アトラス',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '転びガード', priority: 'must' }
    ],
    highlights: [
      '必須: 転びガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id11.html' }
  },
  {
    slug: 'boss-35',
    name: 'アトラス強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id35.html' }
  },
  {
    slug: 'boss-38',
    name: 'プチアトラス',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id38.html' }
  },
  {
    slug: 'boss-64',
    name: '牙王ゴースネル',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'マヒガード', priority: 'must' },
      { label: '呪文耐性', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: '毒ガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'recommended' },
      { label: '風耐性', priority: 'recommended' },
      { label: 'おびえガード', priority: 'nice' },
      { label: '呪いガード', priority: 'nice' }
    ],
    highlights: [
      '必須: マヒガード / 呪文耐性 / 封印ガード',
      '推奨: 毒ガード / 混乱ガード / 風耐性',
      'あると安心: おびえガード / 呪いガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id64.html' }
  },
  {
    slug: 'boss-80',
    name: 'プチゴースネル',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id80.html' }
  },
  {
    slug: 'boss-65',
    name: '輪王ザルトラ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' },
      { label: '呪いガード', priority: 'must' },
      { label: '呪文耐性', priority: 'nice' },
      { label: '氷耐性', priority: 'nice' },
      { label: '闇耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: ブレス耐性 / 呪いガード',
      'あると安心: 呪文耐性 / 氷耐性 / 闇耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id65.html' }
  },
  {
    slug: 'boss-69',
    name: '剣王ガルドリオン',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'おびえガード', priority: 'must' },
      { label: 'マヒガード', priority: 'must' },
      { label: '毒ガード', priority: 'must' },
      { label: '転びガード', priority: 'must' }
    ],
    highlights: [
      '必須: おびえガード / マヒガード / 毒ガード / 転びガード'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id69.html' }
  },
  {
    slug: 'boss-72',
    name: '震王ジュノーガ',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: '即死ガード', priority: 'must' },
      { label: '混乱ガード', priority: 'must' },
      { label: '炎耐性', priority: 'must' },
      { label: 'ブレス耐性', priority: 'nice' },
      { label: '呪文耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: 即死ガード / 混乱ガード / 炎耐性',
      'あると安心: ブレス耐性 / 呪文耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id72.html' }
  },
  {
    slug: 'boss-70',
    name: 'タロット魔人',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略ページに耐性指定が明記されていません。装備はステータス重視で調整。',
    resistances: [],
    highlights: [
      '耐性情報は極限攻略ページに未掲載。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id70.html' }
  },
  {
    slug: 'boss-74',
    name: 'タロット魔人強',
    category: 'coin',
    categoryLabel: 'COIN BOSS',
    party: null,
    summary: '極限攻略の「おすすめ耐性」を抜粋。詳細な行動はリンク参照。',
    resistances: [
      { label: 'マヒガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: 'おびえガード', priority: 'recommended' },
      { label: '呪文耐性', priority: 'recommended' },
      { label: 'ブレス耐性', priority: 'nice' }
    ],
    highlights: [
      '必須: マヒガード / 転びガード',
      '推奨: おびえガード / 呪文耐性',
      'あると安心: ブレス耐性'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_id74.html' }
},
  // End / High-end content
  {
    slug: 'regillas-lougast',
    name: '聖守護者 レギルラッゾ＆ローガスト',
    category: 'saint',
    categoryLabel: 'END CONTENT',
    release: '聖守護者 第1弾',
    difficulty: 5,
    party: '前衛2 + 後衛2',
    summary: 'ブレスと呪いが主な事故要因。ブレス耐性は全員で揃える。',
    recommended: ['戦士×2 + 賢者 + 僧侶', '魔剣士×2 + 占い師 + 僧侶'],
    resistances: [
      { label: '呪いガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'must' },
      { label: 'おびえガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'recommended' },
      { label: '幻惑ガード', priority: 'recommended' }
    ],
    highlights: [
      '「ダークネスブレス」で呪い＋ブレス大ダメージ。ブレス耐性は全員で伸ばす。',
      'ローガストの「絶対零度」に即死判定。蘇生役が落ちると立て直せない。',
      '壁とタゲ下がりを徹底し、範囲攻撃を重ねて受けない立ち回りが重要。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_tousenki1.html' }
  },
  {
    slug: 'scorpide',
    name: '聖守護者 紅殻魔スコルパイド',
    category: 'saint',
    categoryLabel: 'END CONTENT',
    release: '聖守護者 第2弾',
    difficulty: 5,
    party: '前衛2 + 後衛2',
    summary: '毒と即死が致命的。前衛も含め全員が毒100%を用意するのが最低ライン。',
    recommended: ['パラディン×2 + 賢者×2', '戦士 + パラディン + 賢者 + どうぐ使い'],
    resistances: [
      { label: '即死ガード', priority: 'must' },
      { label: '毒ガード', priority: 'must' },
      { label: '封印ガード', priority: 'recommended' },
      { label: '呪いガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'recommended' },
      { label: '幻惑ガード', priority: 'recommended' }
    ],
    highlights: [
      '「デススコルピオ」からの猛毒が即死級。毒耐性100%未満はほぼ戦力外。',
      '「邪魂冥道波」で呪い＋封印。蘇生役は呪い封印を両立する。',
      '賢者の雨管理が重要。ブレス耐性を積むと蘇生リスクが下がる。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_tousenki2.html' }
  },
  {
    slug: 'jelzark',
    name: '聖守護者 翠将鬼ジェルザーク',
    category: 'saint',
    categoryLabel: 'END CONTENT',
    release: '聖守護者 第3弾',
    difficulty: 5,
    party: '前衛1 + 後衛2 + 回復1',
    summary: '混乱・踊り・幻惑・転びが致命的。ブレス耐性も全員必須。',
    recommended: ['魔剣士 + 魔法使い×2 + 僧侶', 'まもの使い + 賢者×2 + 僧侶'],
    resistances: [
      { label: '混乱ガード', priority: 'must' },
      { label: '踊りガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'must' },
      { label: '眠りガード', priority: 'recommended' },
      { label: '封印ガード', priority: 'nice' },
      { label: '呪いガード', priority: 'nice' },
      { label: 'マヒガード', priority: 'nice' }
    ],
    highlights: [
      '「雷撃シールド」でマヒ。壁役と魔法使いともに100%ガード推奨。',
      '「蒼天魔斬」で転び判定。ターンエンド前衛は特に注意。',
      '暴れ回るラズバーンの分身を制御するためタゲ判断が超重要。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_tousenki3.html' }
  },
  {
    slug: 'gardodon',
    name: '聖守護者 剛獣鬼ガルドドン',
    category: 'saint',
    categoryLabel: 'END CONTENT',
    release: '聖守護者 第4弾',
    difficulty: 5,
    party: '前衛1 + 後衛2 + 回復1',
    summary: 'マヒ対策が重要。雷耐性も積むと安定度が上がる。',
    recommended: ['パラディン + 賢者×2 + 僧侶', '戦士 + ブーメラン賢者×2 + 僧侶'],
    resistances: [
      { label: 'マヒガード', priority: 'recommended' },
      { label: '雷耐性', priority: 'nice' }
    ],
    highlights: [
      '「嵐撃シールド」でマヒ＋被ダメ大。マヒ100%が無いと即壊滅。',
      '「獣魔の咆哮」で転び。壁役・ブメ賢者も転び100にする。',
      '雷耐性を盛ると「豪雷バースト」の致死率が大幅に下がる。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_tousenki4.html' }
  },
  {
    slug: 'barashna',
    name: '聖守護者 羅刹王バラシュナ',
    category: 'saint',
    categoryLabel: 'END CONTENT',
    release: '聖守護者 第5弾',
    difficulty: 5,
    party: '前衛2 + 後衛1 + 回復1',
    summary: '毒・即死・転びが致命的。呪文耐性も全員で揃える。',
    recommended: ['戦士×2 + 賢者 + 僧侶', 'パラディン×2 + 天地雷鳴士 + 僧侶'],
    resistances: [
      { label: '毒ガード', priority: 'must' },
      { label: '即死ガード', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '呪文耐性', priority: 'must' },
      { label: 'おびえガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'nice' },
      { label: '踊りガード', priority: 'nice' }
    ],
    highlights: [
      '毒・即死・転び・呪文耐性の4つは全員必須。どれか1つでも欠けると事故率が跳ね上がる。',
      'おびえガードがあると安定度が増す。混乱・踊りは装備に余裕があれば。',
      '呪文耐性を積むと「ドルマドン」「メラゾーマ」のダメージが大幅に軽減される。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_tousenki6.html' }
  },
  {
    slug: 'frawson',
    name: '深淵の咎人 凶禍のフラウソン',
    category: 'abyss',
    categoryLabel: 'END CONTENT',
    release: '深淵の咎人たち 第3弾',
    difficulty: 5,
    party: '前衛3 + 回復1',
    summary: '闇属性と転び対策が最優先。終盤は被ダメが跳ね上がるので軽減手段を重ねたい。',
    recommended: ['戦士×3 + 僧侶', '魔剣士×2 + まもの使い + 僧侶'],
    resistances: [
      { label: '闇耐性', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '呪いガード', priority: 'recommended' },
      { label: 'おびえガード', priority: 'recommended' },
      { label: 'ブレス耐性', priority: 'recommended' },
      { label: '風耐性', priority: 'nice' }
    ],
    highlights: [
      '「ダークネスアビス」で闇属性大ダメージ。闇耐性60%以上を目安に盛る。',
      '「ジャッジメントナイフ」後の竜巻で転び判定。転び100がないと離脱できない。',
      '終盤の連打を耐えるため、鉄壁・アビスセットなどで軽減を積む。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_togabito_boss03.html' }
  },
  {
    slug: 'rubrangis',
    name: '深淵の咎人 厭悪のルベランギス',
    category: 'abyss',
    categoryLabel: 'END CONTENT',
    release: '深淵の咎人たち 第1弾',
    difficulty: 5,
    party: '前衛2 + 後衛1 + 回復1',
    summary: '呪い・混乱が同時に飛び交う。ブレスと雷耐性のバランスを取りながら装備を組む。',
    recommended: ['戦士×2 + 賢者 + 僧侶', 'パラディン×2 + 天地雷鳴士 + 僧侶'],
    resistances: [
      { label: '呪いガード', priority: 'must' },
      { label: '混乱ガード', priority: 'must' },
      { label: 'ブレス耐性', priority: 'recommended' },
      { label: '雷耐性', priority: 'recommended' },
      { label: '転びガード', priority: 'recommended' },
      { label: '封印ガード', priority: 'nice' }
    ],
    highlights: [
      '「咎人の叫び」で呪い・混乱。行動不能で玉割りに失敗すると即壊滅。',
      '「雷雲のたまご」で雷範囲攻撃。雷耐性を盛ると棒立ちで受けられる場面が増える。',
      'ブレス攻撃も多い。賢者はブレスと雷の両立が鍵。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_togabito_boss01.html' }
  },
  {
    slug: 'aulmod',
    name: '深淵の咎人 絶念のアウルモッド',
    category: 'abyss',
    categoryLabel: 'END CONTENT',
    release: '深淵の咎人たち 第2弾',
    difficulty: 5,
    party: '前衛2 + 後衛1 + 回復1',
    summary: '呪い・マヒ・混乱が混在。ダークテンペストへの対応とキラポン運用が重要。',
    recommended: ['魔剣士×2 + 賢者 + 僧侶', '戦士×2 + 占い師 + 僧侶'],
    resistances: [
      { label: '呪いガード', priority: 'must' },
      { label: 'マヒガード', priority: 'must' },
      { label: '混乱ガード', priority: 'recommended' },
      { label: '封印ガード', priority: 'recommended' },
      { label: '闇耐性', priority: 'recommended' },
      { label: 'ブレス耐性', priority: 'nice' }
    ],
    highlights: [
      '「ダークネスフレア」で呪い＋マヒ。両方100%でないと事故率が高い。',
      '「サンダーブレード」で感電。マヒ耐性を積んだ上でテンペストを避ける。',
      '闇耐性を60%以上確保すると「奈落の門」の致死率が大きく低下。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_togabito_boss02.html' }
  },
  {
    slug: 'delmese',
    name: '聖守護者 邪蒼鎧デルメゼ',
    category: 'saint',
    categoryLabel: 'END CONTENT',
    release: '聖守護者 第6弾',
    difficulty: 5,
    party: '前衛2 + 後衛2',
    summary: '魔触とダークネスブレス、召喚ユニットの暴走呪文が重なる高難度戦。転び・ブレス耐性を最優先で揃え、壁と反射で行動を封じる。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' },
      { label: '転びガード', priority: 'must' },
      { label: '呪いガード', priority: 'recommended' },
      { label: '幻惑ガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'nice' }
    ],
    highlights: [
      '魔触は周囲に1000超ダメ＋混乱・幻惑・呪い・全属性耐性低下。範囲外に逃げるか耐性で受ける。',
      'ダークネスブレスは1500超＋呪い＋属性耐性低下。体上＋盾＋宝珠でブレス減60%以上を確保。',
      '召喚ユニットの暴走呪文にはマホカンタや退魔の鏡を合わせ、パラ壁で押し勝ちラインを維持する。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_tousenki5.html' }
  },
  {
    slug: 'wiliede',
    name: '深淵の咎人 悲愴のウィリーデ',
    category: 'abyss',
    categoryLabel: 'END CONTENT',
    release: '深淵の咎人たち 第4弾',
    difficulty: 5,
    party: '前衛2 + 後衛2',
    summary: '召喚ユニットの暴走呪文とクライレーザーが猛威を振るう魔法型同盟バトル。呪文軽減と状態異常対策が勝敗を左右する。',
    resistances: [
      { label: '呪文耐性', priority: 'must' },
      { label: 'マヒガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'must' }
    ],
    highlights: [
      '召喚ユニットのメラガイアー／ドガンテルは1700超。体上＋盾＋宝珠で呪文ダメージ減60%を確保したい。',
      'クライレーザーのマヒと幻惑を100%で防ぎ、壁役は押し勝ちライン(完封1200超)の重さを目指す。',
      'アポカリプス詠唱や召喚が見えたら陣と攻撃バフを合わせて一気に削り、敵の行動を許さない。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_togabito_boss04.html' }
  },
  {
    slug: 'nokzeria',
    name: '深淵の咎人 燦滅のノクゼリア',
    category: 'abyss',
    categoryLabel: 'END CONTENT',
    release: '深淵の咎人たち 第5弾',
    difficulty: 5,
    party: '前衛2 + 後衛2',
    summary: '呪文とブレスがともに致死級。ノクゼリアの槍やスパイクソーンを避けつつ、広域支援で生存ラインを底上げする戦い。',
    resistances: [
      { label: '呪文耐性', priority: 'must' },
      { label: 'ブレス耐性', priority: 'must' },
      { label: '転びガード', priority: 'recommended' },
      { label: '毒ガード', priority: 'nice' },
      { label: 'マヒガード', priority: 'nice' },
      { label: '呪いガード', priority: 'nice' },
      { label: '混乱ガード', priority: 'nice' }
    ],
    highlights: [
      'コーラルレインやメイルストロム、イオマータが連続するため呪文減とブレス減の両立が必須。',
      'ノクゼリアの槍はマヒ／呪い／混乱を付与する多段攻撃。避けきれない場合に備えて各耐性を盛る。',
      'スパイクソーンの転倒や継続ダメージで崩れやすい。位置取りとトライアミュレット系の支援で被弾を抑える。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_togabito_boss05.html' }
  },
  {
    slug: 'regnard',
    name: '常闇の竜レグナード',
    category: 'tokoyami',
    categoryLabel: 'END CONTENT',
    release: '常闇の聖戦',
    difficulty: 4,
    party: '前衛2 + 後衛2',
    summary: '竜の咆哮と高火力ブレスが最大の脅威。ブレス減と状態異常耐性を揃え、壁とタゲ下がりを徹底して戦う。',
    resistances: [
      { label: 'ブレス耐性', priority: 'must' },
      { label: '呪いガード', priority: 'must' },
      { label: 'マヒガード', priority: 'must' },
      { label: '封印ガード', priority: 'must' },
      { label: 'おびえガード', priority: 'nice' }
    ],
    highlights: [
      'ダークネスブレスやシャイニングブレスは1500超ダメージ。体上＋盾＋宝珠でブレス減60%以上を確保。',
      '竜の咆哮は守備低下と自己強化を付与。零の洗礼やいてつくはどうで素早く解除。',
      'パラ壁とタゲ下がりで距離を管理し、テールスイングや裁きの雷槌をまとめて受けない。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_kyouteki3.html' }
  },
  {
    slug: 'dark-king',
    name: '常闇の聖戦 ダークキング',
    category: 'tokoyami',
    categoryLabel: 'END CONTENT',
    release: '常闇の聖戦',
    difficulty: 4,
    party: '前衛2 + 後衛2',
    summary: '猛毒と範囲攻撃が連続する機械系ボス。紫雲のたつまき→ダークテンペストの連携に注意。',
    resistances: [
      { label: '毒ガード', priority: 'must' },
      { label: '幻惑ガード', priority: 'recommended' },
      { label: '風耐性', priority: 'nice' },
      { label: '闇耐性', priority: 'nice' }
    ],
    highlights: [
      '紫雲のたつまきの猛毒はどくガード100%で無効化。',
      'クリスタル召喚後はバーティカル／ホライゾンレーザーに注意しつつ迅速に破壊。',
      'ダークテンペストは外周で回避。紫雲の直後に来るパターンを覚えて引き離す。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_boss_kyouteki5.html' }
  },
  {
    slug: 'meiv',
    name: '常闇の聖戦 海冥主メイヴ',
    category: 'tokoyami',
    categoryLabel: 'END CONTENT',
    release: '常闇の聖戦',
    difficulty: 4,
    party: '前衛2 + 後衛2',
    summary: '暗黒海冥波と海冥の牙で広範囲に状態異常を撒く大盾型ボス。幻惑・マヒ対策と呪文／雷耐性が肝。',
    resistances: [
      { label: '幻惑ガード', priority: 'must' },
      { label: 'マヒガード', priority: 'must' },
      { label: '呪いガード', priority: 'recommended' },
      { label: '混乱ガード', priority: 'recommended' },
      { label: '封印ガード', priority: 'recommended' },
      { label: '呪文耐性', priority: 'nice' },
      { label: '雷耐性', priority: 'nice' }
    ],
    highlights: [
      '暗黒海冥波は呪い・混乱・封印を同時付与。キラポン＋耐性で被害を抑える。',
      '海冥の霊薬からのスタンや海冥の鎖で足を止められないよう位置取りを意識。',
      '怒り時の触手連撃は被弾が重なるのでまもりのきりや嵐耐性で軽減する。'
    ],
    source: { label: '極限攻略で詳細を見る', url: 'https://xn--10-yg4a1a3kyh.jp/dq10_kyouteki6.html' }
  }
];

const entries = rawEntries.filter((entry) => !entry.name.startsWith('プチ'));

const rewardDetailsByName = {
  'おうじょのあい': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_ojonoai.html',
    alchemy: [
      'レアドロップ率1.1倍×3',
      'or 転生モンスター出現率1.1倍×3',
      'or メタル系モンスター出現率1.1倍×3'
    ]
  },
  'アクセルギア': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_akuserugia.html',
    alchemy: [
      '行動時ターン消費しない1.5％×3つ（基礎効果と合わせて10.5％）'
    ]
  },
  'ガナン帝国の勲章': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_gananteikokunokunsho.html',
    alchemy: [
      '最大HP+2×3つ（本体で+10、忠義の勲章からの伝承で+3、合計で+19）'
    ]
  },
  'ソーサリーリング': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_so-sari-ringu.html',
    alchemy: [
      '戦闘勝利時MP回復+1×3つ'
    ]
  },
  'デスマスク': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_desumasuku.html',
    alchemy: [
      '（例）前衛用「バイキルト＋ピオラ2段階＋牙神昇誕＋あと1つ」',
      '後衛用「魔力覚醒＋早詠みの杖＋ピオラ2段階＋暴走確定」',
      '回復用「聖なる祈り＋早詠みの杖＋聖女の守り＋あと1つ」',
      '魔戦用「魔力覚醒＋早詠みの杖＋バイキルト＋あと1つ」など',
      '効果はそれぞれ甲乙つけがたいものが多く、全ての人にとって最も強い効果というのはありません。よく戦う敵の攻撃に合わせて付ける効果を考えると良いでしょう。'
    ]
  },
  'ハイドラベルト': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_haidoraberuto.html',
    alchemy: [
      'さいだいHP+9',
      'or 重さ+12'
    ]
  },
  'バトルチョーカー': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_batorucho-ka-.html',
    alchemy: [
      '攻撃力 +5×3つ'
    ]
  },
  'マーシャルピアス': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_ma-sharupiasu.html',
    alchemy: [
      '特技のダメージ+15',
      'or 呪文のダメージ+15'
    ]
  },
  'ラストチョーカー': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_rasutocho-ka-.html',
    alchemy: [
      'こうげき力+10×3つ',
      '＋第一伝承効果でこうげき力+5',
      '＋第二伝承効果でこうげき力+5'
    ]
  },
  'レメディピアス': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_remedipiasu.html',
    alchemy: [
      '特技の回復量+15',
      'or 呪文の回復量+15'
    ]
  },
  '剛勇のベルト': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_goyuunoberuto.html',
    alchemy: [
      'さいだいHP+9',
      'or おもさ+9',
      'or 開戦時25%でヘヴィチャージ×2＆おもさ3'
    ]
  },
  '各種タロットパック': {
    url: null,
    alchemy: []
  },
  '夢幻魔王の勲章': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_mugemmaonokunsho.html',
    alchemy: [
      '行動時2.0%テンション消費なし×3つ',
      'or テンション時魔物にダメージ+30×3つ（本体と合計で+190）'
    ]
  },
  '大地の大竜玉': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_daichinodairyuugyoku.html',
    alchemy: [
      'さいだいHP+5×3つ＋伝承効果でHP+5（基礎効果と合わせてHP＋50）'
    ]
  },
  '大地の竜玉': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_daichinoryuugyoku.html',
    alchemy: [
      'さいだいHP+5×3つ（基礎効果と合わせてHP＋40）'
    ]
  },
  '幻界導師のゆびわ': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_genkaidoshinoyubiwa.html',
    alchemy: [
      'こうげき魔力＋6',
      'or 呪文威力アップ +15秒'
    ]
  },
  '幻界王の首かざり': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_genkaionokubikazari.html',
    alchemy: [
      '各弱体系耐性100%＋最大HP50',
      'or 最大HP60'
    ]
  },
  '幻界闘士のゆびわ': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_genkaitoshinoyubiwa.html',
    alchemy: [
      'こうげき力＋6',
      'or 攻撃力アップ +15秒'
    ]
  },
  '忠義の勲章': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_chuuginokunsho.html',
    alchemy: [
      '会心率と呪文暴走率+0.5%×3つ',
      'or 最大HP+3×3つ（本体と合計で+11）',
      'or きようさ+5×3つ（本体と合計で+25）'
    ]
  },
  '忠誠のチョーカー': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_chuuseinocho-ka-.html',
    alchemy: [
      'こうげき力+5×3つ',
      '＋伝承効果でこうげき力+5'
    ]
  },
  '悪霊の仮面': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_akuryonokamen.html',
    alchemy: [
      '開戦時必殺チャージ+2%×3つ（基礎効果と合わせて+12％）'
    ]
  },
  '智謀の首飾り': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_chibonokubikazari.html',
    alchemy: [
      '属性ダメージ+3%'
    ]
  },
  '機神の眼甲': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_kishinnoganko.html',
    alchemy: [
      '味方死亡時聖女6%',
      'or 味方死亡時ためる6%',
      'or  さいだいHP+8'
    ]
  },
  '氷闇の月飾り': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_hyoannotsukikazari.html',
    alchemy: [
      '最大HP+4×3つ',
      'or こうげき力+3×3つ'
    ]
  },
  '海魔の眼甲': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_kaimanoganko.html',
    alchemy: [
      '魔物を倒すと5%でためる×3（基礎効果と合わせて40％）'
    ]
  },
  '炎光の勾玉': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_enkonomagatama.html',
    alchemy: [
      '最大HP+4×3つ',
      'or こうげき力+3×3つ'
    ]
  },
  '神智のゆびわ': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_shinchinoyubiwa.html',
    alchemy: [
      '開戦時100%で早詠みの杖＋死亡時10%で呪文威力上昇が残る×2（魔使・賢者・竜術用）',
      '開戦時100%で早詠みの杖＋死亡時10%で詠唱時間短縮が残る×2（僧侶・賢者等）'
    ]
  },
  '竜のうろこ': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_ryuunoroko.html',
    alchemy: [
      '最大HP+9 or 攻撃力+15'
    ]
  },
  '紫竜の煌玉': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_shiryuunokogyoku.html',
    alchemy: [
      'さいだいHP+5×3つ',
      '＋第一伝承効果でHP+5',
      '＋第二伝承効果でHP+5'
    ]
  },
  '赤竜の首かざり': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_sekiryuunokubikazari.html',
    alchemy: [
      '最大HP+9 or 攻撃力+15'
    ]
  },
  '軍神のゆびわ': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_gunshinnoyubiwa.html',
    alchemy: [
      '開戦時100%でバイシオン＋死亡時10%で攻撃力上昇が残る×2',
      '死亡時10%で攻撃力上昇が残る×3'
    ]
  },
  '邪教司祭の勲章': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_jakyoshisainokunsho.html',
    alchemy: [
      '会心と暴走ダメージ+10×3つ（第一伝承HP+3、第二伝承HP+2）'
    ]
  },
  '金のロザリオ': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_kinnorozario.html',
    alchemy: [
      '攻撃力 +15 or さいだいHP +9'
    ]
  },
  '銀のロザリオ': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_ginnorozario.html',
    alchemy: [
      '致死ダメージ時25%で生存'
    ]
  },
  '風雷のいんろう': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_fuurainoinro.html',
    alchemy: [
      '最大HP+4×3つ',
      'or こうげき力+3×3つ'
    ]
  },
  '魔人の勲章': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_majinnokunsho.html',
    alchemy: [
      '攻撃時1%でためる×3つ（本体と合計で+5％）',
      'or おもさ+2×3つ（本体と合計でおもさ+8）'
    ]
  },
  '魔犬の仮面': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_makennokamen.html',
    alchemy: [
      '必殺チャージ時効果3つ',
      '＋伝承合成で開戦時必殺チャージ+2％（基礎効果と合わせて+12％）'
    ]
  },
  '魔王のネックレス': {
    url: 'https://xn--10-yg4a1a3kyh.jp/a_acc/dq10_acc_k_maononekkuresu.html',
    alchemy: [
      '攻撃魔力 +5×3つ'
    ]
  }
};

const rewardsByBossName = {
  'Sキラーマシン': ['機神の眼甲'],
  'アトラス': ['バトルチョーカー'],
  'アトラス強': ['バトルチョーカー'],
  'アンドレアル': ['紫竜の煌玉'],
  'エビルプリースト': ['邪教司祭の勲章'],
  'キラーマジンガ': ['アクセルギア'],
  'キラーマジンガ強': ['アクセルギア'],
  'キングヒドラ': ['ハイドラベルト'],
  'キングヒドラ強': ['ハイドラベルト'],
  'ギュメイ将軍': ['忠義の勲章'],
  'グラコス': ['海魔の眼甲'],
  'グラコス強': ['海魔の眼甲'],
  'ゲルニック将軍': ['智謀の首飾り'],
  'ゴレオン将軍': ['剛勇のベルト'],
  'タイムマスター': ['軍神のゆびわ', '神智のゆびわ'],
  'タロット魔人': ['各種タロットパック'],
  'タロット魔人強': ['各種タロットパック'],
  'デスマシーン': ['デスマスク'],
  'ドラゴン': ['竜のうろこ', 'おうじょのあい'],
  'ドラゴンガイア': ['大地の竜玉'],
  'ドラゴンガイア強': ['大地の竜玉'],
  'ドン・モグーラ': ['大地の大竜玉'],
  'バズズ': ['ソーサリーリング'],
  'バズズ強': ['ソーサリーリング'],
  'バラモス': ['魔王のネックレス'],
  'バラモス強': ['魔王のネックレス'],
  'プチSキラーマシン': ['機神の眼甲'],
  'プチアトラス': ['バトルチョーカー'],
  'プチガイア': ['大地の竜玉'],
  'プチギュメイ将軍': ['忠義の勲章'],
  'プチグラコス': ['海魔の眼甲'],
  'プチゲルニック将軍': ['智謀の首飾り'],
  'プチゴースネル': ['金のロザリオ'],
  'プチドラゴン': ['竜のうろこ', 'おうじょのあい'],
  'プチドン・モグーラ': ['大地の大竜玉'],
  'プチバズズ': ['ソーサリーリング'],
  'プチバラモス': ['魔王のネックレス'],
  'プチヒドラ': ['ハイドラベルト'],
  'プチベリアル': ['銀のロザリオ'],
  'プチマジンガ': ['アクセルギア'],
  'プチムドー': ['夢幻魔王の勲章'],
  'プチ伝説の三悪魔': ['忠誠のチョーカー'],
  'プチ帝国三将軍': ['ガナン帝国の勲章'],
  'プチ幻界の四諸侯': ['幻界闘士のゆびわ', '幻界導師のゆびわ'],
  'プチ悪霊': ['悪霊の仮面'],
  'プチ暗黒の魔人': ['魔人の勲章'],
  'プチ魔犬レオパルド': ['魔犬の仮面'],
  'ベリアル': ['銀のロザリオ'],
  'ベリアル強': ['銀のロザリオ'],
  'ムドー': ['夢幻魔王の勲章'],
  '人食い火竜': ['赤竜の首かざり'],
  '伝説の三悪魔': ['忠誠のチョーカー'],
  '伝説の三悪魔・闘': ['忠誠のチョーカー'],
  '剣王ガルドリオン': ['氷闇の月飾り'],
  '帝国三将軍': ['ガナン帝国の勲章'],
  '幻界の四諸侯': ['幻界闘士のゆびわ', '幻界導師のゆびわ'],
  '幻界の四諸侯強': ['幻界闘士のゆびわ', '幻界導師のゆびわ'],
  '悪霊の神々': ['悪霊の仮面'],
  '悪霊の神々強': ['悪霊の仮面'],
  '暗黒の魔人': ['魔人の勲章'],
  '暗黒の魔人強': ['魔人の勲章'],
  '牙王ゴースネル': ['金のロザリオ'],
  '真・幻界諸侯': ['幻界王の首かざり'],
  '究極エビルプリースト': ['ラストチョーカー'],
  '結界の守護者たち': ['マーシャルピアス', 'レメディピアス'],
  '輪王ザルトラ': ['風雷のいんろう'],
  '震王ジュノーガ': ['炎光の勾玉'],
  '魔犬レオパルド': ['魔犬の仮面']
};

const recommendedByName = {
  'グラコス': ['バト・パラ・魔・僧', 'パラ・魔・賢・僧'],
  'グラコス強': ['バト/パラ/魔/僧侶', 'パラ/魔/賢/僧侶'],
  'プチグラコス': ['旅/旅/賢/僧侶', 'バト/旅/賢/僧侶'],
  'キラーマジンガ': ['パラ魔魔賢・パラ魔賢僧'],
  'キラーマジンガ強': ['パラ/魔使/魔戦/賢者', 'パラ/パラ/魔戦/僧侶'],
  'プチマジンガ': ['旅/旅/賢/僧侶', 'パラ/魔戦/賢/僧侶'],
  '真・幻界諸侯': [
    '踊り子×2 + 魔戦 + 僧侶',
    '踊り子×2 + 旅芸 + 僧侶',
    '武闘 + 踊り子 + 魔戦 + 僧侶'
  ],
  'ドン・モグーラ': ['魔/賢/賢/魔戦', '戦/戦/魔戦/僧 または 戦/戦/旅/僧', '戦/道/魔戦/僧'],
  'プチドン・モグーラ': ['戦/戦/魔戦/僧侶', '旅/旅/賢/僧侶'],
  '人食い火竜': ['武闘/レン/魔戦/僧侶', '武闘/武闘/レン/僧侶', 'レン/バト/旅芸/僧侶'],
  '結界の守護者たち': ['武闘/武闘/旅/賢', '武闘/レン/旅/賢'],
  'ゴレオン将軍': ['戦士/旅芸人 または どうぐ/僧侶', 'まも/まも/魔戦/賢者（慣れPT用）'],
  'ゲルニック将軍': ['魔剣/ガデ/賢/僧侶', '魔剣/魔剣/天地/僧侶'],
  'プチゲルニック将軍': ['旅/旅/賢/僧侶', '踊/旅/賢/僧侶'],
  '帝国三将軍': ['ブメ旅×3/占い または どうぐ', '戦/戦 または まも/踊 または 占/賢 または 僧', '踊 または まも / 踊 / 魔戦 / 賢 または 僧', '魔/魔/踊/賢 または 僧'],
  'プチ帝国三将軍': ['旅/旅/賢/僧侶', '踊/踊/旅/僧侶'],
  'ギュメイ将軍': ['戦/戦/占/僧侶', '魔剣/魔剣/賢/僧侶'],
  'プチギュメイ将軍': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  'Sキラーマシン': ['パラ/魔使/魔戦/賢者', 'パラ/パラ/魔戦/僧侶'],
  'プチSキラーマシン': ['旅/旅/賢/僧侶', 'パラ/魔戦/賢/僧侶'],
  'ドラゴン': ['魔剣/魔剣/レン/回復', 'まも/まも/魔戦/賢者', '武闘/武闘/どう または 魔戦/僧侶 または 賢者'],
  'プチドラゴン': ['まも/レン/賢/僧侶', '旅/旅/賢/僧侶'],
  'ドラゴンガイア': ['パラ/パラ/魔戦/僧侶', '戦/戦/魔戦/僧侶'],
  'ドラゴンガイア強': ['パラ/魔使/魔戦/僧侶', 'パラ/パラ/魔戦/賢者'],
  'プチガイア': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  'キングヒドラ': ['パラ/パラ/魔戦/僧侶', '魔剣/魔剣/レン/賢者'],
  'キングヒドラ強': ['パラ/魔使/魔戦/賢者', 'パラ/パラ/魔戦/僧侶'],
  'プチヒドラ': ['旅/旅/賢/僧侶', 'まも/旅/賢/僧侶'],
  '魔犬レオパルド': ['まも/まも/魔戦/レン（高速周回用）', '武闘/武闘/賢者/魔戦 または 旅芸 または どうぐ', '旅/旅/賢/魔戦 または レン または どうぐ または 天地', 'まも/まも/賢者/魔戦（Ver6定番）'],
  'プチ魔犬レオパルド': ['旅/旅/賢/僧侶', 'まも/旅/賢/僧侶'],
  'ムドー': ['魔剣/魔剣/賢者/どうぐ または 旅芸', '魔剣/魔剣/魔戦/どうぐ または 旅芸'],
  'プチムドー': ['踊/旅/賢/僧侶', '魔剣/旅/賢/僧侶'],
  '伝説の三悪魔': ['戦/戦/旅/僧侶', 'まも/まも/賢/僧侶'],
  '伝説の三悪魔・闘': ['戦/戦/賢/僧侶', 'まも/旅/賢/僧侶'],
  'プチ伝説の三悪魔': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  '暗黒の魔人': ['戦/戦/道/僧侶', 'まも/まも/どう/賢者'],
  '暗黒の魔人強': ['戦/戦/占/僧侶', 'まも/まも/どう/僧侶'],
  'プチ暗黒の魔人': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  'アンドレアル': ['魔剣/旅2/どう または 魔剣2/旅/どう または 旅3/どう', '海賊/旅/僧侶/魔剣 または 旅', 'サポ討伐：旅芸3/盗賊（マヒ腕推奨）'],
  '幻界の四諸侯': ['踊/踊/旅/僧侶', '踊/旅/賢/僧侶'],
  '幻界の四諸侯強': ['踊/踊/旅/賢', '旅/旅/賢/僧侶'],
  'プチ幻界の四諸侯': ['旅/旅/賢/僧侶', '踊/旅/賢/僧侶'],
  'エビルプリースト': ['まも/まも/魔戦/旅芸（高速周回用）'],
  '究極エビルプリースト': ['アタッカー2/レン/僧侶', 'ヤリパラ2/僧侶/レン または 道具 または 海賊'],
  'バラモス': ['パラ/魔使/魔戦/僧侶', 'パラ/パラ/魔戦/僧侶'],
  'バラモス強': ['パラ/パラ/魔戦/賢者', '戦/戦/魔戦/僧侶'],
  'プチバラモス': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  '悪霊の神々': ['戦/戦/旅/僧侶', 'まも/旅/賢/僧侶'],
  '悪霊の神々強': ['戦/戦/賢/僧侶', '旅/旅/賢/僧侶'],
  'プチ悪霊': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  'ベリアル': ['パラ/魔使/魔戦/僧侶', 'パラ/パラ/魔戦/僧侶'],
  'ベリアル強': ['パラ/魔使/魔戦/賢者', '戦/戦/魔戦/僧侶'],
  'プチベリアル': ['旅/旅/賢/僧侶', 'パラ/旅/賢/僧侶'],
  'バズズ': ['パラ/魔使/魔戦/僧侶', 'パラ/旅/賢/僧侶'],
  'バズズ強': ['パラ/魔使/魔戦/賢者', '戦/旅/賢/僧侶'],
  'プチバズズ': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  'アトラス': ['戦/戦/旅/僧侶', 'バト/バト/旅/僧侶'],
  'アトラス強': ['戦/戦/賢/僧侶', 'バト/旅/賢/僧侶'],
  'プチアトラス': ['旅/旅/賢/僧侶', 'バト/旅/賢/僧侶'],
  '牙王ゴースネル': ['まも/旅/賢/僧侶', 'パラ/旅/賢/僧侶'],
  'プチゴースネル': ['旅/旅/賢/僧侶', '戦/旅/賢/僧侶'],
  '輪王ザルトラ': ['パラ/魔使/魔戦/僧侶', 'まも/旅/賢/僧侶'],
  '剣王ガルドリオン': ['パラ/武/魔戦/僧侶', '戦/旅/賢/僧侶'],
  '震王ジュノーガ': ['戦/戦/賢/僧侶', 'まも/旅/賢/僧侶'],
  'タロット魔人': ['占/占/旅/僧侶', '占/占/賢/僧侶'],
  'タロット魔人強': ['占/占/旅/僧侶', '占/占/賢/僧侶'],
  '聖守護者 邪蒼鎧デルメゼ': ['まも/まも/賢者/どうぐ', '武闘/魔戦/賢者/どうぐ'],
  '深淵の咎人 悲愴のウィリーデ': ['パラ/魔法/竜術/賢者', 'パラ/賢者/魔戦/僧侶'],
  '深淵の咎人 燦滅のノクゼリア': ['隠者/海賊/武闘/僧侶', 'パラ/隠者/海賊/賢者'],
  '聖守護者 レギルラッゾ＆ローガスト': ['僧侶/天地/魔法/魔法', '僧侶/賢者/魔戦/魔法'],
  '聖守護者 紅殻魔スコルパイド': ['まも/まも/賢者/どうぐ', '武闘/武闘/賢者/どうぐ'],
  '聖守護者 翠将鬼ジェルザーク': ['僧侶/賢者/魔法/魔法', '僧侶/賢者/天地/魔法'],
  '聖守護者 剛獣鬼ガルドドン': ['賢者/賢者/僧侶/魔戦', '賢者/賢者/天地/どうぐ'],
  '聖守護者 羅刹王バラシュナ': ['僧侶/賢者/賢者/どうぐ', '僧侶/賢者/賢者/天地'],
  '深淵の咎人 凶禍のフラウソン': ['魔剣/魔剣/賢者/僧侶', '武闘/魔剣/賢者/僧侶'],
  '深淵の咎人 厭悪のルベランギス': ['まも/まも/賢者/僧侶', '魔剣/魔剣/賢者/僧侶'],
  '深淵の咎人 絶念のアウルモッド': ['武闘/魔剣/賢者/僧侶', '魔剣/魔剣/賢者/どうぐ'],
  '常闇の竜レグナード': ['パラ/戦/賢/僧侶', '戦/戦/賢/僧侶'],
  '常闇の聖戦 ダークキング': ['戦/戦/賢/僧侶', 'まも/まも/賢/僧侶'],
  '常闇の聖戦 海冥主メイヴ': ['戦/戦/賢/僧侶', 'まも/まも/賢/僧侶'],
  'タイムマスター': ['武闘/盗賊/魔戦/旅芸（即効構成）', 'ガデ/火力/魔戦/賢者（安定構成）'],
  'デスマシーン': ['魔使/僧侶/賢者/竜術', '魔使/魔戦/賢者/竜術（高速周回用）']
};

const cleanRecommendedText = (text) =>
  text
    .replace(/[「」]/g, '')
    .replace(/or/gi, 'または')
    .replace(/＠/g, '')
    .replace(/\\/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\/+/g, '/')
    .replace(/\s*または\s*/g, ' または ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/,$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .replace(/\/$/, '');

entries.forEach((entry) => {
  const raw = recommendedByName[entry.name];
  entry.recommended = raw ? raw.map((item) => cleanRecommendedText(item)) : [];
  entry.jobTags = extractJobsFromRecommended(entry.recommended);
  const rewardNames = rewardsByBossName[entry.name];
  entry.rewards = rewardNames
    ? rewardNames.map((rewardName) => {
        const detail = rewardDetailsByName[rewardName] ?? {};
        const alchemyList = Array.isArray(detail.alchemy) ? [...detail.alchemy] : [];
        return {
          name: rewardName,
          url: detail.url ?? null,
          alchemy: alchemyList
        };
      })
    : [];
  const imageKey = entry.imageKey ?? entry.slug ?? null;
  entry.imageCandidates = imageKey ? buildImageCandidates(imageKey) : [];
});

const entriesByCategory = entries.reduce((acc, entry) => {
  if (!acc[entry.category]) {
    acc[entry.category] = [];
  }
  acc[entry.category].push(entry);
  return acc;
}, {});

const requestedMode = document.body.dataset.mode ?? 'coin';
const mode = entriesByCategory[requestedMode] ? requestedMode : 'coin';
const allCoinEntries = entriesByCategory.coin ?? [];
const nonCoinEntries = Object.entries(entriesByCategory)
  .filter(([key]) => key !== 'coin')
  .flatMap(([, list]) => list);
const allEndEntries = nonCoinEntries;
const activeEntries = entriesByCategory[mode] ?? allCoinEntries;

const state = {
  search: '',
  resistances: new Set(),
  jobs: new Set(),
  activeFilterGroup: ''
};

let elements = {};

const getDifficultyStars = (value) => {
  const max = 5;
  return '★'.repeat(value) + '☆'.repeat(Math.max(0, max - value));
};

const updateHeroStats = () => {
  if (elements.heroCoinCount) {
    elements.heroCoinCount.textContent = allCoinEntries.length.toString();
  }
  if (elements.heroEndCount) {
    elements.heroEndCount.textContent = nonCoinEntries.length.toString();
  }
  if (elements.heroResistCount) {
    const activeResistances = new Set(activeEntries.flatMap((entry) => entry.resistances.map((r) => r.label)));
    elements.heroResistCount.textContent = activeResistances.size.toString();
  }
};

// デバウンス用ヘルパー関数
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// render関数の前方宣言（後で定義）
let render;

const buildResistanceFilters = () => {
  if (!elements.resistanceFilters) return;

  const labels = new Set(activeEntries.flatMap((entry) => entry.resistances.map((r) => r.label)));
  const sorted = Array.from(labels).sort((a, b) => {
    const ga = resistanceMeta[a]?.group ?? '';
    const gb = resistanceMeta[b]?.group ?? '';
    if (ga === gb) return a.localeCompare(b, 'ja');
    return ga.localeCompare(gb, 'ja');
  });

  const grouped = new Map();
  sorted.forEach((label) => {
    const meta = resistanceMeta[label] ?? { group: 'その他' };
    if (!grouped.has(meta.group)) {
      grouped.set(meta.group, []);
    }
    grouped.get(meta.group).push(label);
  });

  const fragment = document.createDocumentFragment();
  const nav = document.createElement('div');
  nav.className = 'filter-groups-nav';
  const panelsWrapper = document.createElement('div');
  panelsWrapper.className = 'filter-group-panels';

  const buttons = new Map();
  const panels = new Map();
  const groupNames = Array.from(grouped.keys());
  if (!state.activeFilterGroup && groupNames.length > 0) {
    state.activeFilterGroup = groupNames[0];
  }

  const handleGroupChange = (targetGroup) => {
    state.activeFilterGroup = targetGroup;
    buttons.forEach((btn, name) => {
      btn.dataset.active = name === targetGroup ? 'true' : 'false';
    });
    panels.forEach((panel, name) => {
      panel.hidden = name !== targetGroup;
    });
  };

  // イベント委譲: navボタン用
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-groups-nav__btn');
    if (btn && btn.dataset.group) {
      handleGroupChange(btn.dataset.group);
    }
  });

  groupNames.forEach((groupName) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-groups-nav__btn';
    btn.textContent = groupName;
    btn.dataset.group = groupName;
    nav.appendChild(btn);
    buttons.set(groupName, btn);

    const panel = document.createElement('div');
    panel.className = 'filter-group-panel';
    panel.dataset.group = groupName;

    const label = document.createElement('div');
    label.className = 'filter-group-panel__label';
    label.textContent = `${groupName} (${grouped.get(groupName).length})`;
    panel.appendChild(label);

    const chipsWrap = document.createElement('div');
    chipsWrap.className = 'filter-group__chips';

    grouped.get(groupName).forEach((labelText) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'filter-chip';
      chip.textContent = labelText;
      chip.dataset.label = labelText;
      chip.dataset.active = state.resistances.has(labelText) ? 'true' : 'false';
      chip.title = resistanceMeta[labelText]?.description ?? labelText;
      chipsWrap.appendChild(chip);
    });

    panel.appendChild(chipsWrap);
    panelsWrapper.appendChild(panel);
    panels.set(groupName, panel);
  });

  // イベント委譲: フィルターチップ用
  panelsWrapper.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (chip && chip.dataset.label) {
      const labelText = chip.dataset.label;
      const isActive = chip.dataset.active === 'true';
      if (isActive) {
        chip.dataset.active = 'false';
        state.resistances.delete(labelText);
      } else {
        chip.dataset.active = 'true';
        state.resistances.add(labelText);
      }
      render();
    }
  });

  fragment.appendChild(nav);
  fragment.appendChild(panelsWrapper);
  elements.resistanceFilters.replaceChildren(fragment);
  handleGroupChange(state.activeFilterGroup);
};

const clearResistanceSelections = () => {
  if (!elements.resistanceFilters) return;

  state.resistances.clear();
  elements.resistanceFilters
    .querySelectorAll('.filter-chip[data-active="true"]')
    .forEach((chip) => {
      chip.dataset.active = 'false';
    });
  render();
};

const buildJobFilters = () => {
  if (!elements.jobFilters) return;

  const jobs = new Set(activeEntries.flatMap((entry) => entry.jobTags ?? []));
  const sorted = Array.from(jobs).sort((a, b) => a.localeCompare(b, 'ja'));

  if (sorted.length === 0) {
    elements.jobFilters.textContent = 'おすすめ構成の職業データがありません。';
    if (elements.clearJobs) {
      elements.clearJobs.disabled = true;
    }
    return;
  }

  const fragment = document.createDocumentFragment();
  sorted.forEach((job) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'filter-chip';
    chip.textContent = job;
    chip.dataset.job = job;
    chip.dataset.active = state.jobs.has(job) ? 'true' : 'false';
    fragment.appendChild(chip);
  });

  elements.jobFilters.replaceChildren(fragment);
  if (elements.clearJobs) {
    elements.clearJobs.disabled = false;
  }
};

const clearJobSelections = () => {
  if (!elements.jobFilters) return;

  state.jobs.clear();
  elements.jobFilters.querySelectorAll('.filter-chip[data-active="true"]').forEach((chip) => {
    chip.dataset.active = 'false';
  });
  render();
};

const filterEntries = () => {
  const keyword = state.search.trim().toLowerCase();
  return activeEntries.filter((entry) => {
    if (state.resistances.size > 0) {
      const entryResLabels = entry.resistances.map((r) => r.label);
      for (const label of state.resistances) {
        if (!entryResLabels.includes(label)) {
          return false;
        }
      }
    }

    if (state.jobs.size > 0) {
      const entryJobs = entry.jobTags ?? [];
      for (const job of state.jobs) {
        if (!entryJobs.includes(job)) {
          return false;
        }
      }
    }

    if (keyword) {
      const haystack = [
        entry.name,
        entry.summary,
        entry.resistances.map((r) => r.label).join(' '),
        (entry.recommended ?? []).join(' '),
        (entry.rewards ?? []).flatMap((reward) => [reward.name, ...(reward.alchemy ?? [])]).join(' '),
        entry.highlights.join(' ')
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(keyword)) {
        return false;
      }
    }

    return true;
  });
};

const createBossImage = (entry) => {
  if (!entry.imageCandidates || entry.imageCandidates.length === 0) return null;

  const wrapper = document.createElement('div');
  wrapper.className = 'card__image';
  if (imageShiftDownNames.has(entry.name)) {
    wrapper.classList.add('card__image--shift-down');
  }
  if (imageShiftUpNames.has(entry.name)) {
    wrapper.classList.add('card__image--shift-up');
  }
  wrapper.dataset.loaded = 'false';

  const img = document.createElement('img');
  img.loading = 'lazy';
  img.decoding = 'async';
  img.alt = `${entry.name}の画像`;

  let attemptIndex = 0;
  const tryNextSource = () => {
    if (attemptIndex >= entry.imageCandidates.length) {
      wrapper.remove();
      return;
    }
    img.src = entry.imageCandidates[attemptIndex++];
  };

  img.addEventListener('load', () => {
    wrapper.dataset.loaded = 'true';
  });

  img.addEventListener('error', () => {
    tryNextSource();
  });

  tryNextSource();
  wrapper.appendChild(img);
  return wrapper;
};

const createCard = (entry, index) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.category = entry.category;
  card.dataset.categoryLabel = entry.categoryLabel;
  card.style.setProperty('--card-delay', `${index * 60}ms`);

  const header = document.createElement('div');
  header.className = 'card__header';

  const title = document.createElement('h3');
  title.className = 'card__title';
  title.textContent = entry.name;
  header.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'card__meta';

  if (entry.release) {
    const releaseChip = document.createElement('span');
    releaseChip.className = 'meta-chip';
    releaseChip.textContent = entry.release;
    meta.appendChild(releaseChip);
  }

  if (entry.party) {
    const partyChip = document.createElement('span');
    partyChip.className = 'meta-chip';
    partyChip.textContent = `推奨: ${entry.party}`;
    meta.appendChild(partyChip);
  }

  if (entry.difficulty) {
    const diffChip = document.createElement('span');
    diffChip.className = 'meta-chip';
    diffChip.textContent = `難度 ${getDifficultyStars(entry.difficulty)}`;
    meta.appendChild(diffChip);
  } else if (entry.difficultyNote) {
    const diffNoteChip = document.createElement('span');
    diffNoteChip.className = 'meta-chip';
    diffNoteChip.textContent = entry.difficultyNote;
    meta.appendChild(diffNoteChip);
  }

  if (meta.childElementCount > 0) {
    header.appendChild(meta);
  }

  const bossImage = createBossImage(entry);

  const summary = document.createElement('p');
  summary.className = 'card__summary';
  summary.textContent = entry.summary;

  const fragments = [];

  if (entry.rewards && entry.rewards.length > 0) {
    const lootBlock = document.createElement('div');
    lootBlock.className = 'card__loot';

    const lootTitle = document.createElement('div');
    lootTitle.className = 'card__loot-title';
    lootTitle.textContent = '討伐報酬 / おすすめ錬金';
    lootBlock.appendChild(lootTitle);

    const lootList = document.createElement('div');
    lootList.className = 'loot-list';

    entry.rewards.forEach((reward) => {
      const item = document.createElement('div');
      item.className = 'loot-item';

      const nameEl = reward.url ? document.createElement('a') : document.createElement('span');
      nameEl.className = 'loot-item__name';
      nameEl.textContent = reward.name;
      if (reward.url) {
        nameEl.classList.add('loot-item__name--link');
        nameEl.href = reward.url;
        nameEl.target = '_blank';
        nameEl.rel = 'noopener noreferrer';
      }
      item.appendChild(nameEl);

      if (reward.alchemy && reward.alchemy.length > 0) {
        const comboList = document.createElement('ul');
        comboList.className = 'loot-item__alchemy';
        reward.alchemy.forEach((combo) => {
          const li = document.createElement('li');
          li.textContent = combo;
          comboList.appendChild(li);
        });
        item.appendChild(comboList);
      }

      lootList.appendChild(item);
    });

    lootBlock.appendChild(lootList);
    fragments.push(lootBlock);
  }

  if (entry.recommended && entry.recommended.length > 0) {
    console.log(`[DEBUG] ${entry.name}: recommended =`, entry.recommended);
    const jobsBlock = document.createElement('div');
    jobsBlock.className = 'card__jobs';

    const jobsTitle = document.createElement('div');
    jobsTitle.className = 'card__jobs-title';
    jobsTitle.textContent = 'おすすめ構成';
    jobsBlock.appendChild(jobsTitle);

    const jobsList = document.createElement('ul');
    jobsList.className = 'card__jobs-list';

    entry.recommended.forEach((combo) => {
      const li = document.createElement('li');
      li.textContent = combo;
      jobsList.appendChild(li);
    });

    jobsBlock.appendChild(jobsList);
    fragments.push(jobsBlock);
  }

  if (entry.resistances.length > 0) {
    const resistanceGroups = document.createElement('div');
    resistanceGroups.className = 'resistance-group';

    ['must', 'recommended', 'nice'].forEach((priority) => {
      const items = entry.resistances.filter((r) => r.priority === priority);
      if (items.length === 0) return;

      const block = document.createElement('div');
      block.className = 'resistance-group__block';

      const heading = document.createElement('div');
      heading.className = 'resistance-group__title';
      heading.textContent = priorityLabels[priority];
      block.appendChild(heading);

      const chips = document.createElement('div');
      chips.className = 'resistance-chips';

      items.forEach((item) => {
        const chip = document.createElement('span');
        chip.className = 'resistance-chip';
        chip.dataset.priority = item.priority;
        chip.textContent = item.label;
        chips.appendChild(chip);
      });

      block.appendChild(chips);
      resistanceGroups.appendChild(block);
    });

    fragments.push(resistanceGroups);
  }

  const notes = document.createElement('div');
  notes.className = 'card__notes';
  const list = document.createElement('ul');
  entry.highlights.forEach((point) => {
    const li = document.createElement('li');
    li.textContent = point;
    list.appendChild(li);
  });
  notes.appendChild(list);

  card.appendChild(header);
  if (bossImage) {
    card.appendChild(bossImage);
  }
  card.appendChild(summary);
  fragments.forEach((fragment) => card.appendChild(fragment));
  card.appendChild(notes);

  if (entry.source?.url) {
    const footer = document.createElement('div');
    footer.className = 'card__footer';
    const link = document.createElement('a');
    link.className = 'card__link';
    link.href = entry.source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = entry.source.label ?? '詳細を見る';
    footer.appendChild(link);
    card.appendChild(footer);
  }

  return card;
};

render = () => {
  if (!elements.cardsContainer) return;

  const filtered = filterEntries();
  elements.cardsContainer.replaceChildren();

  if (elements.visibleCount) {
    elements.visibleCount.textContent = `${filtered.length} 件表示`;
  }

  if (filtered.length === 0) {
    if (elements.emptyState) elements.emptyState.hidden = false;
    return;
  }

  if (elements.emptyState) elements.emptyState.hidden = true;

  filtered.forEach((entry, idx) => {
    elements.cardsContainer.appendChild(createCard(entry, idx));
  });
};

// 検索入力用のデバウンス版render（連続入力に対応）
const debouncedRender = debounce(render, 150);

const bindEvents = () => {
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', (event) => {
      state.search = event.target.value;
      debouncedRender();
    });
  }

  if (elements.clearResistances) {
    elements.clearResistances.addEventListener('click', clearResistanceSelections);
  }

  if (elements.jobFilters) {
    elements.jobFilters.addEventListener('click', (event) => {
      const chip = event.target.closest('.filter-chip');
      if (!chip || !chip.dataset.job) return;
      const job = chip.dataset.job;
      const isActive = chip.dataset.active === 'true';
      if (isActive) {
        chip.dataset.active = 'false';
        state.jobs.delete(job);
      } else {
        chip.dataset.active = 'true';
        state.jobs.add(job);
      }
      render();
    });
  }

  if (elements.clearJobs) {
    elements.clearJobs.addEventListener('click', clearJobSelections);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // DOM要素の初期化
  elements = {
    cardsContainer: document.getElementById('cards'),
    emptyState: document.getElementById('emptyState'),
    visibleCount: document.getElementById('visibleCount'),
    heroCoinCount: document.getElementById('coinCount'),
    heroEndCount: document.getElementById('endCount'),
    heroResistCount: document.getElementById('resistCount'),
    searchInput: document.getElementById('searchInput'),
    resistanceFilters: document.getElementById('resistanceFilters'),
    clearResistances: document.getElementById('clearResistances'),
    jobFilters: document.getElementById('jobFilters'),
    clearJobs: document.getElementById('clearJobs')
  };

  buildResistanceFilters();
  buildJobFilters();
  updateHeroStats();
  bindEvents();
  render();
});
