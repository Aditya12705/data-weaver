import React, { useState, useEffect } from 'react';
import { getMashupData } from '../services/dataService';
import CorrelationChart from './charts/CorrelationChart';
import { CloudRain, Github, RefreshCw, Zap, Search, AlertCircle, Calendar, Sparkles } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = [
    { name: 'Bangalore, IN', lat: 12.97, lon: 77.59 },
    { name: 'San Francisco, US', lat: 37.77, lon: -122.41 },
    { name: 'London, UK', lat: 51.50, lon: -0.12 },
    { name: 'Tokyo, JP', lat: 35.67, lon: 139.65 },
];

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
    const [useRealData, setUseRealData] = useState(false); // Default to Mock
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);

    // Stats
    const [stats, setStats] = useState({ totalCommits: 0, rainyDays: 0, correlation: '' });

    const calculateStats = (dataset) => {
        const totalCommits = dataset.reduce((acc, curr) => acc + curr.commits, 0);
        const rainyDays = dataset.filter(d => d.rain > 0.1).length;

        // Simple logic for "insight"
        const rainCommits = dataset.filter(d => d.rain > 0.1).reduce((acc, c) => acc + c.commits, 0);
        const avgRainCommits = rainyDays > 0 ? rainCommits / rainyDays : 0;

        const dryDays = dataset.length - rainyDays;
        const dryCommits = dataset.filter(d => d.rain <= 0.1).reduce((acc, c) => acc + c.commits, 0);
        const avgDryCommits = dryDays > 0 ? dryCommits / dryDays : 0;

        let insight = "No clear pattern.";
        if (dataset.length === 0) insight = "No data available.";
        else if (avgRainCommits > avgDryCommits * 1.2) insight = "You love coding in the rain! ⛈️";
        else if (avgDryCommits > avgRainCommits * 1.2) insight = "Sunny days boost your code! ☀️";
        else insight = "Weather doesn't stop you! 🤖";

        setStats({ totalCommits, rainyDays, correlation: insight });
    };

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!useRealData) await new Promise(r => setTimeout(r, 800)); // Slightly longer delay for smoother transition

            if (useRealData && !username.trim()) {
                throw new Error("Enter a GitHub username");
            }

            const result = await getMashupData(useRealData, selectedLocation, username);
            setData(result);
            calculateStats(result);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [useRealData, selectedLocation, username]);

    useEffect(() => {
        if (!useRealData) {
            fetchData();
        }
    }, [useRealData, selectedLocation, fetchData]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (useRealData) fetchData();
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Hero Header With Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                >
                    <h2 className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Project: Data Weaver</h2>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4">
                        Code vs <span className="text-primary-glow">Clouds</span>
                    </h1>
                    <p className="text-slate-400 max-w-lg text-lg leading-relaxed">
                        Discover the hidden correlation between your GitHub activity and the weather.
                        Do you code more when it rains? Let's find out.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-2 rounded-2xl flex flex-col sm:flex-row gap-2"
                >
                    {/* Location Pills */}
                    <div className="flex bg-slate-900/50 p-1.5 rounded-xl">
                        {LOCATIONS.map(loc => (
                            <button
                                key={loc.name}
                                onClick={() => setSelectedLocation(loc)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${selectedLocation.name === loc.name ? 'bg-primary/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {loc.name.split(',')[0]}
                            </button>
                        ))}
                    </div>

                    <div className="w-px bg-glass-border mx-2 hidden sm:block"></div>

                    {/* Mode Toggle & Input */}
                    <div className="flex items-center gap-3 px-2">
                        <button
                            onClick={() => {
                                setUseRealData(!useRealData);
                                setError(null);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-500 font-medium ${useRealData ? 'bg-success/10 border-success/30 text-success shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-warning/10 border-warning/30 text-warning shadow-[0_0_15px_rgba(245,158,11,0.2)]'}`}
                        >
                            {useRealData ? <Zap size={18} /> : <Zap size={18} className="fill-warning/50" />}
                            <span>{useRealData ? 'Live Data' : 'Mock Mode'}</span>
                        </button>

                        <AnimatePresence>
                            {useRealData && (
                                <motion.form
                                    initial={{ width: 0, opacity: 0, scale: 0.9 }}
                                    animate={{ width: 'auto', opacity: 1, scale: 1 }}
                                    exit={{ width: 0, opacity: 0, scale: 0.9 }}
                                    onSubmit={handleSearch}
                                    className="flex items-center gap-2 overflow-hidden"
                                >
                                    <div className="relative group">
                                        <Github size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-white transition-colors" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="GitHub User"
                                            className="glass-input pl-10 pr-4 py-2 w-[180px] rounded-lg text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!username}
                                        className="bg-primary hover:bg-primary-glow text-white p-2 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                                    >
                                        <Search size={18} />
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-8 bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 backdrop-blur-md"
                    >
                        <div className="bg-red-500/20 p-2 rounded-full">
                            <AlertCircle className="text-red-500" size={20} />
                        </div>
                        <p className="font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    icon={<Github className="text-accent" size={24} />}
                    label="Total Commits"
                    value={loading ? "..." : stats.totalCommits}
                    delay={0.3}
                    trend="+12%" // Fake trend for aesthetic
                />
                <StatCard
                    icon={<CloudRain className="text-primary" size={24} />}
                    label="Rainy Days"
                    value={loading ? "..." : stats.rainyDays}
                    delay={0.4}
                    trend="30 days"
                />
                <StatCard
                    icon={<Sparkles className="text-warning" size={24} />}
                    label="AI Insight"
                    value={loading ? "Analyzing..." : stats.correlation}
                    subtext="Correlation Analysis"
                    delay={0.5}
                    isGradient
                />
            </div>

            {/* Main Chart Area */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="glass-panel rounded-3xl p-1 overflow-hidden"
            >
                <div className="bg-slate-900/40 rounded-[20px] p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-slate-500" size={20} />
                            <span>30-Day Timeline</span>
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_#d946ef]"></span>
                                <span className="text-slate-300">Commits</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-primary/50 shadow-[0_0_10px_#6366f1]"></span>
                                <span className="text-slate-300">Rainfall</span>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-slate-700 rounded-full border-t-primary animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <RefreshCw size={24} className="text-primary animate-pulse" />
                                </div>
                            </div>
                            <p className="text-slate-400 font-medium animate-pulse">Crunching numbers...</p>
                        </div>
                    ) : (
                        <CorrelationChart data={data} />
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ icon, label, value, subtext, delay, trend, isGradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className={`relative overflow-hidden p-6 rounded-2xl border transition-all duration-300 group
        ${isGradient
                ? 'bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30'
                : 'glass-panel hover:bg-slate-800/60'
            }
    `}
    >
        {/* Background Glow */}
        {isGradient && <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/20 blur-3xl rounded-full group-hover:bg-accent/30 transition-colors"></div>}

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-xl ${isGradient ? 'bg-white/10' : 'bg-slate-800 border border-slate-700'}`}>
                {icon}
            </div>
            {trend && (
                <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700/50">
                    {trend}
                </span>
            )}
        </div>

        <div className="relative z-10">
            <h3 className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">{label}</h3>
            <div className={`font-bold ${typeof value === 'string' && value.length > 10 ? 'text-xl leading-tight' : 'text-4xl'} ${isGradient ? 'text-white' : 'text-slate-100'} tracking-tight`}>
                {value}
            </div>
            {subtext && <div className="text-sm text-indigo-200/80 mt-2 font-medium">{subtext}</div>}
        </div>
    </motion.div>
);

export default Dashboard;
