# Playwright Agentic AI

Generate Playwright test cases using Agentic AI and LLMs.

## Features

- 🤖 AI-powered test generation
- 📖 Automatic page analysis
- 🎯 Page Object Model generation
- 🔧 Customizable via .env
- 📝 TypeScript support

## Prerequisites

- Node.js 18+
- Ollama (running locally)
- A downloaded LLM model

## Setup

### 1. Install Ollama

```bash
# macOS
brew install ollama

# Or download from https://ollama.ai
```

### 2. Start Ollama

```bash
ollama serve
```

### 3. Pull a Model

```bash
ollama pull llama3.2:3b
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Configure Environment

```bash
cp .env.example .env
# Edit .env as needed
```

## Usage

```bash
npm run dev -- https://example.com
```

This will:
1. Analyze the webpage
2. Extract interactive elements
3. Generate Playwright test code
4. Output the test to console

## Project Structure

```
src/
  ├── core/
  │   └── agent.ts        # Main agent logic
  ├── config/
  │   └── constants.ts    # Configuration
  ├── utils/
  │   └── logger.ts       # Logging utility
  ├── types.ts            # TypeScript types
  └── index.ts            # CLI entry point
```

## Configuration

All settings can be modified via `.env`:

- `PLAYWRIGHT_AGENT_OLLAMA_URL` - Ollama server URL
- `PLAYWRIGHT_AGENT_LLM_MODEL` - LLM model name
- `PLAYWRIGHT_AGENT_LOG_LEVEL` - Logging level
- `PLAYWRIGHT_AGENT_TIMEOUT` - Page load timeout

## Troubleshooting

### Connection Refused
Make sure Ollama is running: `ollama serve`

### Model Not Found
Pull the model: `ollama pull llama3.2:3b`

### TypeScript Errors
Run: `npm run type-check`

## Next Steps

1. Customize prompts in `src/config/constants.ts`
2. Add more analysis rules in `src/core/agent.ts`
3. Extend test generation logic
4. Add form handling capabilities

## License

MIT

    1  xcode-select --install
    2  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\n
    3  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    4  eval "$(/opt/homebrew/bin/brew shellenv)"
    5  brew doctor
    6  brew install node\n
    7  npm init -y
    8  npm i @langchain/core @langchain/ollama @playwright/test langgraph typescript tsx zod
    9  npm i @langchain/core @langchain/ollama @playwright/test @langchain/langgraph typescript tsx zod\n
   10  npm ls @langchain/langgraph 
   11  rm -rf node_modules package-lock.json
   12  npm i @langchain/core @langchain/ollama @playwright/test @langchain/langgraph typescript tsx zod
   13  npm ls
   14  npx playwright install
   15  npm i -D @types/node
   16  find src -type f -name "*.ts" | sort\n