'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Cpu, HardDrive, Network, Server, 
  AlertTriangle, CheckCircle, XCircle, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Database,
  Globe, Shield, Terminal, Command
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// Mock data generator
const generateSparklineData = (points = 20, trend: 'up' | 'down' | 'stable' = 'stable') => {
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    if (trend === 'up') value += Math.random() * 5 - 1;
    else if (trend === 'down') value -= Math.random() * 5 - 1;
    else value += Math.random() * 10 - 5;
    value = Math.max(10, Math.min(90, value));
    return { time: i, value };
  });
};

// Metric Card Component
function MetricCard({ 
  label, 
  value, 
  unit, 
  status, 
  icon: Icon, 
  sparklineData,
  trend,
  shortcut 
}: {
  label: string;
  value: string | number;
  unit?: string;
  status: 'success' | 'warning' | 'danger';
  icon: React.ElementType;
  sparklineData?: { time: number; value: number }[];
  trend?: { value: number; direction: 'up' | 'down' };
  shortcut?: string;
}) {
  const statusColors = {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-panel p-5 relative group cursor-pointer transition-all duration-300 hover:bg-[var(--color-glass-hover)] ${
        status === 'danger' ? 'metric-glow-danger' : 
        status === 'warning' ? 'metric-glow-warning' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${statusColors[status]}22, ${statusColors[status]}11)`,
              border: `1px solid ${statusColors[status]}33`
            }}
          >
            <Icon size={18} style={{ color: statusColors[status] }} />
          </div>
          <span className="text-sm text-white/50 font-medium">{label}</span>
        </div>
        {shortcut && <kbd className="kbd opacity-0 group-hover:opacity-100 transition-opacity">{shortcut}</kbd>}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-semibold tracking-tight text-white">{value}</span>
        {unit && <span className="text-sm text-white/40">{unit}</span>}
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {trend.direction === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend.value}%
          </div>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData && (
        <div style={{ width: '100%', height: 48, marginLeft: -4, marginRight: -4 }}>
          <ResponsiveContainer width="100%" height={48}>
            <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={statusColors[status]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={statusColors[status]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={statusColors[status]}
                strokeWidth={2}
                fill={`url(#gradient-${label.replace(/\s/g, '')})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-5 right-5">
        <div className={`status-dot status-${status === 'success' ? 'online' : status === 'warning' ? 'warning' : 'offline'}`} />
      </div>
    </motion.div>
  );
}

// Service Status Item
function ServiceItem({ 
  name, 
  status, 
  latency, 
  icon: Icon 
}: { 
  name: string; 
  status: 'healthy' | 'degraded' | 'down';
  latency?: number;
  icon: React.ElementType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <Icon size={16} className="text-white/50" />
        </div>
        <span className="text-sm font-medium text-white/80">{name}</span>
      </div>
      <div className="flex items-center gap-4">
        {latency && (
          <span className="text-xs text-white/40 font-mono">{latency}ms</span>
        )}
        <div className={`flex items-center gap-2 text-xs font-medium ${
          status === 'healthy' ? 'text-emerald-400' :
          status === 'degraded' ? 'text-amber-400' : 'text-rose-400'
        }`}>
          {status === 'healthy' ? <CheckCircle size={14} /> :
           status === 'degraded' ? <AlertTriangle size={14} /> : <XCircle size={14} />}
          <span className="capitalize">{status}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Alert Item
function AlertItem({ 
  title, 
  time, 
  severity 
}: { 
  title: string; 
  time: string;
  severity: 'critical' | 'warning' | 'info';
}) {
  const colors = {
    critical: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    info: 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 py-3 px-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      <div className={`px-2 py-1 rounded-md text-[10px] font-semibold uppercase border ${colors[severity]}`}>
        {severity}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/80 truncate">{title}</p>
        <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
          <Clock size={10} />
          {time}
        </p>
      </div>
    </motion.div>
  );
}

// Command Palette Hint
function CommandHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-4 py-2.5 flex items-center gap-3"
    >
      <Command size={14} className="text-white/40" />
      <span className="text-sm text-white/50">Press</span>
      <kbd className="kbd">⌘</kbd>
      <kbd className="kbd">K</kbd>
      <span className="text-sm text-white/50">to open command palette</span>
    </motion.div>
  );
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState({
    cpu: { value: 42, data: generateSparklineData(20, 'stable') },
    memory: { value: 67, data: generateSparklineData(20, 'up') },
    disk: { value: 54, data: generateSparklineData(20, 'stable') },
    network: { value: 23, data: generateSparklineData(20, 'down') },
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: { 
          value: Math.max(0, Math.min(100, prev.cpu.value + (Math.random() * 6 - 3))),
          data: [...prev.cpu.data.slice(1), { time: 20, value: prev.cpu.value }]
        },
        memory: { 
          value: Math.max(0, Math.min(100, prev.memory.value + (Math.random() * 4 - 1.5))),
          data: [...prev.memory.data.slice(1), { time: 20, value: prev.memory.value }]
        },
        disk: { 
          value: Math.max(0, Math.min(100, prev.disk.value + (Math.random() * 2 - 1))),
          data: [...prev.disk.data.slice(1), { time: 20, value: prev.disk.value }]
        },
        network: { 
          value: Math.max(0, Math.min(100, prev.network.value + (Math.random() * 10 - 5))),
          data: [...prev.network.data.slice(1), { time: 20, value: prev.network.value }]
        },
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (value: number): 'success' | 'warning' | 'danger' => {
    if (value >= 85) return 'danger';
    if (value >= 70) return 'warning';
    return 'success';
  };

  return (
    <div className="min-h-screen">
      <div className="ambient-bg" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-obsidian-950/80 backdrop-blur-xl"
      >
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">Obsidian</h1>
              <p className="text-xs text-white/40">Infrastructure Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="glass-panel px-4 py-2 flex items-center gap-3">
              <div className="status-dot status-online" />
              <span className="text-sm text-white/70">All Systems Operational</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-white/70">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
              </p>
              <p className="text-xs text-white/40">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">System Metrics</h2>
            <span className="text-xs text-white/30">Live</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="CPU Usage"
              value={Math.round(metrics.cpu.value)}
              unit="%"
              status={getStatus(metrics.cpu.value)}
              icon={Cpu}
              sparklineData={metrics.cpu.data}
              trend={{ value: 2.4, direction: 'up' }}
              shortcut="C"
            />
            <MetricCard
              label="Memory"
              value={Math.round(metrics.memory.value)}
              unit="%"
              status={getStatus(metrics.memory.value)}
              icon={Activity}
              sparklineData={metrics.memory.data}
              trend={{ value: 5.1, direction: 'up' }}
              shortcut="M"
            />
            <MetricCard
              label="Disk I/O"
              value={Math.round(metrics.disk.value)}
              unit="%"
              status={getStatus(metrics.disk.value)}
              icon={HardDrive}
              sparklineData={metrics.disk.data}
              trend={{ value: 0.8, direction: 'down' }}
              shortcut="D"
            />
            <MetricCard
              label="Network"
              value={Math.round(metrics.network.value)}
              unit="Mbps"
              status={getStatus(metrics.network.value)}
              icon={Network}
              sparklineData={metrics.network.data}
              trend={{ value: 12.3, direction: 'down' }}
              shortcut="N"
            />
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass-panel-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">Services</h2>
              <kbd className="kbd">S</kbd>
            </div>
            <div className="space-y-1">
              <ServiceItem name="API Gateway" status="healthy" latency={45} icon={Globe} />
              <ServiceItem name="Database Cluster" status="healthy" latency={12} icon={Database} />
              <ServiceItem name="Cache Layer" status="degraded" latency={234} icon={Zap} />
              <ServiceItem name="Auth Service" status="healthy" latency={28} icon={Shield} />
              <ServiceItem name="Worker Nodes" status="healthy" latency={67} icon={Server} />
              <ServiceItem name="Message Queue" status="healthy" latency={8} icon={Terminal} />
            </div>
          </motion.section>

          {/* Recent Alerts */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel-elevated p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">Recent Alerts</h2>
              <kbd className="kbd">A</kbd>
            </div>
            <div className="space-y-1">
              <AlertItem 
                title="High memory usage on node-03" 
                time="2 min ago" 
                severity="warning" 
              />
              <AlertItem 
                title="SSL certificate expiring soon" 
                time="1 hour ago" 
                severity="info" 
              />
              <AlertItem 
                title="Database connection pool exhausted" 
                time="3 hours ago" 
                severity="critical" 
              />
              <AlertItem 
                title="Disk space below 20% on storage-01" 
                time="5 hours ago" 
                severity="warning" 
              />
            </div>
          </motion.section>
        </div>
      </main>

      <CommandHint />
    </div>
  );
}
