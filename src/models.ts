/**
 * Defines the core model for tool calls.
 */
export interface ToolCall {
    /**
     * Name of the tool to call
     */
    tool: string;
    
    /**
     * Arguments to pass to the tool
     */
    args: Record<string, any>;
  }