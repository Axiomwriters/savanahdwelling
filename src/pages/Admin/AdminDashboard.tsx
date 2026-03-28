import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Home, Calendar, Shield, ArrowRight, Eye, Map, Clock } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";

const weeklyData = [
  { name: "Mon", views: 240, verifications: 12, listings: 8 },
  { name: "Tue", views: 198, verifications: 18, listings: 5 },
  { name: "Wed", views: 310, verifications: 22, listings: 12 },
  { name: "Thu", views: 280, verifications: 15, listings: 9 },
  { name: "Fri", views: 420, verifications: 28, listings: 15 },
  { name: "Sat", views: 350, verifications: 20, listings: 11 },
  { name: "Sun", views: 290, verifications: 14, listings: 7 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  badge?: string;
  badgeColor?: string;
}

function StatCard({ title, value, change, changeLabel, icon: Icon, trend, badge, badgeColor }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{value}</span>
              {badge && (
                <Badge className={badgeColor || "bg-yellow-500"}>{badge}</Badge>
              )}
            </div>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-medium ${
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
              }`}>
                {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                {change > 0 ? "+" : ""}{change}% {changeLabel}
              </div>
            )}
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalListings: 0,
    pendingVerifications: 0,
    activeViewings: 0,
    totalTrips: 0,
    verifiedAgents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [accountsRes] = await Promise.all([
        supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        totalAccounts: accountsRes.count || 0,
        totalListings: 0,
        pendingVerifications: 0,
        activeViewings: 0,
        totalTrips: 0,
        verifiedAgents: Math.floor((accountsRes.count || 0) * 0.7),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Command Center</h1>
          <p className="text-muted-foreground mt-1">Overview of platform activity and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Last updated: Just now
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Accounts"
          value={loading ? "..." : stats.totalAccounts}
          change={12}
          changeLabel="this month"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Pending Verifications"
          value={loading ? "..." : stats.pendingVerifications}
          icon={Shield}
          trend="neutral"
          badge="Action Required"
          badgeColor="bg-yellow-500"
        />
        <StatCard
          title="Total Listings"
          value={loading ? "..." : stats.totalListings}
          change={8}
          changeLabel="this week"
          icon={Home}
          trend="up"
        />
        <StatCard
          title="Active Viewings"
          value={loading ? "..." : stats.activeViewings}
          icon={Calendar}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:h-[400px]">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Performance Radar</span>
              <span className="text-xs font-normal text-muted-foreground">Platform Activity - Last 7 Days</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Total Views</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">2,088</span>
                  <span className="flex items-center text-xs text-green-500 font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18%
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Verifications</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">129</span>
                  <span className="flex items-center text-xs text-green-500 font-medium bg-green-500/10 px-1.5 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +24%
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorViewsAdmin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorViewsAdmin)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/admin/verifications">
              <Button variant="outline" className="w-full justify-between h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Shield className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Review Verifications</p>
                    <p className="text-xs text-muted-foreground">{stats.pendingVerifications} pending reviews</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link to="/admin/accounts">
              <Button variant="outline" className="w-full justify-between h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Manage Accounts</p>
                    <p className="text-xs text-muted-foreground">Agents, Landlords, Hosts</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link to="/admin/listings">
              <Button variant="outline" className="w-full justify-between h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Home className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">View Listings</p>
                    <p className="text-xs text-muted-foreground">{stats.totalListings} total properties</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link to="/admin/viewings">
              <Button variant="outline" className="w-full justify-between h-auto py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Scheduled Viewings</p>
                    <p className="text-xs text-muted-foreground">{stats.activeViewings} upcoming</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">User {i}</p>
                    <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Agent</Badge>
                </div>
              ))}
            </div>
            <Link to="/admin/accounts">
              <Button variant="ghost" className="w-full mt-4 text-xs">
                View all accounts <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <Home className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Property Listing {i}</p>
                    <p className="text-xs text-muted-foreground">KES {5 + i}.2M</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
              ))}
            </div>
            <Link to="/admin/listings">
              <Button variant="ghost" className="w-full mt-4 text-xs">
                View all listings <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Upcoming Viewings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Viewing #{1000 + i}</p>
                    <p className="text-xs text-muted-foreground">Today, {10 + i}:00 AM</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Scheduled</Badge>
                </div>
              ))}
            </div>
            <Link to="/admin/viewings">
              <Button variant="ghost" className="w-full mt-4 text-xs">
                View all viewings <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
