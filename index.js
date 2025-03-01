// Load environment variables
require('dotenv').config();

// Import from the taot-ts package and ChatOpenAI package
const { createSystemMessageTaot, createReactAgentTaot } = require('taot-ts');
const { ChatOpenAI } = require('@langchain/openai');

// Define calculator tool without console logs
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

// Define text analyzer tool without console logs
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
const createModel = () => {
    return new ChatOpenAI({
      modelName: "deepseek/deepseek-r1",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1"
      }
    });
  };

// Example previous messages
// Note: We do not include system message in previous_messages as it's handled separately
const previous_messages = [
  // { role: "system", content: "You are a helpful AI assistant." }, // Commented out as we do not include system message
  { role: "user", content: "What is the capital of Australia?" },
  { role: "assistant", content: "The capital of Australia is Canberra." }
];

// Example for calculator tool only
async function runCalculatorExample() {
  try {    
    // Initialize model
    const model = createModel();
    
    // Create system message
    const systemMessage = "You are a math expert. You are an assistant with access to specific tools. " + 
      "When the user's question requires a calculation, use the 'calculator' tool. " + 
      "For the 'calculator' tool, provide the user provided math expression as a string in the 'expression' argument in the tool.";
    
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
      "For the 'text_analyzer' tool, provide the user provided text as a string in the 'text' argument in the tool and " + 
      "either 'words' or 'chars' as a string in the 'analysis_type' argument in the tool.";
    
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
      When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string in the 'expression' argument in the tool.
      When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string in the 'text' argument in the tool and either 'words' or 'chars' as a string in the 'analysis_type' argument in the tool.`;
    
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
      When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string in the 'expression' argument in the tool.
      When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string in the 'text' argument in the tool and either 'words' or 'chars' as a string in the 'analysis_type' argument in the tool.`;
    
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
      When the user's question requires a calculation, use the 'calculator' tool. For the 'calculator' tool, provide the user provided math expression as a string in the 'expression' argument in the tool.
      When the user's question requires analysis of the text provided by the user, use the 'text_analyzer' tool. For the 'text_analyzer' tool, provide the user provided text as a string in the 'text' argument in the tool and either 'words' or 'chars' as a string in the 'analysis_type' argument in the tool.`;
    
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