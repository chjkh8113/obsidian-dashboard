'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Cpu, HardDrive, Network, Server, Database, Box, Cloud,
  AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Zap, Shield, Terminal, Globe, Layers,
  GitBranch, Play, Pause, AlertCircle, Info, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, 
  PieChart, Pie, Cell, LineChart, Line, Tooltip
} from 'recharts';

// Generate mock time-series data
const generateTimeSeriesData = (points = 24) => {
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
  color = 'emerald'
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'emerald' | 'amber' | 'rose' | 'blue' | 'violet' | 'cyan';
}) {
  const colors = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl ${colors[color].bg} border ${colors[color].border} flex items-center justify-center`}>
        <Icon size={22} className={colors[color].text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {trend && trendValue && (
            <span className={`text-xs font-medium flex items-center gap-0.5 ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-white/40'
            }`}>
              {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : null}
              {trendValue}
            </span>
          )}
        </div>
        <p className="text-sm text-white/50 truncate">{label}</p>
      </div>
    </motion.div>
  );
}

// Large Chart Panel
function PerformanceChart({ data }: { data: ReturnType<typeof generateTimeSeriesData> }) {
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'network' | 'all'>('all');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel-elevated p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Real-time Performance</h2>
        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-lg">
          {(['cpu', 'memory', 'network', 'all'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeMetric === metric 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              {metric.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            {(activeMetric === 'cpu' || activeMetric === 'all') && (
              <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2} fill="url(#colorCpu)" />
            )}
            {(activeMetric === 'memory' || activeMetric === 'all') && (
              <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} fill="url(#colorMemory)" />
            )}
            {(activeMetric === 'network' || activeMetric === 'all') && (
              <Area type="monotone" dataKey="network" stroke="#06b6d4" strokeWidth={2} fill="url(#colorNetwork)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
        {[
          { label: 'CPU Usage', value: '44%', color: 'text-violet-400' },
          { label: 'Memory', value: '59%', color: 'text-emerald-400' },
          { label: 'Network', value: '259 Mbps', color: 'text-cyan-400' },
          { label: 'Disk I/O', value: '78%', color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Alert Distribution Donut
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
      className="glass-panel-elevated p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Alert Distribution</h2>
      
      <div className="flex items-center gap-6">
        <div style={{ width: 140, height: 140 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <span className="text-sm text-white/70">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button className="flex-1 px-3 py-2 text-xs font-medium text-white/70 bg-white/[0.03] hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-center gap-1">
          View All <ChevronRight size={14} />
        </button>
        <button className="px-3 py-2 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors">
          Ack Critical (3)
        </button>
      </div>
    </motion.div>
  );
}

// Infrastructure Overview
function InfrastructureOverview() {
  const infra = [
    { icon: Server, label: 'Servers', total: 847, healthy: 823, warning: 21, critical: 3 },
    { icon: Database, label: 'Databases', total: 124, healthy: 122, warning: 2 },
    { icon: Box, label: 'Containers', total: 2341, healthy: 2298, warning: 38, critical: 5 },
    { icon: Cloud, label: 'VMs', total: 456, healthy: 449, warning: 6, critical: 1 },
    { icon: Layers, label: 'Load Balancers', total: 24, healthy: 24 },
    { icon: HardDrive, label: 'Storage', total: 89, healthy: 87, warning: 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel-elevated p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Infrastructure Overview</h2>
        <button className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1">
          View Topology <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        {infra.map((item) => (
          <div key={item.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors cursor-pointer">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 flex items-center justify-center">
              <item.icon size={22} className="text-violet-400" />
            </div>
            <p className="text-2xl font-bold text-white">{item.total.toLocaleString()}</p>
            <p className="text-xs text-white/50 mt-1">{item.label}</p>
            <div className="flex justify-center gap-2 mt-2 text-[10px]">
              <span className="text-emerald-400">{item.healthy}</span>
              {item.warning && <span className="text-amber-400">{item.warning}</span>}
              {item.critical && <span className="text-rose-400">{item.critical}</span>}
            </div>
          </div>
        ))}
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-panel-elevated p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Service Health Matrix</h2>
      
      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className={`w-2 h-2 rounded-full ${
              service.status === 'healthy' ? 'bg-emerald-400' :
              service.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{service.name}</p>
              <p className="text-xs text-white/40">Uptime: {service.uptime} • Response: {service.latency}</p>
            </div>
            <div className="w-32">
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    service.load > 80 ? 'bg-rose-500' :
                    service.load > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${service.load}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-white/50 w-8 text-right">{service.load}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Critical Events
function CriticalEvents() {
  const events = [
    { 
      icon: XCircle, 
      title: 'Auth Service Down', 
      desc: 'Response time exceeding 2500ms threshold',
      time: '2 min ago',
      severity: 'critical',
      action: 'Investigate'
    },
    { 
      icon: AlertTriangle, 
      title: 'Cache Layer Degradation', 
      desc: 'Memory usage at 89%, approaching critical',
      time: '15 min ago',
      severity: 'warning',
      action: 'Review'
    },
    { 
      icon: CheckCircle, 
      title: 'Database Backup Completed', 
      desc: 'Daily backup successful, 124GB processed',
      time: '1 hour ago',
      severity: 'success'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel-elevated p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Critical Events</h2>
      
      <div className="space-y-3">
        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              event.severity === 'critical' ? 'bg-rose-500/10' :
              event.severity === 'warning' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
            }`}>
              <event.icon size={16} className={
                event.severity === 'critical' ? 'text-rose-400' :
                event.severity === 'warning' ? 'text-amber-400' : 'text-emerald-400'
              } />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{event.title}</p>
              <p className="text-xs text-white/40 mt-0.5">{event.desc}</p>
              <p className="text-xs text-white/30 mt-1 flex items-center gap-1">
                <Clock size={10} /> {event.time}
              </p>
            </div>
            {event.action && (
              <button className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                event.severity === 'critical' 
                  ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' 
                  : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
              } transition-colors`}>
                {event.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Recent Deployments
function RecentDeployments() {
  const deployments = [
    { name: 'API v2.3.1', env: 'Production • 3 instances', status: 'successful', icon: CheckCircle },
    { name: 'Frontend v1.8.0', env: 'Staging • Rolling update', status: 'in-progress', icon: Play },
    { name: 'Database Migration', env: 'Scheduled • 2:00 AM UTC', status: 'pending', icon: Clock },
  ];

  const statusStyles = {
    successful: 'text-emerald-400 bg-emerald-500/10',
    'in-progress': 'text-blue-400 bg-blue-500/10',
    pending: 'text-amber-400 bg-amber-500/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-panel-elevated p-6"
    >
      <h2 className="text-lg font-semibold text-white mb-4">Recent Deployments</h2>
      
      <div className="space-y-3">
        {deployments.map((dep, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <GitBranch size={16} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{dep.name}</p>
              <p className="text-xs text-white/40">{dep.env}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${statusStyles[dep.status as keyof typeof statusStyles]}`}>
              {dep.status.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Application Performance Chart
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
      transition={{ delay: 0.4 }}
      className="glass-panel-elevated p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Application Performance</h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-400" />Requests/min</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" />Errors</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" />Latency</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} interval={3} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} width={35} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} width={35} />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }} />
            <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/[0.06]">
        {[
          { label: 'Request Rate', value: '1.9K/min' },
          { label: 'Errors (5min)', value: '0' },
          { label: 'Avg Latency', value: '111ms' },
          { label: 'Success Rate', value: '99.98%' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
          </div>
        ))}
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
    <div className="min-h-screen pb-8">
      <div className="ambient-bg" />
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-xl"
      >
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">Obsidian</h1>
              <p className="text-xs text-white/40">Enterprise Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="glass-panel px-4 py-2 flex items-center gap-3">
              <div className="status-dot status-online" />
              <span className="text-sm text-white/70">All Systems Operational</span>
            </div>
            <div className="text-xs text-white/40">
              Last Update: {currentTime.toLocaleTimeString()}
            </div>
            <div className="glass-panel px-3 py-1.5 text-xs text-white/50">
              3,881 Resources
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard icon={Server} value="3,458" label="Total Assets" trend="up" trendValue="+5.2%" color="blue" />
          <KPICard icon={Shield} value="99.98%" label="Uptime SLA" trend="stable" trendValue="stable" color="emerald" />
          <KPICard icon={AlertCircle} value="12" label="Critical Issues" trend="down" trendValue="-3" color="rose" />
          <KPICard icon={AlertTriangle} value="169" label="Active Alerts" color="amber" />
          <KPICard icon={CheckCircle} value="94%" label="Compliance" trend="up" trendValue="+2%" color="violet" />
          <KPICard icon={TrendingDown} value="$127.8K" label="Monthly Cost" trend="down" trendValue="-8%" color="cyan" />
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

        {/* Service Health & Network */}
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
