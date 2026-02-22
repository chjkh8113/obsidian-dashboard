'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Cpu, HardDrive, Network, Server, Database, Box, Cloud,
  AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown,
  Zap, Shield, Layers, GitBranch, AlertCircle, Info, ChevronRight, 
  Settings, Bell
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, 
  PieChart, Pie, Cell, LineChart, Line, Tooltip
} from 'recharts';

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

// Raycast-style Icon
function RaycastIcon({ 
  icon: Icon, 
  size = 32, 
  color = 'violet',
  containerSize = 64 
}: { 
  icon: React.ElementType; 
  size?: number; 
  color?: string;
  containerSize?: number;
}) {
  const colorClasses: Record<string, string> = {
    violet: 'icon-violet text-violet-400',
    emerald: 'icon-emerald text-emerald-400',
    amber: 'icon-amber text-amber-400',
    rose: 'icon-rose text-rose-400',
    cyan: 'icon-cyan text-cyan-400',
    blue: 'icon-blue text-blue-400',
  };

  return (
    <div 
      className={`icon-container ${colorClasses[color]}`}
      style={{ width: containerSize, height: containerSize }}
    >
      <Icon size={size} />
    </div>
  );
}

// KPI Card
function KPICard({ 
  icon: Icon, 
  value, 
  label, 
  trend, 
  trendValue,
  color = 'violet'
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="kpi-card p-6"
    >
      <div className="flex items-center gap-5">
        <RaycastIcon icon={Icon} size={28} color={color} containerSize={56} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
            {trend && trendValue && (
              <span className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-full ${
                trend === 'up' ? 'text-emerald-400 bg-emerald-500/15' : 
                trend === 'down' ? 'text-rose-400 bg-rose-500/15' : 
                'text-white/40 bg-white/5'
              }`}>
                {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : null}
                {trendValue}
              </span>
            )}
          </div>
          <p className="text-sm text-white/40 mt-1.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Performance Chart
function PerformanceChart({ data }: { data: ReturnType<typeof generateTimeSeriesData> }) {
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'network' | 'all'>('all');
  
  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Real-time Performance</h2>
            <p className="text-sm text-white/40 mt-2">System metrics over the last 2 hours</p>
          </div>
          <div className="flex gap-1.5 p-2 bg-white/[0.03] rounded-2xl border border-white/[0.04]">
            {(['cpu', 'memory', 'network', 'all'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeMetric === metric 
                    ? 'bg-violet-500/20 text-violet-300 shadow-lg shadow-violet-500/20' 
                    : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                {metric.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 12 }} width={50} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(140,80,200,0.3)', borderRadius: '16px', fontSize: '13px' }} />
              {(activeMetric === 'cpu' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorCpu)" />
              )}
              {(activeMetric === 'memory' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={3} fill="url(#colorMemory)" />
              )}
              {(activeMetric === 'network' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="network" stroke="#06b6d4" strokeWidth={3} fill="url(#colorNetwork)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-10 pt-8 border-t border-white/[0.04]">
          {[
            { label: 'CPU Usage', value: '44%', color: 'bg-violet-500/15 text-violet-400' },
            { label: 'Memory', value: '59%', color: 'bg-emerald-500/15 text-emerald-400' },
            { label: 'Network I/O', value: '259 Mbps', color: 'bg-cyan-500/15 text-cyan-400' },
            { label: 'Disk Usage', value: '78%', color: 'bg-amber-500/15 text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className={`text-center p-5 rounded-2xl ${stat.color.split(' ')[0]}`}>
              <p className={`text-4xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
              <p className="text-sm text-white/40 mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
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
    <div className="glow-border h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 h-full"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Alert Distribution</h2>
        <p className="text-sm text-white/40 mb-8">By severity level</p>
        
        <div className="flex items-center gap-10">
          <div style={{ width: 200, height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-4">
            {data.map((item) => (
              <motion.div 
                key={item.name} 
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ background: item.color, boxShadow: `0 0 12px ${item.color}60` }} />
                  <span className="text-base text-white/70 font-medium">{item.name}</span>
                </div>
                <span className="text-xl font-bold text-white">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button className="flex-1 px-5 py-4 text-sm font-semibold text-white/70 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl transition-all border border-white/[0.04] flex items-center justify-center gap-2">
            View All Alerts <ChevronRight size={18} />
          </button>
          <button className="px-5 py-4 text-sm font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-2xl transition-all border border-rose-500/20">
            Ack Critical (3)
          </button>
        </div>
      </motion.div>
    </div>
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

  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white">Infrastructure Overview</h2>
            <p className="text-sm text-white/40 mt-2">3,881 total resources across all categories</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className="text-sm text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-2 px-5 py-3 bg-violet-500/10 rounded-2xl border border-violet-500/20 transition-all"
          >
            View Topology <ChevronRight size={18} />
          </motion.button>
        </div>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
          {infra.map((item) => (
            <motion.div 
              key={item.label} 
              whileHover={{ scale: 1.05, y: -4 }}
              className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer"
            >
              <div className="flex justify-center mb-5">
                <RaycastIcon icon={item.icon} size={36} color={item.color} containerSize={72} />
              </div>
              <p className="text-4xl font-bold text-white">{item.total.toLocaleString()}</p>
              <p className="text-sm text-white/40 mt-2 font-medium">{item.label}</p>
              <div className="flex justify-center gap-3 mt-4 text-sm font-semibold">
                <span className="text-emerald-400">{item.healthy}</span>
                {item.warning && <span className="text-amber-400">{item.warning}</span>}
                {item.critical && <span className="text-rose-400">{item.critical}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
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
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Service Health</h2>
        <p className="text-sm text-white/40 mb-8">Real-time status and performance</p>
        
        <div className="space-y-4">
          {services.map((service) => (
            <motion.div 
              key={service.name} 
              whileHover={{ x: 4 }}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.04] cursor-pointer"
            >
              <div className={`w-4 h-4 rounded-full ${
                service.status === 'healthy' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                service.status === 'warning' ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 
                'bg-rose-400 shadow-lg shadow-rose-400/50 animate-pulse'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white">{service.name}</p>
                <p className="text-sm text-white/40 mt-0.5">Uptime: {service.uptime} • Response: {service.latency}</p>
              </div>
              <div className="w-48">
                <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${service.load}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      service.load > 80 ? 'bg-rose-500 progress-glow' :
                      service.load > 60 ? 'bg-amber-500 progress-glow' : 'bg-emerald-500 progress-glow'
                    }`}
                    style={{ color: service.load > 80 ? '#ef4444' : service.load > 60 ? '#f59e0b' : '#10b981' }}
                  />
                </div>
              </div>
              <span className="text-lg font-bold text-white w-14 text-right">{service.load}%</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Critical Events
function CriticalEvents() {
  const events = [
    { icon: XCircle, title: 'Auth Service Down', desc: 'Response time exceeding 2500ms', time: '2 min ago', severity: 'critical', action: 'Investigate' },
    { icon: AlertTriangle, title: 'Cache Layer Degradation', desc: 'Memory at 89%, approaching critical', time: '15 min ago', severity: 'warning', action: 'Review' },
    { icon: CheckCircle, title: 'Database Backup Complete', desc: 'Daily backup successful, 124GB', time: '1 hour ago', severity: 'success' },
  ];

  const severityColors: Record<string, { icon: string; bg: string }> = {
    critical: { icon: 'text-rose-400', bg: 'icon-rose' },
    warning: { icon: 'text-amber-400', bg: 'icon-amber' },
    success: { icon: 'text-emerald-400', bg: 'icon-emerald' },
  };

  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Critical Events</h2>
        <p className="text-sm text-white/40 mb-8">Recent incidents and alerts</p>
        
        <div className="space-y-4">
          {events.map((event, i) => (
            <motion.div 
              key={i} 
              whileHover={{ x: 4 }}
              className="flex items-start gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className={`icon-container ${severityColors[event.severity].bg}`} style={{ width: 52, height: 52 }}>
                <event.icon size={24} className={severityColors[event.severity].icon} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white">{event.title}</p>
                <p className="text-sm text-white/40 mt-1">{event.desc}</p>
                <p className="text-xs text-white/30 mt-2 flex items-center gap-1.5">
                  <Clock size={12} /> {event.time}
                </p>
              </div>
              {event.action && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    event.severity === 'critical' 
                      ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20' 
                      : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20'
                  }`}
                >
                  {event.action}
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Recent Deployments
function RecentDeployments() {
  const deployments = [
    { name: 'API v2.3.1', env: 'Production • 3 instances', status: 'successful' },
    { name: 'Frontend v1.8.0', env: 'Staging • Rolling update', status: 'in-progress' },
    { name: 'Database Migration', env: 'Scheduled • 2:00 AM UTC', status: 'pending' },
  ];

  const statusStyles: Record<string, string> = {
    successful: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'in-progress': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Recent Deployments</h2>
        <p className="text-sm text-white/40 mb-8">Latest deployment activities</p>
        
        <div className="space-y-4">
          {deployments.map((dep, i) => (
            <motion.div 
              key={i} 
              whileHover={{ x: 4 }}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all border border-white/[0.04] cursor-pointer"
            >
              <RaycastIcon icon={GitBranch} size={24} color="violet" containerSize={52} />
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white">{dep.name}</p>
                <p className="text-sm text-white/40 mt-1">{dep.env}</p>
              </div>
              <span className={`px-4 py-2 text-sm font-semibold rounded-xl capitalize border ${statusStyles[dep.status]}`}>
                {dep.status.replace('-', ' ')}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
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
      
      {/* Floating Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50"
      >
        <div className="header-float">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <RaycastIcon icon={Zap} size={28} color="violet" containerSize={52} />
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Obsidian</h1>
                <p className="text-xs text-white/40">Enterprise Infrastructure</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="kpi-card px-5 py-3 flex items-center gap-3">
                <div className="status-dot status-online" />
                <span className="text-sm text-white/70 font-medium">All Systems Operational</span>
              </div>
              <div className="kpi-card px-4 py-3 text-sm text-white/50 font-mono">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="kpi-card px-4 py-3 text-sm text-white/50">
                <span className="text-white font-semibold">3,881</span> Resources
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className="icon-container"
                style={{ width: 44, height: 44 }}
              >
                <Bell size={20} className="text-white/50" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                className="icon-container"
                style={{ width: 44, height: 44 }}
              >
                <Settings size={20} className="text-white/50" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-8 py-10 space-y-10">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <KPICard icon={Server} value="3,458" label="Total Assets" trend="up" trendValue="+5.2%" color="violet" />
          <KPICard icon={Shield} value="99.98%" label="Uptime SLA" trend="stable" trendValue="stable" color="emerald" />
          <KPICard icon={AlertCircle} value="12" label="Critical Issues" trend="down" trendValue="-3" color="rose" />
          <KPICard icon={AlertTriangle} value="169" label="Active Alerts" color="amber" />
          <KPICard icon={CheckCircle} value="94%" label="Compliance" trend="up" trendValue="+2%" color="cyan" />
          <KPICard icon={TrendingDown} value="$127.8K" label="Monthly Cost" trend="down" trendValue="-8%" color="blue" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PerformanceChart data={chartData} />
          </div>
          <AlertDistribution />
        </div>

        {/* Infrastructure */}
        <InfrastructureOverview />

        {/* Service Health & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ServiceHealthMatrix />
          <CriticalEvents />
        </div>

        {/* Deployments */}
        <RecentDeployments />
      </main>
    </div>
  );
}
