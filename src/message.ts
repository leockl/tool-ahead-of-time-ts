import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ToolCall } from "./models";

/**
 * Create a system message with tool instructions and JSON schema.
 * 
 * @param systemMessage - The specific system message for tools
 * @returns Formatted system message with JSON schema instructions
 */
export function createSystemMessageTaot(systemMessage: string): string {
  const jsonParser = new JsonOutputParser<ToolCall>();
  
  // Get format instructions for the ToolCall schema
  const formatInstructions = `{
    "properties": {
      "tool": {
        "type": "string",
        "description": "Name of the tool to call"
      },
      "args": {
        "type": "object",
        "description": "Arguments to pass to the tool"
      }
    },
    "required": ["tool", "args"]
  }`;

  return `${systemMessage}\n
When a user's question matches a tool's capability, you MUST use that tool. 
Do not try to solve problems manually if a tool exists for that purpose.

Output ONLY a JSON object (with no extra text) that adheres EXACTLY to the following schema:

${formatInstructions}

If the user's question doesn't require any tool, answer directly in plain text with no JSON.`;
}