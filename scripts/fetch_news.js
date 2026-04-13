import Parser from "rss-parser";
import fs from "fs";
import path from "path";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; MacroDailyBot/1.0; +https://example.com)"
  }
});

const feeds = [
  // =========================
  // Global Crypto
  // =========================
  { source: "CoinDesk", category: "crypto", market: "global", lang: "en", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { source: "FXStreet", category: "crypto", market: "global", lang: "en", url: "https://www.fxstreet.com/rss/crypto" },
  { source: "Investing", category: "crypto", market: "global", lang: "en", url: "https://www.investing.com/rss/302.rss" },

  // =========================
  // Global FX / Macro
  // =========================
  { source: "FXStreet", category: "fx", market: "global", lang: "en", url: "https://www.fxstreet.com/rss/news" },
  { source: "FXStreet", category: "fx_analysis", market: "global", lang: "en", url: "https://www.fxstreet.com/rss/analysis" },
  { source: "Investing", category: "fx", market: "global", lang: "en", url: "https://www.investing.com/rss/forex.rss" },
  { source: "Investing", category: "macro", market: "global", lang: "en", url: "https://www.investing.com/rss/market_overview.rss" },
  { source: "Investing", category: "macro", market: "global", lang: "en", url: "https://www.investing.com/rss/market_overview_Fundamental.rss" },

  // =========================
  // Global Stocks / Risk sentiment
  // =========================
  { source: "FXStreet", category: "stocks", market: "global", lang: "en", url: "https://www.fxstreet.com/rss/stocks" },
  { source: "Investing", category: "stocks", market: "global", lang: "en", url: "https://www.investing.com/rss/stock.rss" },

  // =========================
  // Japan Crypto (candidate feeds commonly used on WordPress-style sites)
  // =========================
  { source: "CoinPost", category: "crypto", market: "jp", lang: "ja", url: "https://coinpost.jp/feed" },
  { source: "CoinPost", category: "crypto", market: "jp", lang: "ja", url: "https://coinpost.jp/?feed=rss2" },
  { source: "CoinDesk Japan", category: "crypto", market: "jp", lang: "ja", url: "https://www.coindeskjapan.com/feed/" },

  // =========================
  // Japan FX / Macro
  // ※ 外為どっとコムはサイト/サービス提供自体は確認できるが、
  //    検索結果だけでは確実なRSSエンドポイントを断定しきれないため、
  //    一旦コメントアウト。URL確認後に有効化推奨。
  // =========================
  // { source: "外為どっとコム", category: "fx", market: "jp", lang: "ja", url: "https://www.gaitame.com/???/feed" },

  // =========================
  // Optional candidates (verify manually before enabling)
  // =========================
  // { source: "みんかぶFX", category: "fx", market: "jp", lang: "ja", url: "https://fx.minkabu.jp/news/rss" },
  // { source: "Reuters JP", category: "macro", market: "jp", lang: "ja", url: "https://jp.reuters.com/rssFeed/topNews" },
];

const rawDir = "data/raw";
const outputPath = path.join(rawDir, "news.json");

const MAX_ITEMS_PER_FEED = 12;
const MAX_TOTAL_ITEMS = 140;

const SOURCE_PRIORITY = {
  "CoinDesk": 100,
  "FXStreet": 95,
  "Investing": 90,
  "CoinDesk Japan": 85,
  "CoinPost": 82,
  "Reuters JP": 98,
  "外為どっとコム": 75,
  "みんかぶFX": 72
};

function normalizeText(text = "") {
  return text
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase();
}

function parsePubDate(value) {
  const time = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(time) ? 0 : time;
}

function normalizeCategory(category = "") {
  const value = String(category).trim().toLowerCase();

  if (["forex"].includes(value)) return "fx";
  if (["macro_fundamental"].includes(value)) return "macro";
  return value;
}

function buildDedupKey(item) {
  return `${normalizeText(item.title)}__${normalizeText(item.link)}`;
}

function scoreItem(item) {
  const pubScore = parsePubDate(item.pubDate);
  const sourceScore = SOURCE_PRIORITY[item.source] || 0;
  const jpBoost = item.market === "jp" ? 5 : 0;
  return { pubScore, sourceScore, jpBoost };
}

function sortItems(a, b) {
  const aScore = scoreItem(a);
  const bScore = scoreItem(b);

  if (bScore.pubScore !== aScore.pubScore) {
    return bScore.pubScore - aScore.pubScore;
  }

  if (bScore.sourceScore !== aScore.sourceScore) {
    return bScore.sourceScore - aScore.sourceScore;
  }

  if (bScore.jpBoost !== aScore.jpBoost) {
    return bScore.jpBoost - aScore.jpBoost;
  }

  return 0;
}

function shouldKeepItem(item) {
  if (!item.title || !item.link) return false;

  const title = normalizeText(item.title);

  // ノイズ軽減
  const blockedWords = [
    "sponsored",
    "advertisement",
    "promo",
    "pr:",
    "pr ",
    "タイアップ",
    "広告",
    "スポンサー"
  ];

  if (blockedWords.some((word) => title.includes(word))) {
    return false;
  }

  return true;
}

async function fetchOneFeed(feedConfig) {
  const { source, category, market, lang, url } = feedConfig;

  try {
    console.log(`Fetching: [${source}/${category}/${market}] ${url}`);

    const feed = await parser.parseURL(url);

    const items = (feed.items || [])
      .slice(0, MAX_ITEMS_PER_FEED)
      .map((item) => ({
        source,
        category: normalizeCategory(category),
        market,
        lang,
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || "",
        contentSnippet: item.contentSnippet || item.content || ""
      }))
      .filter(shouldKeepItem);

    console.log(`Done: [${source}/${category}/${market}] ${items.length} items`);
    return items;
  } catch (error) {
    console.error(`Failed: [${source}/${category}/${market}] ${url}`);
    console.error(error?.message || error);
    return [];
  }
}

async function fetchNews() {
  const allItems = [];

  for (const feed of feeds) {
    const items = await fetchOneFeed(feed);
    allItems.push(...items);
  }

  // タイトル + リンクで重複除去
  const seen = new Set();
  const deduped = [];

  for (const item of allItems) {
    const key = buildDedupKey(item);
    if (!shouldKeepItem(item) || seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  // ソート
  deduped.sort(sortItems);

  // 件数制限
  const finalArticles = deduped.slice(0, MAX_TOTAL_ITEMS);

  if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(finalArticles, null, 2), "utf-8");

  console.log(`Saved news.json (${finalArticles.length} items)`);

  // 集計ログ
  const stats = finalArticles.reduce((acc, item) => {
    const key = `${item.market}/${item.category}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  console.log("Stats by market/category:");
  for (const [key, count] of Object.entries(stats).sort()) {
    console.log(`- ${key}: ${count}`);
  }

  if (finalArticles.length === 0) {
    throw new Error("ニュースを1件も取得できませんでした。");
  }
}

fetchNews().catch((error) => {
  console.error("Fetch failed:");
  console.error(error);
  process.exit(1);
});
