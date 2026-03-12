import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Ghost, TrendingUp, Users, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SnapshotData {
    responseSpeed: string;
    responseRank: string;
    conversionRate: string;
    conversionChange: string;
    ghostedLeads: number;
    activeDeals: number;
    dealsValue: string;
}

// Mock function to simulate fetching data from the Savanah Intelligence Engine
const fetchPerformanceData = async (agentId: string | undefined): Promise<SnapshotData> => {
    if (!agentId) {
        throw new Error("Agent ID is not available.");
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would make an API call here.
    // For now, we return mock data.
    console.log(`Fetching performance data for agent: ${agentId}`);

    // Let's create some dynamic mock data
    const random = Math.random();
    if (random < 0.1) {
        throw new Error("Failed to connect to Savanah Intelligence Engine.");
    }

    return {
        responseSpeed: `${Math.floor(Math.random() * 20) + 5}m`,
        responseRank: `Top ${Math.floor(Math.random() * 15) + 5}% of agents`,
        conversionRate: `${(Math.random() * 5 + 1).toFixed(1)}%`,
        conversionChange: `${(Math.random() > 0.5 ? '+' : '-')}${(Math.random() * 2).toFixed(1)}% this month`,
        ghostedLeads: Math.floor(Math.random() * 7),
        activeDeals: Math.floor(Math.random() * 25) + 5,
        dealsValue: `~${Math.floor(Math.random() * 500) + 100}m`,
    };
};


export function PerformanceSnapshot({ agentId }: { agentId: string | undefined }) {
    const [data, setData] = useState<SnapshotData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const performanceData = await fetchPerformanceData(agentId);
                setData(performanceData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [agentId]);

    if (isLoading) {
        return <PerformanceSkeleton />;
    }

    if (error) {
        return (
            <Card className="bg-slate-950 text-slate-50 border-slate-800">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <AlertCircle className="w-10 h-10 text-destructive mb-4" />
                    <h3 className="font-bold text-lg text-destructive">Error Loading Snapshot</h3>
                    <p className="text-sm text-slate-400">{error}</p>
                     <Button variant="outline" size="sm" className="mt-4 text-xs border-slate-700 hover:bg-slate-800 text-slate-300" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!data) {
        return null; // Or some empty state
    }
    
    return (
        <Card className="bg-slate-950 text-slate-50 border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <TrendingUp className="w-24 h-24" />
            </div>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6 z-10 relative">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400"/>CRM Intelligence Snapshot</h3>
                    <Button variant="outline" size="xs" className="text-xs border-slate-700 hover:bg-slate-800 text-slate-300">
                        View Full Report
                    </Button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400">Response Speed</p>
                        <p className="text-2xl font-bold text-green-400">{data.responseSpeed}</p>
                        <p className="text-[10px] text-slate-400">{data.responseRank}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400">Conversion Rate</p>
                        <p className="text-2xl font-bold text-blue-400">{data.conversionRate}</p>
                        <p className="text-[10px] text-slate-400">{data.conversionChange}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Ghost className="w-3 h-3" /> Ghosted Leads
                        </p>
                        <p className="text-2xl font-bold text-orange-400">{data.ghostedLeads}</p>
                        <p className="text-[10px] text-slate-400">Needs follow-up</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Users className="w-3 h-3" /> Active Deals
                        </p>
                        <p className="text-2xl font-bold">{data.activeDeals}</p>
                        <p className="text-[10px] text-slate-400">Worth KES {data.dealsValue}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const PerformanceSkeleton = () => (
     <Card className="bg-slate-950 text-slate-50 border-slate-800">
        <CardContent className="p-6">
             <div className="flex justify-between items-start mb-6">
                <Skeleton className="h-6 w-48 bg-slate-800" />
                <Skeleton className="h-6 w-24 bg-slate-800" />
            </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div className="space-y-2" key={i}>
                        <Skeleton className="h-4 w-20 bg-slate-800" />
                        <Skeleton className="h-8 w-16 bg-slate-800" />
                        <Skeleton className="h-3 w-24 bg-slate-800" />
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)
