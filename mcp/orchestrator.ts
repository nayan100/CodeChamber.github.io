import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { FrontendAgent } from './agents/frontend.agent.js';
import { BackendAgent } from './agents/backend.agent.js';
import { DevOpsAgent } from './agents/devops.agent.js';

dotenv.config({ path: '../.env.local' });

// Need to use the securely bounded server role.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function logAgentIntent(agentName: string, actionName: string, payload: any) {
    const { error } = await supabase.from('ai_action_logs').insert({
        agent_name: agentName,
        action_type: actionName,
        payload: payload,
        status: 'PENDING_APPROVAL' 
    });
    if(error) console.error("Error logging action:", error.message);
}

export async function processQueue() {
  console.log('[Orchestrator] Checking for pending tasks...');
  
  const { data: tasks, error } = await supabase
    .from('ai_task_queue')
    .select('*')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    console.error('[Orchestrator] DB Error:', error.message);
    return;
  }
  
  if (!tasks || tasks.length === 0) return;

  const task = tasks[0];
  console.log(`[Orchestrator] Picked up task [${task.task_type}] - ID: ${task.id}`);

  // Mark task as computing
  await supabase.from('ai_task_queue').update({ status: 'IN_PROGRESS' }).eq('id', task.id);

  try {
    let result;

    // Route to appropriate agent
    switch (task.task_type) {
        case 'FRONTEND_OPTIMIZATION':
            result = await FrontendAgent.execute(task.result_payload);
            await logAgentIntent(FrontendAgent.name, result.action, result.details);
            break;
            
        case 'BACKEND_REVIEW':
            result = await BackendAgent.execute(task.result_payload);
            await logAgentIntent(BackendAgent.name, result.action, result.details);
            break;
            
        case 'NIGHTLY_LINT':
            // E.g., The DevOps agent runs health checks
            result = await DevOpsAgent.execute(task.result_payload);
            
            // DevOps checks might not need "Approval", they can just be marked executed
             await supabase.from('ai_action_logs').insert({
                agent_name: DevOpsAgent.name,
                action_type: 'Nightly CI Healthcheck',
                payload: result.details,
                status: 'EXECUTED' 
            });
            break;

        case 'WEEKLY_BLOG':
            result = { action: 'Blog Draft Started', details: 'Searching trending tech...' };
            await logAgentIntent('Blog Agent', result.action, result.details);
            break;
            
        default:
            throw new Error(`Orchestrator has no mapped Agent for ${task.task_type}`);
    }

    // Mark task successfully completed
    await supabase.from('ai_task_queue')
      .update({ status: 'COMPLETED', result_payload: result })
      .eq('id', task.id);

    console.log(`[Orchestrator] Task ${task.id} handled successfully.`);

  } catch (err: any) {
    console.error(`[Orchestrator] Task ${task.id} failed:`, err.message);
    
    // Bubble up failure state
    await supabase.from('ai_task_queue')
      .update({ status: 'FAILED', result_payload: { error: err.message } })
      .eq('id', task.id);
  }
}

// In a real environment, you might run this on a cron, or listen to realtime channels!
console.log("Orchestrator loaded. (Run processQueue() to tick).");
