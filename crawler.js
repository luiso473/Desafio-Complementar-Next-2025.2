import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const startUrl = "http://localhost:3000";
const visited = new Set();
const data = [];

async function crawl(url) {
  if (visited.has(url)) return;
  visited.add(url);

  try {
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    console.log(`✔ Extraído: ${url}`);

    data.push({
      url,
      text
    });

    const links = $("a")
      .map((_, a) => $(a).attr("href"))
      .get()
      .filter((href) => href && href.startsWith("/"))
      .map((href) => startUrl + href);

    for (const link of links) {
      await crawl(link);
    }

  } catch (error) {
    console.log(`Erro ao acessar ${url}`);
  }
}

async function start() {
  console.log("Iniciando crawler...");
  await crawl(startUrl);

  fs.writeFileSync("dataset.json", JSON.stringify(data, null, 2));
  console.log("\n🎉 Finalizado! Conteúdo salvo em dataset.json");
}

start();
