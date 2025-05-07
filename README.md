# Tool-Ahead-of-Time-TypeScript (TAoT-ts): Because Why Wait? 🕒
Ever found yourself staring at a shiny new LLM through LangChain.js's window, but can't use tool calling because it's "not supported yet"? 

*Sad agent noises* 😢

Well, hold my JSON parser, because this repo says "NOT TODAY!" 🦾

## What is this sorcery? 🧙‍♂️

This is a TypeScript package (a package mirrowing the equivalent Python package: https://github.com/leockl/tool-ahead-of-time) that enables tool calling for any model available through LangChain.js's ChatOpenAI class (and by extension, any model available through OpenAI's class), and any model available through LangChain.js's BaseChatModel class, even before LangChain.js and LangGraph.js officially supports it! 

Yes, you read that right. We're living in the age of AI and things move fast 🏎️💨

It essentially works by reformatting the output response of the model into a JSON parser and passing this on to the relevant tools.

This repo showcases an example with DeepSeek-R1 671B, which isn't currently supported with tool calling by LangChain.js and LangGraph.js (as of 16th Feb 2025).

## Features 🌟

- Tool calling support for OpenAI and non-OpenAI models available on:
  - LangChain.js's ChatOpenAI class (and by extension, OpenAI and non-OpenAI models available on the base OpenAI's class).
  - LangChain.js's BaseChatModel class.
- This package follows a similar method to LangChain.js's and LangGraph.js's `createReactAgent` method for tool calling, so makes it easy for you to read the syntax. 😊
- Zero waiting for official support required.
- More robust than a caffeinated developer at 3 AM. ☕

## Quick Start 🚀

I will show below how to run the tutorials for LangChain.js's ChatOpenAI class (using DeepSeek-R1 671B on OpenRouter), LangChain.js's BaseChatModel class (using DeepSeek-R1 671B on Microsoft Azure) and LangChain.js's ChatOpenAI class (using QwQ-32B on OpenRouter) in this repo which uses the `taot-ts` package:

### 1. LangChain.js's ChatOpenAI class (using DeepSeek-R1 671B on OpenRouter)

First, create an empty "tutorial" folder and an empty "ChatOpenAI" sub-folder in your local device. Then copy the "taotTutorialChatOpenAI.js" and ".env" files (under the "tutorial" folder and "ChatOpenAI" sub-folder in this repo) into your empty "ChatOpenAI" sub-folder in your local device. Note you will need to enter your own API key into the ".env" file.

Then run the following lines of code:

```bash
# Navigate to the "ChatOpenAI" sub-directory in your local device
cd tutorial\ChatOpenAI

# Initialize as npm project
npm init -y

# Npm install the "taot-ts" package
npm install taot-ts

# Npm install dependencies required in the "taotTutorialChatOpenAI.js" file
npm install dotenv @langchain/openai

# Run the "taotTutorialChatOpenAI.js" file
node taotTutorialChatOpenAI.js
```

After running the "taotTutorialChatOpenAI.js" file, you should see a similar results to the below:

```bash
123 multiplied by 456 equals 56,088.
There are 7 words in the sentence "I built my 1st Hello World program."
The product of 123 multiplied by 456 is **56,088**.
There are 7 words in the sentence: *I*, *built*, *my*, *1st*, *Hello*, *World*, and *program*.
The exact number of languages spoken globally is estimated to be around 7,000, though this number can vary due to factors like dialect continuums and language endangerment. Ethnologue (2023) currently documents 7,168 living languages.
```

### 2. LangChain.js's BaseChatModel class (using DeepSeek-R1 671B on Microsoft Azure)

First, create an empty "tutorial" folder, an empty "BaseChatModel" sub-folder and an empty "azure" sub-sub-folder in your local device. Then copy the "taotTutorialBaseChatModelAzure.js" and ".env" files (under the "tutorial" folder -> "BaseChatModel" sub-folder -> "azure" sub-sub-folder in this repo) into your empty "azure" sub-sub-folder in your local device. Note you will need to enter your own API key and endpoint into the ".env" file.

**Tip**: To setup Azure (ie. Azure AI Foundry) just ask any AI with internet access (so that you get the latest up to date steps) the following question: "You are an expert in Microsoft Azure. Can you tell me the latest step-by-step guide on how to setup an Azure AI Foundry account and deploy a model in Azure AI Foundry within the Azure AI Foundry platform.". Once you have your model deployed, you can obtain the value for the parameters API key (credential) and endpoint from the "Models + endpoints" tab in Azure AI Foundry as shown in the screenshot below:

![deepseek-r1_azure](https://github.com/user-attachments/assets/b9ec1a0d-d509-48e8-8591-4d9af29f392c)

Then run the following lines of code:

```bash
# Navigate to the "azure" sub-sub-directory in your local device
cd tutorial\BaseChatModel\azure

# Initialize as npm project
npm init -y

# Npm install the "taot-ts" package
npm install taot-ts

# Npm install dependencies required in the "taotTutorialBaseChatModelAzure.js" file
npm install dotenv node-fetch@2 @langchain/core

# Run the "taotTutorialBaseChatModelAzure.js" file
node taotTutorialBaseChatModelAzure.js
```

After running the "taotTutorialBaseChatModelAzure.js" file, you should see a similar results to the below:

```bash
<think>
Okay, the user asked for the product of 123 and 456. I need to provide a clear answer using the calculator result, which is 56088. The instructions say not to mention the tool used, so I shouldn't refer to a calculator. Just state the result directly. Let me phrase it concisely. Maybe start with "The product of 123 multiplied by 456 is 56,088." That's straightforward and includes the commas for readability. Check if the number is correct: 123*456. Let me do a quick verification. 100*456=45,600, 20*456=9,120, 3*456=1,368. Adding those: 45,600 + 9,120 = 54,720 + 1,368 = 56,088. Yep, that's right. So the answer is correct. Alright, just present the result as the answer without any extra details. That should do it.
</think>

The product of 123 multiplied by 456 is **56,088**.
<think>
Okay, the user asked, "How many words are in this sentence?: I built my 1st Hello World program". The tool result says 7. Let me check that.

First, the sentence is "I built my 1st Hello World program". Let's count the words. "I" is 1, "built" 2, "my" 3, "1st" 4, "Hello" 5, "World" 6, "program" 7. So yeah, that's seven words. The number "1st" counts as a single word even though it's a numeral and a suffix. Similarly, "Hello World" is two separate words. The user might wonder if contractions or numbers affect the count, but standard practice is to count each sequence of characters between spaces as a word. So the answer should be straightforward: "There are 7 words in that sentence."
</think>

There are 7 words in the sentence: "I built my 1st Hello World program."
<think>
Okay, the user asked for the product of 123 and 456. The calculator gave 56,088. I need to answer naturally without mentioning the tool. Let me phrase it simply. Start with the result, maybe state the numbers multiplied equal that. Keep it short and direct. No extra words. Check the numbers again to be sure. Yeah, 123 times 456 is indeed 56,088. Alright, that should do it.
</think>

The product of 123 multiplied by 456 is **56,088**.
<think>
Okay, the user is asking how many words are in the sentence they provided. The sentence is "I built my 1st Hello World program". The tool result says 7 words. Let me check that.

First, I need to split the sentence into words. Words are usually separated by spaces. Let's break it down:

1. I
2. built
3. my
4. 1st
5. Hello
6. World
7. program

That's seven words. Wait, sometimes people might confuse numbers with hyphens or other characters, but "1st" is a single word. "Hello World" here is two separate words because of the space. So yes, the tool is correct.

The user wants a concise and direct response without mentioning the tool. So the answer should just state the number. Maybe like, "There are 7 words in the sentence." That's straightforward and uses the result without extra details.
</think>

There are 7 words in the sentence.
<think>
Okay, the user is asking how many languages there are in the world. Let me think. The question is about counting languages. I remember that there's a tool called 'text_analyzer' which can analyze text. But wait, the user didn't provide any text to analyze. The tools I have are calculator and text_analyzer. The calculator is for math expressions, and text_analyzer is for analyzing provided text, counting words or characters.

Since the user's question isn't about analyzing a given text or performing a calculation, but rather a factual question about the number of languages globally, there's no tool available here. The text_analyzer requires the user to provide text, which they didn't. So the correct response is to answer directly. But the user's previous instruction said to only use tools when applicable and answer in plain text otherwise. The assistant should know that this question can't be addressed with the available tools, hence respond in plain text with the factual answer.
</think>

The exact number of languages in the world is difficult to determine, but estimates suggest there are roughly 7,000-7,100 living languages globally. This number fluctuates due to factors like language endangerment and discovery of undocumented languages.
```

To remove the "think" blocks from the response, use the line of code `content.split('</think>')[1].trim()`. I have done this for you in the "taotTutorialBaseChatModelAzureNoThink.js" file under the "tutorial" folder -> "BaseChatModel" sub-folder -> "azureNoThink" sub-sub-folder in this repo. Just follow the same steps under "**Langchain.js's BaseChatModel class**" above but for the "taotTutorialBaseChatModelAzureNoThink.js" file. After running the "taotTutorialBaseChatModelAzureNoThink.js" file, you should see a similar results to the below:

```bash
The result of 123 multiplied by 456 is **56,088**.
There are 7 words in the sentence.
The product of 123 and 456 is **56,088**.
The sentence "I built my 1st Hello World program" contains **7 words**.
The exact number of languages in the world is difficult to determine, but estimates suggest there are approximately **7,000 languages** spoken globally. This number fluctuates due to factors like language endangerment, evolution, and documentation efforts.
```

### 3. LangChain.js's ChatOpenAI class (using QwQ-32B on OpenRouter)

First, create an empty "tutorial" folder and an empty "ChatOpenAI_QwQ32B" sub-folder in your local device. Then copy the "taotTutorialChatOpenAI_QwQ32B.js" and ".env" files (under the "tutorial" folder and "ChatOpenAI_QwQ32B" sub-folder in this repo) into your empty "ChatOpenAI_QwQ32B" sub-folder in your local device. Note you will need to enter your own API key into the ".env" file.

Then run the following lines of code:

```bash
# Navigate to the "ChatOpenAI_QwQ32B" sub-directory in your local device
cd tutorial\ChatOpenAI_QwQ32B

# Initialize as npm project
npm init -y

# Npm install the "taot-ts" package
npm install taot-ts

# Npm install dependencies required in the "taotTutorialChatOpenAI.js" file
npm install dotenv @langchain/openai

# Run the "taotTutorialChatOpenAI.js" file
node taotTutorialChatOpenAI_QwQ32B.js
```

After running the "taotTutorialChatOpenAI_QwQ32B.js" file, you should see a similar results to the below:

```bash
The result of 123 multiplied by 456 is 56,088.
There are 7 words in the sentence "I built my 1st Hello World program." Let me know if you need help with anything else!
The product of 123 and 456 is 56,088.
The sentence "I built my 1st Hello World program" contains **7 words**.
The number of languages in the world is a complex and debated figure, but the most commonly cited estimate from Ethnologue is **7,100+ living languages**. This number can vary based on classification criteria and ongoing documentation efforts.
```

### 4. LangChain's MCP Adapters library with DeepSeek-R1 671B (via LangChain's ChatOpenAI class on OpenRouter)

For this section, please refer to the "TutorialMcpAdaptersDeepSeekR1.mjs" file under the "tutorial" folder -> "McpAdapters_DeepSeekR1" sub-folder in this repo.

This notebook tutorial showcases a step-by-step guide on how to implement DeepSeek-R1 connected to tools in MCP servers, using LangChain's MCP Adapters library (here: https://github.com/langchain-ai/langchain-mcp-adapters).

I am using MCP servers from an MPC server registry/depository called MCP Server Cloud (here: https://mcpserver.cloud/, or their GitHub repo here: https://github.com/modelcontextprotocol).

I will be connecting DeepSeek-R1 to 2 MCP servers, with 1 tool in each MCP server. Namely, I will be using the Brave Search MCP Server (here: https://mcpserver.cloud/server/server-brave-search) and the AccuWeather MCP Server (here: https://mcpserver.cloud/server/mcp-weather-server).

To use the Brave Search MCP Server and the AccuWeather MCP Server, you will need to create a Brave Browser API key (here: https://brave.com/search/api/) and an AccuWeather API key (here: https://developer.accuweather.com/getting-started), respectively. They are both free and it's fairly straight forward to do this (but note creating a Brave Browser API key require a credit card even for the free subscription). Just ask any AI for the step-by-step guide to do this.

Once you have your Brave Browser and AccuWeather API keys, save them in a .env file, along with an OpenRouter API key (for this notebook tutorial I will be using DeepSeek-R1 hosted on OpenRouter). This .env file is saved in the same folder as where this Jupyter Notebook will be saved.

Now that we have all the above setup, let's get into the more technical part of this notebook tutorial. How LangChain's MCP Adapters library works is it convert tools in MCP servers into LangChain tools, so then these LangChain tools can be used within the LangChain/LangGraph framework. Yes, it's as simple as that!

Currently MCP servers are still in it's early development stages and so MCP servers doesn't yet have a direct SSE (Server-Sent Events) connection. To fix this, I have used a package called Supergateway (here: https://github.com/supercorp-ai/supergateway) which establishes a SSE connection for MCP servers. [Note: Currently there are several other ways to connect to MCP servers including downloading MCP servers into your local device and then connecting with the MCP server locally in your device using a Python package called langchain-mcp-tools (here: https://github.com/hideya/langchain-mcp-tools-py, where support for remote MCP server connection is currently experimental) or using the docker approach (here: https://www.youtube.com/watch?v=rdvt1qBZJtI), but I have chosen to use the Supergateway package approach as it is more realistic to connect to remote servers via SSE connections. The Supergateway package is run using npx (which is available in Node.js) which means if you haven't already, you will need to download Node.js (from here: https://nodejs.org/en/download) in order to use the Supergateway package via npx.]

Referring to the instructions in the README file in the Supergateway's GitHub repo, in particular the "stdio → SSE" section ("Expose an MCP stdio server as an SSE server:"):
- To establish a SSE connection for the Brave Search MCP Server using Supergateway, run the following command below in your IDE's (for eg. Cursor or VS Code) Terminal window (where this will use port 8001):
`npx -y supergateway --stdio "npx -y @modelcontextprotocol/server-brave-search" --port 8001 --baseUrl http://localhost:8001 --ssePath /sse --messagePath /message`
- To establish a SSE connection for the AccuWeather MCP Server using Supergateway, open a 2nd Terminal window in your IDE and run the following command below in this 2nd Terminal window (where this will use port 8002):
`npx -y supergateway --stdio "uvx --from git+https://github.com/adhikasp/mcp-weather.git mcp-weather" --port 8002 --baseUrl http://localhost:8002 --ssePath /sse --messagePath /message`

**Tip:** If you are unsure how to write the commands above for other MCP servers, just copy and paste the entire README file instructions in Supergateway's GitHub repo and the entire content of the MCP server page in the MCP Server Cloud registry/depository wesbite (for eg. for the Brave Search MCP Server, copy and paste the entire content from this page from the MCP Server Cloud registry/depository website: https://mcpserver.cloud/server/server-brave-search) into an AI and ask the AI to give you the "stdio → SSE" command.

Now that you have both the Brave Search MCP Server and AccuWeather MCP Server SSE connections running, you can now run the "TutorialMcpAdaptersDeepSeekR1.mjs" file which uses `http://localhost:8001/sse` for the Brave Search MCP Server and `http://localhost:8002/sse` for the AccuWeather MCP Server. 

First, create an empty "tutorial" folder and an empty "McpAdapters_DeepSeekR1" sub-folder in your local device. Then copy the "TutorialMcpAdaptersDeepSeekR1.mjs" and ".env" files (under the "tutorial" folder and "McpAdapters_DeepSeekR1" sub-folder in this repo) into your empty "McpAdapters_DeepSeekR1" sub-folder in your local device. Note the "TutorialMcpAdaptersDeepSeekR1.mjs file needs to be saved as a .mjs file and you will need to enter your own API keys into the ".env" file.

Then run the following lines of code in your IDE Terminal:

```
# Navigate to the "McpAdapters_DeepSeekR1" sub-directory in your local device
cd tutorial\McpDeepSeepR1

# Initialize as npm project
npm init -y

# Npm install dependencies required in the "TutorialMcpAdaptersDeepSeekR1.mjs" file
npm install @langchain/mcp-adapters @langchain/langgraph @langchain/openai dotenv

# Run the "TutorialMcpAdaptersDeepSeekR1.mjs" file
node TutorialMcpDeepSeepR1.mjs
```

After running the "TutorialMcpAdaptersDeepSeekR1.mjs" file, you should see a similar results to the below:

```
Here's a summary of the latest AI news from credible sources:

1. **Industry Trends** (ArtificialIntelligence-News.com): Dedicated coverage of frontline AI developments, including emerging industry trends and innovations.

2. **Corporate AI Adoption** (NY Times):
   - H&M is experimenting with AI to create "digital twins" of clothing models.
   - News outlets are grappling with accuracy issues in AI-generated content, with some issuing frequent corrections.

3. **AI Chatbots** (NBC News): Focus on tools like ChatGPT, Google’s Bard, and Apple’s rumored AI chatbot, highlighting their growing role in tech.

4. **Research & Robotics** (ScienceDaily): Updates on AI-driven robotics and computational models aiming to replicate human intelligence.

5. **Critical Perspectives** (The Guardian): Ongoing analysis of AI’s societal impact, ethics, and policy challenges.

For deeper insights, visit these sources directly using the provided links. Let me know if you’d like updates on a specific subtopic! 🤖
Here's the weather forecast for Sydney tomorrow based on current information:

**Tomorrow's Weather (Sydney, Australia):**
- **Daytime High:** 72°F (22°C) with windy conditions and a mix of clouds and sun (AccuWeather)
- **Rain:** Morning showers possible, decreasing through the day (The Weather Channel)
- **Evening:** Cooler at 63°F (17°C), with lingering breezy conditions
- **Wind:** SSW winds 15-25 mph (24-40 km/h)

Key details: Expect a brisk day with morning showers tapering off, followed by partly sunny skies. The breeze will make it feel cooler than the actual temperature.

Would you like me to check another day or clarify further?
```

Remember once you are done with using the MCP Servers, you can close off or disconnect the MCP Server's SSE connections by typing "CTRL" + "C" keys in your IDE's Terminal window.

**Takeaway:** This notebook tutorial demonstrates that even without having DeepSeek-R1 fine-tuned for tool calling or even without using my Tool-Ahead-of-Time package (since LangChain's MCP Adapters library works by converting tools in MCP servers into LangChain tools), MCP (via LangChain's MCP Adapters library) still works with DeepSeek-R1. This is likely because DeepSeek-R1 671B is a reasoning model and also how the prompts are written within LangChain's MCP Adapters library.

### 5. LangChain.js's ChatOpenAI class (using Qwen3 models on OpenRouter)

First, create an empty "tutorial" folder and an empty "ChatOpenAI_Qwen3" sub-folder in your local device. Then copy the "taotTutorialChatOpenAI_Qwen3.js" and ".env" files (under the "tutorial" folder and "ChatOpenAI_Qwen3" sub-folder in this repo) into your empty "ChatOpenAI_Qwen3" sub-folder in your local device. Note you will need to enter your own API key into the ".env" file.

Then run the following lines of code:

```bash
# Navigate to the "ChatOpenAI_Qwen3" sub-directory in your local device
cd tutorial\ChatOpenAI_Qwen3

# Initialize as npm project
npm init -y

# Npm install the "taot-ts" package
npm install taot-ts

# Npm install dependencies required in the "taotTutorialChatOpenAI_Qwen3.js" file
npm install dotenv @langchain/openai

# Run the "taotTutorialChatOpenAI_Qwen3.js" file
node taotTutorialChatOpenAI_Qwen3.js
```

After running the "taotTutorialChatOpenAI_QwQ32B.js" file, you should see a similar results to the below:

```bash
123 multiplied by 456 equals 56,088.
The sentence "I built my 1st Hello World program" contains 7 words.
The product of 123 multiplied by 456 is **56,088**. Let me know if you need help with anything else! 🧮😊
The sentence contains 7 words: "I," "built," "my," "1st," "Hello," "World," and "program."
The exact number of languages in the world is difficult to determine precisely, but estimates range around **7,000** living languages. This number varies due to factors like language extinction, dialect classification, and ongoing linguistic research. No tool is needed for this factual question.
```

## Changelog 📖

20th Feb 2025:
- Package now available on PyPI! Just "pip install taot" and you're ready to go.
- Completely redesigned to follow LangChain's and LangGraph's intuitive `create_react_agent` tool calling methods.
- Produces natural language responses when tool calling is performed.

1st Mar 2025:
- Package now available in TypeScript on npm! Just "npm install taot-ts" and you're ready to go.

8th Mar 2025:
- Updated repo to include implementation support for Microsoft Azure via Langchain.js's BaseChatModel class (Note: As of 8th Mar 2025, Langchain.js's ChatOpenAI, ChatAzureOpenAI (considered to be deprecated) and AzureChatOpenAI does not provide Microsoft Azure support for the DeepSeek-R1 model).

16th Mar 2025:
- Updated repo to include example tutorial for tool calling support for QwQ-32B using Langchain.js's ChatOpenAI class (hosted on OpenRouter). See "taotTutorialChatOpenAI_QwQ32B.js" file under the "tutorial" folder -> "ChatOpenAI_QwQ32B" sub-folder in this repo. While doing this, I noticed OpenRouter's API for QwQ-32B is unstable and returning empty responses (likely because QwQ-32B is a new model added on OpenRouter only about a week ago). Due to this, I have updated the taot-ts package to keep looping until a non-empty response is returned. If you have previously downloaded the package, please update the package via `npm update taot-ts`.
- Checked out OpenAI Agents SDK framework for tool calling support for non-OpenAI providers/models (https://openai.github.io/openai-agents-python/models/) and they don't support tool calling for DeepSeek-R1 (or models available through OpenRouter) yet (as of 16th Mar 2025), so there you go! 😉

28th Mar 2025:
- Attempted to implement DeepSeek-R1 for Amazon Bedrock via LangChain.js's ChatBedrockConverse and LangChain.js's BedrockChat classes, but DeepSeek-R1's model ID `us.deepseek.r1-v1:0` is not yet supported for these two classes.
- Managed to implement DeepSeek-R1 for Amazon Bedrock directly via JavaScript version of the AWS SDK (ie. `@aws-sdk/client-bedrock-runtime`), but the model responses are not stable where sometimes it will return the reasoning/thinking part of the model with no token tags (for eg. `</think>`, `<|Assistant|>`, `<|end_of_sentence|>` etc.) which will allow us to filter out the reasoning/thinking part. Because of this, I have decided not to release this implementation for now.
- The DeepSeek-R1 Python implementation for Amazon Bedrock via LangChain's ChatBedrockConverse class was successful. Please refer to the equivalent Python repo for this package here: https://github.com/leockl/tool-ahead-of-time.

6th April 2025:
- Special Update: Updated repo to include implementation support for using LangChain.js's MCP Adapters library with DeepSeek-R1 671B (via LangChain.js's ChatOpenAI class on OpenRouter).
- Special Update: Implementation support for using LangGraph's Bigtool library with DeepSeek-R1 671B (via LangChain's ChatOpenAI class on OpenRouter) was not included as there is currently no JavaScript/TypeScript support for the LangGraph's Bigtool library. The Python implementation for this was successful, see the equivalent Python repo here: https://github.com/leockl/tool-ahead-of-time.

7th May 2025:
- Updated repo to include example tutorial for tool calling support for all the Qwen3 models using Langchain's ChatOpenAI class (hosted on OpenRouter), with the exception of the Qwen3 0.6B model. My observation is that the Qwen 0.6B model is just not "smart" or performant enough to understand when tool use is required.

## Contributions 🤝

Feel free to contribute! Whether it's adding features, fixing bugs, adding comments in the code or any suggestions to improve this repo, all are welcomed 😄

## Disclaimer ⚠️

This package is like that friend who shows up to the party early - technically not invited yet, but hopes to bring such good vibes that everyone's glad they came.

## License 📜

MIT License - Because sharing is caring, and we care about you having tool calling RIGHT NOW.

---

Made with ❤️ and a healthy dose of impatience. 

Please give my GitHub repo a ⭐ if this was helpful. Thank you!
