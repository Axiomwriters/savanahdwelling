import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Map, Calendar, User, Home, MoreHorizontal, Eye, Check, X } from "lucide-react";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { toast } from "sonner";

type TripStatus = "all" | "pending" | "confirmed" | "completed" | "cancelled";

interface Trip {
  id: string;
  guest_name: string;
  guest_email: string;
  property_title: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
}

export default function AdminTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TripStatus>("all");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, [statusFilter]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.guest_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.guest_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.property_title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Trips Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all short-stay bookings</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredTrips.length} trips
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by guest or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TripStatus)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading trips...
                  </TableCell>
                </TableRow>
              ) : filteredTrips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No trips found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{trip.guest_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{trip.guest_email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate">{trip.property_title || "Unknown Property"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(trip.check_in)}</p>
                        <p className="text-muted-foreground text-xs">to {formatDate(trip.check_out)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{trip.guests || 0}</span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(trip.total_price || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          trip.status === "confirmed"
                            ? "bg-green-500"
                            : trip.status === "pending"
                            ? "bg-yellow-500"
                            : trip.status === "completed"
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }
                      >
                        {trip.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTrip(trip);
                          setDetailOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{selectedTrip.guest_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTrip.guest_email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Property</p>
                  <p className="font-medium">{selectedTrip.property_title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Guests</p>
                  <p className="font-medium">{selectedTrip.guests}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-in</p>
                  <p className="font-medium">{formatDate(selectedTrip.check_in)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Check-out</p>
                  <p className="font-medium">{formatDate(selectedTrip.check_out)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Total Price</p>
                  <p className="font-medium text-lg">{formatPrice(selectedTrip.total_price || 0)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Status</p>
                  <Badge
                    className={
                      selectedTrip.status === "confirmed"
                        ? "bg-green-500"
                        : selectedTrip.status === "pending"
                        ? "bg-yellow-500"
                        : selectedTrip.status === "completed"
                        ? "bg-blue-500"
                        : "bg-red-500"
                    }
                  >
                    {selectedTrip.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
