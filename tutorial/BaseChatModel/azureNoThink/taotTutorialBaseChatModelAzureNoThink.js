// Load environment variable (ie. API key) from the .env file
require('dotenv').config();

// Import required packages
const { BaseChatModel } = require("@langchain/core/language_models/chat_models");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { AIMessage } = require("@langchain/core/messages");
const { createSystemMessageTaot, createReactAgentTaot } = require("taot-ts");

// Define calculator tool
const calculatorTool = {
  name: 'calculator',
  invoke: async (args) => {
    try {
      const expression = args.expression.trim();
      if (!expression) {
        return "Error: Empty expression";
      }
      
      const allowedChars = "0123456789+-*/() .";
      for (const char of expression) {
        if (!allowedChars.includes(char)) {
          return "Error: Invalid characters in expression";
        }
      }
      
      // Use Function instead of eval for better safety
      const result = new Function('return ' + expression)();
      return String(result);
    } catch (e) {
      return `Error: ${e.message}`;
    }
  }
};

// Define text analyzer tool
const textAnalyzerTool = {
  name: 'text_analyzer',
  invoke: async (args) => {
    try {
      const text = args.text.trim();
      const analysisType = args.analysis_type;
      
      if (!text) {
        return "Error: Empty text";
      }
      
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

// Initialize model - reused across examples
// Create a custom chat model that uses direct fetch from LangChain's BaseChatModel implementation
// In this tutorial, I am using the DeepSeek-R1 model hosted on Azure. This model hosted on Azure is available on Langchain.js's BaseChatModel library
// If you want to use another model, you will need to check if your model (hosted on Azure) is first available on Langchain.js's BaseChatModel library, and then change the values of the parameters "apiKey" and "baseUrl" below according to how you deployed your model on Azure AI Foundry
// Note: If you want to change the default temperature and max output tokens of the model, you can do this from the "temperature" and "max_tokens" paramters below
class CustomAzureAIModel extends BaseChatModel {
  constructor() {
    super({});
    this.apiKey = process.env.AZURE_API_KEY;
    this.baseUrl = process.env.AZURE_ENDPOINT_BASE_URL;
  }

  _llmType() {
    return "custom-azure-ai";
  }

  async _generate(messages, options = {}) {
    // Convert LangChain message format to Azure AI format
    const formattedMessages = messages.map(message => {
      if (message._getType() === "human") {
        return { role: "user", content: message.content };
      } else if (message._getType() === "ai") {
        return { role: "assistant", content: message.content };
      } else if (message._getType() === "system") {
        return { role: "system", content: message.content };
      } else if (message._getType() === "chat") {
        return { role: message.role, content: message.content };
      }
      // Default to user role if unknown
      return { role: "user", content: String(message.content) };
    });
    
    // Prepare request body
    const requestBody = {
      messages: formattedMessages,
      temperature: options.temperature || 0.7,  // Set temperature to 0.7
      max_tokens: options.maxTokens || 1000,  // Set max output tokens to 1000
      model: this.modelName
    };
    
    try {
      // Make the API call
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error (${response.status}): ${errorText}`);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract the response content
      const responseContent = data.choices[0].message.content;
      
      // Create a simplified generation object
      const generation = {
        message: new AIMessage(responseContent),
        text: responseContent
      };
      
      return {
        generations: [generation]
      };
    } catch (error) {
      console.error("Error in _generate:", error);
      throw error;
    }
  }
}

// Example previous messages
// Note: Based on current best practices in chatbot design, we do not include system message in previous_messages as it's handled separately further down the script
const previous_messages = [
  // { role: "system", content: "You are a helpful AI assistant." }, // Commented out as we do not include system message
  { role: "user", content: "What is the capital of Australia?" },
  { role: "assistant", content: "The capital of Australia is Canberra." }
];

// Getting Model Response
// For ease of use, I have designed the taot-ts package to mimic LangChain.js's and LangGraph.js's "createReactAgent" method with tool calling
// First, the systemMessage variable below can start with any customized system message as per usual, for eg. "You are a helpful assistant. ", "You are an expert programmer in Python. ", "You are a world class expert in SEO optimization. " etc
// Then, the systemMessage variable below needs to STRICTLY include the following: "You are an assistant with access to specific tools. When the user's question requires a {tool use}, use the {'corresponding'} tool. For the {'corresponding'} tool, provide the {user message} as a string into the {'user message'} argument in the tool or any {'predefined values'} as a string for other arguments in the tool."
// For eg. for the 'calculator' tool, since the function for the 'calculator' tool above has one argument called 'expression', the systemMessage variable below would need to look like "You are a math expert. You are an assistant with access to specific tools. When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string into the 'expression' argument in the tool."
// For the 'text analyze' tool, since the function for the 'text analyze' tool above has two arguments 'text' and 'analysis_type' (where the 'analysis_type' argument has two predefined values 'words' and 'chars'), the systemMessage variable below would need to look like "You are an expert in linguitics. You are an assistant with access to specific tools. When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string into the 'text' argument in the tool and either 'words' or 'chars' as a string into the 'analysis_type' argument in the tool."
// Below are five examples of different combinations of user questions and tools used:

// Example for calculator tool only
async function runCalculatorExample() {
  try {
    // Create our custom model
    const model = new CustomAzureAIModel();
    
    // Create system message for TAOT
    const systemMessage = "You are a math expert. You are an assistant with access to specific tools. " + 
      "When the user's question requires a calculation, use the 'calculator' tool. " + 
      "For the 'calculator' tool, provide the user provided math expression as a string into the 'expression' argument in the tool.";
    
    const systemMessageTaot = createSystemMessageTaot(systemMessage);
    
    // Prepare all messages
    const allMessages = [
      { role: "system", content: systemMessageTaot }
    ];

    // Add previous messages
    allMessages.push(...previous_messages);
    
    // Add current user query
    allMessages.push({ role: "user", content: "What is 123 * 456?" });
    
    // Create agent and invoke
    const agent = createReactAgentTaot(model, [calculatorTool]);
    const response = await agent.invoke({
      messages: allMessages
    });
    
    // Print only the final result part without the think block
    const content = response.messages[0].content;
    const resultNoThink = content.split('</think>')[1].trim();
    console.log(resultNoThink);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for text analyzer tool only
async function runTextAnalyzerExample() {
  try {    
    // Create our custom model
    const model = new CustomAzureAIModel();
    
    // Create system message
    const systemMessage = "You are an expert in linguistics. You are an assistant with access to specific tools. " + 
      "When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. " + 
      "For the 'text_analyzer' tool, provide the user provided text as a string into the 'text' argument in the tool and " + 
      "either 'words' or 'chars' as a string into the 'analysis_type' argument in the tool.";
    
    const systemMessageTaot = createSystemMessageTaot(systemMessage);
    
    // Prepare all messages
    const allMessages = [
      { role: "system", content: systemMessageTaot }
    ];
    
    // Add previous messages
    allMessages.push(...previous_messages);
    
    // Add current user query
    allMessages.push({ role: "user", content: "How many words are in this sentence?: I built my 1st Hello World program" });
    
    // Create agent and invoke
    const agent = createReactAgentTaot(model, [textAnalyzerTool]);
    const response = await agent.invoke({
      messages: allMessages
    });
    
    // Print only the final result part without the think block
    const content = response.messages[0].content;
    const resultNoThink = content.split('</think>')[1].trim();
    console.log(resultNoThink);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for both tools with user question requiring math calculation
async function runBothToolsMathExample() {
  try {    
    // Create our custom model
    const model = new CustomAzureAIModel();
    
    // Create system message
    const systemMessage = `You are an expert in math and linguistics. You are an assistant with access to specific tools. 
      When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string into the 'expression' argument in the tool.
      When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string into the 'text' argument in the tool and either 'words' or 'chars' as a string into the 'analysis_type' argument in the tool.`;
    
    const systemMessageTaot = createSystemMessageTaot(systemMessage);
    
    // Prepare all messages
    const allMessages = [
      { role: "system", content: systemMessageTaot }
    ];
    
    // Add previous messages
    allMessages.push(...previous_messages);
    
    // Add current user query
    allMessages.push({ role: "user", content: "What is 123 * 456?" });
    
    // Create agent and invoke
    const agent = createReactAgentTaot(model, [calculatorTool, textAnalyzerTool]);
    const response = await agent.invoke({
      messages: allMessages
    });
    
    // Print only the final result part without the think block
    const content = response.messages[0].content;
    const resultNoThink = content.split('</think>')[1].trim();
    console.log(resultNoThink);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for both tools with user question requiring text analysis
async function runBothToolsTextExample() {
  try {    
    // Create our custom model
    const model = new CustomAzureAIModel();
    
    // Create system message
    const systemMessage = `You are an expert in math and linguistics. You are an assistant with access to specific tools. 
      When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string into the 'expression' argument in the tool.
      When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string into the 'text' argument in the tool and either 'words' or 'chars' as a string into the 'analysis_type' argument in the tool.`;
    
    const systemMessageTaot = createSystemMessageTaot(systemMessage);
    
    // Prepare all messages
    const allMessages = [
      { role: "system", content: systemMessageTaot }
    ];
    
    // Add previous messages
    allMessages.push(...previous_messages);
    
    // Add current user query
    allMessages.push({ role: "user", content: "How many words are in this sentence?: I built my 1st Hello World program" });
    
    // Create agent and invoke
    const agent = createReactAgentTaot(model, [calculatorTool, textAnalyzerTool]);
    const response = await agent.invoke({
      messages: allMessages
    });
    
    // Print only the final result part without the think block
    const content = response.messages[0].content;
    const resultNoThink = content.split('</think>')[1].trim();
    console.log(resultNoThink);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for both tools with user question not requiring any tools
async function runBothToolsNoToolsExample() {
  try {    
    // Create our custom model
    const model = new CustomAzureAIModel();
    
    // Create system message
    const systemMessage = `You are an expert in math and linguistics. You are an assistant with access to specific tools. 
      When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string into the 'expression' argument in the tool.
      When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string into the 'text' argument in the tool and either 'words' or 'chars' as a string into the 'analysis_type' argument in the tool.`;
    
    const systemMessageTaot = createSystemMessageTaot(systemMessage);
    
    // Prepare all messages
    const allMessages = [
      { role: "system", content: systemMessageTaot }
    ];
    
    // Add previous messages
    allMessages.push(...previous_messages);
    
    // Add current user query
    allMessages.push({ role: "user", content: "How many languages are there in the world?" });
    
    // Create agent and invoke
    const agent = createReactAgentTaot(model, [calculatorTool, textAnalyzerTool]);
    const response = await agent.invoke({
      messages: allMessages
    });
    
    // Print only the final result part without the think block
    const content = response.messages[0].content;
    const resultNoThink = content.split('</think>')[1].trim();
    console.log(resultNoThink);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Run all examples
async function runAllExamples() {
  try {
    await runCalculatorExample();
    await runTextAnalyzerExample();
    await runBothToolsMathExample();
    await runBothToolsTextExample();
    await runBothToolsNoToolsExample();
  } catch (error) {
    console.error("Error running examples:", error);
  }
}

// Run all examples
runAllExamples();