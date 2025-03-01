# TAoT-TS - Tool-Ahead-of-Time (TypeScript)

TAoT-TS is a TypeScript library for using LLM tools as operational transforms with LangChain. This is the TypeScript version of the [TAOT Python package](https://github.com/yourusername/taot).

## Installation

```bash
# Install the package
npm install taot-ts

# Install required peer dependencies
npm install dotenv @langchain/openai
```

## Quick Start

```typescript
import { createSystemMessageTaot, createReactAgentTaot } from 'taot-ts';
import { ChatOpenAI } from '@langchain/openai';

// Define your tool
const calculatorTool = {
  name: 'calculator',
  invoke: async (args) => {
    try {
      return String(eval(args.expression));
    } catch (e) {
      return `Error: ${e.message}`;
    }
  }
};

// Create the model
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo", // or any other model
  apiKey: process.env.OPENAI_API_KEY
});

// Define system message
const systemMessage = "You are a math expert. You are an assistant with access to specific tools. " + 
  "When the user's question requires a calculation, use the 'calculator' tool. " + 
  "For the 'calculator' tool, provide the user provided math expression as a string in the 'expression' argument in the tool.";

// Format the system message for tool use
const systemMessageTaot = createSystemMessageTaot(systemMessage);

// Create a React agent
const agent = createReactAgentTaot(model, [calculatorTool]);

// Use the agent
const response = await agent.invoke({
  messages: [
    { role: "system", content: systemMessageTaot },
    { role: "user", content: "What is 123 * 456?" }
  ]
});

console.log(response.messages[0].content);
// Output: The result of 123 multiplied by 456 is 56,088.
```

## Using with OpenRouter

You can use the library with OpenRouter's models:

```typescript
import { createSystemMessageTaot, createReactAgentTaot } from 'taot-ts';
import { ChatOpenAI } from '@langchain/openai';

// Create the model with OpenRouter
const model = new ChatOpenAI({
  modelName: "deepseek/deepseek-r1", // or another model from OpenRouter
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1"
  }
});

// ... rest of the code is the same
```

## Message History

You can include previous message history:

```typescript
// Previous messages (excluding system message)
const previousMessages = [
  { role: "user", content: "What is the capital of Australia?" },
  { role: "assistant", content: "The capital of Australia is Canberra." }
];

// Prepare all messages
const allMessages = [
  { role: "system", content: systemMessageTaot }
];

// Add previous messages
allMessages.push(...previousMessages);

// Add current user query
allMessages.push({ role: "user", content: "What is 123 * 456?" });

// Use the agent with all messages
const response = await agent.invoke({ messages: allMessages });
```

## Creating Multiple Tools

You can define and use multiple tools:

```typescript
// Text analyzer tool
const textAnalyzerTool = {
  name: 'text_analyzer',
  invoke: async (args) => {
    try {
      const text = args.text.trim();
      const analysisType = args.analysis_type;
      
      if (analysisType.toLowerCase() === 'words') {
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        return `${wordCount}`;
      } else if (analysisType.toLowerCase() === 'chars') {
        const charCount = text.length;
        return `${charCount}`;
      } else {
        return "Error: analysis_type must be either 'words' or 'chars'";
      }
    } catch (e) {
      return `Error: ${e.message}`;
    }
  }
};

// Create agent with both tools
const agent = createReactAgentTaot(model, [calculatorTool, textAnalyzerTool]);
```

## Full Tutorial

See the `examples` directory for complete examples of using the package.

## API Reference

### `createSystemMessageTaot(systemMessage: string): string`

Creates a system message with tool instructions and JSON schema.

### `createReactAgentTaot(model: ChatOpenAI, tools: Tool[]): ManualToolAgent`

Creates a React agent with manual tool handling.

### `Tool` Interface

```typescript
interface Tool {
  name: string;
  invoke: (args: Record<string, any>) => Promise<string>;
}
```

## License

MIT