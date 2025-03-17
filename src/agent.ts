import { SystemMessage, HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { Runnable } from "@langchain/core/runnables";
import { ToolCall } from "./models";

/**
 * Interface for messages with role and content
 */
export interface Message {
  role: string;
  content: string;
}

/**
 * Interface defining the structure of a tool
 */
export interface Tool {
  name: string;
  invoke: (args: Record<string, any>) => Promise<string>;
}

/**
 * A custom agent that handles tools manually.
 */
export class ManualToolAgent extends Runnable<{ messages: Message[] }, { messages: { content: string }[] }> {
  lc_namespace = ["taot_ts", "agents"];
  
  private model: any;
  private tools: any[];
  private maxRetries: number = 100;
  
  /**
   * Create a new ManualToolAgent instance.
   * 
   * @param model - The language model to use
   * @param tools - List of tool functions
   */
  constructor(model: any, tools: any[]) {
    super({});
    this.model = model;
    this.tools = tools;
  }
  
  /**
   * Invokes the agent with the provided inputs.
   * 
   * @param inputs - The input messages
   * @returns The output messages
   */
  async invoke(
    inputs: { messages: Message[] }
  ): Promise<{ messages: { content: string }[] }> {
    return this._call(inputs);
  }

  /**
   * Check if the response is empty or contains only whitespace.
   * 
   * @param responseText - The response text to check
   * @returns True if response is empty, False otherwise
   */
  private isEmptyResponse(responseText: string | null | undefined): boolean {
    if (responseText === null || responseText === undefined) {
      return true;
    }
    if (!responseText.trim()) {
      return true;
    }
    return false;
  }

  /**
   * Convert dictionary-based messages to LangChain message objects.
   * 
   * @param messages - List of messages to convert
   * @returns Converted LangChain message objects
   */
  private convertMessages(messages: Message[]): BaseMessage[] {
    const convertedMessages: BaseMessage[] = [];
    
    for (const message of messages) {
      const { role, content } = message;
      
      if (role === "system") {
        convertedMessages.push(new SystemMessage({ content }));
      } else if (role === "user") {
        convertedMessages.push(new HumanMessage({ content }));
      } else if (role === "assistant") {
        convertedMessages.push(new AIMessage({ content }));
      }
    }
    
    return convertedMessages;
  }

  /**
   * Format tool result using LLM to create natural language response.
   * 
   * @param toolName - Name of the tool used
   * @param toolResult - Result from the tool
   * @param userQuery - Original user query
   * @returns Formatted natural language response
   */
  private async formatToolResult(
    toolName: string, 
    toolResult: string, 
    userQuery: string
  ): Promise<string> {
    const prompt = `Given the following:
User query: ${userQuery}
Tool used: ${toolName}
Tool result: ${toolResult}

Create a natural language response to the user query that incorporates the result from the tool. Do not mention anything about using the tool used. 
Keep it concise and direct.`;
    
    let retryCount = 0;
    while (retryCount < this.maxRetries) {
      const response = await this.model.invoke([new HumanMessage({ content: prompt })]);
      const responseContent = response.content as string;
      
      if (!this.isEmptyResponse(responseContent)) {
        return responseContent;
      }
      retryCount++;
    }
    
    // If we've reached here, we've exceeded max retries with empty responses
    // Return a default response with the raw tool result
    return `The result is: ${toolResult}`;
  }

  /**
   * Parse a JSON string to extract a ToolCall object.
   * 
   * @param text - Text potentially containing JSON
   * @returns Parsed ToolCall object or null if parsing fails
   */
  private parseToolCall(text: string): ToolCall | null {
    try {
      // Try to parse the entire response as JSON first
      try {
        const parsed = JSON.parse(text);
        if (parsed.tool && parsed.args) {
          return parsed as ToolCall;
        }
      } catch {
        // Not a valid JSON object, continue to regex matching
      }
      
      // Find JSON objects in the text
      const jsonRegex = /\{(?:[^{}]|(\{(?:[^{}]|(?:\{[^{}]*\}))*\}))*\}/g;
      const matches = text.match(jsonRegex);
      
      if (!matches) return null;
      
      for (const match of matches) {
        try {
          const parsed = JSON.parse(match);
          if (parsed.tool && parsed.args) {
            return parsed as ToolCall;
          }
        } catch (e) {
          // Continue to next match on parse error
          continue;
        }
      }
      
      return null;
    } catch (e) {
      console.error("Error parsing tool call:", e);
      return null;
    }
  }

  /**
   * Execute the agent with manual tool handling (internal implementation).
   * 
   * @param inputs - Dictionary containing messages
   * @returns Response containing processed message
   */
  async _call(
    inputs: { messages: Message[] }
  ): Promise<{ messages: { content: string }[] }> {
    // Get messages
    const { messages } = inputs;
    const userQuery = messages[messages.length - 1].content; // Get the last user message
    
    // Convert messages to LangChain format
    const convertedMessages = this.convertMessages(messages);
    
    // Implement a simplified version of ReAct reasoning
    const thinkingPrompt = new HumanMessage({ 
      content: "Think through this step by step. If the user's request requires using a tool, respond with a JSON object containing 'tool' and 'args' properties."
    });
    const augmentedMessages = [...convertedMessages, thinkingPrompt];
    
    // Get response from the model with retry logic for empty responses
    let lastResponse: string | null = null;
    let retryCount = 0;
    
    while (retryCount < this.maxRetries) {
      const response = await this.model.invoke(augmentedMessages);
      lastResponse = response.content as string;
      
      if (!this.isEmptyResponse(lastResponse)) {
        break;
      }
      
      retryCount++;
    }
    
    // If we still have an empty response after all retries, return an error message
    if (this.isEmptyResponse(lastResponse)) {
      return { messages: [{ content: "I'm having trouble generating a response. Please try again." }] };
    }
    
    // Try to parse as a tool call
    const toolCall = this.parseToolCall(lastResponse as string);
    
    if (toolCall) {
      try {
        // Find the matching tool
        const tool = this.tools.find(t => t.name === toolCall.tool);
        
        if (tool) {
          const rawResult = await tool.invoke(toolCall.args);
          // Format the result using LLM
          const result = await this.formatToolResult(toolCall.tool, rawResult, userQuery);
          return { messages: [{ content: result }] };
        } else {
          return { messages: [{ content: "Error: Unknown tool" }] };
        }
      } catch (e) {
        return { 
          messages: [{ 
            content: `Error processing tool call: ${e instanceof Error ? e.message : String(e)}` 
          }] 
        };
      }
    } else {
      return { messages: [{ content: lastResponse as string }] };
    }
  }
}

/**
 * Create a React agent with manual tool handling.
 * 
 * @param model - The language model to use
 * @param tools - List of tool functions
 * @returns Agent with manual tool handling
 */
export function createReactAgentTaot(
  model: any, 
  tools: any[]
): ManualToolAgent {
  return new ManualToolAgent(model, tools);
}
