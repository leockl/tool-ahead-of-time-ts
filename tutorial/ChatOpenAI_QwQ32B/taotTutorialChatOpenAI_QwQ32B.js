// Load environment variable (ie. API key) from the .env file
require('dotenv').config();

// Import from the taot-ts package and ChatOpenAI package
const { createSystemMessageTaot, createReactAgentTaot } = require('taot-ts');
const { ChatOpenAI } = require('@langchain/openai');

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
// In this tutorial, I am using the DeepSeek-R1 model hosted on the platform OpenRouter. This model hosted on OpenRouter is available on Langchain's ChatOpenAI library.
// If you want to use another model, you will need to check if your model (hosted on whichever platform you have chosen, for eg. Azure, Together AI or DeepSeek's own platform etc.) is first available on Langchain.js's ChatOpenAI library, and then change the values of the parameters "model", "api_key" and "base_url" below according to which model and platform you have chosen.
const createModel = () => {
    return new ChatOpenAI({
      modelName: "qwen/qwq-32b",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1"
      }
    });
  };

// Example previous messages
// Note: Based on current best practices in chatbot design, we do not include system message in previous_messages as it's handled separately further down the script
const previous_messages = [
  // { role: "system", content: "You are a helpful AI assistant." }, // Commented out as we do not include system message
  { role: "user", content: "What is the capital of Australia?" },
  { role: "assistant", content: "The capital of Australia is Canberra." }
];

// Getting Model Response
// For ease of use, I have designed the taot-ts package to mimic LangChain.js's and LangGraph.js's "createReactAgent" method with tool calling.
// First, the systemMessage variable below can start with any customized system message as per usual, for eg. "You are a helpful assistant. ", "You are an expert programmer in Python. ", "You are a world class expert in SEO optimization. " etc.
// Then, the systemMessage variable below needs to STRICTLY include the following: "You are an assistant with access to specific tools. When the user's question requires a {tool use}, use the {'corresponding'} tool. For the {'corresponding'} tool, provide the {user message} as a string into the {'user message'} argument in the tool or any {'predefined values'} as a string for other arguments in the tool."
// For eg. for the 'calculator' tool, since the function for the 'calculator' tool above has one argument called 'expression', the systemMessage variable below would need to look like "You are a math expert. You are an assistant with access to specific tools. When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string into the 'expression' argument in the tool."
// For the 'text analyze' tool, since the function for the 'text analyze' tool above has two arguments 'text' and 'analysis_type' (where the 'analysis_type' argument has two predefined values 'words' and 'chars'), the systemMessage variable below would need to look like "You are an expert in linguitics. You are an assistant with access to specific tools. When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string into the 'text' argument in the tool and either 'words' or 'chars' as a string into the 'analysis_type' argument in the tool."
// Below are five examples of different combinations of user questions and tools used:

// Example for calculator tool only
async function runCalculatorExample() {
  try {    
    // Initialize model
    const model = createModel();
    
    // Create system message
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
    
    // Print result
    console.log(response.messages[0].content);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for text analyzer tool only
async function runTextAnalyzerExample() {
  try {    
    // Initialize model
    const model = createModel();
    
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
    
    // Print result
    console.log(response.messages[0].content);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for both tools with user question requiring math calculation
async function runBothToolsMathExample() {
  try {    
    // Initialize model
    const model = createModel();
    
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
    
    // Print result
    console.log(response.messages[0].content);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for both tools with user question requiring text analysis
async function runBothToolsTextExample() {
  try {    
    // Initialize model
    const model = createModel();
    
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
    
    // Print result
    console.log(response.messages[0].content);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

// Example for both tools with user question not requiring any tools
async function runBothToolsNoToolsExample() {
  try {    
    // Initialize model
    const model = createModel();
    
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
    
    // Print result
    console.log(response.messages[0].content);
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
