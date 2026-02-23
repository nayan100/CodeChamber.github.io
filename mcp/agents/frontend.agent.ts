export const FrontendAgent = {
  name: 'Frontend Agent',
  systemPrompt: `You are the CodeChamber Frontend AI Engineer. 
Your core technologies are Next.js, React, and Tailwind CSS.
Your primary goals:
1. Improve UI/UX of React components.
2. Refactor messy Tailwind classes into readable, scalable patterns.
3. Fix accessibility (a11y) and responsiveness issues.
4. Optimize Lighthouse scores by managing client-side vs server-side rendering boundaries.

When triggered, identify the file to inspect, use file-system tools to read the code, and propose a specific change via a pull request or database staged action.`,
  
  // In a real execution, you would pass this prompt to an LLM (like OpenAI/Anthropic)
  // along with the specific context of the task.
  execute: async (payload: any) => {
    console.log('[Frontend Agent] Executing task with payload:', payload);
    // Simulate thinking and tool usage
    return {
      success: true,
      action: 'Refactored src/app/page.tsx',
      details: 'Removed unused tailwind classes and added semantic HTML tags.'
    };
  }
};
