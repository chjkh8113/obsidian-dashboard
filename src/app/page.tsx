'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Cpu, HardDrive, Network, Server, Database, Box, Cloud,
  AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown,
  Zap, Shield, Layers, GitBranch, AlertCircle, Info, ChevronRight, 
  Settings, Bell, LayoutDashboard, BarChart3, Globe, Wifi, FileJson,
  Table2, DollarSign, Package, Users, Home
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

// Raycast-style Icon - Single tone
function RaycastIcon({ 
  icon: Icon, 
  size = 32, 
  containerSize = 64 
}: { 
  icon: React.ElementType; 
  size?: number; 
  containerSize?: number;
}) {
  return (
    <div 
      className="icon-container icon-dusk"
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
  trendValue
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="kpi-card p-4"
    >
      <div className="flex items-center gap-4">
        <RaycastIcon icon={Icon} size={22} containerSize={44} />
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
                  <stop offset="0%" stopColor="#d4a89a" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#d4a89a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c49b8c" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#c49b8c" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNetwork" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b08979" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#b08979" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 12 }} width={50} />
              <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(140,80,200,0.3)', borderRadius: '16px', fontSize: '13px' }} />
              {(activeMetric === 'cpu' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="cpu" stroke="#d4a89a" strokeWidth={2} fill="url(#colorCpu)" />
              )}
              {(activeMetric === 'memory' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="memory" stroke="#c49b8c" strokeWidth={2} fill="url(#colorMemory)" />
              )}
              {(activeMetric === 'network' || activeMetric === 'all') && (
                <Area type="monotone" dataKey="network" stroke="#b08979" strokeWidth={2} fill="url(#colorNetwork)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/[0.04]">
          {[
            { label: 'CPU Usage', value: '44%' },
            { label: 'Memory', value: '59%' },
            { label: 'Network I/O', value: '259 Mbps' },
            { label: 'Disk Usage', value: '78%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-2xl bg-[rgba(212,168,154,0.1)]">
              <p className="text-2xl font-bold text-[#d4a89a]">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1 font-medium">{stat.label}</p>
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
    { name: 'Critical', value: 3, color: '#8b7b8a' },
    { name: 'High', value: 8, color: '#a08979' },
    { name: 'Medium', value: 24, color: '#b49a8c' },
    { name: 'Low', value: 45, color: '#c9ab9e' },
    { name: 'Info', value: 89, color: '#d4a89a' },
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

        <div className="flex gap-3 mt-8">
          <button className="flex-1 px-4 py-3 text-xs font-semibold text-white/70 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl transition-all border border-white/[0.04] flex items-center justify-center gap-2">
            View All Alerts <ChevronRight size={14} />
          </button>
          <button className="px-4 py-3 text-xs font-semibold text-[#d4a89a] bg-[rgba(212,168,154,0.1)] hover:bg-[rgba(212,168,154,0.2)] rounded-xl transition-all border border-[rgba(212,168,154,0.2)]">
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
    { icon: Server, label: 'Servers', total: 847, healthy: 823, warning: 21, critical: 3 },
    { icon: Database, label: 'Databases', total: 124, healthy: 122, warning: 2 },
    { icon: Box, label: 'Containers', total: 2341, healthy: 2298, warning: 38, critical: 5 },
    { icon: Cloud, label: 'VMs', total: 456, healthy: 449, warning: 6, critical: 1 },
    { icon: Layers, label: 'Load Balancers', total: 24, healthy: 24 },
    { icon: HardDrive, label: 'Storage', total: 89, healthy: 87, warning: 2 },
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
            className="text-xs text-[#d4a89a] hover:text-[#e8c4b8] font-semibold flex items-center gap-2 px-4 py-2 bg-[rgba(212,168,154,0.1)] rounded-xl border border-[rgba(212,168,154,0.2)] transition-all"
          >
            View Topology <ChevronRight size={14} />
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
                <RaycastIcon icon={item.icon} size={30} containerSize={60} />
              </div>
              <p className="text-4xl font-bold text-white">{item.total.toLocaleString()}</p>
              <p className="text-sm text-white/40 mt-2 font-medium">{item.label}</p>
              <div className="flex justify-center gap-2 mt-3 text-xs font-semibold">
                <span className="text-[#d4a89a]">{item.healthy}</span>
                {item.warning && <span className="text-[#c49b8c]">{item.warning}</span>}
                {item.critical && <span className="text-[#b08979]">{item.critical}</span>}
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
              <div className={`w-3 h-3 rounded-full bg-[#d4a89a] ${
                service.status === 'critical' ? 'animate-pulse opacity-60' : 'opacity-100'
              }`} style={{ boxShadow: '0 0 8px rgba(212, 168, 154, 0.5)' }} />
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
                    className="h-full rounded-full bg-[#d4a89a]"
                    style={{ boxShadow: '0 0 8px rgba(212, 168, 154, 0.5)' }}
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
    critical: { icon: 'text-[#d4a89a]', bg: 'icon-dusk' },
    warning: { icon: 'text-[#d4a89a]', bg: 'icon-dusk' },
    success: { icon: 'text-[#d4a89a]', bg: 'icon-dusk' },
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
                  className="px-4 py-2 text-xs font-semibold rounded-xl transition-all bg-[rgba(212,168,154,0.1)] text-[#d4a89a] hover:bg-[rgba(212,168,154,0.2)] border border-[rgba(212,168,154,0.2)]"
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

// Sidebar
function Sidebar({ activeItem, setActiveItem }: { activeItem: string; setActiveItem: (item: string) => void }) {
  const menuItems = [
    { icon: Home, label: 'Overview', id: 'overview' },
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Server, label: 'Infrastructure', id: 'infrastructure' },
    { icon: Globe, label: 'Network', id: 'network' },
    { icon: Wifi, label: 'SNMP Monitor', id: 'snmp' },
    { icon: FileJson, label: 'API Sources', id: 'api' },
    { icon: Table2, label: 'Data Import', id: 'import' },
    { icon: DollarSign, label: 'Finance', id: 'finance' },
    { icon: Package, label: 'Inventory', id: 'inventory' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sidebar-glass"
    >
      <nav className="flex flex-col gap-1 p-3">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            whileHover={{ x: 4 }}
            className={`sidebar-item ${activeItem === item.id ? 'sidebar-item-active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
      
      <div className="mt-auto p-3 border-t border-white/[0.06]">
        <motion.button
          whileHover={{ x: 4 }}
          className="sidebar-item w-full"
        >
          <Settings size={20} />
          <span>Settings</span>
        </motion.button>
      </div>
    </motion.aside>
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
    successful: 'text-[#d4a89a] bg-[rgba(212,168,154,0.1)] border-[rgba(212,168,154,0.2)]',
    'in-progress': 'text-[#c49b8c] bg-[rgba(196,155,140,0.1)] border-[rgba(196,155,140,0.2)]',
    pending: 'text-[#b08979] bg-[rgba(176,137,121,0.1)] border-[rgba(176,137,121,0.2)]',
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
              <RaycastIcon icon={GitBranch} size={24}  containerSize={52} />
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
  const [activeItem, setActiveItem] = useState('dashboard');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="ambient-bg" />
      
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Floating Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50"
        >
          <div className="header-float">
            <div className="px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <RaycastIcon icon={Zap} size={28}  containerSize={52} />
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
        <main className="max-w-[1600px] mx-auto px-8 py-10 space-y-10 w-full">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <KPICard icon={Server} value="3,458" label="Total Assets" trend="up" trendValue="+5.2%"  />
          <KPICard icon={Shield} value="99.98%" label="Uptime SLA" trend="stable" trendValue="stable"  />
          <KPICard icon={AlertCircle} value="12" label="Critical Issues" trend="down" trendValue="-3"  />
          <KPICard icon={AlertTriangle} value="169" label="Active Alerts"  />
          <KPICard icon={CheckCircle} value="94%" label="Compliance" trend="up" trendValue="+2%"  />
          <KPICard icon={TrendingDown} value="$127.8K" label="Monthly Cost" trend="down" trendValue="-8%"  />
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
    </div>
  );
}
