# Playwright Agentic AI

Generate Playwright end-to-end tests with an agentic LLM workflow.

## What it does
- Analyzes a target page with Playwright and extracts interactive elements.
- Applies guardrails and locator prioritization for stable selectors.
- Loads prompts and runtime settings from a single JSON config.
- Writes timestamped Playwright specs under `tests/<host>/`.
- TypeScript-first development entry at [src/agentRunner.ts](src/agentRunner.ts).

## Prerequisites
- Node.js 18+
- Ollama running locally
- An installed model (default: `llama3.2:3b`)

## Setup
1) Install dependencies

```bash
npm install
```

2) Install Playwright browsers

```bash
npx playwright install
```

3) Start Ollama and pull the model

```bash
ollama serve
ollama pull llama3.2:3b
```

4) Configure `agent.config.json` (see below)

## Configure (agent.config.json)
`agent.config.json` at the repo root controls runtime behavior.

```json
{
  "OLLAMA_BASE_URL": "http://localhost:11434",
  "LLM_MODEL": "llama3.2:3b",
  "LOG_LEVEL": "info",
  "TIMEOUT": 30000,
  "MAX_RETRIES": 3,
  "ALLOWED_DOMAINS": ["localhost", "example.com"]
}
```

- `OLLAMA_BASE_URL`: Ollama server URL.
- `LLM_MODEL`: model name/tag to use for generation.
- `LOG_LEVEL`: `debug`, `info`, `warn`, `error`.
- `TIMEOUT`: page load/operation timeout in milliseconds.
- `MAX_RETRIES`: retries for flaky steps.
- `ALLOWED_DOMAINS`: optional allowlist; agent aborts if target host is not listed.

## Run
```bash
npm run dev -- https://example.com
```

What happens:
- Loads config via [src/config/loader.ts](src/config/loader.ts) and [src/config/runtime.ts](src/config/runtime.ts).
- Analyzes the target page with [src/services/pageAnalyzer.ts](src/services/pageAnalyzer.ts) and LLM prompts from [src/config/prompts.ts](src/config/prompts.ts).
- Applies guardrails from [src/validators/agentGuardrails.ts](src/validators/agentGuardrails.ts) and locator priorities from [src/config/locatorPriority.ts](src/config/locatorPriority.ts).
- Generates a Playwright spec and saves it with [src/services/testWriter.ts](src/services/testWriter.ts) to `tests/<host>/<host>-YYYY-MM-DD-HHMM.spec.ts`.

## Project layout (key files)
- Entry point: [src/agentRunner.ts](src/agentRunner.ts)
- Core orchestrator: [src/core/agent.ts](src/core/agent.ts)
- Services: [src/services/llmClient.ts](src/services/llmClient.ts), [src/services/pageAnalyzer.ts](src/services/pageAnalyzer.ts), [src/services/testWriter.ts](src/services/testWriter.ts)
- Config: [src/config/loader.ts](src/config/loader.ts), [src/config/runtime.ts](src/config/runtime.ts), [src/config/prompts.ts](src/config/prompts.ts), [src/config/locatorPriority.ts](src/config/locatorPriority.ts), [src/config/guardrailTypes.ts](src/config/guardrailTypes.ts)
- Validation: [src/validators/agentGuardrails.ts](src/validators/agentGuardrails.ts)
- Utilities and types: [src/utils/logger.ts](src/utils/logger.ts), [src/types.ts](src/types.ts)

## Scripts
- `npm run dev`: Run the agent against a URL (TypeScript via tsx).
- `npm run type-check`: TypeScript type-check only.
- `npm run build`: Emit compiled JS to `dist/`.
- `npm start`: Run the compiled agent from `dist/agentRunner.js`.

## Troubleshooting
- Ollama connection issues: confirm `ollama serve` is running and `OLLAMA_BASE_URL` is reachable.
- Model missing: pull the model specified in `agent.config.json`.
- Playwright browser errors: rerun `npx playwright install`.
- Type errors: run `npm run type-check`.

## License
MIT# Playwright Agentic AI

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