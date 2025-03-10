# AI Chat Application

A real-time chat application with streaming responses using Node.js and the OpenAI API.

## Features

- Real-time streaming responses
- Multi-turn conversation support
- Modern and responsive UI
- Server-Sent Events (SSE) for efficient streaming
- Easy-to-use interface

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variable:
   - Make sure the `AI_STUDIO_TOKEN` environment variable is set in your system
   ```bash
   # Linux/Mac
   export AI_STUDIO_TOKEN=your_token_here
   
   # Windows (Command Prompt)
   set AI_STUDIO_TOKEN=your_token_here
   
   # Windows (PowerShell)
   $env:AI_STUDIO_TOKEN="your_token_here"
   ```

3. Start the server:
```bash
npm start
```

4. Open your browser and visit:
```
http://localhost:3000
```

## Usage

1. Type your message in the input field
2. Press Enter or click the Send button
3. Watch as the AI responds in real-time with streaming text
4. Continue the conversation with follow-up messages

## Technical Details

- Backend: Node.js with Express
- Frontend: HTML5, CSS3, JavaScript
- API: OpenAI API with streaming support
- Real-time updates using Server-Sent Events (SSE) 