'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Cpu, HardDrive, Network, Server, Database, Box, Cloud,
  AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown,
  Zap, Shield, Terminal, Globe, Layers, GitBranch, Play, AlertCircle, 
  Info, ChevronRight, Settings, Bell, Search, User
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, 
  PieChart, Pie, Cell, LineChart, Line, Tooltip, BarChart, Bar
} from 'recharts';

// Generate mock time-series data
const generateTimeSeriesData = (points = 30) => {
  const now = new Date();
  return Array.from({ length: points }, (_, i) => {
    const time = new Date(now.getTime() - (points - i - 1) * 5 * 60 * 1000);
    return {
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      cpu: 30 + Math.random() * 40,
      memory: 50 + Math.random() * 30,
      network: 100 + Math.random() * 200,
    };
  });
};

// KPI Card Component
function KPICard({ 
  icon: Icon, 
  value, 
  label, 
  trend, 
  trendValue,
  glowColor = 'violet'
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  glowColor?: 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'blue';
}) {
  const glowClasses = {
    violet: 'icon-glow',
    emerald: 'icon-glow-emerald',
    amber: 'icon-glow-amber',
    rose: 'icon-glow-rose',
    cyan: 'icon-glow-cyan',
    blue: 'icon-glow',
  };

  const iconColors = {
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="kpi-card p-5 flex items-center gap-4"
    >
      <div className={`w-14 h-14 rounded-2xl ${glowClasses[glowColor]} flex items-center justify-center`}>
        <Icon size={26} className={iconColors[glowColor]} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
          {trend && trendValue && (
            <span className={`text-xs font-semibold flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
              trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 
              trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 
              'text-white/40 bg-white/5'
            }`}>
              {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null}
              {trendValue}
            </span>
          )}
        </div>
        <p className="text-sm text-white/40 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

// Large Performance Chart
function PerformanceChart({ data }: { data: ReturnType<typeof generateTimeSeriesData> }) {
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'network' | 'all'>('all');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glow-border"
    >
      <div className="glass-panel-elevated p-8 card-hover-glow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Real-time Performance</h2>
            <p className="text-sm text-white/40 mt-1">System metrics over the last 2 hours</p>
          </div>
          <div className="flex gap-1 p-1.5 bg-white/[0.03] rounded-xl border border-white/[0.04]">
            {(['cpu', 'memory', 'network', 'all'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeMetric === metric 
                    ? 'bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/10' 
                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                {metric.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11 }}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0,0,0,0.9)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)'
                }}
              />
              {(activeMetric === 'cpu' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorCpu)" />
              )}
              {(activeMetric === 'memory' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2.5} fill="url(#colorMemory)" />
              )}
              {(activeMetric === 'network' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="network" stroke="#06b6d4" strokeWidth={2.5} fill="url(#colorNetwork)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/[0.04]">
          {[
            { label: 'CPU Usage', value: '44%', color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Memory', value: '59%', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Network I/O', value: '259 Mbps', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { label: 'Disk Usage', value: '78%', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat) => (
            <div key={stat.label} className={`text-center p-4 rounded-xl ${stat.bg}`}>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/40 mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Alert Distribution
function AlertDistribution() {
  const data = [
    { name: 'Critical', value: 3, color: '#ef4444' },
    { name: 'High', value: 8, color: '#f97316' },
    { name: 'Medium', value: 24, color: '#eab308' },
    { name: 'Low', value: 45, color: '#22c55e' },
    { name: 'Info', value: 89, color: '#3b82f6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glow-border h-full"
    >
      <div className="glass-panel-elevated p-8 h-full card-hover-glow">
        <h2 className="text-xl font-bold text-white mb-2">Alert Distribution</h2>
        <p className="text-sm text-white/40 mb-6">By severity level</p>
        
        <div className="flex items-center gap-8">
          <div style={{ width: 180, height: 180 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-3">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}50` }} />
                  <span className="text-sm text-white/70 font-medium">{item.name}</span>
                </div>
                <span className="text-lg font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button className="flex-1 px-4 py-3 text-sm font-semibold text-white/70 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-all border border-white/[0.04] flex items-center justify-center gap-2">
            View All Alerts <ChevronRight size={16} />
          </button>
          <button className="px-4 py-3 text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all border border-rose-500/20">
            Ack Critical (3)
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Infrastructure Overview
function InfrastructureOverview() {
  const infra = [
    { icon: Server, label: 'Servers', total: 847, healthy: 823, warning: 21, critical: 3, color: 'violet' },
    { icon: Database, label: 'Databases', total: 124, healthy: 122, warning: 2, color: 'blue' },
    { icon: Box, label: 'Containers', total: 2341, healthy: 2298, warning: 38, critical: 5, color: 'cyan' },
    { icon: Cloud, label: 'VMs', total: 456, healthy: 449, warning: 6, critical: 1, color: 'emerald' },
    { icon: Layers, label: 'Load Balancers', total: 24, healthy: 24, color: 'amber' },
    { icon: HardDrive, label: 'Storage', total: 89, healthy: 87, warning: 2, color: 'rose' },
  ];

  const colorMap: Record<string, string> = {
    violet: 'from-violet-500/20 to-purple-500/10 border-violet-500/20 text-violet-400',
    blue: 'from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-400',
    cyan: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/20 text-cyan-400',
    emerald: 'from-emerald-500/20 to-green-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-orange-500/10 border-amber-500/20 text-amber-400',
    rose: 'from-rose-500/20 to-pink-500/10 border-rose-500/20 text-rose-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glow-border"
    >
      <div className="glass-panel-elevated p-8 card-hover-glow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Infrastructure Overview</h2>
            <p className="text-sm text-white/40 mt-1">3,881 total resources across all categories</p>
          </div>
          <button className="text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 px-4 py-2 bg-violet-500/10 rounded-xl border border-violet-500/20 transition-all hover:bg-violet-500/20">
            View Topology <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-5">
          {infra.map((item) => (
            <div key={item.label} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${colorMap[item.color]} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <p className="text-3xl font-bold text-white">{item.total.toLocaleString()}</p>
              <p className="text-sm text-white/40 mt-2 font-medium">{item.label}</p>
              <div className="flex justify-center gap-3 mt-3 text-xs font-semibold">
                <span className="text-emerald-400">{item.healthy}</span>
                {item.warning && <span className="text-amber-400">{item.warning}</span>}
                {item.critical && <span className="text-rose-400">{item.critical}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Service Health Matrix
function ServiceHealthMatrix() {
  const services = [
    { name: 'API Gateway', uptime: '99.99%', latency: '45ms', load: 34, status: 'healthy' },
    { name: 'Database Cluster', uptime: '99.98%', latency: '12ms', load: 67, status: 'healthy' },
    { name: 'Cache Layer', uptime: '98.5%', latency: '156ms', load: 89, status: 'warning' },
    { name: 'Message Queue', uptime: '99.97%', latency: '23ms', load: 45, status: 'healthy' },
    { name: 'Auth Service', uptime: '92.3%', latency: '2500ms', load: 98, status: 'critical' },
    { name: 'CDN', uptime: '99.99%', latency: '8ms', load: 23, status: 'healthy' },
    { name: 'Search Engine', uptime: '99.95%', latency: '89ms', load: 56, status: 'healthy' },
    { name: 'Analytics', uptime: '99.94%', latency: '234ms', load: 42, status: 'healthy' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glow-border"
    >
      <div className="glass-panel-elevated p-8 card-hover-glow">
        <h2 className="text-xl font-bold text-white mb-2">Service Health Matrix</h2>
        <p className="text-sm text-white/40 mb-6">Real-time service status and performance</p>
        
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.04]">
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'healthy' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                service.status === 'warning' ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 
                'bg-rose-400 shadow-lg shadow-rose-400/50 animate-pulse'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{service.name}</p>
                <p className="text-xs text-white/40">Uptime: {service.uptime} • Response: {service.latency}</p>
              </div>
              <div className="w-40">
                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all progress-glow ${
                      service.load > 80 ? 'bg-rose-500' :
                      service.load > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${service.load}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-white w-12 text-right">{service.load}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Application Performance
function ApplicationPerformance() {
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    requests: 1500 + Math.random() * 1000,
    errors: Math.floor(Math.random() * 10),
    latency: 80 + Math.random() * 60,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glow-border"
    >
      <div className="glass-panel-elevated p-8 card-hover-glow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Application Performance</h2>
            <p className="text-sm text-white/40 mt-1">Request metrics over 24 hours</p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />Requests/min</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-400 shadow-lg shadow-rose-400/50" />Errors</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />Latency (ms)</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} interval={3} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} width={40} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} width={40} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '12px', fontSize: '11px' }} />
              <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.04]">
          {[
            { label: 'Request Rate', value: '1.9K/min', color: 'text-violet-400' },
            { label: 'Errors (5min)', value: '0', color: 'text-emerald-400' },
            { label: 'Avg Latency', value: '111ms', color: 'text-cyan-400' },
            { label: 'Success Rate', value: '99.98%', color: 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/[0.02]">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-white/40 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Critical Events
function CriticalEvents() {
  const events = [
    { icon: XCircle, title: 'Auth Service Down', desc: 'Response time exceeding 2500ms threshold', time: '2 min ago', severity: 'critical', action: 'Investigate' },
    { icon: AlertTriangle, title: 'Cache Layer Degradation', desc: 'Memory usage at 89%, approaching critical', time: '15 min ago', severity: 'warning', action: 'Review' },
    { icon: CheckCircle, title: 'Database Backup Completed', desc: 'Daily backup successful, 124GB processed', time: '1 hour ago', severity: 'success' },
    { icon: Info, title: 'SSL Certificate Renewal', desc: 'Certificate renewed successfully', time: '2 hours ago', severity: 'info' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glow-border"
    >
      <div className="glass-panel-elevated p-8 card-hover-glow">
        <h2 className="text-xl font-bold text-white mb-2">Critical Events</h2>
        <p className="text-sm text-white/40 mb-6">Recent system events and incidents</p>
        
        <div className="space-y-3">
          {events.map((event, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                event.severity === 'critical' ? 'icon-glow-rose' :
                event.severity === 'warning' ? 'icon-glow-amber' : 
                event.severity === 'success' ? 'icon-glow-emerald' : 'icon-glow-cyan'
              }`}>
                <event.icon size={20} className={
                  event.severity === 'critical' ? 'text-rose-400' :
                  event.severity === 'warning' ? 'text-amber-400' : 
                  event.severity === 'success' ? 'text-emerald-400' : 'text-cyan-400'
                } />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <p className="text-xs text-white/40 mt-1">{event.desc}</p>
                <p className="text-xs text-white/30 mt-2 flex items-center gap-1">
                  <Clock size={10} /> {event.time}
                </p>
              </div>
              {event.action && (
                <button className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  event.severity === 'critical' 
                    ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20' 
                    : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                }`}>
                  {event.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Recent Deployments
function RecentDeployments() {
  const deployments = [
    { name: 'API v2.3.1', env: 'Production • 3 instances', status: 'successful' },
    { name: 'Frontend v1.8.0', env: 'Staging • Rolling update', status: 'in-progress' },
    { name: 'Database Migration', env: 'Scheduled • 2:00 AM UTC', status: 'pending' },
    { name: 'Auth Service v3.0', env: 'Production • Rollback', status: 'failed' },
  ];

  const statusStyles: Record<string, string> = {
    successful: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'in-progress': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    failed: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glow-border"
    >
      <div className="glass-panel-elevated p-8 card-hover-glow">
        <h2 className="text-xl font-bold text-white mb-2">Recent Deployments</h2>
        <p className="text-sm text-white/40 mb-6">Latest deployment activities</p>
        
        <div className="space-y-3">
          {deployments.map((dep, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/[0.04]">
              <div className="w-10 h-10 rounded-xl icon-glow flex items-center justify-center">
                <GitBranch size={20} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{dep.name}</p>
                <p className="text-xs text-white/40 mt-1">{dep.env}</p>
              </div>
              <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize border ${statusStyles[dep.status]}`}>
                {dep.status.replace('-', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chartData] = useState(generateTimeSeriesData);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="ambient-bg" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 header-glass"
      >
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
              <Zap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Obsidian</h1>
              <p className="text-xs text-white/40">Enterprise Infrastructure Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="kpi-card px-5 py-3 flex items-center gap-3">
              <div className="status-dot status-online" />
              <span className="text-sm text-white/70 font-medium">All Systems Operational</span>
            </div>
            <div className="kpi-card px-4 py-3 text-xs text-white/50 font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="kpi-card px-4 py-3 text-xs text-white/50">
              <span className="text-white font-semibold">3,881</span> Resources
            </div>
            <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all">
              <Bell size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-all">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Centered with padding */}
      <main className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          <KPICard icon={Server} value="3,458" label="Total Assets" trend="up" trendValue="+5.2%" glowColor="violet" />
          <KPICard icon={Shield} value="99.98%" label="Uptime SLA" trend="stable" trendValue="stable" glowColor="emerald" />
          <KPICard icon={AlertCircle} value="12" label="Critical Issues" trend="down" trendValue="-3" glowColor="rose" />
          <KPICard icon={AlertTriangle} value="169" label="Active Alerts" glowColor="amber" />
          <KPICard icon={CheckCircle} value="94%" label="Compliance" trend="up" trendValue="+2%" glowColor="cyan" />
          <KPICard icon={TrendingDown} value="$127.8K" label="Monthly Cost" trend="down" trendValue="-8%" glowColor="blue" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart data={chartData} />
          </div>
          <AlertDistribution />
        </div>

        {/* Infrastructure */}
        <InfrastructureOverview />

        {/* Service Health & App Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceHealthMatrix />
          <ApplicationPerformance />
        </div>

        {/* Events & Deployments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CriticalEvents />
          <RecentDeployments />
        </div>
      </main>
    </div>
  );
}
