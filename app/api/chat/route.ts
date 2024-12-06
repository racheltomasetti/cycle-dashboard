import OpenAI from 'openai';
import { DataAPIClient } from '@datastax/astra-db-ts';

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

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    if (!latestMessage) {
      return new Response('No message provided', { status: 400 });
    }

    let docContext = '';

    // Generate embeddings for the query with retry logic
    const embedding = await attemptWithRetry(() => 
      openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: latestMessage,
        encoding_format: 'float',
      })
    );

    // Query the vector database for relevant context
    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 5,
      });

      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);
      docContext = docsMap.join('\n\n');
    } catch (err) {
      console.error('Error querying database:', err);
      docContext = '';
    }

    const systemMessage = {
      role: 'system',
      content: `You are a helpful, honest AI assistant who knows everything about women's health.
        Your mission is to make the user's life as easy as possible.
        
        Use the following context to augment your knowledge about women's health, biology, and lifestyle optimization.
        This context contains insights from top experts in the field from their most recent blogs, podcasts, and research.
        
        If the context doesn't contain information relevant to the question, use your existing knowledge and maintain a natural conversation
        without mentioning the sources or context.
        
        Format responses using markdown for better readability.
        ----------------
        CONTEXT:
        ${docContext}
        ----------------`
    };

    // Generate chat completion with retry logic
    const response = await attemptWithRetry(() =>
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      })
    );

    return new Response(
      JSON.stringify({ content: response.choices[0].message.content }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (err: any) {
    console.error('Error in chat route:', err);
    let errorMessage = 'An error occurred processing your request';
    if (err?.message?.includes('rate limit')) {
      errorMessage = 'Service is currently busy. Please try again in a few moments.';
    }
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        headers: { 'Content-Type': 'application/json' },
        status: err?.message?.includes('rate limit') ? 429 : 500,
      }
    );
  }
}
