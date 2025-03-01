# Tool-Ahead-of-Time-TypeScript (TAoT-ts): Because Why Wait? 🕒
Ever found yourself staring at a shiny new LLM through LangChain's window, but can't use tool calling because it's "not supported yet"? 

*Sad agent noises* 😢

Well, hold my JSON parser, because this repo says "NOT TODAY!" 🦾

## What is this sorcery? 🧙‍♂️

This is a TypeScript package (a package mirrowing the equivalent Python package: https://github.com/leockl/tool-ahead-of-time) that enables tool calling for any model available through Langchain's ChatOpenAI library (and by extension, any model available through OpenAI's library), even before LangChain and LangGraph officially supports it! 

Yes, you read that right. We're living in the age of AI and things move fast 🏎️💨

It essentially works by reformatting the output response of the model into a JSON parser and passing this on to the relevant tools.

This repo showcases an example with DeepSeek-R1 671B (hosted on the OpenRouter platform), which isn't currently supported with tool calling by LangChain and LangGraph (as of 16th Feb 2025).

## Features 🌟

- Tool calling support for OpenAI and non-OpenAI models available on Langchain's ChatOpenAI library (and by extension, OpenAI and non-OpenAI models available on the base OpenAI's library).
- This package follows a similar method to LangChain's and LangGraph's `create_react_agent` method for tool calling, so makes it easy for you to read the syntax. 😊
- Zero waiting for official support required.
- More robust than a caffeinated developer at 3 AM. ☕

## Quick Start 🚀

I will show a tutorial below on how to run the example script in the "index.js" file (under the "examples" folder) in this repo which uses the `taot-ts` package.

First, create an empty "examples" folder in your local device. Then copy the "index.js" and ".env" files (under the "examples" folder) in this repo into your empty "examples" folder in your local device. Note you will need to enter your own API key into the ".env" file.

Then run the following lines of code:

```bash
# Navigate to the "examples" directory in your local device
cd examples

# Initialize as npm project
npm init -y

# Npm install the "taot-ts" package
npm install taot-ts

# Npm install dependencies required in the "index.js" file
npm install dotenv @langchain/openai

# Run the "index.js" file
node index.js
```

After running the "index.js" file, you should see a similar results to the below:

```bash
123 multiplied by 456 equals 56,088.
There are 7 words in the sentence "I built my 1st Hello World program."
The product of 123 multiplied by 456 is **56,088**.
There are 7 words in the sentence: *I*, *built*, *my*, *1st*, *Hello*, *World*, and *program*.
The exact number of languages spoken globally is estimated to be around 7,000, though this number can vary due to factors like dialect continuums and language endangerment. Ethnologue (2023) currently documents 7,168 living languages.
```

## Change Log 📖

20th Feb 2025:
- Package now available on PyPI! Just "pip install taot" and you're ready to go. (v0.1.3)
- Completely redesigned to follow LangChain's and LangGraph's intuitive `create_react_agent` tool calling methods.
- Produces natural language responses when tool calling is performed.

1st Mar 2025:
- Package now available in TypeScript on npm! Just "npm install taot-ts" and you're ready to go. (v0.1.4)

## Contributions 🤝

Feel free to contribute! Whether it's adding features, fixing bugs, adding comments in the code or any suggestions to improve this repo, all are welcomed 😄

## Disclaimer ⚠️

This package is like that friend who shows up to the party early - technically not invited yet, but hopes to bring such good vibes that everyone's glad they came.

## License 📜

MIT License - Because sharing is caring, and we care about you having tool calling RIGHT NOW.

---

Made with ❤️ and a healthy dose of impatience.
