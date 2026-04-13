// scripts/knowledge_pages_manifest.js

export const knowledgePages = [
  // =========================
  // FX
  // =========================
  {
    id: "fx-a-root",
    title: "FXとは？",
    path: "basics/fx/what-is-fx.html",
    section: "fx",
    category: "FX基礎",
    type: "parent",
    description: "FXの基本、為替、通貨ペアなどの土台を理解する入口ページ",
  },
  {
    id: "fx-a-1",
    title: "為替とは何か",
    path: "basics/fx/what-is-exchange-rate.html",
    section: "fx",
    category: "FX基礎",
    type: "child",
    parentId: "fx-a-root",
    description: "為替レートの意味と通貨交換の仕組みを理解する",
  },
  {
    id: "fx-a-2",
    title: "通貨ペアとは何か",
    path: "basics/fx/what-is-currency-pair.html",
    section: "fx",
    category: "FX基礎",
    type: "child",
    parentId: "fx-a-root",
    description: "USD/JPYなど通貨ペアの読み方を理解する",
  },
  {
    id: "fx-b-root",
    title: "ドル円とは？",
    path: "basics/fx/what-is-usdjpy.html",
    section: "fx",
    category: "ドル円",
    type: "parent",
    description: "USD/JPYの基本と見方を理解する",
  },
  {
    id: "fx-c-root",
    title: "なぜ為替は動くのか",
    path: "basics/fx/what-moves-fx.html",
    section: "fx",
    category: "為替の仕組み",
    type: "parent",
    description: "金利や経済指標など為替の動く理由を理解する",
  },
  {
    id: "fx-e-root",
    title: "FXニュースの読み方",
    path: "basics/fx/how-to-read-fx-news.html",
    section: "fx",
    category: "ニュース",
    type: "parent",
    description: "ニュースをどう解釈するかを学ぶ",
  },

  // =========================
  // CRYPTO
  // =========================
  {
    id: "crypto-a-root",
    title: "暗号通貨とは？",
    path: "basics/crypto/what-is-crypto.html",
    section: "crypto",
    category: "基礎",
    type: "parent",
    description: "暗号資産の基本と仕組みを理解する",
  },
  {
    id: "crypto-a-1",
    title: "ビットコインとは何か",
    path: "basics/crypto/what-is-bitcoin.html",
    section: "crypto",
    category: "基礎",
    type: "child",
    parentId: "crypto-a-root",
    description: "BTCの役割と価値の考え方を理解する",
  },
  {
    id: "crypto-b-root",
    title: "ブロックチェーンとは？",
    path: "basics/crypto/what-is-blockchain.html",
    section: "crypto",
    category: "技術",
    type: "parent",
    description: "ブロックチェーンの基本構造を理解する",
  },
  {
    id: "crypto-d-root",
    title: "市場テーマとは何か",
    path: "basics/crypto/what-is-market-theme.html",
    section: "crypto",
    category: "テーマ",
    type: "parent",
    description: "AI・DeFiなどテーマでの資金の動きを理解する",
  },
  {
    id: "crypto-d-2",
    title: "DeFiとは何か",
    path: "basics/crypto/what-is-defi.html",
    section: "crypto",
    category: "テーマ",
    type: "child",
    parentId: "crypto-d-root",
    description: "分散型金融の基本と仕組み",
  },

  // =========================
  // COMMON
  // =========================
  {
    id: "common-1",
    title: "相場ニュースの読み方",
    path: "basics/common/how-to-read-news.html",
    section: "common",
    category: "共通",
    type: "parent",
    description: "ニュースの解釈方法を学ぶ",
  },
  {
    id: "common-3",
    title: "FXと暗号通貨の違い",
    path: "basics/common/fx-vs-crypto-overview.html",
    section: "common",
    category: "共通知識",
    type: "parent",
    description: "FXと暗号通貨の違いを、値動き・仕組み・学び方の違いから整理する",
  },
  {
    id: "common-5",
    title: "リスク管理の基本",
    path: "basics/common/risk-management.html",
    section: "common",
    category: "共通知識",
    type: "parent",
    description: "資金・情報・判断の3つの観点からリスク管理を整理する",
  },

  // =========================
  // GUIDE（アフィリエイト導線）
  // =========================
  {
    id: "guide-1",
    title: "FX口座の選び方",
    path: "basics/guides/best-fx-brokers.html",
    section: "guide",
    category: "導入",
    type: "parent",
    description: "口座比較と選び方",
  },
  {
    id: "guide-2",
    title: "暗号通貨取引所の選び方",
    path: "basics/guides/best-crypto-exchanges.html",
    section: "guide",
    category: "導入",
    type: "parent",
    description: "暗号資産の取引所を比較するポイント",
  },
];
