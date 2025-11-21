import OpenAI from "openai";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const lines = fs.readFileSync("embeddings-ready.jsonl", "utf8").trim().split("\n");

for (const line of lines) {
  const obj = JSON.parse(line);

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: obj.text,
  });

  await supabase.from("documents").insert({
    id: obj.id,
    url: obj.url,
    content: obj.text,
    embedding: embedding.data[0].embedding,
  });

  console.log(`Inserido: ${obj.id}`);
}
