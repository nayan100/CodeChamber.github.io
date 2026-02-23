-- Track tasks for the AI orchestrator to process
CREATE TABLE IF NOT EXISTS ai_task_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_type VARCHAR(50) NOT NULL, -- e.g., 'WEEKLY_BLOG', 'NIGHTLY_LINT'
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, FAILED
    result_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comprehensive Audit Log & Approval System
CREATE TABLE IF NOT EXISTS ai_action_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL, -- e.g., 'BlogAgent', 'FrontendAgent'
    action_type VARCHAR(100) NOT NULL, -- e.g., 'DB_WRITE', 'CODE_COMMIT'
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING_APPROVAL', -- APPROVED, REJECTED, EXECUTED
    executed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Enable RLS on these tables so that only admins can access them
ALTER TABLE ai_task_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_action_logs ENABLE ROW LEVEL SECURITY;

-- Note: Policies would be needed here to restrict read/write to the 'admin' role or authenticated admin emails.
-- For example:
-- CREATE POLICY "Allow Admin select ai_action_logs" ON ai_action_logs FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' IN ('your-admin-email@example.com'));
