import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import 'dotenv/config';

// Define the server
const server = new Server(
  {
    name: "CodeChamber-AI-Core",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      logging: {},
    }
  }
);

// Define tool schemas
const MOCK_TOOLS = [
  {
    name: "supabase_insert_draft",
    description: "Inserts a new draft blog post to Supabase pending admin approval.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        content: { type: "string" },
      },
      required: ["title", "content"],
    }
  }
];

// Handle listing tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: MOCK_TOOLS
  };
});

// Handle executing tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  console.log(`[MCP Server] Executing tool: ${name}`);

  if (name === "supabase_insert_draft") {
    // In production, this would use a Supabase client to write to ai_action_logs
    return {
      content: [
        {
          type: "text",
          text: `Draft staged for approval. Title: ${args?.title}`
        }
      ]
    };
  }

  throw new Error(`Tool not supported: ${name}`);
});

// Initialize transport
async function run() {
  console.log('Starting MCP Server via STDIO...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('MCP Server connected and listening.');
}

run().catch((error) => {
  console.error("Fatal error starting server:", error);
  process.exit(1);
});
