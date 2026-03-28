import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Home, Eye, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";

const monthlyData = [
  { name: "Jan", listings: 45, users: 120, revenue: 2500000 },
  { name: "Feb", listings: 52, users: 145, revenue: 3200000 },
  { name: "Mar", listings: 48, users: 160, revenue: 2800000 },
  { name: "Apr", listings: 70, users: 190, revenue: 4100000 },
  { name: "May", listings: 65, users: 175, revenue: 3800000 },
  { name: "Jun", listings: 80, users: 210, revenue: 4500000 },
];

const topLocations = [
  { location: "Nairobi", listings: 245, avgPrice: 18500000 },
  { location: "Mombasa", listings: 132, avgPrice: 12200000 },
  { location: "Kisumu", listings: 78, avgPrice: 8500000 },
  { name: "Nakuru", listings: 65, avgPrice: 6800000 },
  { name: "Eldoret", listings: 42, avgPrice: 5400000 },
];

export default function AdminInsights() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalInquiries: 0,
    conversionRate: 0,
    avgListingPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      
      const { count: listingsCount } = await supabaseAdmin
        .from("agent_listings")
        .select("*", { count: "exact", head: true });

      const { count: usersCount } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true });

      setStats({
        totalViews: Math.floor((listingsCount || 0) * 150),
        totalInquiries: Math.floor((listingsCount || 0) * 12),
        conversionRate: 4.2,
        avgListingPrice: 12500000,
      });
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const insightCards = [
    {
      title: "Total Platform Views",
      value: loading ? "..." : stats.totalViews.toLocaleString(),
      change: 18,
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Inquiries",
      value: loading ? "..." : stats.totalInquiries.toLocaleString(),
      change: 12,
      icon: Calendar,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Conversion Rate",
      value: loading ? "..." : `${stats.conversionRate}%`,
      change: -2,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Avg. Listing Price",
      value: loading ? "..." : `KES ${(stats.avgListingPrice / 1000000).toFixed(1)}M`,
      change: 8,
      icon: DollarSign,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Platform Insights</h1>
          <p className="text-muted-foreground mt-1">Analytics and performance metrics</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Last 30 days
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insightCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    card.change >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {card.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(card.change)}% vs last period
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="listings"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorListings)"
                    strokeWidth={2}
                    name="Listings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLocations} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="location" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`${value} listings`, 'Listings']}
                  />
                  <Bar dataKey="listings" fill="#10b981" radius={[0, 4, 4, 0]} name="Listings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
