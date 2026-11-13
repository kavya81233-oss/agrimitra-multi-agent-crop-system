import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  Microscope,
  CloudSun,
  ClipboardList,
  BotMessageSquare,
  History,
  Bell,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Globe2
} from 'lucide-react';
import { fetchNotifications, markNotificationAsRead } from '../services/api';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentLang, setCurrentLang] = useState('en');
  const location = useLocation();
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    loadNotifications();
  }, [location.pathname]);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n) => !n.is_read).length);
    } catch (e) {
      console.warn('Could not load notifications', e);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await markNotificationAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.error(e);
      }
    }
    setNotificationsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Crop Investigation', path: '/investigate', icon: Microscope, highlight: true },
    { name: 'Weather Intelligence', path: '/weather', icon: CloudSun },
    { name: 'Farm Action Planner', path: '/actions', icon: ClipboardList },
    { name: 'Agricultural Assistant', path: '/assistant', icon: BotMessageSquare },
    { name: 'Investigation History', path: '/history', icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E293B] flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 shadow-sm shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow-md shadow-forest-900/10">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-forest-900 flex items-center gap-1.5">
              AgriMitra
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                v1.0
              </span>
            </span>
            <p className="text-[11px] font-medium text-slate-400">Autonomous Crop AI</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-1">
            Core Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-800 text-white shadow-sm shadow-forest-900/20'
                      : 'text-slate-600 hover:text-forest-900 hover:bg-forest-50'
                  } ${item.highlight && !location.pathname.startsWith('/investigate') ? 'border border-emerald-200/60 bg-emerald-50/40 text-emerald-900' : ''}`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
                {item.highlight && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-1">
            Architecture
          </div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-slate-100 text-forest-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>System Overview</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-400" />
          </NavLink>
        </nav>

        {/* Multi-Agent System Live Status Badge */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-emerald-50 to-green-100/70 border border-emerald-200/80 rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-forest-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Multi-Agent Swarm
              </span>
              <span className="text-[10px] font-bold text-forest-700 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-300">
                5 Agents Active
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Orchestrator ready for image diagnosis & weather risk evaluation.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Mobile hamburger & brand */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-forest-800 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-extrabold text-base text-forest-900">AgriMitra</span>
            </div>
          </div>

          {/* Desktop Left: Current Farm and Date */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <span className="px-3 py-1 rounded-full bg-forest-100 text-forest-800 font-semibold border border-forest-200/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
              Sannidhi Organic Farms • Bengaluru Rural
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500 font-medium">{currentDate}</span>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <button
              onClick={() => setCurrentLang(currentLang === 'en' ? 'kn' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              title="Toggle Interface Language"
            >
              <Globe2 className="w-3.5 h-3.5 text-forest-700" />
              <span>{currentLang === 'en' ? 'English (EN)' : 'ಕನ್ನಡ (KN)'}</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-forest-900 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Farm Notifications</span>
                    <span className="text-xs text-slate-500">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3.5 hover:bg-forest-50/50 cursor-pointer transition flex items-start gap-3 ${
                            !n.is_read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              n.type === 'warning'
                                ? 'bg-amber-500'
                                : n.type === 'alert'
                                ? 'bg-rose-500'
                                : 'bg-forest-600'
                            }`}
                          />
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-slate-900">{n.title}</p>
                            <p className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 self-center" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Farmer Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-forest-100">
                RK
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">Ramesh Kumar</p>
                <p className="text-[10px] text-slate-500">Progressive Farmer</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-1 z-40">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive
                        ? 'bg-forest-800 text-white'
                        : 'text-slate-600 hover:bg-forest-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>System Overview</span>
            </NavLink>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet context={{ currentLang }} />
        </main>
      </div>
    </div>
  );
}
