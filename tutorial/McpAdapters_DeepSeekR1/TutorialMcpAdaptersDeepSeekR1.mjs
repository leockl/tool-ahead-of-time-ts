import dotenv from 'dotenv';
dotenv.config();

import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;

// Initialize the language model using "openAIApiKey"
const model = new ChatOpenAI({
  modelName: 'deepseek/deepseek-r1',
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1"
  }
});

async function main() {
  const client = new MultiServerMCPClient();

  // Connect to the Brave Search MCP server via SSE with custom header.
  await client.connectToServerViaSSE('brave-search', 'http://localhost:8001/sse', {
    Authorization: BRAVE_API_KEY,
  });

  // Connect to the Weather MCP server via SSE with custom header.
  await client.connectToServerViaSSE('weather', 'http://localhost:8002/sse', {
    Authorization: ACCUWEATHER_API_KEY,
  });

  // Retrieve all tools from the connected servers.
  const tools = client.getTools();

  // Create the agent with the language model and loaded tools.
  const agent = createReactAgent({ llm: model, tools });

  // Example usage: Perform a web search using Brave Search.
  const searchResponse = await agent.invoke({
    messages: [{ role: 'user', content: 'Search for the latest news on AI.' }],
  });
  // console.log('Search Response:', searchResponse);
  console.log(searchResponse.messages[searchResponse.messages.length - 1].content);

  // Example usage: Get the weather forecast using the Weather MCP server.
  const weatherResponse = await agent.invoke({
    messages: [{ role: 'user', content: "What's the weather forecast for Sydney tomorrow?" }],
  });
  // console.log('Weather Response:', weatherResponse);
  console.log(weatherResponse.messages[weatherResponse.messages.length - 1].content);

  await client.close();
}

// Run the main function using top-level await.
await main();
