import "dotenv/config";
import fs from "fs";
import path from "path";

const siteDir = "site";
const postsDir = path.join(siteDir, "posts");
const siteUrl = (process.env.SITE_URL || "https://YOUR_USERNAME.github.io/macro-daily").replace(/\/$/, "");
const heroImageRelativePath = "site/assets/img/hero.jpg";
const heroImageFsPath = path.join(siteDir, "assets", "img", "hero.jpg");

if (!fs.existsSync(postsDir)) {
  console.error("site/posts がありません。先に build を実行してください。");
  process.exit(1);
}

const categoryConfigs = {
  fx: {
    outputPath: "fx.html",
    pageTitle: "FX記事一覧｜Macro Daily",
    heroTitle: "FX記事一覧",
    heroDescription: "USD/JPY・金利・地政学・マクロ材料を中心に整理した記事一覧です。",
    canonical: `${siteUrl}/fx.html`
  },
  crypto: {
    outputPath: "crypto.html",
    pageTitle: "暗号資産記事一覧｜Macro Daily",
    heroTitle: "暗号資産記事一覧",
    heroDescription: "主要コインの地合い、テーマ、個別プロジェクト進捗を整理した記事一覧です。",
    canonical: `${siteUrl}/crypto.html`
  }
};

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getPostTypeLabel(type) {
  if (type === "fx") return "FX";
  if (type === "crypto") return "CRYPTO";
  return "OTHER";
}

function getPostTypeClass(type) {
  if (type === "fx") return "fx";
  if (type === "crypto") return "crypto";
  return "other";
}

function readPostMeta(file) {
  const name = file.replace(".html", "");
  const [type, date] = name.split(/-(.+)/);
  const dailyPath = path.join("data", "daily", `${name}.json`);

  let seoTitle = `Macro Daily ${name}`;
  let seoDescription = "デイリーまとめ記事です。";

  if (fs.existsSync(dailyPath)) {
    try {
      const daily = JSON.parse(fs.readFileSync(dailyPath, "utf-8"));
      seoTitle = daily.seoTitle || seoTitle;
      seoDescription = daily.seoDescription || seoDescription;
    } catch (error) {
      console.error(`Failed to parse ${dailyPath}`);
      console.error(error);
    }
  }

  return {
    type,
    typeLabel: getPostTypeLabel(type),
    typeClass: getPostTypeClass(type),
    date,
    file,
    relativeUrl: `./site/posts/${file}`,
    title: seoTitle,
    description: seoDescription
  };
}

function buildCard(post) {
  return `
    <article class="article-card">
      <div class="card-meta-row">
        <span class="card-badge card-badge-${post.typeClass}">${escapeHtml(post.typeLabel)}</span>
        <span class="card-meta">${escapeHtml(post.date)}</span>
      </div>
      <a href="${post.relativeUrl}" class="card-title">${escapeHtml(post.title)}</a>
      <p class="card-description">${escapeHtml(post.description)}</p>
      <div class="card-link-wrap">
        <a href="${post.relativeUrl}" class="card-link">記事を読む →</a>
      </div>
    </article>`;
}

function buildPage(config, posts) {
  const heroImageExists = fs.existsSync(heroImageFsPath);
  const heroImageHtml = heroImageExists
    ? `<div class="hero-image" aria-label="カテゴリヘッダー画像"></div>`
    : `<div class="hero-image hero-image-fallback"><div class="hero-image-fallback-text">Macro Daily</div></div>`;

  const listHtml = posts.length
    ? `<div class="card-grid">${posts.map(buildCard).join("")}</div>`
    : `<div class="empty-state">記事がまだありません。</div>`;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(config.pageTitle)}</title>
  <meta name="description" content="${escapeHtml(config.heroDescription)}" />
  <link rel="canonical" href="${config.canonical}" />
  <meta name="robots" content="index,follow" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(config.pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(config.heroDescription)}" />
  <meta property="og:url" content="${config.canonical}" />
  <meta property="og:site_name" content="Macro Daily" />
  <meta name="twitter:card" content="summary_large_image" />

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg: #0b1120;
      --panel: rgba(15, 23, 42, 0.88);
      --panel-border: rgba(255, 255, 255, 0.08);
      --text: #e5e7eb;
      --text-soft: #94a3b8;
      --heading: #f8fafc;
      --accent: #38bdf8;
      --accent-strong: #0ea5e9;
      --radius-lg: 22px;
      --radius-md: 16px;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.75;
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 30%),
        radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 28%),
        linear-gradient(180deg, #020617 0%, #0b1120 100%);
      color: var(--text);
      padding: 32px 16px 64px;
    }

    .container { max-width: 1100px; margin: 0 auto; }
    a { color: inherit; text-decoration: none; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 18px;
      color: #93c5fd;
      font-size: 14px;
      font-weight: 700;
    }

    .hero {
      overflow: hidden;
      background: linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.96));
      border: 1px solid var(--panel-border);
      border-radius: var(--radius-lg);
      padding: 32px;
      margin-bottom: 28px;
    }

    .hero-image {
      width: 100%;
      height: 280px;
      border-radius: 18px;
      margin-bottom: 22px;
      background-image: url("${heroImageRelativePath}");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .hero-image-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      background:
        radial-gradient(circle at center, rgba(56,189,248,0.22), transparent 35%),
        linear-gradient(135deg, #111827, #1e293b);
    }

    .hero-image-fallback-text {
      font-size: 32px;
      font-weight: 800;
      color: #f8fafc;
    }

    .hero h1 {
      margin: 0 0 12px;
      font-size: clamp(34px, 6vw, 52px);
      line-height: 1.1;
      font-weight: 800;
      color: var(--heading);
    }

    .hero p {
      margin: 0;
      color: #cbd5e1;
      font-size: 16px;
      max-width: 760px;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 20px;
    }

    .article-card {
      background: linear-gradient(180deg, rgba(17,24,39,0.92), rgba(15,23,42,0.92));
      border: 1px solid var(--panel-border);
      border-radius: var(--radius-md);
      padding: 22px 20px 20px;
    }

    .card-meta-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .card-meta {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent);
    }

    .card-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.12);
    }

    .card-badge-fx {
      background: rgba(14, 165, 233, 0.14);
      color: #7dd3fc;
    }

    .card-badge-crypto {
      background: rgba(168, 85, 247, 0.16);
      color: #d8b4fe;
    }

    .card-title {
      display: block;
      font-size: 22px;
      font-weight: 800;
      line-height: 1.35;
      color: var(--heading);
      margin-bottom: 12px;
    }

    .card-description {
      margin: 0;
      font-size: 15px;
      color: #cbd5e1;
    }

    .card-link-wrap {
      margin-top: 16px;
    }

    .card-link {
      font-size: 14px;
      font-weight: 700;
      color: var(--accent);
    }

    .empty-state {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: var(--radius-md);
      padding: 24px;
      color: var(--text-soft);
    }
  </style>
</head>
<body>
  <div class="container">
    <a class="back-link" href="./index.html">← トップへ戻る</a>

    <section class="hero">
      ${heroImageHtml}
      <h1>${escapeHtml(config.heroTitle)}</h1>
      <p>${escapeHtml(config.heroDescription)}</p>
    </section>

    ${listHtml}
  </div>
</body>
</html>`;
}

const postFiles = fs
  .readdirSync(postsDir)
  .filter((file) => file.endsWith(".html"))
  .sort()
  .reverse();

const posts = postFiles.map(readPostMeta);

for (const [type, config] of Object.entries(categoryConfigs)) {
  const filteredPosts = posts.filter((post) => post.type === type);
  const html = buildPage(config, filteredPosts);
  fs.writeFileSync(config.outputPath, html, "utf-8");
  console.log(`Saved ${config.outputPath}`);
}
