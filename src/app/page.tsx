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

// KPI Card - Compact
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="kpi-card px-3 py-2"
    >
      <div className="flex items-center gap-2">
        <RaycastIcon icon={Icon} size={14} containerSize={28} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{value}</span>
            {trend && trendValue && (
              <span className="text-[10px] font-medium text-[#d4a89a] opacity-70">
                {trendValue}
              </span>
            )}
          </div>
          <p className="text-[10px] text-white/40">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Performance Chart - Compact
function PerformanceChart({ data }: { data: ReturnType<typeof generateTimeSeriesData> }) {
  const [activeMetric, setActiveMetric] = useState<'cpu' | 'memory' | 'network' | 'all'>('all');
  
  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-semibold text-white">Real-time Performance</h2>
            <p className="text-[10px] text-white/40">Last 2 hours</p>
          </div>
          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-lg border border-white/[0.04]">
            {(['cpu', 'memory', 'network', 'all'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-all ${
                  activeMetric === metric 
                    ? 'bg-[rgba(212,168,154,0.2)] text-[#d4a89a]' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {metric.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ width: '100%', height: 180 }}>
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

        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/[0.04]">
          {[
            { label: 'CPU', value: '44%' },
            { label: 'Memory', value: '59%' },
            { label: 'Network', value: '259Mb' },
            { label: 'Disk', value: '78%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-[rgba(212,168,154,0.08)]">
              <p className="text-sm font-semibold text-[#d4a89a]">{stat.value}</p>
              <p className="text-[9px] text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Alert Distribution - Compact
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 h-full"
      >
        <h2 className="text-xs font-semibold text-white mb-1">Alert Distribution</h2>
        <p className="text-[10px] text-white/40 mb-3">By severity</p>
        
        <div className="flex items-center gap-4">
          <div style={{ width: 100, height: 100 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data} innerRadius={30} outerRadius={48} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-1">
            {data.map((item) => (
              <div 
                key={item.name} 
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[10px] text-white/60">{item.name}</span>
                </div>
                <span className="text-[11px] font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.04]">
          <button className="flex-1 px-2 py-1.5 text-[10px] font-medium text-white/60 bg-white/[0.03] hover:bg-white/[0.06] rounded-lg transition-all">
            View All
          </button>
          <button className="px-2 py-1.5 text-[10px] font-medium text-[#d4a89a] bg-[rgba(212,168,154,0.1)] hover:bg-[rgba(212,168,154,0.2)] rounded-lg transition-all">
            Ack (3)
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Infrastructure Overview - Compact
function InfrastructureOverview() {
  const infra = [
    { icon: Server, label: 'Servers', total: 847, healthy: 823, warning: 21, critical: 3 },
    { icon: Database, label: 'Databases', total: 124, healthy: 122, warning: 2 },
    { icon: Box, label: 'Containers', total: 2341, healthy: 2298, warning: 38, critical: 5 },
    { icon: Cloud, label: 'VMs', total: 456, healthy: 449, warning: 6, critical: 1 },
    { icon: Layers, label: 'LBs', total: 24, healthy: 24 },
    { icon: HardDrive, label: 'Storage', total: 89, healthy: 87, warning: 2 },
  ];

  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-semibold text-white">Infrastructure</h2>
            <p className="text-[10px] text-white/40">3,881 resources</p>
          </div>
          <button className="text-[10px] text-[#d4a89a] font-medium flex items-center gap-1 px-2 py-1 bg-[rgba(212,168,154,0.1)] rounded-lg">
            Topology <ChevronRight size={10} />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {infra.map((item) => (
            <div 
              key={item.label} 
              className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer"
            >
              <div className="flex justify-center mb-1">
                <RaycastIcon icon={item.icon} size={14} containerSize={24} />
              </div>
              <p className="text-sm font-semibold text-white">{item.total.toLocaleString()}</p>
              <p className="text-[9px] text-white/40">{item.label}</p>
              <div className="flex justify-center gap-1 mt-1 text-[8px] font-medium">
                <span className="text-[#d4a89a]">{item.healthy}</span>
                {item.warning && <span className="text-[#c49b8c]">·{item.warning}</span>}
                {item.critical && <span className="text-[#b08979]">·{item.critical}</span>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Service Health Matrix - Compact
function ServiceHealthMatrix() {
  const services = [
    { name: 'API Gateway', uptime: '99.99%', latency: '45ms', load: 34, status: 'healthy' },
    { name: 'Database Cluster', uptime: '99.98%', latency: '12ms', load: 67, status: 'healthy' },
    { name: 'Cache Layer', uptime: '98.5%', latency: '156ms', load: 89, status: 'warning' },
    { name: 'Message Queue', uptime: '99.97%', latency: '23ms', load: 45, status: 'healthy' },
    { name: 'Auth Service', uptime: '92.3%', latency: '2.5s', load: 98, status: 'critical' },
    { name: 'CDN', uptime: '99.99%', latency: '8ms', load: 23, status: 'healthy' },
  ];

  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <h2 className="text-xs font-semibold text-white mb-1">Service Health</h2>
        <p className="text-[10px] text-white/40 mb-3">Real-time status</p>
        
        <div className="space-y-1.5">
          {services.map((service) => (
            <div 
              key={service.name} 
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <div className={`w-1.5 h-1.5 rounded-full bg-[#d4a89a] ${
                service.status === 'critical' ? 'animate-pulse opacity-60' : ''
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-white truncate">{service.name}</p>
                <p className="text-[9px] text-white/40">{service.uptime} · {service.latency}</p>
              </div>
              <div className="w-16">
                <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#d4a89a]"
                    style={{ width: `${service.load}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-semibold text-white/70 w-8 text-right">{service.load}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Critical Events - Compact
function CriticalEvents() {
  const events = [
    { icon: XCircle, title: 'Auth Service Down', desc: 'Response time >2.5s', time: '2m', severity: 'critical', action: 'Fix' },
    { icon: AlertTriangle, title: 'Cache Degradation', desc: 'Memory at 89%', time: '15m', severity: 'warning', action: 'Review' },
    { icon: CheckCircle, title: 'DB Backup Complete', desc: '124GB successful', time: '1h', severity: 'success' },
  ];

  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <h2 className="text-xs font-semibold text-white mb-1">Critical Events</h2>
        <p className="text-[10px] text-white/40 mb-3">Recent incidents</p>
        
        <div className="space-y-1.5">
          {events.map((event, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="icon-container icon-dusk" style={{ width: 24, height: 24 }}>
                <event.icon size={12} className="text-[#d4a89a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-white truncate">{event.title}</p>
                <p className="text-[9px] text-white/40">{event.desc} · {event.time}</p>
              </div>
              {event.action && (
                <button className="px-2 py-1 text-[9px] font-medium rounded bg-[rgba(212,168,154,0.1)] text-[#d4a89a]">
                  {event.action}
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Sidebar - Compact
function Sidebar({ activeItem, setActiveItem }: { activeItem: string; setActiveItem: (item: string) => void }) {
  const menuItems = [
    { icon: Home, label: 'Overview', id: 'overview' },
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Server, label: 'Infra', id: 'infrastructure' },
    { icon: Globe, label: 'Network', id: 'network' },
    { icon: Wifi, label: 'SNMP', id: 'snmp' },
    { icon: FileJson, label: 'API', id: 'api' },
    { icon: Table2, label: 'Import', id: 'import' },
    { icon: DollarSign, label: 'Finance', id: 'finance' },
    { icon: Package, label: 'Inventory', id: 'inventory' },
    { icon: BarChart3, label: 'Analytics', id: 'analytics' },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="sidebar-glass"
    >
      <nav className="flex flex-col gap-0.5 p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`sidebar-item ${activeItem === item.id ? 'sidebar-item-active' : ''}`}
          >
            <item.icon size={14} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-auto p-2 border-t border-white/[0.04]">
        <button className="sidebar-item w-full">
          <Settings size={14} />
          <span>Settings</span>
        </button>
      </div>
    </motion.aside>
  );
}

// Recent Deployments - Compact
function RecentDeployments() {
  const deployments = [
    { name: 'API v2.3.1', env: 'Prod · 3 inst', status: 'successful' },
    { name: 'Frontend v1.8.0', env: 'Staging · Rolling', status: 'in-progress' },
    { name: 'DB Migration', env: 'Scheduled · 2AM', status: 'pending' },
  ];

  const statusStyles: Record<string, string> = {
    successful: 'text-[#d4a89a] bg-[rgba(212,168,154,0.1)]',
    'in-progress': 'text-[#c49b8c] bg-[rgba(196,155,140,0.1)]',
    pending: 'text-[#b08979] bg-[rgba(176,137,121,0.1)]',
  };

  return (
    <div className="glow-border">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <h2 className="text-xs font-semibold text-white mb-1">Deployments</h2>
        <p className="text-[10px] text-white/40 mb-3">Recent activity</p>
        
        <div className="space-y-1.5">
          {deployments.map((dep, i) => (
            <div 
              key={i} 
              className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
            >
              <RaycastIcon icon={GitBranch} size={12} containerSize={22} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-white">{dep.name}</p>
                <p className="text-[9px] text-white/40">{dep.env}</p>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-medium rounded ${statusStyles[dep.status]}`}>
                {dep.status === 'in-progress' ? 'Running' : dep.status === 'successful' ? 'Done' : 'Pending'}
              </span>
            </div>
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
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RaycastIcon icon={Zap} size={14} containerSize={28} />
                <div>
                  <h1 className="text-xs font-semibold text-white">Obsidian</h1>
                  <p className="text-[9px] text-white/40">Enterprise Monitor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="kpi-card px-2 py-1 flex items-center gap-1.5">
                  <div className="status-dot status-online" style={{ width: 6, height: 6 }} />
                  <span className="text-[10px] text-white/70">Operational</span>
                </div>
                <div className="kpi-card px-2 py-1 text-[10px] text-white/50 font-mono">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="kpi-card px-2 py-1 text-[10px] text-white/50">
                  <span className="text-white font-medium">3,881</span>
                </div>
                <button className="icon-container" style={{ width: 24, height: 24 }}>
                  <Bell size={12} className="text-white/50" />
                </button>
                <button className="icon-container" style={{ width: 24, height: 24 }}>
                  <Settings size={12} className="text-white/50" />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content - Compact */}
        <main className="max-w-[1400px] mx-auto px-4 py-4 space-y-4 w-full">
        {/* KPI Row */}
        <div className="grid grid-cols-6 gap-2">
          <KPICard icon={Server} value="3,458" label="Assets" trend="up" trendValue="+5.2%" />
          <KPICard icon={Shield} value="99.98%" label="Uptime" />
          <KPICard icon={AlertCircle} value="12" label="Critical" trend="down" trendValue="-3" />
          <KPICard icon={AlertTriangle} value="169" label="Alerts" />
          <KPICard icon={CheckCircle} value="94%" label="Compliance" />
          <KPICard icon={TrendingDown} value="$127.8K" label="Cost" trend="down" trendValue="-8%" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <PerformanceChart data={chartData} />
          </div>
          <AlertDistribution />
        </div>

        {/* Infrastructure */}
        <InfrastructureOverview />

        {/* Service Health & Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
