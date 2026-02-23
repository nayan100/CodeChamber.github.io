'use client'

import { useState, useEffect } from 'react'
import { Server, Activity, Bot, Shield, Terminal, Zap, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'
import { getAiActionLogs, updateAiActionStatus, triggerAiTask } from '@/lib/actions'
import type { AiActionLog } from '@/types'
import toast from 'react-hot-toast'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AIControlCenter() {
  const [autonomousMode, setAutonomousMode] = useState(false)
  const [logs, setLogs] = useState<AiActionLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = async () => {
    try {
      const data = await getAiActionLogs()
      setLogs(data as AiActionLog[])
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch AI logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    // Could set up polling here
    const interval = setInterval(fetchLogs, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      toast.loading(`Processing ${status.toLowerCase()}...`, { id: 'status_update' })
      await updateAiActionStatus(id, status)
      await fetchLogs()
      toast.success(`Action ${status.toLowerCase()}`, { id: 'status_update' })
    } catch (error: any) {
      toast.error(error.message, { id: 'status_update' })
    }
  }

  const handleTaskTrigger = async (taskName: string) => {
    try {
      toast.loading(`Triggering ${taskName}...`, { id: 'task_trigger' })
      await triggerAiTask(taskName, { triggered_by: 'admin' })
      toast.success(`Task ${taskName} queued!`, { id: 'task_trigger' })
    } catch (error: any) {
      toast.error(error.message, { id: 'task_trigger' })
    }
  }

  const getTimeAgo = (dateStr: string) => {
    const minDiff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000)
    if (minDiff < 1) return 'Just now'
    if (minDiff < 60) return `${minDiff} min ago`
    if (minDiff < 1440) return `${Math.floor(minDiff / 60)} hrs ago`
    return `${Math.floor(minDiff / 1440)} days ago`
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-heading mb-2 flex items-center gap-2">
            <Bot className="text-primary" />
            AI Control Center
          </h1>
          <p className="text-text-muted">Manage internal MCP agents, inspect action logs, and control autonomous behaviors.</p>
        </div>

        {/* Top Metrics / Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <div className="elevated-surface rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-success-bg text-success-text rounded-xl">
                <Server size={24} />
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-success-text bg-success-bg px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Online
              </span>
            </div>
            <h3 className="text-text-muted text-sm font-medium mb-1">MCP Core Node</h3>
            <p className="text-2xl font-bold text-text-heading">v1.0.0</p>
          </div>

          {/* Security / Autonomous Mode */}
          <div className="elevated-surface rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className={autonomousMode ? "text-error" : "text-success"} size={20} />
                <h3 className="text-text-heading font-semibold">Autonomous Mode</h3>
              </div>
              <p className="text-sm text-text-muted mb-4">
                {autonomousMode 
                  ? "Agents can write to DB & repo directly." 
                  : "Agents require admin approval for writes."}
              </p>
            </div>
            <button 
              onClick={() => setAutonomousMode(!autonomousMode)}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all border ${
                autonomousMode 
                  ? 'bg-error-bg text-error hover:bg-error/10 border-error/20' 
                  : 'bg-success-bg text-success-text hover:bg-success/20 border-success/20'
              }`}
            >
              {autonomousMode ? 'Disable Autonomy' : 'Enable Autonomy'}
            </button>
          </div>

          {/* Quick Triggers */}
          <div className="elevated-surface rounded-2xl p-6">
            <h3 className="text-text-heading font-semibold mb-4 flex items-center gap-2">
              <Zap size={18} className="text-warning" /> Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleTaskTrigger('WEEKLY_BLOG')}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-2 hover:bg-border/60 rounded-xl text-sm text-text-heading font-medium transition-colors border border-transparent hover:border-border"
              >
                Trigger Blog Research
                <Activity size={16} className="text-text-muted" />
              </button>
              <button 
                onClick={() => handleTaskTrigger('NIGHTLY_LINT')}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-2 hover:bg-border/60 rounded-xl text-sm text-text-heading font-medium transition-colors border border-transparent hover:border-border"
              >
                Run Nightly Tests
                <Terminal size={16} className="text-text-muted" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Logs & Approval Queue */}
        <div className="elevated-surface rounded-2xl overflow-hidden min-h-[300px]">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-heading">Action Logs & Approvals</h2>
            <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
              Viewing Last 30 Days
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center p-12 text-primary">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-text-disabled text-sm">
              <Bot size={40} className="mb-4 text-border" />
              <p>No AI actions or pending approvals yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {logs.map((log) => (
                <div key={log.id} className="p-6 flex items-center justify-between hover:bg-surface-2/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0 border border-border">
                      <Bot size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-text-heading font-medium text-sm">{log.agent_name}</span>
                        <span className="text-text-muted text-xs flex items-center gap-1 border-l border-border pl-2 ml-1">
                          <Clock size={12} /> {getTimeAgo(log.created_at)}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm">{log.action_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {log.status === 'PENDING_APPROVAL' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAction(log.id, 'APPROVED')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-success-bg hover:bg-success/20 text-success-text rounded-xl border border-success-bg text-xs font-semibold transition-all"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => handleAction(log.id, 'REJECTED')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-error-bg hover:bg-error/20 text-error rounded-xl border border-error-bg text-xs font-semibold transition-all"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}
                    {log.status === 'EXECUTED' && (
                      <span className="chip bg-surface-2 border-border text-text">
                        <CheckCircle2 size={12} className="text-success" /> Executed
                      </span>
                    )}
                    {log.status === 'COMPLETED' && (
                      <span className="chip bg-surface-2 border-border text-text">
                        <Activity size={12} className="text-info-text" /> Completed
                      </span>
                    )}
                    {log.status === 'APPROVED' && (
                      <span className="chip chip-success">
                        <CheckCircle2 size={12} className="text-success" /> Approved
                      </span>
                    )}
                    {log.status === 'REJECTED' && (
                      <span className="chip bg-error-bg text-error border-error-bg">
                        <XCircle size={12} className="text-error" /> Rejected
                      </span>
                    )}
                    {log.status === 'FAILED' && (
                      <span className="chip bg-error-bg text-error border-error-bg">
                        <XCircle size={12} className="text-error" /> Failed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
