import { DataAPIClient } from '@datastax/astra-db-ts';
import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer';
import OpenAI from 'openai';

import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import 'dotenv/config';
import { launch } from 'puppeteer';

type SimilarityMetric = 'dot_product' | 'cosine' | 'euclidean';

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const cycleKnowledgeData = [
  'https://www.saragottfriedmd.com/filling-the-gaps-in-womens-health-personalized-guidance-is-essential/',
  'https://www.saragottfriedmd.com/women-and-autoimmune-disease-why-are-our-rates-higher/',
  'https://www.saragottfriedmd.com/hormone-imbalance-lets-stop-normalizing-it/',
  'https://www.saragottfriedmd.com/unlock-the-secrets-to-hormone-health-for-longevity-and-vitality/?doing_wp_cron=1733495581.1202399730682373046875',
  'https://drmindypelz.com/the-art-of-intuitive-fasting-with-dr-will-cole/',
  'https://drmindypelz.com/lifestyle-hacks-to-naturally-balance-hormones-with-dr-stephanie-estima/',
  'https://drmindypelz.com/ep257/',
  'https://drmindypelz.com/ep264/',
  'https://www.natniddam.com/blog/supplementing-for-brain-health-a-comprehensive-guide-on-how-to-do-it-right/',
  'https://www.kaylabarnes.com/articles/muscle-an-organ-of-longevity',
  'https://www.kaylabarnes.com/articles/fasting-for-women',
  'https://www.kaylabarnes.com/articles/circadian-rhythms-why-it-matters-amp-how-to-optimise-yours',
  'https://www.kaylabarnes.com/articles/where-i-would-start-with-health-optimization-as-a-woman-extended-version',
];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (similarityMetric: SimilarityMetric = 'dot_product') => {
  const res = await db.createCollection(ASTRA_DB_COLLECTION, {
    vector: {
      dimension: 1536,
      metric: similarityMetric,
    },
  });
  console.log(res);
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);
  for await (const url of cycleKnowledgeData) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: chunk,
        encoding_format: 'float',
      });
      const vector = embedding.data[0].embedding;

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });
      console.log(res);
    }
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: 'domcontentloaded',
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, '');
};

createCollection().then(() => loadSampleData());
