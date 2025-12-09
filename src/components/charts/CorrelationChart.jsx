import React from 'react';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const commits = payload.find(p => p.dataKey === 'commits')?.value || 0;
        const rain = payload.find(p => p.dataKey === 'rain')?.value || 0;

        return (
            <div className="glass-panel p-4 rounded-xl border border-glass-border/50 !bg-slate-900/90 shadow-2xl backdrop-blur-xl">
                <p className="font-bold text-slate-300 mb-3 border-b border-slate-700 pb-2 text-sm uppercase tracking-wider">{label}</p>

                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#d946ef]"></span>
                            <span className="text-sm text-slate-400">Commits</span>
                        </div>
                        <span className="text-xl font-bold text-white font-mono">{commits}</span>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#6366f1]"></span>
                            <span className="text-sm text-slate-400">Rainfall</span>
                        </div>
                        <span className="text-lg font-bold text-blue-200 font-mono">{rain} <span className="text-xs text-slate-500">mm</span></span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

const CorrelationChart = ({ data }) => {
    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d946ef" stopOpacity={0.9} />
                            <stop offset="95%" stopColor="#d946ef" stopOpacity={0.5} />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.4} />

                    <XAxis
                        dataKey="date"
                        scale="point"
                        stroke="#64748b"
                        tick={{ fontSize: 11, fontFamily: 'Outfit' }}
                        tickFormatter={(str) => str.slice(5)} // Show MM-DD
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />

                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#d946ef"
                        hide={false}
                        tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#d946ef' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />

                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#6366f1"
                        hide={false}
                        tick={{ fontSize: 11, fontFamily: 'Outfit', fill: '#6366f1' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />

                    <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="rain"
                        name="Rainfall"
                        fill="url(#colorRain)"
                        stroke="#6366f1"
                        strokeWidth={3}
                        filter="url(#glow)" // Add neon glow
                    />

                    <Bar
                        yAxisId="left"
                        dataKey="commits"
                        name="Commits"
                        barSize={12}
                        fill="url(#colorCommits)"
                        radius={[6, 6, 0, 0]}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CorrelationChart;
