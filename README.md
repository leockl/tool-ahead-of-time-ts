# Tool-Ahead-of-Time-TypeScript (TAoT-ts): Because Why Wait? 🕒
Ever found yourself staring at a shiny new LLM through LangChain.js's window, but can't use tool calling because it's "not supported yet"? 

*Sad agent noises* 😢

Well, hold my JSON parser, because this repo says "NOT TODAY!" 🦾

## What is this sorcery? 🧙‍♂️

This is a TypeScript package (a package mirrowing the equivalent Python package: https://github.com/leockl/tool-ahead-of-time) that enables tool calling for any model available through Langchain.js's ChatOpenAI library (and by extension, any model available through OpenAI's library) and Langchain.js's BaseChatModel library, even before LangChain.js and LangGraph.js officially supports it! 

Yes, you read that right. We're living in the age of AI and things move fast 🏎️💨

It essentially works by reformatting the output response of the model into a JSON parser and passing this on to the relevant tools.

This repo showcases an example with DeepSeek-R1 671B, which isn't currently supported with tool calling by LangChain.js and LangGraph.js (as of 16th Feb 2025).

## Features 🌟

- Tool calling support for OpenAI and non-OpenAI models available on:
  - Langchain.js's ChatOpenAI library (and by extension, OpenAI and non-OpenAI models available on the base OpenAI's library).
  - Langchain.js's BaseChatModel library.
- This package follows a similar method to LangChain.js's and LangGraph.js's `createReactAgent` method for tool calling, so makes it easy for you to read the syntax. 😊
- Zero waiting for official support required.
- More robust than a caffeinated developer at 3 AM. ☕

## Quick Start 🚀

I will show below how to run the tutorials for both the Langchain.js's ChatOpenAI library and BaseChatModel library cases in this repo which uses the `taot-ts` package:

### Langchain.js's ChatOpenAI library

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

### Langchain.js's BaseChatModel library

First, create an empty "tutorial" folder, an empty "BaseChatModel" sub-folder and an empty "azure" sub-sub-folder in your local device. Then copy the "taotTutorialBaseChatModelAzure.js" and ".env" files (under the "tutorial" folder -> "BaseChatModel" sub-folder -> "azure" sub-sub-folder in this repo) into your empty "azure" sub-sub-folder in your local device. Note you will need to enter your own API key and endpoint into the ".env" file.

**Tip**: To setup Azure (ie. Azure AI Foundry) just ask any AI with internet access (so that you get the latest up to date steps) the following question: "You are an expert in Microsoft Azure. Can you tell me the latest step-by-step guide on how to setup an Azure AI Foundry account and deploy a model in Azure AI Foundry within the Azure AI Foundry platform.". Once you have your model deployed, you can obtain the value for the parameters API key (credential) and endpoint from the "Models + endpoints" tab in Azure AI Foundry as shown in the screenshot below:

![deepseek-r1_azure](https://github.com/user-attachments/assets/40564165-9646-49ac-8ef3-62d85786a240)

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

To remove the "think" blocks from the response, use the line of code `content.split('</think>')[1].trim()`. I have done this for you in the "taotTutorialBaseChatModelAzureNoThink.js" file under the "tutorial" folder -> "BaseChatModel" sub-folder -> "azureNoThink" sub-sub-folder in this repo. Just follow the same steps under **Langchain.js's BaseChatModel library** above to run the "taotTutorialBaseChatModelAzureNoThink.js" file and you should see a similar results to the below:

```bash
The result of 123 multiplied by 456 is **56,088**.
There are 7 words in the sentence.
The product of 123 and 456 is **56,088**.
The sentence "I built my 1st Hello World program" contains **7 words**.
The exact number of languages in the world is difficult to determine, but estimates suggest there are approximately **7,000 languages** spoken globally. This number fluctuates due to factors like language endangerment, evolution, and documentation efforts.
```

## Change Log 📖

20th Feb 2025:
- Package now available on PyPI! Just "pip install taot" and you're ready to go.
- Completely redesigned to follow LangChain's and LangGraph's intuitive `create_react_agent` tool calling methods.
- Produces natural language responses when tool calling is performed.

1st Mar 2025:
- Package now available in TypeScript on npm! Just "npm install taot-ts" and you're ready to go.

8th Mar 2025:
- Updated package to include implementation support for Microsoft Azure via Langchain.js's BaseChatModel library (Note: As of 8th Mar 2025, Langchain.js's ChatOpenAI, ChatAzureOpenAI and AzureChatOpenAI does not provide Microsoft Azure support for the DeepSeek-R1 model).

## Contributions 🤝

Feel free to contribute! Whether it's adding features, fixing bugs, adding comments in the code or any suggestions to improve this repo, all are welcomed 😄

## Disclaimer ⚠️

This package is like that friend who shows up to the party early - technically not invited yet, but hopes to bring such good vibes that everyone's glad they came.

## License 📜

MIT License - Because sharing is caring, and we care about you having tool calling RIGHT NOW.

---

Made with ❤️ and a healthy dose of impatience.
