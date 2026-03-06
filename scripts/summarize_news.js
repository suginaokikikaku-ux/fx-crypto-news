import "dotenv/config";
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000
});

const rawPath = "data/raw/news.json";

if (!fs.existsSync(rawPath)) {
  console.error("data/raw/news.json がありません。先に fetch を実行してください。");
  process.exit(1);
}

const rawText = fs.readFileSync(rawPath, "utf-8").trim();

if (!rawText) {
  console.error("data/raw/news.json が空です。");
  process.exit(1);
}

const news = JSON.parse(rawText);
const today = new Date().toISOString().slice(0, 10);

const headlines = news.slice(0, 5).map((item) => item.title).join("\n");

async function generate() {
  console.log("Starting OpenAI summarize...");

  const prompt = `
以下のニュースをもとに、FXとBTCのトレーダー向けの日刊記事を書いてください。

ニュース一覧:
${headlines}

構成:
1. 今日の結論
2. 重要ニュース
3. ニュースの背景
4. 市場の反応
5. USD/JPYへの影響
6. BTCへの影響
7. トレーダーの注目ポイント
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  console.log("OpenAI summarize done.");

  const article = response.choices[0]?.message?.content ?? "記事生成に失敗しました。";

  fs.writeFileSync(
    `data/daily/${today}.json`,
    JSON.stringify({ article }, null, 2),
    "utf-8"
  );

  console.log(`Saved data/daily/${today}.json`);
}

generate().catch((error) => {
  console.error("Summarize failed:");
  console.error(error);
  process.exit(1);
});