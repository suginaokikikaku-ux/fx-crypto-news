import Parser from "rss-parser";
import fs from "fs";

const parser = new Parser({
  timeout: 5000
});

const feeds = [
  "https://feeds.reuters.com/reuters/businessNews",
  "https://www.coindesk.com/arc/outboundfeeds/rss/"
];

async function fetchNews() {
  const articles = [];

  for (const url of feeds) {
    try {
      console.log(`Fetching: ${url}`);
      const feed = await parser.parseURL(url);

      if (feed.items && feed.items.length > 0) {
        feed.items.slice(0, 5).forEach((item) => {
          articles.push({
            title: item.title || "",
            link: item.link || "",
            pubDate: item.pubDate || ""
          });
        });
      }

      console.log(`Done: ${url}`);
    } catch (error) {
      console.error(`Failed: ${url}`);
      console.error(error.message);
    }
  }

  fs.writeFileSync(
    "data/raw/news.json",
    JSON.stringify(articles, null, 2),
    "utf-8"
  );

  console.log(`Saved news.json (${articles.length} items)`);
}

fetchNews();