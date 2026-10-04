# RodiumAI JavaScript/TypeScript SDK

[![npm version](https://img.shields.io/npm/v/rodiumai)](https://www.npmjs.com/package/rodiumai)
[![Node versions](https://img.shields.io/badge/node-18%20|%2020%20|%2022-brightgreen)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Unified AI API for Africa — access leading AI models through one SDK with local payment methods.

> **OpenAI drop-in replacement** — migrate by changing only `apiKey` and `baseURL`.

## Installation

```bash
npm install rodiumai
```

## Quick Start

```typescript
import RodiumAI from 'rodiumai'

const client = new RodiumAI({
  apiKey: process.env.RODIUMAI_API_KEY
})

// Chat completion
const response = await client.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Hello!' }]
})
console.log(response.choices[0].message.content)

// Streaming
const stream = await client.chat.completions.create({
  model: 'auto',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true
})
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}
```

## Migration from OpenAI

```typescript
// Before (OpenAI)
import OpenAI from 'openai'
const client = new OpenAI({ apiKey: 'sk-...' })

// After (RodiumAI)
import RodiumAI from 'rodiumai'
const client = new RodiumAI({ apiKey: 'rdk-...' })
```

Same methods, same parameters, same response types.

## Documentation

Full documentation at [docs.rodiumai.io](https://docs.rodiumai.io).

## License

MIT
